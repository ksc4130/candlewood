const DocModel = require('./models/DocModel');
const moment = require('moment');
const util = require('util');

module.exports = {
  getAll,
  remove,
  create,
  update,
  getById
};

function getAll(cb) {
  DocModel.find({}, (err, data) => {
    if(err) return cb ? cb(err, null) : '';

    if(!cb) return;
    const toReturn = data.map(doc => {
      const n = util._extend({}, doc._doc);
      n.expired = doc.expired;
      n.until = doc.until;
      return n;
    });

    cb(null, toReturn);
  });
}

function getById(id, cb) {
  DocModel.findById(id, (err, data) => {
    if(err) return cb ? cb(err, null) : '';

    if(!cb) return;

    const n = util._extend({}, data._doc);
    n.expired = data.expired;
    n.until = data.until;

    cb(null, n);
  });
}

function update(doc, cb) {
  DocModel.findOne({ _id: doc._id }, (err, found) => {
    if(err || !found) return cb ? cb(err, null) : '';

    const d = doc.until ? new Date(doc.until) : null;
    if(d && moment(d).isValid()) {
      found.untilStr = moment(d).format('MM/DD/YYYY');
    } else {
      found.untilStr = null;
    }

    found.name = doc.name;
    found.type = doc.type;
    found.when = doc.when;
    found.isPublic = doc.isPublic;

    found.save((err, saved) => {
      if(err) {
        console.log('error saving doc', err);
        return cb ? cb(err, null) : '';
      }
      console.log(saved._id);
      if(!cb) return;

      const n = util._extend({}, saved._doc);
      n.expired = saved.expired;
      n.until = saved.until;

      return cb(err, n);
    });
  });
}

function remove(id, cb) {
  DocModel.remove({_id: id }, cb);
}

function create(doc, cb){
  const d = doc.until ? new Date(doc.until) : null;
  if(d && moment(d).isValid()) {
    doc.untilStr = moment(d).format('MM/DD/YYYY');
  } else {
    doc.untilStr = null;
  }

  doc.created = new Date();
  const test = new DocModel(doc);
  test.save((err, test) => {
    if(err) {
      console.log('error saving doc', err);
      return cb ? cb(err, null) : '';
    }
    console.log(test._id);
    if(!cb) return;

    const n = util._extend({}, test._doc);
    n.expired = test.expired;
    n.until = test.until;

    return cb(err, n);
  });
}
