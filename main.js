const express = require('express');
const mongoose = require('mongoose');
const layouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');
const passport = require('passport');
const User = require('./models/user');
const router = require('./routes/index');

require('dotenv').config();

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(
    process.env.DB_URL || 'mongodb://localhost/chat_test_db', {
    useNewUrlParser: true,
  });
} else {
  mongoose.connect(
    process.env.DB_URL || 'mongodb://localhost/chat_db', {
    useNewUrlParser: true,
  });
}

const app = express();

mongoose.set('useCreateIndex', true);

if (process.env.NODE_ENV === 'test') {
  app.set("port", 3001);
} else {
  app.set("port", process.env.PORT || 3000);
  app.set('view engine', 'ejs');
}

let { SESSION_SECRET, JWT_SECRET } = process.env;

if (!SESSION_SECRET) {
  if (process.env.NODE_ENV !== 'production') {
    SESSION_SECRET = 'secret_express_session';
    console.log('Missing env variable SESSION_SECRET. Using unsafe dev secret');
  } else {
    console.log('Missing env variable SESSION_SECRET. Authentication disabled');
  }
}

if (!JWT_SECRET) {
  if (process.env.NODE_ENV !== 'production') {
    JWT_SECRET = 'tempjwtsecretfordevonly';
    console.log('Missing env variable JWT_SECRET. Using unsafe dev secret');
  } else {
    console.log('Missing env variable JWT_SECRET. Authentication disabled');
  }
}

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 4000000,
  },
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Successfully connected to MongoDB using Mongoose!');
});

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(layouts);

app.use(bodyParser.json());
app.use(expressValidator());

app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.use(methodOverride('_method', {
  methods: ['POST', 'GET'],
}));
app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use('/', router);

const server = app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
const io = require('socket.io')(server);
require('./controllers/chatController')(io);

module.exports = app;
