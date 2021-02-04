'use strict';
const models = require('../../db/models');

exports = module.exports = async (userId, resourceGroupId, roleName) => {
  const resourceGroupRole = await models.ResourceGroupRole
    .findOne({where: {ResourceGroupId: resourceGroupId, name: roleName}, attributes: ['id']});
  await models.ResourceGroupRoleBinding
    .create({
      UserId: userId,
      ResourceGroupRoleId: resourceGroupRole.id,
    });
};