const passport = require("passport"),
    httpStatus = require("http-status-codes"),
    User = require("../models/user"),
    jwt = require("jsonwebtoken");

const getUserParams = body => {
    return {
        name: {
            first: body.first,
            last: body.last
        },
        email: body.email,
        password: body.password,
        zipCode: body.zipCode
    };
};

module.exports = {
    index: (req, res, next) => {
        User.find()
            .then(users => {
                res.locals.users = users;
                next();
            })
            .catch(error => {
                console.log(`Error fetching users: ${error.message}`);
                next(error);
            });
    },
    indexView: (req, res) => {
        res.render("users/index");
    },
    new: (req, res) => {
        res.render("users/new");
    },
    create: (req, res, next) => {

        if (req.skip) next();

        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (e, user) => {
            if (user) {
                req.flash("success", `${user.fullName}'s account is created !`);
                res.locals.redirect = "/users";
                next();
            } else {
                req.flash("error", `Failed to create user account
                because: ${e.message}.`);
                res.locals.redirect = "/users/new";
                next();
            }
        });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`);
                next(error);
            });
    },
    showView: (req, res) => {
        res.render("users/show");
    },
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.render("users/edit", {
                    user
                });
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`);
                next(error);
            });
    },
    update: (req, res, next) => {
        let userId = req.params.id,
            userParams = {
                name: {
                    first: req.body.first,
                    last: req.body.last
                },
                email: req.body.email,
                password: req.body.password,
                zipCode: req.body.zipCode
            };

        User.findByIdAndUpdate(userId, {
            $set: userParams
        })
            .then(user => {
                res.locals.redirect = `/users/${userId}`;
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`Error updating user by ID: ${error.message}`);
                next(error);
            });
    },
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(() => {
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`Error deleting user by ID: ${error.message}`);
                next();
            });
    },
    login: (req, res) => {
        res.render("users/login");
    },
    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    },
    authenticate: passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: "Failed to login.",
        successRedirect: "/",
        successFlash: "Logged in!"
    }),
    apiAuthenticate: (req, res, next) => {
        passport.authenticate("local", (errors, user) => {
            if (user) {
                let signedToken = jwt.sign(
                    {
                        data: user._id,
                        exp: new Date().setDate(new Date().getDate() + 1)
                    },
                    process.env.JWT_SECRET
                );
                res.json({
                    success: true,
                    token: signedToken
                });
            } else
                res.json({
                    success: false,
                    message: "Could not authenticate user."
                });
        })(req, res, next);
    },
    verifyJWT: (req, res, next) => {
        let token = req.headers.token;
        if (token) {
            jwt.verify(
                token,
                process.env.JWT_SECRET,
                (errors, payload) => {
                    if (payload) {
                        User.findById(payload.data).then(user => {
                            if (user) {
                                next();
                            } else {
                                res.status(httpStatus.FORBIDDEN).json({
                                    error: true,
                                    message: "No User account found."
                                });
                            }
                        });
                    } else {
                        res.status(httpStatus.UNAUTHORIZED).json({
                            error: true,
                            message: "Cannot verify API token."
                        });
                        next();
                    }
                }
            );
        } else {
            res.status(httpStatus.UNAUTHORIZED).json({
                error: true,
                message: "Provide a valid token"
            });
        }
    },
    validate: (req, res, next) => {
        req.sanitizeBody("email")
            .normalizeEmail({
                all_lowercase: true
            })
            .trim();
        req.check("email", "Email is invalid").isEmail();
        req.check("zipCode", "Zip code is invalid")
            .notEmpty().isInt()
            .isLength({
                min: 6,
                max: 6
            })
            .equals(req.body.zipCode);
        req.check("password", "Password cannot be empty").notEmpty();

        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                let messages = error.array().map(e => e.msg);
                req.skip = true;
                req.flash("error", messages.join(" and "));
                res.locals.redirect = "/users/new";
                next();
            } else {
                next();
            }
        });
    },
    // verifyToken: (req, res, next) => {
    //   let token = req.query.apiToken;
    //   if (token) {
    //     User.findOne({ apiToken: token })
    //       .then(user => {
    //         if (user) next();
    //         else next(new Error("Invalid API token."));
    //       })
    //       .catch(error => {
    //         next(new Error(error.message));
    //       });
    //   } else {
    //     next(new Error("Invalid API token."));
    //   }
    // },
}