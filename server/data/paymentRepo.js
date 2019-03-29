const PaymentModel = require('./models/PaymentModel');
// const moment = require('moment');
// const util = require('util');

module.exports = {
  // getAll,
  // remove,
  create
  // update,
  // getById
};

function create(payment, cb) {
  // const d = payment.until ? new Date(payment.until) : null;
  // if (d && moment(d).isValid()) {
  //   payment.untilStr = moment(d).format('MM/DD/YYYY');
  // } else {
  //   payment.untilStr = null;
  // }

  payment.createdAt = new Date();
  const test = new PaymentModel(payment);
  test.save((err, test) => {
    if (err) {
      console.log('error saving doc', err);
      return cb ? cb(err, null) : '';
    }
    console.log(test._id);
    if (!cb) return;

    // return cb(err, mapModelToObj(test));
    return cb(err, test);
  });
}

// function mapModelToObj(doc) {
//   if (!doc) return null;

//   const n = util._extend({}, (doc || {})._doc);
//   n.expired = doc.expired;
//   n.until = doc.until;
//   n.isPub = doc.isPub();
//   return n;
// }

// function getAll(cb) {
//   DocModel.find({}, (err, data) => {
//     if (err) return cb ? cb(err, null) : '';

//     if (!cb) return;

//     const toReturn = data.map(mapModelToObj);

//     cb(null, toReturn);
//   });
// }

// function getById(id, cb) {
//   DocModel.findById(id, (err, data) => {
//     if (err) return cb ? cb(err, null) : '';

//     if (!cb) return;

//     cb(null, mapModelToObj(data));
//   });
// }

// function update(doc, cb) {
//   DocModel.findOne({ _id: doc._id }, (err, found) => {
//     if (err || !found) return cb ? cb(err, null) : '';

//     const d = doc.until ? new Date(doc.until) : null;
//     if (d && moment(d).isValid()) {
//       found.untilStr = moment(d).format('MM/DD/YYYY');
//     } else {
//       found.untilStr = null;
//     }

//     found.name = doc.name;
//     found.type = doc.type;
//     found.when = doc.when;
//     found.isPublic = doc.isPublic;

//     found.save((err, saved) => {
//       if (err) {
//         console.log('error saving doc', err);
//         return cb ? cb(err, null) : '';
//       }
//       console.log(saved._id);
//       if (!cb) return;

//       return cb(err, mapModelToObj(saved));
//     });
//   });
// }

// function remove(id, cb) {
//   DocModel.remove({ _id: id }, cb);
// }
