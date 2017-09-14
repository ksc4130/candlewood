const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  firstName: String,
  lastName: String,
  email: String,
  phash: String,
  created: Date,
  isAdmin: Boolean,
  isActive: Boolean,
  lotNumber: String
});
//TODO: add last active and last login
