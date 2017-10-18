const mongoose = require('mongoose');

module.exports = mongoose.model('Doc', {
  name: String,
  type: String,
  src: String,
  when: Date,
  until: Date,
  isPublic: Boolean,
  created: Date
});
