/**
 * Created by shinan on 2017/1/23.
 */
const express = require('express')
const models = require('../models')
const Token = require('../lib/Token')
const auth = require('../middlewares/auth')
const co = require('co')
const router = express.Router()

router.get('/', auth, (req, res, next) => {
  const { id } = res.locals.barInfo

  models.LargeScreenInfo.findAll({
    where: {
      id: id
    }
  }).then(rows => {
    res.render('order', {
      rows: rows
    })
  })
})

module.exports = router