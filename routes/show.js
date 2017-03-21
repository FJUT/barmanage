/**
 * Created by shinan on 2017/1/23.
 * 霸屏路由
 */
const express = require('express')
const models = require('../models')
const sha1 = require('../lib/sha1')
const Token = require('../lib/Token')
const auth = require('../middlewares/auth')
const co = require('co')
const router = express.Router();
const {Message, User} = models

router.get('/', auth, (req, res, next) => {
  co(function*() {
    var barId = req.session.barInfo.id
    var messages = yield Message.findAll({
      where: {BarId: barId}
    })

    var userIds = messages.map(message => message.UserId)

    var users = yield User.findAll({
      where: {id: userIds}
    })

    var usersHash = {}

    users.forEach(function(user) {
      usersHash[user.id] = user.get({plain: true})
    })

    messages.forEach(function(message) {
      message = message.get({plain: true})

      message.user = usersHash[message.UserId]
    })

    res.render('show', {
      messages: messages
    })
  }).catch(next)
})

module.exports = router