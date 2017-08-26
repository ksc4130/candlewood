/*jslint node: true */
const path = require('path');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
bodyParser.urlencoded({extended: true});
const clientPath = path.resolve(__dirname, '../client/');

const userRepo = require('./data/userRepo');

app.use(fileUpload());
app.use(express.static(clientPath));
app.use(bodyParser.json());

app.post('/account/user', (req, res) => {
  //TODO: check authorized
  userRepo.register(req.body.user, (err, user) => res.json({err, user}));
});
app.post('/account/login', (req, res) => {
  //TODO: validate
  userRepo.login(req.body.email, req.body.pwd, (err, user) => res.json({err, user}));
});

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.sampleFile;
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv('/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});

app.get('*', (req, res) => {
  console.log('knock knock',req.path, req.originalUrl);
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.listen(3001, () => {
  console.log('listening on port 3001!');
});

setTimeout(() => {
  userRepo.login('test@test.com', 'Test123!', (err, user) => console.log(user));
}, 1000);


