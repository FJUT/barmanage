/**
 * Created by 99171 on 2017/1/19.
 */
/*
 CREATE TABLE [BarPrice](
 [id] [nvarchar](32) NOT NULL,
 [barid] [nvarchar](32) NOT NULL,
 [seconds] [int] NULL,
 [price] int NULL,
 CONSTRAINT [PK_BarPrice] PRIMARY KEY CLUSTERED
 (
 [id] ASC
 )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
 */
module.exports = (sequelize, DataTypes) => {
  var BarPrice = sequelize.define('BarPrice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    seconds: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        BarPrice.belongsTo(models.Bar)
      }
    }
  })

  return BarPrice
}