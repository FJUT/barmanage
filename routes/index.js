const express = require('express');
const router = express.Router();
const models = require('../models')
const sha1 = require('../lib/sha1')

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(models.Bar.rawAttributes)

  res.render('index', {
    title: 'Sequelize: Bars',
    bars: Object.keys(models.Bar.rawAttributes)
  })
});

router.get('/register', (req, res, next) => {
  res.render('register', {

  })
})

router.get('/login', (req, res, next) => {
  res.render('login', {

  })
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
      next()
    }
  })
})

router.post('/register', (req, res, next) => {
  let { phonenumber, password } = req.body

  if (phonenumber === '' || password === '') {
    res.send('fuck you')
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
