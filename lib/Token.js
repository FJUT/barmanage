/**
 * Created by 99171 on 2017/1/16.
 */
const PUBLIC_KEY = 'barmanage'
const crypto = require('crypto')
const cipher = crypto.createCipher('aes192', PUBLIC_KEY)
const decipher = crypto.createDecipher('aes192', PUBLIC_KEY)

const Token = {
  encode(phonenumber, password) {
    var str = JSON.stringify([phonenumber, password])
    var encrypted = cipher.update(str, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return encrypted
  },
  decode(encrypted) {
    var decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return JSON.parse(decrypted)
  }
}

module.exports = Token