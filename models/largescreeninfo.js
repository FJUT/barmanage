/**
 * Created by 99171 on 2017/1/19.
 */
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