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
		wxOrder: {
			type: DataTypes.STRING,
			defaultValue: ''
		}
	}, {
		classMethods: {
			associate: (models) => {
				Order.belongsTo(models.Message)
			}
		}
	})

	return Order
}