/*jslint node: true */
require('dotenv').config();

const path = require('path');
const uuidv1 = require('uuid/v1');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
bodyParser.urlencoded({ extended: true });
const clientPath = path.resolve(__dirname, '../client/');
const fs = require('fs');
const mongoose = require('mongoose');

const userRepo = require('./data/userRepo');
const docRepo = require('./data/docRepo');
const paymentRepo = require('./data/paymentRepo');
const PaymentModel = require('./data/models/PaymentModel');
const notificationRepo = require('./data/notificationRepo');
const dbConfig = require('./data/dbconfig');

const request = require('request');
const convert = require('xml-js');

const CardTransReq = require('.//data/models/CardTransReq');

dbConfig.connect();

const port = process.env.NODE_ENV === 'production' ? 3000 : 3001;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//TODO: move to db or cache
const userTokens = [];

app.use(fileUpload());
app.use(express.static(clientPath));
app.use(bodyParser.json());
app.use(cookieParser());

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.post('/payment', isAuthenticated, (req, res) => {
  //  https://api.demo.convergepay.com/VirtualMerchantDemo/processxml.do

  // extend data
  console.log(req.body);
  const token = req.cookies.t;
  const somebody = userTokens.filter(x => token && x.token === token)[0];
  console.log('sombody', somebody);
  let payment = {
    user_id: somebody._id,
    createdAt: new Date(),
    amount: req.body.ssl_amount,
    status: 'Pending',
    message: null,
    for: null,
    lotNumber: req.body.lotNumber
  };

  const transReq = { txn: Object.assign({}, CardTransReq, req.body) };
  var payload = convert.js2xml(transReq, {
    compact: true,
    ignoreAttributes: true
  });

  console.log('payload', payload);

  paymentRepo.create(payment, (err, pm) => {
    if (err) {
      return res.json({ err, payment: pm });
    }

    payment._id = pm._id;

    request.post(
      {
        url: `https://api.demo.convergepay.com/VirtualMerchantDemo/processxml.do?xmldata=${payload}`
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          console.error('payment req failed:', err);
          return res.json({ err });
        }

        var result = convert.xml2js(body, {
          compact: true,
          ignoreAttributes: true
        });

        if (result.txn.errorCode) {
          payment.message = result.txn.errorMessage._text;
          payment.status = 'Failed';
        } else {
          payment.message = result.txn.ssl_result_message._text;
          payment.refId = result.txn.ssl_txn_id._text;
          payment.status = result.txn.ssl_result_message._text;
          payment.refCard = result.txn.ssl_card_number._text;
          payment.refApprovalCode = result.txn.ssl_approval_code._text;
        }

        payment.refData = body;

        console.log('***resp', err, body, result, payment);

        PaymentModel.update({ _id: payment._id }, payment, (err, saved) => {
          res.json({ err, payment: saved });
        });
      }
    );
  });

  /*
<txn>
  <ssl_issue_points/>
  <ssl_card_number>41**********9990</ssl_card_number>
  <ssl_departure_date/>
  <ssl_result>0</ssl_result>
  <ssl_txn_id>00000000-0000-0000-0000-00000000000</ssl_txn_id>
  <ssl_loyalty_program/>
  <ssl_avs_response>X</ssl_avs_response>
  <ssl_approval_code>123456</ssl_approval_code>
  <ssl_account_status/>
  <ssl_amount>1.00</ssl_amount>
  <ssl_txn_time>02/25/2019 09:21:16 AM</ssl_txn_time>
  <ssl_promo_code/>
  <ssl_exp_date>1220</ssl_exp_date>
  <ssl_card_short_description>VISA</ssl_card_short_description>
  <ssl_completion_date/>
  <ssl_card_type>CREDITCARD</ssl_card_type>
  <ssl_access_code/>
  <ssl_transaction_type>SALE</ssl_transaction_type>
  <ssl_loyalty_account_balance/>
  <ssl_salestax/>
  <ssl_enrollment/>
  <ssl_account_balance>0.00</ssl_account_balance>
  <ssl_ps2000_data/>
  <ssl_result_message>APPROVED</ssl_result_message>
  <ssl_invoice_number/>
  <ssl_cvv2_response>P</ssl_cvv2_response>
  <ssl_tender_amount/>
</txn>
  */
});

