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
router.get('/', (req, res, next) => {
  res.redirect('/mainview')
})

router.post('/register', (req, res, next) => {
  if (!req.xhr) {
    next(new Error('404'))
    return
  }

  co(function*() {
    let {phonenumber, password} = req.body
    let Bar = models.Bar
    let result = yield Bar.findAndCount({
      where: {
        phonenumber: phonenumber
      }
    })

    if (result.count > 0) {
      res.json({
        iRet: -1,
        message: '该手机号已经注册过'
      })

      return
    }

    let created = yield models.Bar.findOrCreate({
      where: {
        phonenumber,
        password: sha1(password)
      }
    })

    res.json({
      iRet: 0,
      message: '注册成功'
    })
  }).catch(next)
})

router.get('/form', auth, (req, res, next) => {
  res.render('form', {barInfo: res.locals.barInfo})
})

router.get('/mainview', auth, (req, res, next) => {

  models.CompanyNews.findAll({order: 'newsTime DESC'}).then((newResult) => {

    // res.render('mainview', {news: newResult});

    //msgType:2为支付类型
    let _barId = res.locals.barInfo['id']
    models.Message.findAll({
      where: {
        BarId: _barId,
        msgType: 2
      },
      include: [
        {model: models.Order, where: {amount: {$gt: 0}}},
        {model: models.User}
      ]

    }).then((orderRes) => {

      console.log("orderRes:", orderRes)
      res.render('mainview', {news: newResult, order: orderRes});

    }).catch((err) => {

      console.log("[mainview@Message]:", err)
    })

  }).catch((err) => {
    console.log("[mainview@CompanyNews]:", err)
  })

})

router.post('/saveForm', (req, res) => {
  var {barInfo} = req.body

  models.Bar.update(Object.assign({}, barInfo), {
    where: {
      id: barInfo.id
    }
  }).then(count => {
    return models.Bar.findOne({where: {id: barInfo.id}})
  }).then(row => {
    // 更新session
    req.session.barInfo = row.get({plain: true})

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

router.get('/logout', (req, res, next) => {
  res.clearCookie('token')
  delete req.session.barInfo
  res.redirect('/')
})

module.exports = router;
