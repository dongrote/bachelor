'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeasonCastMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.SeasonCastMember.belongsTo(models.Season);
      models.SeasonCastMember.hasMany(models.Rose);
      models.SeasonCastMember.hasMany(models.SeasonCastMemberPicks);
    }
  };
  SeasonCastMember.init({
    SeasonId: DataTypes.INTEGER,
    firstName: DataTypes.STRING(25),
    lastName: DataTypes.STRING(25),
    age: DataTypes.INTEGER,
    occupation: DataTypes.STRING(50),
    gender: DataTypes.STRING(1),
    homeLocation: DataTypes.STRING,
    imageFilename: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'SeasonCastMember',
  });
  return SeasonCastMember;
};
