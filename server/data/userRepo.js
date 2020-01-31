const argon2 = require('argon2');
const salt = '@do9%lakjsuv^32jcjdSDFHBjiijn12345SXFBWRT45ywFBW^Uthqwe%YU@4w5';
const UserModel = require('./models/UserModel');

module.exports = {
  register,
  login,
  getAll,
  remove,
  update
};

function getAll(cb) {
  UserModel.find({}, (err, data) => {
    if (err) return cb ? cb(err, null) : '';

    cb(null, data.map(x => {
      delete x.phash;
      return x;
    }));
  });
}

function update(user, cb) {
  UserModel.findOne({ _id: user._id }, (err, found) => {
    if (err || !found) return cb ? cb(err, null) : '';

    found.email = user.email.toLowerCase();
    found.lastName = user.lastName;
    found.firstName = user.firstName;
    found.isAdmin = user.isAdmin;
    found.isActive = user.isActive;
    found.lotNumber = user.lotNumber;

    found.save(cb);
  });
}

function remove(id, cb) {
  UserModel.remove({ _id: id }, cb);
}

function register(user, cb) {
  user.email = user.email.toLowerCase();
  UserModel.findOne({ email: user.email }, (err, data) => {
    console.log('register user repo');
    if (err) {
      if (!cb) return;

      return cb(err, null);
    }

    if (data) {
      //user already exists
      if (!cb) return;

      return cb({ msg: 'Email already in use.' }, null);
    }

    const pwd = user.pwd;
    delete user.pwd;

    argon2.hash(`${pwd}${salt}`, {
      type: argon2.argon2d
    }).then(phash => {
      user.phash = phash;
      user.created = new Date();
      const test = new UserModel(user);
      test.save((err, test) => {
        if (err) {
          console.log('error saving user', err);
          if (!cb) return;

          return cb(err, null);
        }
        console.log(test._id);
        if (!cb) return;

        return cb(err, test);
      });
    }).catch(err => {
      console.log('failed to create hash', err);
      if (!cb) return;

      return cb(err, null);
    });
  });
}

function login(email, pwd, cb) {
  email = email.toLowerCase();
  if (!cb) {
    return;
  }
  UserModel.findOne({ email: email }, (err, data) => {
    if (err || !data) {
      if (!cb) return;

      return cb ? cb(err, null) : err || null;
    }

    if (!data.isActive) {
      return cb ? cb({ msg: 'user is not active' }, null) : err || null;
    }

    argon2.verify(data.phash, `${pwd}${salt}`).then((m) => {
      delete data.phash;
      if (!cb) return;

      return m ? cb(null, data) : cb(null, null);
    });
  });
}
