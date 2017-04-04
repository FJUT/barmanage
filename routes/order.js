/**
 * Created by shinan on 2017/1/23.
 */
const express = require('express')
const models = require('../models')
const Token = require('../lib/Token')
const auth = require('../middlewares/auth')
const co = require('co')
const router = express.Router()
const {Message, Order} = models

router.get('/', auth, (req, res, next) => {
  const { id } = res.locals.barInfo

  co(function*() {
    var messages = yield Message.findAll({
      where: {
        BarId: id
      }
    })

    var orders = yield Order.findAll({
      where: {
        MessageId: messages.map(msg => msg.id),
        status: true
      }
    })

    res.render('order', {orders})
  })
})

module.exports = router