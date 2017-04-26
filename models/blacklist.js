/**
 * Created by shaojun on 2017/4/26.
 */

module.exports = (sequelize, DataTypes) => {
  var BlackList = sequelize.define('BlackList', {
    BarId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  })

  return BlackList
}
