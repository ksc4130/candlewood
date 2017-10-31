const mongoose = require('mongoose');
const moment = require('moment');

const schema = new mongoose.Schema({
  name: String,
  type: String,
  src: String,
  when: Date,
  untilStr: String,
  isPublic: Boolean,
  created: Date
});

schema.methods.isPub = function () {
  return this.isPublic || this.type === 'upcoming-events' || this.type === 'monthly-calendar' || this.type === 'chronicle';
};

schema.virtual('expired').
  get(function () {
    const now = moment();
    const nowForExpires = !this.untilStr ? moment().add(1, 'day') : moment(this.untilStr);
    return !now.isBetween(moment(new Date(this.when)), nowForExpires);
  });

schema.virtual('until')
  .get(function () {
    return this.untilStr ? moment(new Date(this.untilStr)) : null;
  });

module.exports = mongoose.model('Doc', schema);
