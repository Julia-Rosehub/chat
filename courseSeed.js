const mongoose = require('mongoose');
const Course = require('./models/course');

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.DB_URL || 'mongodb://localhost/chat_db',
  { useUnifiedTopology: true }
);
Course.remove({})
  .then(() => {
    return Course.create({
      title: 'Title One',
      description: 'Descriptive description',
      zipCode: 200700,
      items: ['item1'],
    });
  })
  .then((course) => console.log(course.title))
  .then(() => {
    return Course.create({
      title: 'Title Two',
      description: 'Descriptive description Two',
      zipCode: 201701,
      items: ['item1', 'item2', 'item3'],
    });
  })
  .then((course) => console.log(course.title))
  .then(() => {
    return Course.create({
      title: 'Title Three',
      description: 'Descriptive description Three',
      zipCode: 201702,
      items: ['item1', 'item2'],
    });
  })
  .then((course) => console.log(course.title))
  .catch((error) => console.log(error.message))
  .then(() => {
    console.log('Bye');
    mongoose.connection.close();
  });