app.post('/account/user', (req, res) => {
  console.log('register route', req.body.user);
  //TODO: check authorized
  userRepo.register(req.body.user, (err, user) => res.json({ err, user }));
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
    if (err || !data || !data.email) {
      res.status(401);
      return res.send('Unauthorized');
    }
    let token = uuidv1();

    const user = !data
      ? null
      : {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        token,
        isAdmin: data.isAdmin,
        isActive: data.isActive //may not need this
      };

    //TODO: expire
    userTokens.push(user);
    res.json({ err, user });
  });
});

//admin get all users
app.get('/user', isAdmin, (req, res) => {
  //TODO: make sure user is admin

  userRepo.getAll((err, data) => {
    if (err) {
      //TODO: handle
      res.status(500);
      return res.json(err);
    }

    res.json(data);
  });
});

//admin create user ... use reg for now
// app.post('/user', isAuthenticated, (req, res) => {

// });

//admin update user
app.put('/user', isAdmin, (req, res) => {
  console.log(req.body.user);
  userRepo.update(req.body.user, (err, user) => {
    if (err) {
      //TODO: handle
      res.status(500);
      return res.json(err);
    }

    res.json(user);
  });
});

app.delete('/user/:id', isAdmin, (req, res) => {
  console.log(req.params.id);
  userRepo.remove(req.params.id, err => {
    if (err) {
      //TODO: handle
      res.status(500);
      return res.json(err);
    }

    res.json();
  });
});

//admin update doc
app.put('/doc', isAdmin, (req, res) => {
  console.log('update doc', req.body);
  docRepo.update(req.body, (err, doc) => {
    if (err) {
      //TODO: handle
      res.status(500);
      return res.json(err);
    }

    res.json(doc);
  });
});

//admin remove file
app.delete('/doc/:id', isAdmin, (req, res) => {
  docRepo.remove(req.params.id, err => {
    if (err) {
      //TODO: handle
      res.status(500);
      return res.json(err);
    }

    res.json();
  });
});

//get doc
app.get('/doc/:id', (req, res) => {
  console.log('doc', req.params.doc);
  docRepo.getById(req.params.id, (err, doc) => {
    if (err) {
      //TODO: handle
      res.status(500);
      return res.json(err);
    }

    if (!doc) {
      res.status(404);
      return res.json({ msg: 'unable to find requested document' });
    }

    if (doc.expired) {
      res.status(400);
      return res.json({ msg: 'request document has expired' });
    }

    if (doc.isPub) {
      return res.sendFile(`${__dirname}/uploads/${doc.src}`);
    }
    const somebody = getCurrentUser(req);

    if (somebody) {
      res.sendFile(`${__dirname}/uploads/${doc.src}`);
    } else {
      res.status(401);
      return res.json({ msg: 'Please login to view requested document' });
    }
  });
});

app.get('/calendar', (req, res) => {
  docRepo.getAll((err, found) => {
    if (err) return res.status(500).json(err);

    return res.json(
      found.filter(doc => {
        return doc.type === 'monthly-calendar' && (!doc.until || !doc.expired);
      })[0]
    );
  });
});

app.get('/calendar', (req, res) => {
  docRepo.getAll((err, found) => {
    if (err) return res.status(500).json(err);

    return res.json(
      found.filter(doc => {
        return doc.type === 'monthly-calendar' && (!doc.until || !doc.expired);
      })[0]
    );
  });
});

