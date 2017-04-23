/**
 * Created by shinan on 2017/1/23.
 * 霸屏路由
 */
const express = require('express')
const models = require('../models')
const sha1 = require('../lib/sha1')
const Token = require('../lib/Token')
const auth = require('../middlewares/auth')
const co = require('co')
const moment = require('moment')
const router = express.Router();
const {Message, User, LandInfo, sequelize} = models
const DataApi = require('../lib/DataApi')
const _ = require('underscore')

global._bapingStatus = global._bapingStatus || {}

const toPlain = o => o.get({plain: true})

function transDate(date) {
  var tt = new Date(date)
  var days = parseInt((new Date().getTime() - date) / 86400000);
  var today = new Date().getDate();
  var year = tt.getFullYear();
  var mouth = tt.getMonth() + 1;
  var day = tt.getDate();
  var time = tt.getHours() < 10 ? "0" + tt.getHours() : tt.getHours();
  var min = tt.getMinutes() < 10 ? "0" + tt.getMinutes() : tt.getMinutes();
  var result, offset;
  offset = Math.abs(today - day);
  if (days < 4 && offset < 4) {
    if (offset === 0) {
      result = "今天 " + time + ":" + min;
    } else if (offset === 1) {
      result = "昨天 " + time + ":" + min;
    } else if (offset === 2) {
      result = "前天 " + time + ":" + min;
    }
  } else {
    result = year + "-" + mouth + "-" + day + " " + time + ":" + min;
  }

  return result
}


router.get('/', auth, (req, res, next) => {
  let barId = req.session.barInfo.id
  co(function*() {
    // 获取3天内的所有历史消息
    //var messages = yield DataApi.getAllMessages(barId)
    //messages.forEach(msg => msg.createdAt = moment(msg.createdAt).format('HH:mm'))

    // 打开大屏幕的时候
    // 删除的消息不显示
    // 显示历史消息10条
    let _sql_users_info = `select m.id, m.msgText, u.avatar UserAvatar, u.name UserName, u.gender, u.exp, m.msgImage, m.createdAt, m.updatedAt, m.msgVideo, m.msgType \
      from Messages m inner join Users u on m.UserId = u.id \
      where m.BarId = ${barId} AND m.deletedAt IS NULL order by m.createdAt DESC limit 10`

    let messages = yield sequelize.query(_sql_users_info)

    global._bapingStatus[barId] = 'open'

    //消息之后少数几条的时候 默认消息
    if (messages[0].length < 3) {
      let defaultMsgs = [
        {
          "UserAvatar": "http://jufoinfo.com/images/logo-default.png",
          "UserName": "YeHi-夜嗨",
          "gender": 1,
          "exp": 99999,
          "msgText": "欢迎使用YeHi-夜嗨大屏幕互动系统",
          "msgImage": null,
          "msgVideo": null,
          "msgType": 0,
          "id": 0,
          "createdAt": new Date.now(),
          "updatedAt": new Date.now(),
          "lv": 20
        },
        {
          "UserAvatar": "http://jufoinfo.com/images/logo-default.png",
          "UserName": "YeHi-夜嗨",
          "gender": 1,
          "exp": 99999,
          "msgText": "扫描屏幕下方二维码，参与互动",
          "msgImage": null,
          "msgVideo": null,
          "msgType": 0,
          "id": 0,
          "createdAt": new Date.now(),
          "updatedAt": new Date.now(),
          "lv": 20
        }
      ]

      messages.unshift(defaultMsgs)
    }

    let tmsg = messages[0].map(function (obj) {
      let tmp = _.extend({}, obj)
      tmp['createdAt'] = transDate(new Date(tmp['createdAt']))
      return tmp
    })

    res.render('show', {
      messages: tmsg
    })
  }).catch(next)
})

// 获取未播放的霸屏
router.get('/getPendingBaping', (req, res, next) => {
  co(function*() {

    var messages = yield DataApi.getMessages({
      BarId: req.session.barInfo.id,
      isDisplay: false,
      isPayed: true,
      msgType: 2
    })

    var msg = messages.length > 0 ? messages[0] : null

    res.json({
      iRet: 0,
      data: msg
    })
  }).catch(err => {
    res.json({
      iRet: -1
    })
  })
})

// 播放完毕后，更新霸屏消息状态
router.post('/setMessageDisplay', (req, res, next) => {
  co(function*() {
    yield Message.update({
      isDisplay: true
    }, {
      where: {
        id: req.body.id
      }
    })

    res.json({
      iRet: 0
    })
  }).catch(err => {
    res.json({
      iRet: -1
    })
  })
})

