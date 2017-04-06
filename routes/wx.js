/**
 * Created by shinan on 2017/2/26.
 */
const express = require('express')
const randomstring = require('randomstring')
const router = express.Router()
const models = require('../models')
const {User} = models
const querystring = require('querystring')
const fetch = require('node-fetch')
const APP_ID = 'wx06a1ff0e6eb6505a'
const MCH_ID = '1454040702'
const APP_SECRET = '70603dba83c47f0700b9107a630f49cb'
const WX_SESSION_KEY_URL = 'https://api.weixin.qq.com/sns/jscode2session'
const WXBizDataCrypt = require('../lib/WXBizDataCrypt')

/*
 // 测试代码
 var encryptedData = "f0kJrEj3ZOMBfgkZpMEvwivkmxkMajzHs/NjYAjlFkLtyzhyUkr/A5x6+ScERd5fys8tBo6Le5AdOZgzPPFVaFez+nh8X9EiJ/FRM9q9F8Qevh03hDJXVIIEFTYBPdEWaNYMCZUplU0v55KsFe28miEpOV/su/nr6kb2C5oXh7Sujyc6oRjzIO01a0BMcFbqPAA+hLHsptFDjJpxqqInRDU2oTgwJIqNxPwDOq5Mvtl3KhVPhnX/mae8wGMP+tPoEqNPu8BpeV3yo6kw22a5JQDO5huo0HXCQPeVquTA30olgigl/XJ3u3qevFhdF0TTN+myzMQEd3HfgfRpwdq1TtYONW8izriGfYVsX38yHMuVvuFmi0goFTNcH1GZlHmSlJD4HpCMqejBu1IYaZ7cKemLPIgEzUuldmB9iP+ZktEufeE1+kxLZ4X6JEKp32gvCS4ReMWVNo+eekwsJjY2uw=="
 var iv = "eriZjuICImh+ilpWLCudEA=="
 var sessionKey = "XFLOa0vefTS2gX1wZLA/zQ=="
 var pc = new WXBizDataCrypt(APP_ID, sessionKey)
 var data = pc.decryptData(encryptedData, iv) // object
 console.log(data)
 */

// 通过code换取openid和session_key
router.get('/getOpenidAndSessionKey', (req, res) => {
  var JSCODE = req.query.JSCODE

  var str = querystring.stringify({
    appid: APP_ID,
    secret: APP_SECRET,
    js_code: JSCODE,
    grant_type: 'authorization_code'
  })

  var url = WX_SESSION_KEY_URL + '?' + str

  fetch(url)
    .then(res => res.json())
    .then(json => {
      res.json(json)
    })
})

// 检查用户是否在数据库中，如不存在则强行入库
router.post('/saveUserToDb', (req, res, next) => {
  var {encryptedData, iv, session_key} = req.body
  var pc = new WXBizDataCrypt(APP_ID, session_key)
  var data = pc.decryptData(encryptedData, iv)

  User.findOrCreate({
    where: {
      openid: data.openId
    },
    defaults: {
      openid: data.openId,
      avatar: data.avatarUrl,
      name: data.nickName,
      gender: data.gender,
      city: data.city,
      province: data.province,
      wx: JSON.stringify(data)
    }
  }).then(ret => {
    res.json({
      iRet: 0,
      userInfo: ret[0].get({plain: true})
    })
  }).catch(err => {
    res.json({
      iRet: -1
    })
  })
})

module.exports = router
