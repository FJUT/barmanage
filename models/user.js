/**
 * Created by 99171 on 2017/1/19.
 *  CREATE TABLE [UserInfo](
 [id] [nvarchar](32) NOT NULL,
 [name] [nvarchar](32) NOT NULL,
 [head] [text] NULL,
 [weichat] [nvarchar](32) NULL,
 [position] [nvarchar](32) NULL,
 [level] [int] NULL,
 [score] [int] NULL,
 CONSTRAINT [PK_UserInfo] PRIMARY KEY CLUSTERED
 (
 [id] ASC
 )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
 */

//user表需要添加gender表 1男  2女
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    nickname: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.INTEGER
    },
    password: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    province:{
      type: DataTypes.STRING
    },
    city:{
      type: DataTypes.STRING
    },
    phonenumber:{
      type: DataTypes.STRING
    },
    email:{
      type:DataTypes.STRING
    },
    openid: {
      type: DataTypes.STRING
    },
    wx: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function (models) {
        User.hasMany(models.Message)
        User.hasMany(models.Order)
      }
    }
  })

  return User
}
