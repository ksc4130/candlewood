const mongoose = require('mongoose');
const argon2 = require('argon2');
const salt = '@do9%lakjsuv^32jcjdSDFHBjiijn12345SXFBWRT45ywFBW^Uthqwe%YU@4w5';
const UserModel = require('./models/UserModel');

mongoose.connect('mongodb://192.168.1.11/cwdev');

module.exports = {
  register,
  login
};

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log('connected');
// });

function register(user, cb){
  const pwd = user.pwd;
  delete user.pwd;

  argon2.hash(`${pwd}${salt}`, {
    type: argon2.argon2d
  }).then(phash => {
    user.phash = phash;
    user.created = new Date();
    const test = new UserModel(user);
    test.save((err, test) => {
      if(err) {
        console.log('error saving user', err);
        return cb(err, null);
      }
      console.log(test._id);
      return cb(err, test);
    })
  }).catch(err => {
    console.log('failed to create hash', err);
    return cb(err, null);
  });
}

function login(email, pwd, cb) {
  if(!cb) {
    return;
  }
  UserModel.findOne({email: email}, (err, data) => {
    if(err || !data) {
      return cb ? cb(err, null) : err || null;
    }
    argon2.verify(data.phash, `${pwd}${salt}`).then((m) => m ? cb(null, data) : cb(null, null));
  });
}