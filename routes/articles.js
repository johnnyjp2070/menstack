const express = require('express')
const router = express.Router()

//Bring in Model

let Article = require('../models/articles')

//Add Articles

router.get('/add', function(req, res) {
  res.render('./add-article.pug', {
    title: 'Add Article'
  })
})
//Get Single Article
router.get('/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('./article.pug', {
      article
    })
  })
})

router.post('/add', function(req, res) {
  req.checkBody('title', 'Title is Required').notEmpty()
  req.checkBody('author', 'Author is Required').notEmpty()
  req.checkBody('body', 'Body is Required').notEmpty()

  // Get errors

  let errors = req.validationErrors()
  if (errors) {
    res.render('add-article', {
      title: 'Add Article',
      errors
    })
  } else {
    let article = new Article()

    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body

    article.save(function(err) {
      if (err) {
        console.log(err)
        return
      } else {
        req.flash('success', 'Article Added')
        res.redirect('/')
      }
    })
  }

  // res.render('./article.pug', {
  //   title: 'Add Article'
  // })
})

//Get Edit Article Page
router.get('/edit/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('./edit_article.pug', {
      title: 'Edit Article',
      article
    })
  })
})

//Edit Request of Article
router.post('/edit/:id', function(req, res) {
  let article = {}
  article.title = req.body.title
  article.author = req.body.author
  article.body = req.body.body

  let query = { _id: req.params.id }

  Article.update(query, article, function(err) {
    if (err) {
      console.log(err)
    } else {
      req.flash('success', 'Article Edited')
      res.redirect('/')
    }
  })
})

router.delete('/:id', function(req, res) {
  let query = { _id: req.params.id }
  Article.findOneAndDelete(query, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.send('Success')
    }
  })
})

module.exports = router
