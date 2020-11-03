'use strict';
const _ = require('lodash');
function Season(seasonData) {
  this.id = seasonData.id;
  this.ResourceGroupId = seasonData.ResourceGroupId;
  this.resourceGroup = seasonData.resourceGroup;
  this.type = _.capitalize(seasonData.type);
  this.name = seasonData.name;
  this.startDate = seasonData.startedAt;
  this.endDate = seasonData.endedAt;
}
exports = module.exports = Season;
const log = require('debug-logger')('Season'),
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
  return accessToken.isAdmin()
    ? await Season.findAllForAdmin(accessToken, options)
    : await Season.findAllForUser(accessToken, options);
};

Season.findAllForAdmin = async (accessToken, options) => {
  const {count, rows} = await models.Season.findAndCountAll({include: [models.ResourceGroup]});
  return {count, seasons: rows.map(r => new Season(r.toJSON()))};
};

Season.findAllForUser = async (accessToken, options) => {
  log.info('findAll:accessToken', accessToken);
  log.info('findAll:accessToken.groupIds', accessToken.groupIds());
  const seasons = _.filter(await Promise.all(accessToken.groupIds().map(async groupId => await Season.findByResourceGroupId(accessToken, groupId)), s => s !== null));
  return {count: seasons.length, seasons};
};

Season.findById = async (accessToken, seasonId) => {
  const season = await models.Season.findByPk(seasonId);
  log.info('findById:season', season);
  const resourceGroup = await ResourceGroup.findById(accessToken, season.ResourceGroupId);
  return new Season(_.assignIn(season.toJSON(), {resourceGroup}));
};

Season.findByResourceGroupId = async (accessToken, resourceGroupId) => {
  const season = await models.Season
    .findOne({where: {ResourceGroupId: resourceGroupId}});
  const resourceGroup = await ResourceGroup.findById(accessToken, resourceGroupId);
  return season ? new Season(_.assignIn(season.toJSON(), {resourceGroup})) : null;
};

Season.prototype.createCastMember = async function(accessToken, seasonCastMember) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) throw new MissingRoleError(roles);
  return await SeasonCastMember
    .create(this, {
      firstName: _.get(seasonCastMember, 'firstName'),
      lastName: _.get(seasonCastMember, 'lastName'),
      age: _.get(seasonCastMember, 'age'),
      occupation: _.get(seasonCastMember, 'occupation'),
      gender: _.get(seasonCastMember, 'gender'),
    });
};

Season.prototype.castMembers = async function(accessToken) {
  if (!accessToken.isMemberOfGroup(this.ResourceGroupId)) throw new MissingMembershipError(this.ResourceGroupId);
  const {count, rows} = await models.SeasonCastMember
    .findAndCountAll({where: {SeasonId: this.id}});
  return {count, seasonCastMembers: rows.map(r => new SeasonCastMember(r.toJSON()))};
};

Season.prototype.userMembers = async function(accessToken) {
  if (!accessToken.isMemberOfGroup(this.ResourceGroupId)) throw new MissingMembershipError(this.ResourceGroupId);
  const {count, rows} = await models.User
    .findAndCountAll({
      attributes: ['id', 'displayName'],
      include: [{
        model: models.ResourceGroupRoleBinding,
        required: true,
        include: [{
          model: models.ResourceGroupRole,
          required: true,
          attributes: ['name'],
          include: [{
            model: models.ResourceGroup,
            where: {id: this.ResourceGroupId},
          }]
        }],
      }]
    });
  return {count, members: rows.map(r => ({
    id: r.id,
    displayName: r.displayName,
    role: _.get(_.first(r.ResourceGroupRoleBindings), 'ResourceGroupRole.name', 'error'),
  }))};
};

Season.prototype.roles = async function(accessToken) {
  return await this.resourceGroup.userRoles(accessToken);
};

Season.prototype.createRole = async function(accessToken, name, details) {
  return await this.resourceGroup.createRole(accessToken, name, details);
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

Season.prototype.awardRose = async function(accessToken, episode, seasonCastMember) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) throw new MissingRoleError(roles);
  await episode.awardRose(seasonCastMember);
};

Season.prototype.revokeRose = async function(accessToken, episode, seasonCastMember) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) throw new MissingRoleError(roles);
  await episode.revokeRose(seasonCastMember);
};
