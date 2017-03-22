/**
 * Created by Administrator on 2017/2/19.
 */
var express = require('express')
var router = express.Router()
var models = require('../models')
var { Bar, User, Message } = models
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
  DataApi.getAllMessagesByBarId(req.query.id)
    .then(messages => res.send(messages))
})

router.get('/getLatestMessage', (req, res, next) => {

})

router.get('/uploadImage', (req, res, next) => {

})

router.post('/sendMessage', (req, res, next) => {

})

router.post('/needBarPing', (req, res, next) => {

})

module.exports = router