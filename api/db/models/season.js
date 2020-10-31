'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Season extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Season.belongsTo(models.ResourceGroup);
      models.Season.hasMany(models.SeasonCastMember);
    }
  };
  Season.init({
    type: DataTypes.STRING,
    startedAt: DataTypes.DATE,
    endedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Season',
  });
  return Season;
};