'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResourceGroupRoleBinding extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ResourceGroupRoleBinding.belongsTo(models.ResourceGroupRole);
      models.ResourceGroupRoleBinding.belongsTo(models.User);
    }
  };
  ResourceGroupRoleBinding.init({
    UserId: DataTypes.INTEGER,
    ResourceGroupRoleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ResourceGroupRoleBinding',
  });
  return ResourceGroupRoleBinding;
};