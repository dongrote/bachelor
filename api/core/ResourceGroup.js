'use strict';
function ResourceGroup(data) {
  this.id = data.id;
  this.name = data.name || 'unnamed';
  this.description = data.description || 'no description';
}
exports = module.exports = ResourceGroup;
const _ = require('lodash'),
  {MissingRoleError, MissingMembershipError} = require('./rbac'),
  ResourceGroupRole = require('./ResourceGroupRole'),
  models = require('../db/models');

ResourceGroup.create = async (accessToken, details) => {
  const data = {
    name: _.get(details, 'name'),
    description: _.get(details, 'description'),
  };
  const resourceGroupRow = await models.ResourceGroup.create(data);
  const resourceGroup = new ResourceGroup(resourceGroupRow);
  await resourceGroup.createInitialOwner(accessToken);
  return resourceGroup;
};

ResourceGroup.findAll = async accessToken => {
  const resourceGroups = await Promise.all(accessToken.groups()
    .map(async g => await ResourceGroup.findById(accessToken, g.id)));
  return {count: resourceGroups.length, resourceGroups};
};

ResourceGroup.findById = async (accessToken, resourceGroupId) => {
  if (!accessToken.isMemberOfGroup(resourceGroupId)) throw new MissingMembershipError(resourceGroupId);
  const resourceGroup = await models.ResourceGroup.findByPk(resourceGroupId);
  return resourceGroup ? new ResourceGroup(resourceGroup.toJSON()) : null;
};

ResourceGroup.prototype.createInitialOwner = async function(accessToken) {
  await ResourceGroupRole.createInitialOwner(accessToken, this);
};

ResourceGroup.prototype.findRole = async function(accessToken, roleName) {
  return await ResourceGroupRole.findByName(accessToken, this, roleName);
};

ResourceGroup.prototype.bindUserRole = async function(accessToken, user, resourceGroupRole) {
  if (!accessToken.hasGroupRole(this.id, 'owner')) throw new MissingRoleError('owner');
  await models.ResourceGroupRoleBinding
    .findOrCreate({UserId: user.id, ResourceGroupRoleId: resourceGroupRole.id});
};

ResourceGroup.prototype.unbindUserRole = async function(accessToken, user, resourceGroupRole) {
  if (!accessToken.hasGroupRole(this.id, 'owner')) throw new MissingRoleError('owner');
  await models.ResourceGroupRoleBinding
    .destroy({where: {UserId: user.id, ResourceGroupRoleId: resourceGroupRole.id}});
};

ResourceGroup.prototype.userRoles = async function(accessToken) {
  if (!accessToken.isMemberOfGroup(this.id)) throw new MissingMembershipError(this.id);
};
