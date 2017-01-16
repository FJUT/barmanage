const express = require('express');
const router = express.Router();
const models = require('../models')
const sha1 = require('../lib/sha1')
const auth = require('../middlewares/auth')
const Token = require('../lib/Token')

/* GET home page. */
router.get('/', auth, function(req, res, next) {
  res.render('index', {
    title: 'Sequelize: Bars',
    bars: Object.keys(models.Bar.rawAttributes)
  })
})

router.get('/register', (req, res, next) => {
  if (req.cookies.token) {
    res.redirect('/')
    return
  }

  res.render('register', {

  })
})

router.get('/login', (req, res, next) => {
  let token = req.cookies.token
  if (token) {
    res.redirect('/')
  } else {
    res.render('login')
  }
})

router.post('/login', (req, res, next) => {
  let { phonenumber, password } = req.body

  models.Bar.findOne({
    where: {
      phonenumber: phonenumber,
      password: sha1(password)
    }
  }).then(result => {
    // 返回原始json的方法
    // res.send(result.get({ plain: true }))
    if (!result) {
      res.redirect('/login')
    } else {
      res.cookie('token', Token.encode(phonenumber, password))
      res.redirect('/')
    }
  })
})

router.post('/register', (req, res, next) => {
  let { phonenumber, password } = req.body

  if (phonenumber === '' || password === '') {
    res.redirect('/register')
    return
  }

  password = sha1(password)

  models.Bar.upsert({
    phonenumber,
    password
  }).then(created => {
    res.send(created)
  })
})

module.exports = router;