'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeasonCastMemberPicks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.SeasonCastMemberPicks.belongsTo(models.User);
      models.SeasonCastMemberPicks.belongsTo(models.Season);
      models.SeasonCastMemberPicks.belongsTo(models.SeasonCastMember);
      // define association here
    }
  };
  SeasonCastMemberPicks.init({
    SeasonId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    SeasonCastMemberId: DataTypes.INTEGER,
    eliminatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SeasonCastMemberPicks',
  });
  return SeasonCastMemberPicks;
};