// 获取最新消息
// -大屏幕和小程序： 删除的消息不显示
router.get('/getNewMessages', (req, res, next) => {
  const barId = req.session.barInfo.id
  const lastMessageId = req.query.lastMessageId || 0
  let me = this
  co(function *() {
    // 找用户信息
    let _sql_users = `SELECT u.avatar UserAvatar, u.name UserName, u.gender, u.exp, m.msgText, m.msgImage, m.msgVideo, m.createdAt, m.updatedAt, m.id, m.msgType, m.createdAt \
          FROM Messages m, INNER JOIN Users u ON m.UserId = u.id  \
          WHERE u.id = m.UserId AND m.BarId = ${barId} \
          AND m.id > ${lastMessageId} AND m.deletedAt IS NULL \
          ORDER BY m.createdAt ASC`

    let _users_result = yield sequelize.query(_sql_users)

    moment.locale("zh")

    let messages = _users_result[0].map((obj) => {
      let tmp = _.extend({}, obj)
      let _lv = DataApi.getLv(obj['exp'] * me.m2exp)
      tmp['lv'] = _lv['lv']
      tmp['createdAt'] = transDate(new Date(tmp['createdAt']))
      return tmp
    })

    res.json({iRet: 0, data: messages})

  }).catch((err) => {
    console.log('[error]@getNewMessages:', err)
    res.json({iRet: -1, msg: err})
  })

  // DataApi.getLatestMessages({
  //   barId,
  //   lastMessageId
  // }).then(messages => {
  //   messages.forEach(msg => msg.createdAt = moment(msg.createdAt).format('HH:mm'))
  //
  //   res.json({
  //     iRet: 0,
  //     data: messages
  //   })
  // }).catch(err => {
  //   res.json({
  //     iRet: -1
  //   })
  // })
})

//检查消息ids中包含已删除消息的id
router.get('/getDeletedMessage', (req, res, next) => {
  const barId = req.session.barInfo.id
  //const barId = 1
  const inArrStr = req.query['ids']
  try{
    var inArr = JSON.parse(inArrStr)
  } catch(e) {
    res.json({iRet: -1, msg: e.message || e})
    return
  }

  co(function *() {
    let arr = yield models.Message.findAll({
      attributes: ["id"],
      where: {
        BarId: barId,
        id: {
          $in: inArr
        },
        deletedAt: {
          $ne: null
        }
      },
      paranoid: false
    })

    arr = arr.map((obj)=>{
      let _t = obj.get({plain:true})
      return _t["id"]
    })
    res.json({iRet: 0, data: arr})
  }).catch((err) => {
    res.json({iRet: -1, msg: err.message})
  })
})

router.get('/getNewLamp', (req, res, next) => {
  const barId = req.session.barInfo.id

  co(function *() {

    //登录上次显示时间和目前大于1小时就显示
    let _sql = `SELECT id, name, avatar, exp, gender FROM Users u WHERE u.id IN (SELECT userid FROM LandInfos l WHERE \
    l.BarId = ${barId} AND (l.displayAt IS NULL \
    OR l.displayAt < DATE_SUB(NOW(), INTERVAL 1 HOUR))) \
    GROUP BY u.id;`

    // let _secondspan = 3600
    // let _sql = `SELECT u.id, u.name, u.avatar, u.exp, u.gender\
    //   FROM Users u WHERE\
    //     u.id IN (SELECT DISTINCT userid\
    //       FROM weizhong.landinfos l\
    //       WHERE\
    //         l.barid = ${barId}\
    //           AND TIMESTAMPDIFF(SECOND,\
    //           l.displayAt,\
    //           l.updatedAt) > ${_secondspan})\
    //   GROUP BY u.id;`

    let _result = yield sequelize.query(_sql)

    if (_result && _result[0] && _result[0].length > 0) {
      let _ret = _result[0].map((obj) => {
        let _lv = DataApi.getLv(parseFloat(obj['exp']) * DataApi.m2exp)
        return {
          lv: _lv['lv'],
          id: obj['id'],
          name: obj['name'],
          gender: obj['gender'],
          avatar: obj['avatar'],
          exp: obj['exp']
        }
      }).filter((obj) => {  //过滤等级大于5级的用户
        return obj['lv'] >= 5
      })

      let updateUserIds = _ret.map((obj) => {
        return obj['id']
      })
      let _ret_up = yield LandInfo.update({displayAt: new Date()}, {
        where: {userid: {$in: updateUserIds}},
        barid: barId
      })

      res.json({iRet: 0, data: _ret})
    } else {
      res.json({iRet: 0, data: null})
    }
  }).catch((err) => {
    res.json({iRet: -1, msg: err})
  })
})

// 获取最新消息
router.get('/close', (req, res, next) => {
  const barId = req.session.barInfo.id
  if (!/\d+/.test(barId)) {
    res.json({iRet: -1, msg: "参数错误"})
    return
  }
  global._bapingStatus[barId] = 'close'
  res.json({iRet: 0})
})

module.exports = router
