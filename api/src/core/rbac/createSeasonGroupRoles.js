'use strict';
const models = require('../../db/models');

exports = module.exports = async resourceGroupId => {
  const resourceGroupRoles = await models.ResourceGroupRole
    .bulkCreate([{
      name: 'owner',
      description: 'Owner',
      ResourceGroupId: resourceGroupId,
    }, {
      name: 'member',
      description: 'Participating member in this season',
      ResourceGroupId: resourceGroupId,
    }, {
      name: 'spectator',
      description: 'Member with strictly spectating privileges; cannot participate',
      ResourceGroupId: resourceGroupId,
    }]);
  return resourceGroupRoles.map(rgr => rgr.toJSON());
};