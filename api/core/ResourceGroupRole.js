'use strict';
function ResourceGroupRole(data) {
  this.id = data.id;
  this.name = data.name;
  this.description = data.description;
}
exports = module.exports = ResourceGroupRole;

const _ = require('lodash'),
  models = require('../db/models'),
  {MissingRoleError, MissingMembershipError} = require('./rbac');

ResourceGroupRole.createInitialOwner = async (accessToken, resourceGroup) => {
  const resourceGroupRole = await models.ResourceGroupRole
  .create({
    ResourceGroupId: resourceGroup.id,
    name: 'owner',
    description: 'Group Owner',
  });
await models.ResourceGroupRoleBinding
  .create({
    UserId: accessToken.userId(),
    ResourceGroupRoleId: resourceGroupRole.id,
  });
};

ResourceGroupRole.create = async (accessToken, resourceGroup, name, options) => {
  if (!accessToken.hasGroupRole(resourceGroup.id, 'owner')) throw new MissingRoleError('owner');
  const [row] = await models.ResourceGroupRole
    .findOrCreate({
      name,
      description: _.get(options, 'description'),
    });
  return row ? new ResourceGroupRole(row) : null;
};

ResourceGroupRole.findAll = async (accessToken, resourceGroup) => {
  if (!accessToken.isMemberOfGroup(resourceGroup.id)) throw new MissingMembershipError(resourceGroup.id);
  const {count, rows} = await models.ResourceGroupRole
    .findAndCountAll({where: {ResourceGroupId: resourceGroup.id}});
  return {count, roles: rows.map(r => new ResourceGroupRole(r))};
};

ResourceGroupRole.findByName = async (accessToken, resourceGroup, role) => {
  if (!accessToken.isMemberOfGroup(resourceGroup.id)) throw new MissingMembershipError(resourceGroup.id);
  const dbRow = await models.ResourceGroupRole
    .findOne({
      where: {
        ResourceGroupId: resourceGroup.id,
        name: role,
      }
    });
  return dbRow ? new ResourceGroupRole(dbRow) : null;
};

/*
class ResourceGroupRole {
  static async createInitialOwner(accessToken, resourceGroup) {
    const resourceGroupRole = await models.ResourceGroupRole
      .create({
        ResourceGroupId: resourceGroup.id,
        name: 'owner',
        description: 'Group Owner',
      });
    await models.ResourceGroupRoleBinding
      .create({
        UserId: accessToken.userId(),
        ResourceGroupRoleId: resourceGroupRole.id,
      });
  }
  static async create(accessToken, resourceGroup, name, options) {
    if (!accessToken.hasGroupRole(resourceGroup.id, 'owner')) throw new MissingRoleError('owner');
    const [row] = await models.ResourceGroupRole
      .findOrCreate({
        name,
        description: _.get(options, 'description'),
      });
    return row ? new ResourceGroupRole(row) : null;
  }
  static async findAll(accessToken, resourceGroup) {
    if (!accessToken.isMemberOfGroup(resourceGroup.id)) throw new MissingMembershipError(resourceGroup.id);
    const {count, rows} = await models.ResourceGroupRole
      .findAndCountAll({where: {ResourceGroupId: resourceGroup.id}});
    return {count, roles: rows.map(r => new ResourceGroupRole(r))};
  }
  static async findByName(accessToken, resourceGroup, role) {
    if (!accessToken.isMemberOfGroup(resourceGroup.id)) throw new MissingMembershipError(resourceGroup.id);
    const dbRow = await models.ResourceGroupRole
      .findOne({
        where: {
          ResourceGroupId: resourceGroup.id,
          name: role,
        }
      });
    return dbRow ? new ResourceGroupRole(dbRow) : null;
  }
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
  }
  async boundUsers() {}
}

exports = module.exports = ResourceGroupRole;
*/
