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

  let _barId = res.locals.barInfo['id']

  co(function *() {
    let newsResult = yield models.CompanyNews.findAll({order: 'newsTime DESC'})

    let orderResult = yield models.Message.findAll({
      attributes: ['id', 'BarId', 'UserId'],
      where: {
        BarId: _barId,
        //msgType:2为支付类型
        msgType: 2
      },
      include: [
        {
          model: models.Order,
          where: {amount: {$gt: 0}, status: {$ne: 0}},
          attributes: ['createdAt', 'amount', 'UserId']
        },
        {model: models.User, attributes: ['name', 'gender', 'id']}
      ]
    })

    let userCount = yield models.User.count()

    let wallCount = yield models.Message.count({
      where: {
        msgType: {$ne: 2}
      }
    })

    let bapingCount = yield models.Message.count({
      where: {
        msgType: 2,
        isPayed: 1
      }
    })

    res.render('mainview', {
      news: newsResult ? newsResult : {},
      order: orderResult ? orderResult : {},
      userCount: userCount ? userCount : 0,
      wallCount: wallCount ? wallCount : 0,
      bapingCount: bapingCount ? bapingCount : 0
    });
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

router.post('/feedback', auth, (req, res) => {
  let barId = req.session.barInfo.id
  let {content} = req.body
  models.Feedback.create({
    content: content, BarId: barId
  }).then(function () {
    res.json({iRet: 0})
  }).catch(function (err) {
    res.json({iRet: -1, err: err})
  })
})

module.exports = router;
