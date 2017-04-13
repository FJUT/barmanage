//order表需要添加User的外键id

//由于有多种订单类型，添加tpye字段

module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    type: { //0：霸屏消息
      type: DataTypes.INTEGER,
      defaultValue: '0'
    },
    BarId: {
      type: DataTypes.INTEGER,
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    MessageId: {
      type: DataTypes.INTEGER,
    }
  })

  return Order
}
