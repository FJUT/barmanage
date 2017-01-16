/**
 * Created by 99171 on 2017/1/16.
 */
const co = require('co')
const sha1 = require('../lib/sha1')
const models = require('../models')
const Token = require('../lib/Token')

const auth = (req, res, next) => {
  let token = req.cookies.token

  if (!token) {
    res.redirect('/login')
    return
  }

  co(function*() {
    console.log(token)
    let arr = Token.decode(token)
    let [ phonenumber, password ] = arr

    console.log(phonenumber, password)

    password = sha1(password)

    let result = yield models.Bar.findOne({
      where: {
        phonenumber,
        password,
      }
    })

    if (!result) {
      res.redirect('/login')
    } else {
      next()
    }
  }).catch(next)
}

module.exports = auth