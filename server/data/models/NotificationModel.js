const mongoose = require('mongoose');
const moment = require('moment');

const schema = new mongoose.Schema({
  title: String,
  msg: String,
  type: String,
  when: Date,
  untilStr: String,
  isPublic: Boolean,
  created: Date,
  index: Number
});

schema.methods.isPub = function () {
  return this.isPublic || this.type === 'upcoming-events' || this.type === 'monthly-calendar' || this.type === 'chronicle';
};

schema.virtual('expired').
  get(function () {
    const now = moment();
    const nowForExpires = !this.untilStr ? moment().add(1, 'day') : moment(this.untilStr, 'MM/DD/YYYY');
    return !now.isBetween(moment(new Date(this.when)), nowForExpires);
  });

schema.virtual('until')
  .get(function () {
    return this.untilStr ? moment(new Date(this.untilStr, 'MM/DD/YYYY')) : null;
  });

module.exports = mongoose.model('Notification', schema);
