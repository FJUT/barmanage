/*
*
* — Create table
 create table
 (
 id            nvarchar2(32) not null,
 logo          nvarchar2(128),
 name          nvarchar2(32),
 address       nvarchar2(512),
 businesshours nvarchar2(64),
 position      nvarchar2(32),
 score         number,
 photos        nvarchar2(2048),
 summary       nvarchar2(1024),
 city          nvarchar2(32),
 screenvalid   number,
 phonenumber   number not null,
 password      nvarchar2(32) not null
 )
* */

module.exports = (sequelize, DataTypes) => {
  var Bar = sequelize.define('Bar', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    logo: {
      type: DataTypes.CHAR
    },
    name: {
      type: DataTypes.CHAR
    },
    address: {
      type: DataTypes.STRING
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
      type: DataTypes.CHAR
    },
    screenvalid: {
      type: DataTypes.INTEGER
    },
    phonenumber: {
      type: DataTypes.INTEGER
    },
    password: {
      type: DataTypes.STRING
    }
  })
}