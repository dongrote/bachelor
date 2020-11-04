'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rose extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Rose.belongsTo(models.Episode);
      models.Rose.belongsTo(models.SeasonCastMember);
    }
  };
  Rose.init({
    EpisodeId: DataTypes.INTEGER,
    SeasonCastMemberId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rose',
  });
  return Rose;
};