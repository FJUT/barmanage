/**
 * Created by shinan on 2017/3/20.
 * 制造假数据
 */
var faker = require('faker/locale/zh_CN')
var { User, Message } = require('../models')

// var users = []
// for (var i = 0; i < 100; i++) {
//   users.push({
//     name: faker.name.findName(),
//     avatar: faker.image.avatar(),
//     openid: faker.random.uuid(),
//     level: faker.random.number(),
//     score: faker.random.number()
//   })
// }
//
// User.bulkCreate(users)

// var messages = []
//
// for (var i = 0; i < 2; i++) {
//   messages.push({
//     message: i % 2 > 0 ? faker.image.image() : faker.lorem.sentence(),
//     photo: i % 2 > 0 ? 1: 0,
//     time: faker.date.past(),
//     BarId: parseInt(Math.random() * 20),
//     UserId: parseInt(Math.random() * 100)
//   })
// }
//
// Message.bulkCreate(messages)

var user = User.find({
  where: {
    id: 1
  }
}).then(user => {
  console.log('enter here')
})
