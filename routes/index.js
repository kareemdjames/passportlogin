const express = require('express')
const router = express.Router();

let User = require('../models/user')

// Home Page
router.get('/', (req, res, next) => {
  res.render('index')
})

// Register Form
router.get('/register', (req, res, next) => {
  res.render('register')
})

// Process Register
router.post('/register', (req, res, next) => {
  const name = req.body.name
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password
  const password2 = req.body.password2

  // Express Validators
  req.checkBody('name', 'Name field is required').notEmpty()
  req.checkBody('email', 'Email field is required').notEmpty()
  req.checkBody('email', 'Email must be a valid email address').notEmpty()
  req.checkBody('username', 'Username field is required').notEmpty()
  req.checkBody('password', ' Password field is required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

  let errors = req.validationErrors()

  if (errors) {
    res.render('register', {
      errors: errors
    })
  } else {
    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password
    })

    User.registerUser(newUser, (err, user) => {
      if(err) throw err;
      res.redirect('/login')
    })
  }
})


module.exports = router
