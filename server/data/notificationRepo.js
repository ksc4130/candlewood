const NotificationModel = require('./models/NotificationModel');
const moment = require('moment');
const util = require('util');

module.exports = {
  getAll,
  remove,
  create,
  update
};

function update(docs, cb) {
  const updated = [];
  let cnt = 0;
  let errs = null;
  function finished() {
    cnt += 1;
    if (cnt === docs.length) {
      cb(errs, updated);
    }
  }
  docs.forEach(doc => {
    NotificationModel.findById(doc._id, (err, n) => {
      /*
      title: req.body.title,
      msg: req.body.msg,
      type: req.body.type,
      when: req.body.when,
      until: req.body.until || '',
      isPublic: req.body.isPublic
      */
      if (err || !n) {
        if (err) {
          errs = errs || [];
          errs.push(err);
        }
        finished();
        return;
      }
      n.title = doc.title;
      n.msg = doc.msg;
      n.type = doc.type;
      n.when = doc.when;
      n.until = doc.until;
      n.isPublic = doc.isPublic;
      n.index = doc.index;
      n.save((err, saved) => {
        if (err) {
          errs = errs || [];
          errs.push(err);
          finished();
          return;
        }
        updated.push(saved);
        finished();
      });
    });
  });
}

function mapModelToObj(doc) {
  if (!doc) return null;

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
