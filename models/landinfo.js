//order表需要添加User的外键id

//由于有多种订单类型，添加tpye字段

module.exports = (sequelize, DataTypes) => {
  var LandInfo = sequelize.define('LandInfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: DataTypes.INTEGER
    },
    barid: {
      type: DataTypes.INTEGER
    },
    displayAt: {
      type: DataTypes.DATE
    }
  }, {
    //建表时是否包含所有timestamp字段，createdAt，updatedAt，deletedAt，这三个字段
    timestamps: true,
    //设置为true，在destroy时不会正真的删除而是，将deletedAt设置为删除的时间
    paranoid: true
  })

  return LandInfo
}
