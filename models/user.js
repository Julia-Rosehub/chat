const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Subscriber = require('./subscriber');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    first: {
      type: String,
      trim: true,
    },
    last: {
      type: String,
      trim: true,
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  zipCode: {
    type: Number,
    min: [100000, 'Zip code is too short'],
    max: 999999,
  },
  courses: [
    { type: Schema.Types.ObjectId, ref: 'Course' },
  ],
  subscribedAccount: {
    type: Schema.Types.ObjectId, ref: 'Subscriber',
  },
},
  {
    timestamps: true,
  });

userSchema.virtual('fullName')
  .get(function () {
    return `${this.name.first} ${this.name.last}`;
  });

userSchema.pre('save', function (next) {
  const user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email,
    })
      .then((subscriber) => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error in connecting subscriber:
     ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

module.exports = mongoose.model('User', userSchema);
