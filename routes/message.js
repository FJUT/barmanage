/**
 * Created by shinan on 2017/1/23.
 */
const express = require('express')
const models = require('../models')
const Token = require('../lib/Token')
const auth = require('../middlewares/auth')
const co = require('co')
const router = express.Router()
const {Message} = models

router.get('/', auth, (req, res, next) => {
  const {id} = res.locals.barInfo

  co(function*() {
    var messages = yield Message.findAll({
      where: {
        BarId: id
      }
    })

    messages = messages.map(o => o.get({plain: true}))

    res.render('message', {messages})
  })
})

router.post('/del', (req, res, next) => {
  var id = req.body.id

  Message.destroy({
    where: {
      id: id
    }
  }).then(delCount => {
    res.json({
      iRet: 0,
      data: delCount
    })
  }).catch(err => {
    res.json({
      iRet: -1
    })
  })
})

module.exports = router
