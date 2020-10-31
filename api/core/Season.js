'use strict';
const _ = require('lodash'),
  ResourceGroup = require('./ResourceGroup'),
  models = require('../db/models');
class Season {
  static async create(resourceGroup, details) {
    const seasonDbRow = await models.Season
      .create({
        ResourceGroupId: resourceGroup.id,
        type: _.get(details, 'type'),
        startedAt: _.get(details, 'startDate'),
        endedAt: _.get(details, 'endDate'),
      });
    return seasonDbRow ? new Season(_.assignIn(seasonDbRow, {resourceGroup})) : null;
  }
  static async findAll(accessToken, options) {
    const seasons = _.filter(await Promise.all(accessToken.groups().map(async g => await Season.findByResourceGroupId(accessToken, g.id)), s => s !== null));
    return {count: seasons.length, seasons};
  }
  static async findById(accessToken, seasonId) {
    const season = await models.Season.findByPk(seasonId);
    const resourceGroup = await ResourceGroup.findById(accessToken, season.ResourceGroupId);
    return new Season(_.assignIn(season.toJSON(), {resourceGroup}));
  }
  static async findByResourceGroupId(accessToken, resourceGroupId) {
    const season = await models.Season
      .findOne({where: {ResourceGroupId: resourceGroupId}});
    const resourceGroup = await ResourceGroup.findById(accessToken, resourceGroupId);
    return season ? new Season(_.assignIn(season.toJSON(), {resourceGroup})) : null;
  }
  constructor(seasonData) {
    this.ResourceGroupId = seasonData.ResourceGroupId;
    this.resourceGroup = seasonData.resourceGroup;
    this.type = seasonData.type;
    this.startDate = seasonData.startedAt;
    this.endDate = seasonData.endedAt;
  }

  async addCastMember(accessToken, seasonCastMember) {}
  async addUserMember(accessToken, user) {
    const resourceGroupRole = await this.resourceGroup.findRole(accessToken, 'member');
    await this.resourceGroup.bindUserRole(accessToken, user, resourceGroupRole);
  }
  async removeUserMember(accessToken, user) {
    const resourceGroupRole = await this.resourceGroup.findRole(accessToken, 'member');
    await this.resourceGroup.unbindUserRole(accessToken, user, resourceGroupRole);
  }
}

exports = module.exports = Season;
