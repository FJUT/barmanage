/**
 * Created by Administrator on 2017/2/19.
 */
var express = require('express')
var router = express.Router()
var models = require('../models')
var { Bar, User, Message, BarPrice, Order } = models
var upload = require('../middlewares/upload')
var co = require('co')
var DataApi = require('../lib/DataApi')
var { paymentInstance, notifyMiddleware } = require('../lib/pay')

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
  var { barId, lastMessageId } = req.query
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

// 发送霸屏文字
router.post('/sendBapingText', (req, res, next) => {
  var {BarId, UserId, msgText, seconds, price, openid} = req.body

  co(function*() {
    // 插入消息表
    var createdMessage = yield Message.create({
      msgType: 2,
      msgText: msgText,
      msgImage: '',
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
})


// 发送霸屏图片和文字
router.post('/sendBaping', upload.single('file'), (req, res, next) => {
  console.log('filename', req.file.filename)

  var {BarId, UserId, msgText, seconds, price, openid} = req.body

  co(function*() {
    // 插入消息表
    var createdMessage = yield Message.create({
      msgType: 2,
      msgText: msgText,
      msgImage: req.file.filename ? req.file.filename: '',
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
})

var midd = notifyMiddleware
  .getNotify()
  .done((message, req, res, next) => {
    console.log('wx notify message:', message)

    // 订单号
    var orderId = message.out_trade_no.slice(7)

    Order
      .update({status: true}, {
        where: {
          id: orderId,
          MessageId: created.id
        }
      })
      .then(([affectedCount, affectedRows]) => {
        // 给微信回包
        res.reply('success')
      })
      .catch(err => {
        console.log(err)
        res.reply(new Error('update order failed.'))
      })
  })

// 接受微信回调
router.use('/notify', midd)

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

module.exports = router