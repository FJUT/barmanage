/**
 * Created by 99171 on 2017/1/17.
 */
const multer = require('multer')
const path = require('path')

var counter = 0

const storage = multer.diskStorage({
  destination: '/uploads',
  filename: function(req, file, cb) {
    // console.log('storage', file)
    let originalname = file.originalname
    let ext = originalname.substr(originalname.lastIndexOf('.'))

    // console.log('ext:', ext)

    let fileName = file.fieldname + '_' + Date.now() + '_' + (counter++) + ext
    cb(null, fileName)
  }
})

const upload = multer({ storage: storage })

module.exports = upload