const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/nodekb')
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

//LOad view engine

app.set('views', './views')

//Home Route
app.get('/', function(req, res) {
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

app.get('/articles/add', function(req, res) {
  res.render('./article.pug', {
    title: 'Add Article'
  })
})

app.post('/articles/add', function(req, res) {
  let article = new Article()

  article.title = req.body.title
  article.author = req.body.author
  article.body = req.body.body

  article.save(function(err) {
    if (err) {
      console.log(err)
      return
    } else {
      res.redirect('/')
    }
  })

  // res.render('./article.pug', {
  //   title: 'Add Article'
  // })
})

//Start server
app.listen(3000, function() {
  console.log('Server started on port 3000')
})
