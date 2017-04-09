/**
 * Created by Administrator on 2017/2/19.
 */
var express = require('express')
var router = express.Router()
var models = require('../models')
var {Bar, User, Message, BarPrice, Order} = models
var upload = require('../middlewares/upload')
var co = require('co')
var DataApi = require('../lib/DataApi')
var {paymentInstance, notifyMiddleware} = require('../lib/pay')

// 获取酒吧列表
router.get('/getBarList', (req, res, next) => {
  var id = req.query.id

  DataApi.getAllBars().then(bars => {
    res.send(bars)
  }).catch(err => {
    console.log(err)
  })
})

// 排行榜
router.get('/getTopRankUsers', (req, res, next) => {
  User.findAll({
    order:'score DESC',
    limit: 50
  }).then(users => {
    res.json({
      iRet: 0,
      users: users.map(user => user.get({plain: true}))
    })
  }).catch(err => {
    res.json({
      iRet: -1,
      msg: err.message
    })
  })
})

// 获取酒吧详情
router.get('/getBarDetail', (req, res, next) => {
  Bar.find({
    where: {
      id: req.query.id
    }
  }).then(bar => {
    res.send(bar.get({plain: true}))
  })
})

// 获取酒吧消息列表
router.get('/getAllMessages', (req, res, next) => {
  DataApi.getAllMessages(req.query.id)
    .then(messages => res.send(messages))
})

// 获取最新消息
router.get('/getLatestMessages', (req, res, next) => {
  var {barId, lastUpdated} = req.query
  DataApi.getLatestMessages({
    barId,
    lastUpdated
  }).then(messages => res.send(messages))
})

// 发送消息
router.post('/sendMessage', (req, res, next) => {
  var {BarId, msgText, UserId} = req.body

  Message.create({
    msgType: 0,
    msgText: msgText,
    isPayed: true,
    BarId: BarId,
    UserId: UserId
  }).then(created => {
    res.json(created.get({plain: true}))
  })
})

// 获取最新霸屏列表
router.get('/newBapingMessage', (req, res, next) => {
  const {BarId} = req.query
  Message.findAll({
    where: {
      BarId,
      isDisplay: false,
      isPayed: true
    }
  })
    .then(messages => {
      return messages.map(msg => msg.get({plain: true}))
    })
})

// 发送图片
router.post('/sendImage', upload.single('file'), (req, res, next) => {
  var {BarId, UserId} = req.body

  Message.create({
    msgType: 1,
    msgImage: req.file.filename,
    isPayed: true,
    BarId,
    UserId
  }).then(created => {
    res.json(created.get({plain: true}))
  })
})

// 获取霸屏价格
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

// 更换用户头像
router.post('/changeAvatar', upload.single('file'), (req, res, next) => {
  models.User.update({
    avatar: `https://jufoinfo.com/` + req.file.filename
  }, {
    where: {
      id: req.body.UserId
    }
  }).then(() => {
    return models.User.findOne({
      where: {
        id: req.body.UserId
      }
    })
  }).then(created => {
    res.json({
      iRet: 0,
      userInfo: created.get({plain: true})
    })
  }).catch(() => {
    res.json({
      iRet: -1
    })
  })
})

// 创建统一支付订单中间件
const createPayMiddware = (req, res, next) => {
  var {BarId, UserId, msgText, seconds, price, openid} = req.body
  var amount = price

  co(function*() {
    // 插入消息表
    var createdMessage = yield Message.create({
      msgType: 2,
      msgText: msgText,
      msgImage: req.file ? req.file.filename : '',
      BarId,
      UserId,
      seconds,
      isDisplay: false,
      isPayed: false
    })

    // 插入订单表
    var createdOrder = yield Order.create({
      amount: price,
      UserId: UserId,
      MessageId: createdMessage.id
    })

    // 生成订单
    var order = {
      body: `霸屏${seconds}秒`,
      out_trade_no: 'baping_' + createdOrder.id, // 商户订单号后续更新用
      attach: JSON.stringify({
        orderId: createdOrder.id,
        messageId: createdMessage.id,
        userId: UserId,
        amount: amount
      }),
      // total_fee: price * 100, // 微信单位是分，一分钱
      total_fee: 1, // 测试用
      spbill_create_ip: '127.0.0.1',
      openid: openid,
      trade_type: 'JSAPI'
    }

    // 请求微信服务支付
    paymentInstance.getBrandWCPayRequestParams(order, (err, payargs) => {
      console.log(typeof payargs)
      if (err) {
        console.log('创建统一支付订单失败:', err)
        res.json({
          iRet: -1
        })
      } else {
        res.json({
          iRet: 0,
          payargs: payargs
        })
      }
    })
  }).catch(err => {
    console.log('baping error', err)
    res.json({
      iRet: -1
    })
  })
}

// 调试用，模拟发送霸屏
router.post('/sendBapingFake', upload.single('file'), (req, res, next) => {
  var {BarId, UserId, msgText, seconds, price, openid} = req.body

  co(function*() {
    // 插入消息表
    var createdMessage = yield Message.create({
      msgType: 2,
      msgText: msgText,
      msgImage: req.file ? req.file.filename : '',
      BarId,
      UserId,
      seconds,
      isDisplay: false,
      isPayed: false
    })

    // 插入订单表
    var createdOrder = yield Order.create({
      amount: price,
      UserId: UserId,
      MessageId: createdMessage.id
    })

    res.json({
      iRet: 0
    })

    var messageId = createdMessage.id
    var orderId = createdOrder.id

    // 模拟更新订单表，消息表
    setTimeout(() => {
      co(function*() {
        //更新订单状态
        var updateOrderResult = yield Order.update({status: true}, {
          where: {
            id: orderId
          }
        })

        //更新消息支付状态
        var updateMessageResult = yield Message.update({isPayed: true}, {
          where: {
            id: messageId
          }
        })

        //更新用户exp和score
        var updateExpAndScoreResult = yield User.findOne({where: {id: UserId}}).then(function (user) {
          return User.update({
            exp: price + user.exp,
            score: price * 10 + user.score
          }, {where: {id: UserId}})
        })
      })
    }, 500)
  })
})

// 发送霸屏文字
router.post('/sendBapingText', createPayMiddware)

// 发送霸屏图片和文字
router.post('/sendBaping', upload.single('file'), createPayMiddware)

// 接收微信回调中间件
const responseWeixinNotifyMiddware = notifyMiddleware.getNotify().done((message, req, res, next) => {

  console.log('wx notify message:', message)

  var attach = JSON.parse(message.attach)

  // 订单号,消息号
  var {orderId, messageId, userId, amount} = attach

  co(function*() {
    //更新订单状态
    var updateOrderResult = yield Order.update({status: true}, {
      where: {
        id: orderId
      }
    })

    //更新消息支付状态
    var updateMessageResult = yield Message.update({isPayed: true}, {
      where: {
        id: messageId
      }
    })

    //更新用户exp和score
    var updateExpAndScoreResult = yield User.findOne({where: {id: userId}}).then(function (user) {
      return User.update({
        exp: amount + user.exp,
        score: amount * 10 + user.score
      }, {where: {id: userId}})
    })

    console.log(updateOrderResult, updateMessageResult, updateExpAndScoreResult)

    res.reply('success')

  }).catch(err => {
    console.log(err)
    res.reply(new Error('update oreder failed'))
  })
})

// 接受微信回调
router.use('/notify', responseWeixinNotifyMiddware)

module.exports = router
