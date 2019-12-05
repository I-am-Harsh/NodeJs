var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/confusion';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


const connect = mongoose.connect(url)
connect.then( (db) =>{
  console.log("Server is connected succesfully");
  }, (err) =>{
    console.log(err);
});




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('this-is-a-key-for-sign'));

auth = (req,res,next) => {
  console.log(req.signedCookies);

  if(!req.signedCookies.user){
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

    if(username === 'admin' && password ==='pass'){
      // this will allow the request to pass through the next middleware.
      // If an error then it won't get ahead.

      // set the cookie

      res.cookie('user','admin',{signed : true});
      next();
    }

    else{
      var err = new Error('Wrong password or username');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
  }
  // cookie not created then
  else{
    if(req.signedCookies.user === 'admin'){
      next();
    }
    else{
      var err = new Error('Wrong password or username');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
  }
}

// authentication

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);





// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
