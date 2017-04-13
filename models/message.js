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
    msgText: {
      type: DataTypes.STRING
    },
    msgImage: {
      type: DataTypes.STRING
    },
    msgVideo: {
      type: DataTypes.STRING
    },
    msgTime: {
      type: DataTypes.DATE
    },
    msgType: {
      type: DataTypes.INTEGER
    },
    seconds: {
      type: DataTypes.INTEGER
    },
    isDisplay: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isPayed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    },
    BarId: {
      type: DataTypes.INTEGER,
    },
    UserId: {
      type: DataTypes.INTEGER,
    }
  }, {
    //建表时是否包含所有timestamp字段，createdAt，updatedAt，deletedAt，这三个字段
    timestamps: true,
    //设置为true，在destroy时不会正真的删除而是，将deletedAt设置为删除的时间
    paranoid: true
  })

  return Message
}
