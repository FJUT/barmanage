/**
 * Created by 99171 on 2017/1/19.
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