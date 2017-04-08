/**
 * Created by dengdongdong on 2017/4/6.
 */

//需要在CompanyNews表中建立updatedAt和createdAt字段

module.exports = (sequelize, DataTypes) => {
  var CompanyNews = sequelize.define('CompanyNews', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    newsTitle: {
      type: DataTypes.STRING,
    },
    newsContent: {
      type: DataTypes.STRING,
    },
    newsTime: {
      type: DataTypes.DATE,
    }
  })

  return CompanyNews
}
