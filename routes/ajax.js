/**
 * Created by Administrator on 2017/2/19.
 */
var express = require('express')
var router = express.Router()
var models = require('../models')
var { Bar, User, Message, BarPrice } = models
var upload = require('../middlewares/upload')
var co = require('co')
var DataApi = require('../lib/DataApi')

router.get('/getBarList', (req, res, next) => {
  var id = req.query.id

  DataApi.getAllBars().then(bars => {
    res.send(bars)
  }).catch(err => {
    console.log(err)
  })
})

router.get('/getBarDetail', (req, res, next) => {
  Bar.find({
    where: {
      id: req.query.id
    }
  }).then(bar => {
    res.send(bar.get({plain: true}))
  })
})

router.get('/getAllMessages', (req, res, next) => {
  DataApi.getAllMessages(req.query.id)
    .then(messages => res.send(messages))
})

router.get('/getLatestMessages', (req, res, next) => {
  var { barId, lastMessageId } = req.query
  DataApi.getLatestMessages({
    barId,
    lastMessageId
  }).then(messages => res.send(messages))
})

router.post('/sendMessage', (req, res, next) => {
  var {BarId, msgText, UserId} = req.body

  Message.create({
    msgType: 0,
    msgText: msgText,
    BarId: BarId,
    UserId: UserId
  }).then(created => {
    res.json(created.get({plain: true}))
  })
})

router.post('/sendImage', upload.single('file'), (req, res, next) => {
  var {BarId, UserId} = req.body

  Message.create({
    msgType: 1,
    msgImage: req.file.filename,
    BarId,
    UserId
  }).then(created => {
    res.json(created.get({plain: true}))
  })
})

router.get('/getPrices', (req, res, next) => {
  BarPrice.findAll({
    where: {
      BarId: req.query.barId
    }
  }).then(result => {
    result = result.map(o => o.get({plain: true}))

    res.json(result)
  })
})

router.post('/needBarPing', (req, res, next) => {

})

module.exports = router