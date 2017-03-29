/**
 * Created by Administrator on 2017/3/29.
 */
const fs = require('fs')
const APP_ID = 'wx06a1ff0e6eb6505a'
const MCH_ID = '1454040702'
const APP_SECRET = '70603dba83c47f0700b9107a630f49cb'
const WX_SESSION_KEY_URL = 'https://api.weixin.qq.com/sns/jscode2session'

var Payment = require('wechat-pay').Payment
var initConfig = {
  partnerKey: APP_SECRET,
  appId: APP_ID,
  mchId: MCH_ID,
  notifyUrl: 'https://jufoinfo.com/wx/notify',
  pfx: fs.readFileSync("./cers/apiclient_cert.p12")
}

var payment = new Payment(initConfig)
var middleware = Payment.middleware(initConfig)

module.exports = {
  payment,
  middleware
}