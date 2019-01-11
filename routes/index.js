var express = require('express');
var router = express.Router();
var User = require('../models/user')

router.get('/profile', (req, res, next) => {
  if(! req.session.userId) {
    var err = new Error('You are not authorized')
    err.status = 403
    return next(err)
  }
  User.findById(req.session.userId)
    .exec( (err, user) => {
      if(err) return next(err)
      else {
        return res.render('profile', {title: 'Profile', name: user.name, favorite: user.favBook})
      }
    })
})

// GET /
router.get('/', function (req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function (req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function (req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

// GET /register
router.get('/register', (req, res, next) => {
  return res.render('register', { title: 'Sign Up' })
})

router.get('/login', (req, res, next) => {
  return res.render('login', { title: 'Log-In' })
})

router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (err, user) => {
      if (error || !user) {
        var err = new Error('Wrong email or password')
        err.status = 401
        return next(err)
      } else {
        req.session.userId = user._id
        return res.redirect('/profile')
      }
    })
  } else {
    var error = new Error('Email and Password are required')
    error.status = 401
    return next(error)
  }
})

// POST /register
router.post('/register', (req, res, next) => {
  if (req.body.email &&
    req.body.name &&
    req.body.favBook &&
    req.body.password &&
    req.body.confirmPassword) {

    // confirm both password match
    if (req.body.password !== req.body.confirmPassword) {
      var err = new Error('Password do not match')
      err.status = 400
      return next(err)
    }

    var { email, name, favBook, password } = req.body

    // create object with form input
    var UserData = {
      email, name, favBook, password
    }

    // insert doc into mongo
    User.create(UserData, (err, user) => {
      if (err) return next(err)
      req.session.userId = user._id
      return res.redirect('/profile')
    })

  } else {
    var err = new Error('All fields required')
    err.status = 400
    return next(err)
  }
})

module.exports = router;
