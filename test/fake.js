/**
 * Created by shinan on 2017/3/20.
 * 制造假数据
 */
var co = require('co')
var faker = require('faker/locale/zh_CN')
var models = require('../models')
var { User, Message, Bar } = models

const random = (min, max) => {
  return Math.floor(Math.random() * max) + min
}

async function createBars() {
  var bars = []

  for (var i = 0; i < 2; i++) {
    bars.push({
      logo: faker.image.avatar(),
      name: faker.name.findName(),
      address: faker.address.streetName(),
      photos: JSON.stringify([faker.image.image(), faker.image.image()])
    })
  }

  return Bar.bulkCreate(bars)
}

async function createUsers() {
  var users = []

  for (var i = 0; i < 10; i++) {
   users.push({
     name: faker.name.findName(),
     avatar: faker.image.avatar(),
     openid: faker.random.uuid()
   })
  }

  return User.bulkCreate(users)
}

async function createMessages() {
  for (let i = 0; i < 100; i++) {
    let user = await User.findById(random(1, 10))
    let bar = await User.findById(random(1, 2))

    await Message.create({
      msgText: faker.lorem.sentence(),
      msgImage: i % 2 ? faker.image.image() : '',
      msgTime: faker.date.past(),
      msgType: random(0, 2),
      BarId: bar.get('id'),
      UserId: user.get('id')
    })
  }
}

// async function createFakeData() {
//   // await createBars()
//   // await createUsers()
//   await createMessages()
// }
//
// models.sequelize.sync().then(function() {
//   createFakeData()
// })