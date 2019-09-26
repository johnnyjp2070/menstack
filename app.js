const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const config = require('./config/database')
const passport = require('passport')

mongoose.connect(config.database)
let db = mongoose.connection

//Check Connection

db.once('open', function() {
  console.log('Connected to MongoDB')
})

//Check for DB Error

db.on('error', function(err) {
  console.log(err)
})

//Init App
const app = express()

//Bring in Model

let Article = require('./models/articles')

//Bodyparser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'))

//LOad view engine

app.set('view engine', 'pug')

app.set('views', './views')

//Express Session Middleware

app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
)

//Express Messages Middleware

app.use(require('connect-flash')())
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//Express Validator middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']'
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      }
    }
  })
)

//Passport Config

require('./config/passport')(passport)
// Passport Initialize
app.use(passport.initialize())
app.use(passport.session())

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null
  next()
})

//Home Route
app.get('/', ensureAuthenticated, function(req, res) {
  Article.find(function(err, articles) {
    if (err) {
      console.log(err)
    } else {
      res.render('index.pug', {
        title: 'Articles',
        articles
      })

      // res.json(articles)
    }
  })
})

//Add route

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash('danger', 'Please Login')
    res.redirect('/users/login')
  }
}

//Roouter

let articles = require('./routes/articles')
let users = require('./routes/users')
app.use('/articles', articles)
app.use('/users', users)

//Start server
app.listen(3000, function() {
  console.log('Server started on port 3000')
})
