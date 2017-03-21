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

  for (var i = 0; i < 10; i++) {
    bars.push({
      logo: faker.image.avatar(),
      name: faker.name.firstName(),
      address: faker.name.lastName(),
      summary: faker.lorem.sentence()
    })
  }

  return Bar.bulkCreate(bars)
}

async function createUsers() {
  var users = []

  for (var i = 0; i < 100; i++) {
   users.push({
     name: faker.name.findName(),
     avatar: faker.image.avatar(),
     openid: faker.random.uuid(),
     level: faker.random.number(),
     score: faker.random.number(),
     password: ''
   })
  }

  return User.bulkCreate(users)
}

async function createMessages() {
  for (let i = 0; i < 200; i++) {
    let user = await User.findById(random(1, 100))
    let bar = await User.findById(random(1, 10))

    await Message.create({
      message: i % 2 > 0 ? faker.image.image() : faker.lorem.sentence(),
      photo: i % 2 > 0 ? 1: 0,
      time: faker.date.past(),
      BarId: bar.get('id'),
      UserId: user.get('id')
    })
  }
}

async function createFakeData() {
  await createBars()
  await createUsers()
  await createMessages()
}

// models.sequelize.sync({force: true}).then(function() {
//   createFakeData()
// })