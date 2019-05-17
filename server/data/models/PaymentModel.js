const mongoose = require('mongoose');
// const moment = require('moment');

// const schema = new mongoose.Schema({
//   user_id: String,
//   lostNumber: String,
//   createdAt: Date,
//   amount: Number,
//   status: String,
//   message: String,
//   for: String,
//   refId: String,
//   respData: String
// });

// schema.methods.isPub = function() {
//   return (
//     this.isPublic ||
//     this.type === 'upcoming-events' ||
//     this.type === 'monthly-calendar' ||
//     this.type === 'chronicle'
//   );
// };

// schema.virtual('expired').get(function() {
//   const now = moment();
//   const nowForExpires = !this.untilStr
//     ? moment().add(1, 'day')
//     : moment(this.untilStr, 'MM/DD/YYYY');
//   return !now.isBetween(moment(new Date(this.when)), nowForExpires);
// });

// schema.virtual('until').get(function() {
//   return this.untilStr ? moment(new Date(this.untilStr, 'MM/DD/YYYY')) : null;
// });

module.exports = mongoose.model('Payment', {
  user_id: String,
  lostNumber: String,
  createdAt: Date,
  amount: Number,
  status: String,
  message: String,
  for: String,
  notes: String,
  refId: String,
  refData: String,
  refCard: String,
  refApprovalCode: String
});
