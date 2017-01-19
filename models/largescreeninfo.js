/**
 * Created by 99171 on 2017/1/19.
 */
/*
* CREATE TABLE [LargeScreenInfo](
 [id] [nvarchar](32) NOT NULL,
 [barid] [nvarchar](32) NOT NULL,
 [payment_userid] [nvarchar](32) NOT NULL,
 [seconds] [int] NULL,
 [displayed] [int] NULL,
 [msgid] [int] NULL,
 CONSTRAINT [PK_LargeScreenInfo] PRIMARY KEY CLUSTERED
 (
 [id] ASC
 )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
* */
module.exports = (sequelize, DataTypes) => {
  var LargeScreenInfo = sequelize.define('LargeScreenInfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    seconds: {
      type: DataTypes.INTEGER
    },
    displayed: {
      type: DataTypes.BOOLEAN
    }
  }, {
    classMethods: {
      associate: function(models) {
        LargeScreenInfo.belongsTo(models.Bar)
        LargeScreenInfo.belongsTo(models.Message)
        LargeScreenInfo.belongsTo(models.User)
      }
    }
  })

  return LargeScreenInfo
}