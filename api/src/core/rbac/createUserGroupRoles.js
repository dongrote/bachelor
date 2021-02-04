'use strict';
const models = require('../../db/models');

exports = module.exports = async resourceGroupId => {
  const resourceGroupRole = await models.ResourceGroupRole
    .create({
      name: 'owner',
      description: 'Owner',
      ResourceGroupId: resourceGroupId,
    });
  return [resourceGroupRole.toJSON()];
};