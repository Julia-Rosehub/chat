const Course = require('../models/course');
const User = require('../models/user');
const httpStatus = require('http-status-codes');

module.exports = {
  index: (req, res, next) => {
    Course.find({})
      .then((courses) => {
        res.locals.courses = courses;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render('courses/index');
  },

  new: (req, res) => {
    res.render('courses/new');
  },

  create: (req, res, next) => {
    const courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: [req.body.items.split(',')],
      zipCode: req.body.zipCode,
    };
    Course.create(courseParams)
      .then((course) => {
        res.locals.redirect = '/courses';
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },

  show: (req, res, next) => {
    const courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render('courses/show');
  },

  edit: (req, res, next) => {
    const courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        res.render('courses/edit', {
          course,
        });
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    const courseId = req.params.id;
    const courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: [req.body.items.split(',')],
      zipCode: req.body.zipCode,
    };

    Course.findByIdAndUpdate(courseId, {
      $set: courseParams,
    })
      .then((course) => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },

  delete: (req, res, next) => {
    const courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = '/courses';
        next();
      })
      .catch((error) => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },

  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  },

  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    })
  },

  errorJSON: (error, req, res, next) => {
    let errorObj;

    if (error) {
      errorObj = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObj = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unknown Error.',
      };
    }
    res.json(errorObj);
  },

  join: (req, res, next) => {
    const courseId = req.params.id;
    const currentUser = req.user;

    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId,
        },
      })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next(new Error('User must sign in.'));
    }
  },

  canceljoin: (req, res, next) => {
    const courseId = req.params.id;
    const currentUser = req.user;

    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $pull: {
          courses: courseId,
        },
      })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next(new Error('User must sign in.'));
    }
  },

  filterUserCourses: (req, res, next) => {
    const { locals: { currentUser } } = res;
    if (currentUser) {
      const mappedCourses = res.locals.courses.map((course) => {
        const userJoined = currentUser.courses.some((userCourse) => userCourse.equals(course._id));
        return Object.assign(course.toObject(),
          { joined: userJoined });
      });
      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  },
};
