const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  roles: {
    type: [String],
    default: ['Employee'],
  },
  location: String,
  active: {
    type: Boolean,
    default: true,
  },
  picturePath: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model('User', userSchema);
