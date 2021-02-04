'use strict';
const models = require('../../db/models');

exports = module.exports = async userId => {
  const resourceGroup = await models.ResourceGroup
    .create({name: `${userId}`, description: `Personal Resource Group for ${userId}`});
  return resourceGroup.toJSON();
};