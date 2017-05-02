/**
 * Created by shaojun on 2017/4/26.
 */

module.exports = (sequelize, DataTypes) => {
  var DirtyWords = sequelize.define("DirtyWords", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    word: {
      type: DataTypes.STRING,
      defaultValue: ""
    }
  });

  return DirtyWords;
};
