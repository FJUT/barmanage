/**
 * Created by 99171 on 2017/1/16.
 */
const sha1 = require('../lib/sha1')
const Token = require('../lib/Token')
const models = require('../models')
const co = require('co')

const auth = (req, res, next) => {
  co(function*() {
    let token = req.cookies.token

    if (!token) {
      res.redirect('/login')
      return
    }

    let arr = Token.decode(token)
    let [ phonenumber, password ] = arr

    password = sha1(password)

    let barInfo = req.session.barInfo

    if (!barInfo) {
      barInfo = yield models.Bar.findOne({
        where: {
          phonenumber,
          password
        }
      })

      req.session.barInfo = barInfo.get({plain: true})
    }

    if (barInfo.phonenumber == phonenumber && barInfo.password == password) {
      res.locals.barInfo = barInfo
      next()
    } else {
      res.redirect('/login')
    }
  }).catch(next)
}

module.exports = auth