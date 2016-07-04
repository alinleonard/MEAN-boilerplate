var express = require('express');
var swig = require('swig');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Routes
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//  Connect to MongoDB
var MongoURI = process.env.MONGO_URI || 'mongodb://localhost/node-superhero';
mongoose.connect(MongoURI, function(err, res){
  if(err) {
    console.log('Error connect to: ' + MongoURI + '.' + err);
  } else {
    console.log('MongoDB connected successfully to ' + MongoURI);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// set template engine to swig
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
