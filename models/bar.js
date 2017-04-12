/**
 * Created by 99171 on 2017/1/19.
 */
const NAME_DEFAULT = '酒吧名称'
const LOGO_DEFAULT = 'logo-default.png'

module.exports = (sequelize, DataTypes) => {
  var Bar = sequelize.define('Bar', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    logo: {
      type: DataTypes.CHAR,
      defaultValue: LOGO_DEFAULT
    },
    name: {
      type: DataTypes.CHAR,
      defaultValue: NAME_DEFAULT
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    bussinesshours: {
      type: DataTypes.CHAR
    },
    position: {
      type: DataTypes.CHAR
    },
    score: {
      type: DataTypes.INTEGER
    },
    photos: {
      type: DataTypes.STRING
    },
    summary: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    screenvalid: {
      type: DataTypes.INTEGER
    },
    phonenumber: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    screenTitle: {
      type: DataTypes.STRING
    },
    screenBackImage: {
      type: DataTypes.STRING
    }
  })

  return Bar
}
