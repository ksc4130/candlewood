/*jslint node: true */
const path = require('path');
const uuidv1 = require('uuid/v1');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
bodyParser.urlencoded({extended: true});
const clientPath = path.resolve(__dirname, '../client/');
const fs = require('fs');
const mongoose = require('mongoose');

const userRepo = require('./data/userRepo');
const docRepo = require('./data/docRepo');

//TODO: move to db or cache
const userTokens = [];

app.use(fileUpload());
app.use(express.static(clientPath));
app.use(bodyParser.json());
app.use(cookieParser());

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.post('/account/user', (req, res) => {
  //TODO: check authorized
  userRepo.register(req.body.user, (err, user) => res.json({err, user}));
});

//let errrrbody know who they be
app.get('/account/user', (req, res) => {
  console.log('current user');
  const token = req.cookies.t;
  const somebody = userTokens.filter(x => token && x.token === token)[0];
  console.log('cuser', token, somebody);

  res.json(somebody);
});

app.post('/account/login', (req, res) => {
  //TODO: validate
  userRepo.login(req.body.email, req.body.pwd, (err, data) => {
    if(err || !data || !data.email) {
      res.status(401);
      res.send('Unauthorized');
    }
    let token = uuidv1();

    const user = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      token,
      isAdmin: data.isAdmin,
      isActive: data.isActive//may not need this
    };

    //TODO: expire
    userTokens.push(user);
    res.json({err, user});
  });
});

//admin get all users
app.get('user', isAuthenticated, (req, res) => {
  //TODO: make sure user is admin

  userRepo.getAll((err, data) => {
    if(err) {
      //TODO: handle
      res.status(500);
      return res.json(err);
    }

    res.json(data);
  });
});

//admin create user ... use reg for now
app.post('user', isAuthenticated, (req, res) => {

});

//admin update user
app.put('user', isAuthenticated, (req, res) => {
  userRepo.update(req.body.user, (err, user) => {
    if(err) {
      //TODO: handle
      res.status(500);
      return res.json(err);
    }

    res.json(data);
  });
});

app.delete('/user/:id', (req, res) => {
  userRepo.remove(req.param.id, (err) => {
    if(err) {
      //TODO: handle
      res.status(500);
      return res.json(err);
    }

    res.json();
  });
});

//admin remove file
app.delete('/doc/:id', isAuthenticated, (req, res) => {
  docRepo.remove(req.param.id);
});


//get doc
app.get('doc/:doc', (req, res) => {
  res.sendFile(path.resolve(__dirname, `/req.param/doc`));
});

app.get('doc', isAuthenticated, (req, res) => {
  docRepo.getAll((err, found) => {
    if(err) return res.status(500).json(err);

    res.json(found);
  });
});



app.post('/upload', isAuthenticated, function(req, res) {
  console.log('upload', req.body, req.files);
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const fname = `${uuidv1()}.${req.files.file.name.split('.').reverse()[0]}`;


  // Use the mv() method to place the file somewhere on your server
  fs.writeFile(`${__dirname}/uploads/${fname}`, req.files.file.data, (err) => {
    if (err) return res.status(500).json(err);

    docRepo.create({
      name: req.body.name,
      type: req.body.type,
      src: fname,
      when: req.body.when,
    }, (err, newDoc) => {
      if(err) return res.status(500).json(err);

      res.json(newDoc);
    })
  });
});

app.get('*', (req, res) => {
  //console.log('knock knock',req.path, req.originalUrl);
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.listen(3001, () => {
  console.log('listening on port 3001!');
});

function isAuthenticated(req, res, next) {
  const token = req.cookies.t;// req.headers['x-session-token'];
  const somebody = token && userTokens.some(x => x.token === token);
  console.log('is auth', token, somebody);
  if(!somebody) {
    res.status('401');
    return res.send('no no!');
  }

  next();
}

//TODO: make test
// setTimeout(() => {
//   userRepo.login('test@test.com', 'Test123!', (err, user) => console.log(user));
// }, 1000);


