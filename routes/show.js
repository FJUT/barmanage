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
const moment = require('moment')
const router = express.Router();
const {Message, User} = models

router.get('/', auth, (req, res, next) => {
  co(function*() {
    var barId = req.session.barInfo.id
    var messages = yield Message.findAll({
      where: {
        BarId: req.session.barInfo.id
      }
    })

    var set = new Set()
    messages.forEach(message => set.add(message.UserId))

    var users = yield User.findAll({
      where: {id: Array.from(set)}
    })

    var usersHash = {}

    users.forEach(function(user) {
      usersHash[user.id] = user.get({plain: true})
    })

    messages.forEach(function(message) {
      message = message.get({plain: true})

      message.createdAt = moment(message.createdAt).format('MM-DD HH:mm')

      const user = usersHash[message.UserId]
      message.userName = user.name
      message.userAvatar = user.avatar
    })

    res.render('show', {
      messages: messages
    })
  }).catch(next)
})

// 获取未播放的霸屏
router.get('/getPendingBaping', (req, res, next) => {
  co(function*() {
    var messages = yield Message.findAll({
      where: {
        BarId: req.session.barInfo.id,
        isDisplay: false,
        isPayed: true,
        msgType: 2
      }
    })

    var msg = messages.length > 0 ? messages[0].get({plain:true}) : null
    
    if (msg) {
      var user = yield User.findOne({
        where: {
          id: msg.UserId
        }
      })

      msg.UserAvatar = user.avatar
      msg.UserName = user.name
    }
    
    res.json({
      iRet: 0,
      data: msg
    })
  }).catch(err => {
    res.json({
      iRet: -1
    })
  })
})

// 播放完毕后，更新霸屏消息状态
router.post('/setMessageDisplay', (req, res, next) => {
  co(function*() {
    yield Message.update({
      isDisplay: true
    }, {
      where: {
        id: req.body.id
      }
    })

    res.json({
      iRet: 0
    })
  }).catch(err => {
    res.json({
      iRet: -1
    })
  })
})

module.exports = router