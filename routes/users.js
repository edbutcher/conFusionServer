var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username})
  .then((user) => {
    if(user != null) {
      let err = new Error(`User ${req.body.username} alredy exists!`);
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password
      })
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    re.json({status: 'Registration Successful!', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {

  if (!req.session.user) {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        let err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
    
    let auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
    let username = auth[0];
    let password = auth[1];

    User.findOne({username: username})
    .then((user) => {
      if (user.username == username && user.password == password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!');
      }
      else {
          let err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 403;
          return next(err);
      }
    })
    
  }
})

module.exports = router;
