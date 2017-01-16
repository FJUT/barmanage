/**
 * Created by 99171 on 2017/1/16.
 */
const sha1 = require('../lib/sha1')
const models = require('../models')

const auth = (req, res, next) => {
  let { phonenumber, password } = req.body

  models.Bar.findOne({
    where: {
      phonenumber,
      password: sha1(password)
    }
  }).then(result => {
    if (!result) {
      res.redirect('/login')
    } else {
      next()
    }
  })
}

module.exports = auth