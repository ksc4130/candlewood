const mongoose = require('mongoose');

module.exports = mongoose.model('Doc', {
  name: String,
  type: String,
  src: Boolean,
  when: Date,
});
