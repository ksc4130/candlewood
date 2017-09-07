const mongoose = require('mongoose');
const argon2 = require('argon2');
const salt = '@do9%lakjsuv^32jcjdSDFHBjiijn12345SXFBWRT45ywFBW^Uthqwe%YU@4w5';
const DocModel = require('./models/DocModel');

mongoose.connect('mongodb://192.168.1.11/cwdev');

module.exports = {
  register,
  login,
  getAll,
  remove,
  update
};

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log('connected');
// });

function getAll(cb) {
  DocModel.find({}, (err, data) => {
    if(err) return cb(err, null);

    cb(null, data.map(x => {
      delete x.phash;
      return x;
    }));
  });
}

function remove(id, cb) {
  DocModel.remove(id, cb);
}

function create(doc, cb){
  const test = new DocModel(doc);
  test.save((err, test) => {
    if(err) {
      console.log('error saving user', err);
      return cb(err, null);
    }
    console.log(test._id);
    return cb(err, test);
  })
}
