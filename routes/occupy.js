/**
 * Created by 99171 on 2017/1/17.
 */
const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('occupy')
})

module.exports = router