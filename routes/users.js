const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

//Bring in User Model

let User = require('../models/users')

router.get('/register', function(req, res) {
  res.render('register.pug', {
    title: 'User Registration'
  })
})

// Register Process

router.post('/register', function(req, res) {
  const name = req.body.name
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password
  const password2 = req.body.password2

  req.checkBody('name', 'Name is Required').notEmpty()
  req.checkBody('email', 'Email is Required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('username', 'UserName is Required').notEmpty()
  req.checkBody('password', 'Password is Required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(password)

  let errors = req.validationErrors()

  if (errors) {
    res.render('register', {
      errors
    })
  } else {
    let newUser = new User({
      name,
      email,
      username,
      password
    })

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) {
          console.log(err)
        }
        newUser.password = hash
        newUser.save(function(err) {
          if (err) {
            console.log(err)
          } else {
            req.flash('success', 'You are now registerd and can log in')
            res.redirect('login')
          }
        })
      })
    })
  }
})
// Login Form
router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login'
  })
})
//Login Process

router.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})
// Logout

router.get('/logout', function(req, res) {
  req.logout()
  req.flash('success', 'You are logged Out')
  res.redirect('/users/login')
})

module.exports = router
