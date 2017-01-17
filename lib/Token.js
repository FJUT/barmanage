/**
 * Created by 99171 on 2017/1/16.
 */
const PUBLIC_KEY = 'barmanage'
const crypto = require('crypto')

const Token = {
  encode(phonenumber, password) {
    let cipher = crypto.createCipher('aes256', PUBLIC_KEY)
    let str = JSON.stringify([phonenumber, password])
    let encrypted = cipher.update(str, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return encrypted
  },
  decode(encrypted) {
    let decipher = crypto.createDecipher('aes256', PUBLIC_KEY)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')

    // console.log(`decrypted:${decrypted}`)

    decrypted += decipher.final('utf8')

    return JSON.parse(decrypted)
  }
}

module.exports = Token