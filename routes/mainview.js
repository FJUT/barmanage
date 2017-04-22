/**
 * Created by shinan on 2017/1/23.
 */
const express = require('express')
const models = require('../models')
const Token = require('../lib/Token')
const auth = require('../middlewares/auth')
const DataApi = require('../lib/DataApi')
const co = require('co')
const router = express.Router()
const {Message, sequelize} = models

//渲染mainview页面请求
router.get('/', auth, (req, res, next) => {
  let _barId = res.locals.barInfo['id']

  co(function *() {
    let newsResult = yield models.CompanyNews.findAll({order: 'newsTime DESC'})

    // let _sql_order = `select u.name, o.amount, u.gender, o.createdAt from Users u, Orders o where o.BarId = ${_barId} and o.UserId = u.id and o.status=1`
    // let orderResult = yield models.sequelize.query(_sql_order)

    let _totalRes = yield squeryTotalMoney(_barId)
    let _total = DataApi.getBillRadio(parseFloat(_totalRes[0][0] ? _totalRes[0][0]['total'] : 0))

    let _orderCountRes = yield  squeryOrderCount(_barId)
    let _count = _orderCountRes[0][0] ? _orderCountRes[0][0]['count'] : 0

    let orderResult = yield squeryBillPage(_barId, 15, 0)

    //目前查的是系统用户总数
    let userCount = yield models.User.count()

    let wallCount = yield models.Message.count({
      where: {
        msgType: {$ne: 2},
        BarId: _barId
      },
      paranoid: true
    })

    let bapingCount = yield models.Message.count({
      where: {
        BarId: _barId,
        msgType: 2,
        isPayed: 1
      },
      paranoid: true
    })

    res.render('mainview', {
      news: newsResult ? newsResult : [],
      totalMoney: _total || 0,
      order: orderResult ? orderResult[0] : [],
      orderCount : _count || 0,
      userCount: userCount ? userCount : 0,
      wallCount: wallCount ? wallCount : 0,
      bapingCount: bapingCount ? bapingCount : 0,
      err: ""
    });
  }).catch((err) => {
    res.render('mainview', {
      err: err
    });
  })
})


function squeryTotalMoney(barid) {
  let _sql_order = `select sum(o.amount) total from Orders o where o.BarId = ${barid} and o.status=1`
  return models.sequelize.query(_sql_order)
}

function squeryOrderCount(barid) {
  let _sql_order = `select count(o.amount) count from Orders o where o.BarId = ${barid} and o.status=1`
  return models.sequelize.query(_sql_order)
}

function squeryBillPage(barid, limit, offset) {
  let _sql_order = `select u.name, o.amount, u.gender, o.createdAt from Users u, Orders o \
    where o.BarId = ${barid} and o.UserId = u.id and o.status=1 ORDER BY o.createdAt DESC LIMIT ${limit} OFFSET ${offset}`

  return models.sequelize.query(_sql_order)
}


//分页查询账单接口
router.get('/querybill', auth, (req, res, next) => {
  let _barId = res.locals.barInfo['id']
  let _limit = req.query['limit']
  let _offset = req.query['offset']

  co(function *() {
    let orderResult = yield squeryBillPage(_barId, _limit, _offset)

    let countRes = yield squeryOrderCount(_barId)

    let _count = countRes[0][0] ? countRes[0][0]['count'] : 0

    res.json({iRet: 0, order : orderResult[0], count: _count})
  }).catch((err) => {
    res.json({iRet: -1, msg : err})
  })
})

module.exports = router
