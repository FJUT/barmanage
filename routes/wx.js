/**
 * Created by shinan on 2017/2/26.
 */
var express = require('express')
var router = express.Router()
var querystring = require('querystring')
var request = require('request')

// 以下信息需要微信后台申请开发者资格
var APP_ID = ''
var APP_SECRET = ''
var WX_SESSION_KEY_URL = 'https://api.weixin.qq.com/sns/jscode2session'

router.get('/getOpenidAndSessionKey', (req, res, next) => {
  var JSCODE = ''

  var str = querystring.stringify({
    appid: APP_ID,
    secret: APP_SECRET,
    js_code: JSCODE,
    grant_type: 'authorization_code'
  })

  var url = WX_SESSION_KEY_URL + '?' + str

  request(url, function(err, response, body) {
    if (err) {
      console.log(err)

      return
    }

    console.log(body)

    res.send(200)
  })
})

module.exports = router