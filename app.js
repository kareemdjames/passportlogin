const express = require('express')
const logger = require('morgan')
const path = require('path')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator')
const flash = require ('flash')
const session = require('express-session')
const passport = require('passport')
const mongoose = require('mongoose')

const routes = require('./routes/index')
// const users = require('./routes/users')

// Init App
const app = express()

// Morgan Logger
app.use(logger('dev'))

// Set Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

// View Engine
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout: 'layout'}))
app.set('view engine', 'handlebars')

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// Init Passport
app.use(passport.initialize())
app.use(passport.session())

// Connect Flash
app.use(flash())

// Flash Messages
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

// Express Validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

app.use('/', routes);
// app.use('/users', users);

// Error Handling

app.use('*', (req, res) => {
  res.status(404).send({
    error: 'Not Found',
  })
})
