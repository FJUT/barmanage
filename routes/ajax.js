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
var { payment } = require('../lib/pay')

// 获取酒吧列表
router.get('/getBarList', (req, res, next) => {
  var id = req.query.id

  DataApi.getAllBars().then(bars => {
    res.send(bars)
  }).catch(err => {
    console.log(err)
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

// 发送霸屏
router.post('/sendBaping', upload.single('file'), (req, res, next) => {
  var {BarId, UserId, msgText, seconds} = req.body

  co(function*() {
    // 插入消息表
    var createdMsg = yield Message.create({
      msgType: 2,
      msgText: msgText,
      msgImage: req.file.filename,
      BarId,
      UserId,
      seconds,
      isDisplay: false
    })

    // 插入订单表
    var createdOrder = yield Order.create({
      amount: price,
      MessageId: createdMsg.id
    })

    // 生成订单
    var order = {
      body: `霸屏${seconds}秒`,
      out_trade_no: 'baping_' + createdOrder.id,
      total_fee: 1,
      spbill_create_ip: '127.0.0.1',
      openid: req.query.openid,
      trade_type: 'JSAPI'
    }

    // 请求微信服务支付
    payment.getBrandWCPayRequestParams(order, (err, payargs) => {
      if (err) {
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
    res.json({
      iRet: -1
    })
  })
})

var { middleware } = require('../lib/pay')

var notifyMiddleware = middleware
  .getNotify()
  .done((message, req, res, next) => {
    console.log('wx notify message:')
    console.log(message)

    var orderId = message.out_trade_no.slice(7)

    // 此处更新订单表
    Order
      .update({status: true}, {
        where: {
          id: orderId
        }
      })
      .then(([affectedCount, affectedRows]) => {

      })
      .catch()

    // 给微信回包
    res.reply('success')
  })

// 接受微信回调
router.use('/notify', notifyMiddleware)

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