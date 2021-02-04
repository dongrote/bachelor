'use strict';
const models = require('../../db/models');

exports = module.exports = async (UserId, ResourceGroupRoleId) => {
  const row = await models.ResourceGroupRoleBinding.create({UserId, ResourceGroupRoleId});
  return row.toJSON();
};