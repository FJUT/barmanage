/**
 * Created by shinan on 2017/3/20.
 * 制造假数据
 */
var co = require('co')
var faker = require('faker/locale/zh_CN')
var { User, Message, Bar } = require('../models')

 //var users = []
 //for (var i = 0; i < 100; i++) {
 //  users.push({
 //    name: faker.name.findName(),
 //    avatar: faker.image.avatar(),
 //    openid: faker.random.uuid(),
 //    level: faker.random.number(),
 //    score: faker.random.number(),
 //    password: ''
 //  })
 //}
 //
 //User.bulkCreate(users)
 //var messages = []
 //
 //for (var i = 0; i < 2; i++) {
 //  messages.push({
 //    message: i % 2 > 0 ? faker.image.image() : faker.lorem.sentence(),
 //    photo: i % 2 > 0 ? 1: 0,
 //    time: faker.date.past(),
 //    BarId: parseInt(Math.random() * 20),
 //    UserId: parseInt(Math.random() * 100)
 //  })
 //}
//
// Message.bulkCreate(messages)

var bars = []

//for (var i = 0; i < 10; i++) {
//  bars.push({
//    logo: faker.image.avatar(),
//    name: faker.name.firstName(),
//    address: faker.name.lastName(),
//    summary: faker.lorem.sentence()
//  })
//}
//
//Bar.bulkCreate(bars)

co(function*() {
  var user = yield User.findById(1)
  var bar = yield Bar.findById(1)

  Message.create({
    message: faker.lorem.sentence(),
    photo: 0,
    time: faker.date.past(),
    BarId: bar.get('id'),
    UserId: user.get('id')
  })
})