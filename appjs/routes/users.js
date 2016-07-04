var express = require('express');
var router = express.Router();

var passport = require('passport');
var User = require('../models/User');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto'); // Used to generate tokens 

// SMTP Config
var userService = '';
var userUsername = '';
var userPassword = '';

router.get('/sign-in', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login', {  user : req.user });
  }
});

router.post('/sign-in', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      console.log('failed to Sign In !');
      return res.redirect('/sign-in');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);

      if(req.body.remember){
        console.log('remember me');
        res.cookie('remember', 1, {maxAge: 60*1000});
      }
      console.log('\n Succesfully loged in');
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/sign-up', function(req,res){
  res.render('register', {});
});

router.post('/sign-up', function(req, res){
  var user = new User({
      email: req.body.email,
      profile: { name: req.body.name, phone: req.body.phone },
      password: req.body.password
  });

  // Check for account duplicate
  User.findOne({ email: req.body.email }, function(err, data){
    if(data) {
      console.log(data.email + " allready exists !");
      return res.redirect('/sign-up');
    }
    user.save(function(err) {
      // send email on signup
      if(!err){ 
        console.log("New acount created !");
      }else{
        console.log('error: ' + err);
      }

      req.logIn(user, function(err) {
          //res.redirect('/sign-in');
          console.log(user.email + " logged in");
      });

    });

    return res.redirect('/');
  });

});

router.all('/logout', function(req, res, next) {
  req.logout();
  console.log('logged out succesfully !');
  res.redirect('/');
});


module.exports = router;
