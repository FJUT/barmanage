/**
 * Created by 99171 on 2017/1/16.
 */
const crypto = require('crypto')

module.exports = function(password) {
  var sha1 = crypto.createHash('sha1')
  sha1.update(password)
  return sha1.digest('hex')
}