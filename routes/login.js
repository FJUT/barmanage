/**
 * Created by shinan on 2017/1/23.
 */
const express = require('express')
const models = require('../models')
const sha1 = require('../lib/sha1')
const Token = require('../lib/Token')
const co = require('co')
const router = express.Router();

router.get('/', (req, res, next) => {
  let token = req.cookies.token

  if (token) {
    res.redirect('/')
  } else {
    res.render('login', {
      error_message: req.flash('error_message')
    })
  }
})

router.post('/', (req, res, next) => {
  let { phonenumber, password, rememberme } = req.body

  models.Bar.findOne({
    where: {
      phonenumber: phonenumber,
      password: sha1(password)
    }
  }).then(result => {
    /* 返回原始json的方法 */
    // res.send(result.get({ plain: true }))
    if (!result) {
      req.flash('error_message', '用户名或密码错误')
      res.redirect('/login')
      return
    }

    let expires = rememberme ? new Date(Date.now() + 86400) : 0

    res.cookie(
      'token',
      Token.encode(phonenumber, password),
      { expires }
    )

    res.redirect('/')
  })
})

module.exports = router