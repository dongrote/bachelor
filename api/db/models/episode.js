'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Episode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Episode.belongsTo(models.Season);
      models.Episode.hasMany(models.Rose);
    }
  };
  Episode.init({
    SeasonId: DataTypes.INTEGER,
    airDate: DataTypes.DATE,
    episodeNumber: DataTypes.INTEGER,
    title: DataTypes.STRING(64),
  }, {
    sequelize,
    modelName: 'Episode',
  });
  return Episode;
};