app.get('/doc', (req, res) => {
  const somebody = getCurrentUser(req);
  docRepo.getAll((err, found) => {
    if (err) return res.status(500).json(err);

    return res.json(
      found.filter(doc => {
        if (!somebody) {
          return doc.isPub && (!doc.until || !doc.expired);
        } else {
          return !doc.until || !doc.expired;
        }
      })
    );
  });
});

//admin get docs
app.get('/admin/doc', isAdmin, (req, res) => {
  docRepo.getAll((err, found) => {
    if (err) return res.status(500).json(err);

    return res.json(found);
  });
});

app.post('/upload', isAuthenticated, function(req, res) {
  if (!req.files) return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const fname = `${uuidv1()}.${req.files.file.name.split('.').reverse()[0]}`;

  // Use the mv() method to place the file somewhere on your server
  fs.writeFile(`${__dirname}/uploads/${fname}`, req.files.file.data, err => {
    if (err) return res.status(500).json(err);
    docRepo.create(
      {
        name: req.body.name,
        type: req.body.type,
        src: fname,
        when: req.body.when,
        until: req.body.until || '',
        isPublic: req.body.isPublic || false
      },
      (err, newDoc) => {
        if (err) return res.status(500).json(err);

        res.json(newDoc);
      }
    );
  });
});
//notifications

//admin remove file
app.delete('/notification/:id', isAdmin, (req, res) => {
  notificationRepo.remove(req.params.id, err => {
    if (err) {
      //TODO: handle
      res.status(500);
      return res.json(err);
    }

    res.json();
  });
});

app.get('/notification', (req, res) => {
  const somebody = getCurrentUser(req);
  notificationRepo.getAll((err, found) => {
    if (err) return res.status(500).json(err);

    return res.json(
      found.filter(doc => {
        if (!somebody) {
          return doc.isPub && (!doc.until || !doc.expired);
        } else {
          return !doc.until || !doc.expired;
        }
      })
    );
  });
});

//admin get docs
app.get('/admin/notification', isAdmin, (req, res) => {
  notificationRepo.getAll((err, found) => {
    if (err) return res.status(500).json(err);

    return res.json(found);
  });
});
app.put('/admin/notification/all', isAdmin, (req, res) => {
  console.log('create notification', req.body);
  notificationRepo.update(req.body, (errs, updated) => {
    if (errs && errs.length) return res.status(500).json(errs);

    res.json(updated);
  });
});
app.post('/admin/notification', isAdmin, (req, res) => {
  console.log('create notification', req.body);
  notificationRepo.create(
    {
      title: req.body.title,
      msg: req.body.msg,
      type: req.body.type,
      when: req.body.when,
      until: req.body.until || '',
      isPublic: req.body.isPublic || false,
      index: req.body.index || 0
    },
    (err, newNotification) => {
      if (err) return res.status(500).json(err);

      res.json(newNotification);
    }
  );
});
//end notifications

app.get('*', (req, res) => {
  //console.log('knock knock',req.path, req.originalUrl);
  res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});

function isAuthenticated(req, res, next) {
  const somebody = getCurrentUser(req);
  if (!somebody) {
    res.status('401');
    return res.send('no no!');
  }

  next();
}

function isAdmin(req, res, next) {
  const somebody = getCurrentUser(req);
  if (!somebody || !somebody.isAdmin) {
    res.status('401');
    return res.send('no no!');
  }

  next();
}

function getCurrentUser(req) {
  const token = req.cookies.t; // req.headers['x-session-token'];
  return !token ? null : userTokens.filter(x => x.token === token)[0];
}

//TODO: make test
setTimeout(() => {
  if (process.env.NODE_ENV !== 'production') {
    userRepo.login('test@test.com', 'Test123!', (err, user) => {
      if (err || !user) {
        userRepo.register(
          {
            email: 'test@test.com',
            firstName: 'test',
            lastName: 'testlast',
            pwd: 'Test123!',
            isAdmin: true,
            isActive: true
          },
          (e, u) => console.log(e, u)
        );
      }
    });
  }
}, 1000);
