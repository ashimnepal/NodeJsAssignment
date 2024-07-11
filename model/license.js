const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  // age: {
  //   type: Number,
  //   required: true
  // },
  car_details: [{
    licenseNo: {
      type: String,
      required: true
    },
    make: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    platno: {
      type: String,
      required: true
    }
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
