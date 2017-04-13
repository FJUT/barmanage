
module.exports = (sequelize, DataTypes) => {
  var Feedback = sequelize.define('Feedback', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.STRING
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    createdAt: {
      type: DataTypes.DATE
    },
    BarId: {
      type: DataTypes.INTEGER,
    },
  })

  return Feedback
}
