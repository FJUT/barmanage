/**
 * Created by dengdongdong on 2017/4/6.
 */


//需要在paymentinfo表中建立updatedAt和createdAt字段
module.exports = (sequelize, DataTypes) => {
  var PaymentInfo = sequelize.define('PaymentInfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    barID: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    userID: {
      type: DataTypes.STRING,
    },
    money: {
      type: DataTypes.STRING,
    },
    orderTime: {
      type: DataTypes.STRING,
    },
    orderNumber: {
      type: DataTypes.STRING,
    },
    updatedAt: {
      type: DataTypes.DATETIME,
    },
    createdAt: {
      type: DataTypes.DATETIME,
    }
  })

  return PaymentInfo
}
