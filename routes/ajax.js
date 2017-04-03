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
  User
    .findAll({
      limit: 10
    })
    .then(users => {
      res.json({
        iRet: 0,
        users: users.map(user => user.get({plain: true}))
      })
    })
    .catch(err => {
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
  var {barId, lastMessageId} = req.query
  DataApi.getLatestMessages({
    barId,
    lastMessageId
  }).then(messages => res.send(messages))
})

// 发送消息
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
  })
    .then(() => {
      return models.User.findOne({
        where: {
          id: req.body.UserId
        }
      })
    })
    .then(created => {
      res.json({
        iRet: 0,
        userInfo: created.get({plain: true})
      })
    })
    .catch(() => {
      res.json({
        iRet: -1
      })
    })
})

// 创建统一支付订单中间件
const createPayMiddware = (req, res, next) => {
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
      isDisplay: false
    })

    // 插入订单表
    var createdOrder = yield Order.create({
      amount: price,
      MessageId: createdMessage.id
    })

    // 生成订单
    var order = {
      body: `霸屏${seconds}秒`,
      out_trade_no: 'baping_' + createdOrder.id, // 商户订单号后续更新用
      attach: JSON.stringify({
        orderId: createdOrder.id,
        messageId: createdMessage.id
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

// 发送霸屏文字
router.post('/sendBapingText', createPayMiddware)

// 发送霸屏图片和文字
router.post('/sendBaping', upload.single('file'), createPayMiddware)

// 接收微信回调中间件
const responseWeixinNotifyMiddware = notifyMiddleware.getNotify()
  .done((message, req, res, next) => {
    console.log('wx notify message:', message)
    var attach = JSON.parse(message.attach)
    // 订单号,消息号
    var {orderId, messageId} = attach

    co(function*() {
      yield Order.update({status: true}, {
        where: {
          id: orderId
        }
      })

      yield Message.update({isPayed: true}, {
        where: {
          id: messageId
        }
      })

      res.reply('success')
    })
    .catch(err => {
      console.log(err)
      res.reply(new Error('update oreder failed'))
    })
  })

// 接受微信回调
router.use('/notify', responseWeixinNotifyMiddware)

module.exports = router
