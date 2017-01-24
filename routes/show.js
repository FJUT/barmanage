/**
 * Created by shinan on 2017/1/23.
 */
const express = require('express')
const models = require('../models')
const sha1 = require('../lib/sha1')
const Token = require('../lib/Token')
const auth = require('../middlewares/auth')
const co = require('co')
const router = express.Router();

router.get('/', auth, (req, res, next) => {
  res.render('show')
})

module.exports = router