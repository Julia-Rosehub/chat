const mongoose = require('mongoose');
const Course = require('./models/course');

mognoose.Promise = global.Promise;
mongoose.connect(
  process.env.DB_URL || 'mongodb://localhost/chat_db',
  { useUnifiedTopology: true }
);
Course.remove({})
  .then(() => {
    return Course.create({
      title: 'Title One',
      description: 'Descriptive description',
      maxStudents: 10,
      cost: 5,
    });
  })
  .then((course) => console.log(course.title))
  .then(() => {
    return Course.create({
      title: 'Title Two',
      description: 'Descriptive description Two',
      maxStudents: 11,
      cost: 15,
    });
  })
  .then((course) => console.log(course.title))
  .then(() => {
    return Course.create({
      title: 'Title Three',
      description: 'Descriptive description Three',
      maxStudents: 12,
      cost: 20,
    });
  })
  .then((course) => console.log(course.title))
  .catch((error) => console.log(error.message))
  .then(() => {
    console.log('Bye');
    mongoose.connection.close();
  });
