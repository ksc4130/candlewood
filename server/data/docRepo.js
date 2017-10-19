const DocModel = require('./models/DocModel');

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

    cb(null, data);
  });
}

function getById(id, cb) {
  DocModel.findById(id, (err, data) => {
    if(err) return cb ? cb(err, null) : '';

    if(!cb) return;

    cb(null, data);
  });
}

function update(doc, cb) {
  DocModel.findOne({ _id: doc._id }, (err, found) => {
    if(err || !found) return cb ? cb(err, null) : '';

    found.name = doc.name;
    found.type = doc.type;
    found.when = doc.when;
    found.until = doc.until;
    found.isPublic = doc.isPublic;

    found.save(cb);
  });
}

function remove(id, cb) {
  DocModel.remove({_id: id }, cb);
}

function create(doc, cb){
  doc.created = new Date();
  const test = new DocModel(doc);
  test.save((err, test) => {
    if(err) {
      console.log('error saving doc', err);
      return cd ? cb(err, null) : '';
    }
    console.log(test._id);
    if(!cb) return;

    return cb(err, test);
  });
}
