const mongoose = require('mongoose');

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    items: [],
    zipCode: {
      type: Number,
      min: [100000, "Zip code too short"],
      max: 999999
    }
  });

module.exports = mongoose.model('Course', courseSchema);
