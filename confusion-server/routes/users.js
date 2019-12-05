var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
/* GET users listing. */
var user = require('../models/user');

router.use(bodyParser.json());

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', (req,res,next) =>{
  user.findOne({username : req.body.username})
  .then((result) => { 
    if(result != null){
      var err = new Error(`User ${req.body.username} already exists`)
    }
    else{
      return user.create({
        username : req.body.username,
        password : req.body.pass
      })
    }
  })
  .then((result) =>{
    res.statusCode = 200;
    res.setHeader('Content-type','application/json')
    res.json({status : `Registration succesful of the user ${req.body.username} `})
  }, (err) => next(err))
  .catch((err) => next(err))
});

router.post('/login', (req,res,next) =>{
  if(!req.session.user){
    const authHeader = req.headers.authorization;
    // if no header then we challenge the client
    if(!authHeader){
      var err = new Error('You need authentication to access the section');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
    
    // array of user and pass
    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');

    var username = auth[0];
    var password = auth[1];
    user.findOne({username : username})
    .then((result) => {
      if(user === null){
        var err = new Error(`Username doesn't exist`);
        err.status = 403;
        return next(err);
      }

      else if(user.password !== pass){
        var err = new Error('Your password is incorrect');
        err.status = 403;
        return(next(err));
      }

      else if(user.username === username && user.password === pass){
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/plain');
        res.json('You are authenticated');
      }
    })
    .catch((err) => next(err));
  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    res.json('You are authenticated');
  }
});




router.get('/logout', (req,res) => {
  if(req.session){
    req.session.destroy();
  }
})

module.exports = router;
