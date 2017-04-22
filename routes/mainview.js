/**
 * Created by shinan on 2017/1/23.
 */
const express = require('express')
const models = require('../models')
const Token = require('../lib/Token')
const auth = require('../middlewares/auth')
const co = require('co')
const router = express.Router()
const {Message, sequelize} = models

router.get('/', auth, (req, res, next) => {
  let _barId = res.locals.barInfo['id']

  co(function *() {
    let newsResult = yield models.CompanyNews.findAll({order: 'newsTime DESC'})

    let _sql_order = `select u.name, o.amount, u.gender, o.createdAt from Users u, Orders o where o.BarId = ${_barId} and o.UserId = u.id and o.status=1`
    let orderResult = yield models.sequelize.query(_sql_order)

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
      order: orderResult ? orderResult[0] : [],
      userCount: userCount ? userCount : 0,
      wallCount: wallCount ? wallCount : 0,
      bapingCount: bapingCount ? bapingCount : 0,
      err: ""
    });
  }).catch((err)=>{
    res.render('mainview', {
      err: err
    });
  })
})

router.get('/billdetail', auth, (req, res, next) => {
})

module.exports = router
