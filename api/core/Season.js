'use strict';
function Season(seasonData) {
  this.id = seasonData.id;
  this.ResourceGroupId = seasonData.ResourceGroupId;
  this.resourceGroup = seasonData.resourceGroup;
  this.type = seasonData.type;
  this.startDate = seasonData.startedAt;
  this.endDate = seasonData.endedAt;
}
exports = module.exports = Season;
const _ = require('lodash'),
  {MissingMembershipError, MissingRoleError} = require('./rbac'),
  ResourceGroup = require('./ResourceGroup'),
  Episode = require('./Episode'),
  SeasonCastMember = require('./SeasonCastMember'),
  models = require('../db/models');

Season.create = async (accessToken, details) => {
  const {type, name, startDate, endDate} = _.pick(details, ['type', 'name', 'startDate', 'endDate']);
  if (!_.includes(['bachelor', 'bachelorette'], _.lowerCase(type))) throw new Error(`invalid season type: '${type}'`);
  const resourceGroup = await ResourceGroup.create(accessToken);
  const dbrow = await models.Season
    .create({
      type,
      name,
      startedAt: startDate,
      endedAt: endDate,
      ResourceGroupId: resourceGroup.id,
    });
  return dbrow ? new Season(_.assignIn(dbrow.toJSON(), {resourceGroup})) : null;
};

Season.findAll = async (accessToken, options) => {
  const seasons = _.filter(await Promise.all(accessToken.groups().map(async g => await Season.findByResourceGroupId(accessToken, g.id)), s => s !== null));
  return {count: seasons.length, seasons};
};

Season.findById = async (accessToken, seasonId) => {
  const season = await models.Season.findByPk(seasonId);
  const resourceGroup = await ResourceGroup.findById(accessToken, season.ResourceGroupId);
  return new Season(_.assignIn(season.toJSON(), {resourceGroup}));
};

Season.findByResourceGroupId = async (accessToken, resourceGroupId) => {
  const season = await models.Season
    .findOne({where: {ResourceGroupId: resourceGroupId}});
  const resourceGroup = await ResourceGroup.findById(accessToken, resourceGroupId);
  return season ? new Season(_.assignIn(season.toJSON(), {resourceGroup})) : null;
};

Season.prototype.createCastMember = function(accessToken, details) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) throw new MissingRoleError(roles);
  const seasonCastMember = await SeasonCastMember
    .create({
      SeasonId: this.id,
      firstName: _.get(details, 'firstName'),
      lastName: _.get(details, 'lastName'),
    });
  return seasonCastMember;
};

Season.prototype.addUserMember = async function(accessToken, user) {
  const resourceGroupRole = await this.resourceGroup.findRole(accessToken, 'member');
  await this.resourceGroup.bindUserRole(accessToken, user, resourceGroupRole);
};

Season.prototype.removeUserMember = async function(accessToken, user) {
  const resourceGroupRole = await this.resourceGroup.findRole(accessToken, 'member');
  await this.resourceGroup.unbindUserRole(accessToken, user, resourceGroupRole);
};

Season.prototype.episodeCount = async function(accessToken) {
  if (!accessToken.isMemberOfGroup(this.resourceGroup.id)) throw new MissingMembershipError(resourceGroup.id);
  return await models.Episode.count({where: {SeasonId: this.id}});
};

Season.prototype.nextEpisodeNumber = async function(accessToken) {
  const episodeCount = await this.episodeCount(accessToken);
  return episodeCount + 1;
};

Season.prototype.createEpisode = async function(accessToken, options) {
  const {title} = _.pick(options, ['title']),
    episodeNumber = await this.nextEpisodeNumber(accessToken);
  return await Episode.create(accessToken, this, {episodeNumber, title});
};

Season.prototype.seasonCastMembers = async function(accessToken) {
  return await SeasonCastMember.findForSeason(accessToken, this);
};