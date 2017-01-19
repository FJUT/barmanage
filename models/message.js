/**
 * Created by 99171 on 2017/1/19.
 */
/*
 CREATE TABLE [ChatRecord](
 [id] [nvarchar](32) NOT NULL,
 [userid] [nvarchar](32) NOT NULL, // 关联用户表
 [message] [text] NULL,
 [photo] [text] NULL,
 [time] [nvarchar](32) NULL,
 CONSTRAINT [PK_ChatRecord] PRIMARY KEY CLUSTERED
 (
 [roomid] ASC
 )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]*/
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message: {
      type: DataTypes.STRING
    },
    photo: {
      type: DataTypes.INTEGER
    },
    time: {
      type: DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        Message.belongsTo(models.Bar)
        Message.belongsTo(models.User)
      }
    }
  })

  return Message
}