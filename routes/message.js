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
  const {id} = res.locals.barInfo

  let limit = req.query['limit'] || 50
  let offset = req.query['offset'] || 0

  if (!/\d+/.test(limit) || !/\d+/.test(offset)) {
    res.json({iRet: -1, msg: "参数错误"})
    return
  }

  co(function*() {
    let count = yield Message.count({where: {BarId: id}})

    let _sql = `SELECT * FROM Messages WHERE (deletedAt IS NULL AND BarId = ${id}) ORDER BY createdAt DESC LIMIT 50`

    let messages = yield sequelize.query(_sql)

    if (messages && messages[0]) {
      res.render('message', {messages: messages[0], count: count})
    } else
      res.json({iRet: -1, msg: err})

  }).catch((err) => {

    res.json({iRet: -1, msg: err})

  })
})

router.get('/query', auth, (req, res, next) => {
  const {id} = res.locals.barInfo

  let limit = req.query['limit'] || 50
  let offset = req.query['offset'] || 0

  if (!/\d+/.test(limit) || !/\d+/.test(offset)) {
    res.json({iRet: -1, msg: "参数错误"})
    return
  }

  co(function*() {
    var count = yield Message.count({where: {BarId: id}})

    let _sql = `SELECT * FROM Messages WHERE (deletedAt IS NULL AND BarId = ${id}) ORDER BY createdAt DESC LIMIT ${offset}, ${limit}`

    let messages = yield sequelize.query(_sql)

    if (messages && messages[0]) {

      res.json({messages: messages[0], count: count})

    } else {

      res.json({iRet: -1, msg: err})
    }
  }).catch((err) => {

    res.json({iRet: -1, msg: err})

  })
})

router.post('/del', (req, res, next) => {
  var id = req.body.id

  if (!/\d+/.test(id)) {
    res.json({iRet: -1, msg: "参数错误"})
    return
  }

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
