/**
 * Created by Administrator on 2017/2/19.
 */
var express = require('express')
var router = express.Router()
var models = require('../models')
var upload = require('../middlewares/upload')
var co = require('co')

router.get('/getBarList', (req, res, next) => {
  var id = req.query.id

  models.Bar.findAll()
    .then(result => {

    })
    .catch(err => {

    })
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