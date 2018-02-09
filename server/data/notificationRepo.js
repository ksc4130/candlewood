const NotificationModel = require('./models/NotificationModel');
const moment = require('moment');
const util = require('util');

module.exports = {
  getAll,
  remove,
  create,
};

function mapModelToObj(doc) {
  if(!doc) return null;

  const n = util._extend({}, (doc || {})._doc);
  n.expired = doc.expired;
  n.until = doc.until;
  n.isPub = doc.isPub();
  return n;
}

function getAll(cb) {
  NotificationModel.find({}, (err, data) => {
    if (err) return cb ? cb(err, null) : '';

    if (!cb) return;

    const toReturn = data.map(mapModelToObj);

    cb(null, toReturn);
  });
}

function remove(id, cb) {
  NotificationModel.remove({ _id: id }, cb);
}

function create(doc, cb) {
  doc.isPublic = true;
  const d = doc.until ? new Date(doc.until) : null;
  if (d && moment(d).isValid()) {
    doc.untilStr = moment(d).format('MM/DD/YYYY');
  } else {
    doc.untilStr = null;
  }

  doc.created = new Date();
  const test = new NotificationModel(doc);
  test.save((err, test) => {
    if (err) {
      console.log('error saving doc', err);
      return cb ? cb(err, null) : '';
    }
    console.log(test._id);
    if (!cb) return;

    return cb(err, mapModelToObj(test));
  });
}
