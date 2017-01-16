/**
 * Created by 99171 on 2017/1/16.
 */
const Token = require('../lib/Token')

var encrypted = Token.encode('13297985364', '333333')

console.log(encrypted)

var decrypted = Token.decode(encrypted)

console.log(decrypted)