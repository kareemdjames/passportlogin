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

const index = require('./routes/index')
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
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
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

// Express Messages
app.use(require('connect-flash')())
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
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

app.use('/', index);
// app.use('/users', users);

// Error Handling
app.use('*', (req, res) => {
  res.status(404).send({
    error: 'Not Found',
  })
})
