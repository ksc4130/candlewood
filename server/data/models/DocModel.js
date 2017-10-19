const mongoose = require('mongoose');
const moment = require('moment');

const schema = new mongoose.Schema({
  name: String,
  type: String,
  src: String,
  when: Date,
  until: Date,
  isPublic: Boolean,
  created: Date
});

schema.methods.isPub = function () {
  return this.isPublic || this.type === 'monthly-calendar' || this.type === 'chronicle';
};

schema.virtual('expired').
get(function() {
  const now = moment();
  const nowForExpires = !this.until ? moment().add(1, 'day') : moment(this.until);
  return !now.isBetween(moment(this.when), nowForExpires);
 });

module.exports = mongoose.model('Doc', schema);
