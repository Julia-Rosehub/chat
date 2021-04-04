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
