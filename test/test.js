/**
 * Created by 99171 on 2017/1/16.
 */
// const Token = require('../lib/Token')
//
// var encrypted = Token.encode('13297985364', '333333')
//
// console.log(encrypted)

// setInterval(function() {
//   var decrypted = Token.decode('4e90b3bc7b28d545d318c253949490fb3b60c3870916f62a4be44f543bf1eb4d')
//
//   console.log(decrypted)
// }, 2000)
const co = require('co')
const models = require('../models')
const moment = require('moment')

// models.Bar.findById(1).then(bar => {
//   console.log(bar.get({plain: true}))
// })

// models.Bar.update({
//   name: '都市酒吧',
//   bussinesshours: JSON.stringify(['00:00', '24:00']),
//   city: '武汉',
//   summary: '天天大保健',
//   photos: JSON.stringify(['a.jpg', 'b.jpg'])
// }, {
//   where: {
//     id: 1
//   }
// }).then(affected => {
//   console.log(affected)
// })
// co(function*() {
  // var created = yield models.BarPrice.create({
  //   seconds: 30,
  //   price: 10,
  //   BarId: 1
  // })
  //
  // console.log('create success', created.get({plain: true}))

//   var data = yield models.BarPrice.findAll({
//     where: {
//       BarId: 1
//     }
//   })
//
//   data = data.map(row => row.get({ plain: true }))
//
//   console.log(data)
// })

// models.User.findCreateFind({
//   where: {id: 1},
//   defaults: {
//     name: '呵呵'
//   }
// }).then((a, b) => {
//   console.log(a[0].get({plain: true}))
// })

// models.Message.find({
// 	where: {
// 		id: 1
// 	}
// }).then(msg => console.log(msg.get({plain: true})))

// models.Message.find({
//   where: {
//     createdAt: {
//       $gt: moment().subtract(3, 'days')
//     }
//   }
// }).then(result => {
//   console.log(result)
// })

// models.Message.update({isPayed: true}, {
//   where: {
//     id: 1
//   }
// })

// 模拟发送霸屏
models.Message.create({
  BarId: 3,
  UserId: 1,
  isDisplay: false,
  isPayed: true,
  msgType: 2,
  seconds: 3,
  msgText: '日你咧',
  msgImage: 'http://localhost:3000/file_1490367529830_1.jpg'
})

// models.Message.findAll({
//   where: {
//     id: {
//       $gt: 100
//     }
//   }
// }).done(data => console.log(data.length))