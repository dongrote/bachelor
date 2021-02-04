'use strict';
const models = require('../../db/models'),
  User = require('../User');

exports = module.exports = async (accessToken, name) => {
  const user = await User.findById(accessToken.userId());
  const seasonCount = await user.seasonCount();
  const resourceGroup = await models.ResourceGroup.create({
    name: `user-${accessToken.userId()}-season-${seasonCount}`,
    description: name,
  });
  await createSeasonGroupRoles(resourceGroup.id);
  await createGroupRoleBinding(accessToken.userId(), resourceGroup.id, 'owner');
  return resourceGroup.toJSON();
};