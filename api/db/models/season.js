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
      models.Season.hasMany(models.Episode);
      models.Season.hasMany(models.SeasonCastMemberPicks);
    }
  };
  Season.init({
    type: DataTypes.STRING(16),
    name: DataTypes.STRING(64),
    startedAt: DataTypes.DATE,
    endedAt: DataTypes.DATE,
    pickLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    pickingLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Season',
  });
  return Season;
};
