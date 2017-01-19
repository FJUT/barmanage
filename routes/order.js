/**
 * Created by 99171 on 2017/1/19.
 */
const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('order')
})

module.exports = router
