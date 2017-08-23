/*jslint node: true */
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
bodyParser.urlencoded({extended: true});

const userRepo = require('./data/userRepo');

app.use(express.static(path.resolve(__dirname, '../client/')));
app.use(bodyParser.json());

app.post('/account/user', (req, res) => {
  //TODO: check authorized
  userRepo.register(req.body.user, (err, user) => res.json({err, user}));
});
app.post('/account/login', (req, res) => {
  //TODO: validate
  userRepo.login(req.body.email, req.body.pwd, (err, user) => res.json({err, user}));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.listen(3001, () => {
  console.log('listening on port 3001!');
});

setTimeout(() => {
  userRepo.login('test@test.com', 'Test123!', (err, user) => console.log(user));
}, 1000);


