const fs = require('fs');
const express = require('express');
const router = express.Router();
const models = require('../models')
const sha1 = require('../lib/sha1')
const upload = require('../middlewares/upload')
const auth = require('../middlewares/auth')
const Token = require('../lib/Token')
const co = require('co')

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

  res.render('register')
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
  let { phonenumber, password, rememberme } = req.body

  models.Bar.findOne({
    where: {
      phonenumber: phonenumber,
      password: sha1(password)
    }
  }).then(result => {
    /* 返回原始json的方法 */
    // res.send(result.get({ plain: true }))
    if (!result) {
      res.redirect('/login')
    } else {
      var expires = rememberme ? new Date(Date.now() + 86400) : 0

      console.log(`expires${expires}`)

      res.cookie('token', Token.encode(phonenumber, password), {
        expires
      })

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

  models.Bar
    .upsert({
      phonenumber,
      password
    })
    .then(created => {
      res.send(created)
    })
})

router.get('/form', auth, (req, res, next) => {
  res.render('form', { barInfo: res.locals.barInfo })
})

router.post('/saveForm', (req, res) => {
  var { barInfo } = req.body

  // console.log(barInfo)

  models.Bar.update(Object.assign({}, barInfo), {
    where: {
      id: barInfo.id
    }
  }).then(affected => {
    res.json({
      iRet: 0
    })
  })
})

router.post('/upload', upload.single('logo'), (req, res, next) => {
  // console.log(req.body.address)
  // console.log(req.file)
  res.json({
    iRet: 0,
    url: req.file.filename,
    message: 'upload ready'
  })
})

router.post('/uploadMulti', upload.array('photos'), (req, res, next) => {
  // console.log(req.files)

  res.json({
    iRet: 0,
    photos: req.files.map(file => file.filename),
    message: 'upload ready'
  })
})

router.post('/saveBarInfo', (req, res, next) => {
  
})

router.get('/logout', (req, res, next) => {
  res.clearCookie('token')
  res.redirect('/')
})

module.exports = router;
