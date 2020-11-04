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
  this.pickingLocked = seasonData.pickingLocked || false;
  this.pickLimit = seasonData.pickLimit;
}
exports = module.exports = Season;
const log = require('debug-logger')('Season'),
  {MissingMembershipError, MissingRoleError} = require('./rbac'),
  websocket = require('./websocket'),
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
  const season = dbrow ? new Season(_.assignIn(dbrow.toJSON(), {resourceGroup})) : null;
  if (season) websocket.emit('Season.create', season);
  return season;
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
  const seasons = _.filter(await Promise.all(accessToken.groupIds().map(async groupId => await Season.findByResourceGroupId(accessToken, groupId)), s => s !== null));
  seasons.forEach(s => {
    const group = accessToken.groups().find(g => s.ResourceGroupId === g.id);
    if (group) {
      s.role = group.role;
    }
    if (accessToken.isAdmin()) {
      s.role = 'owner';
    }
  });
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

Season.prototype.createCastMember = async function(accessToken, seasonCastMember) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) throw new MissingRoleError(roles);
  const createdSeasonCastMember = await SeasonCastMember
    .create(this, {
      firstName: _.get(seasonCastMember, 'firstName'),
      lastName: _.get(seasonCastMember, 'lastName'),
      age: _.get(seasonCastMember, 'age'),
      occupation: _.get(seasonCastMember, 'occupation'),
      gender: _.get(seasonCastMember, 'gender'),
    });
  websocket.emit('SeasonCastMember.create', createdSeasonCastMember);
  return createdSeasonCastMember;
};

Season.prototype.castMembers = async function(accessToken) {
  if (!accessToken.isMemberOfGroup(this.ResourceGroupId)) throw new MissingMembershipError(this.ResourceGroupId);
  const {count, rows} = await models.SeasonCastMember
    .findAndCountAll({
      where: {SeasonId: this.id},
      include: [models.Rose],
    });
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
  websocket.emit('SeasonUserMembers.update', await this.userMembers(accessToken));
};

Season.prototype.removeUserMember = async function(accessToken, user) {
  const resourceGroupRole = await this.resourceGroup.findRole(accessToken, 'member');
  await this.resourceGroup.unbindUserRole(accessToken, user, resourceGroupRole);
  websocket.emit('SeasonUserMembers.update', await this.userMembers());
};

Season.prototype.episodeCount = async function(accessToken) {
  if (!accessToken.isMemberOfGroup(this.resourceGroup.id)) throw new MissingMembershipError(this.resourceGroup.id);
  return await models.Episode.count({where: {SeasonId: this.id}});
};

Season.prototype.nextEpisodeNumber = async function(accessToken) {
  const episodeCount = await this.episodeCount(accessToken);
  return episodeCount + 1;
};

Season.prototype.episodes = async function(accessToken, options) {
  if (!accessToken.isMemberOfGroup(this.resourceGroup.id)) throw new MissingMembershipError(this.resourceGroup.id);
  return await Episode.findAllForSeason(this);
};

Season.prototype.episode = async function(accessToken, episodeNumber) {
  if (!accessToken.isMemberOfGroup(this.resourceGroup.id)) throw new MissingMembershipError(this.resourceGroup.id);
  return await Episode.findByNumber(this, episodeNumber);
};

Season.prototype.createEpisode = async function(accessToken, options) {
  if (!accessToken.hasGroupRole(this.ResourceGroupId, 'owner')) throw new MissingRoleError('owner');
  const {title} = _.pick(options, ['title']),
    episodeNumber = await this.nextEpisodeNumber(accessToken);
  const episode = await Episode.create(this, {episodeNumber, title});
  websocket.emit('Episode.create', episode);
  return episode;
};

Season.prototype.eligibleCastMembers = async function(accessToken, episode) {
  if (!accessToken.isMemberOfGroup(this.resourceGroup.id)) throw new MissingMembershipError(this.resourceGroup.id);
  return await episode.eligibleCastMembers(this);
};

Season.prototype.awardRose = async function(accessToken, episode, seasonCastMember) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) throw new MissingRoleError(roles);
  await episode.awardRose(seasonCastMember);
  websocket.emit('Rose.create', {episode, seasonCastMember});
  websocket.emit('EligibleCastMembers.update', {SeasonId: this.id, episodeNumber: episode.number, castMembers: await episode.eligibleCastMembers(this)});
};

Season.prototype.revokeRose = async function(accessToken, episode, seasonCastMember) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) throw new MissingRoleError(roles);
  await episode.revokeRose(seasonCastMember);
  websocket.emit('Rose.destroy', {episode, seasonCastMember});
  websocket.emit('EligibleCastMembers.update', {SeasonId: this.id, episodeNumber: episode.number, castMembers: await episode.eligibleCastMembers(this)});
};

Season.prototype.userMayPick = async function(accessToken) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) return false;
  if (this.pickingLocked) return false;
  const pickCount = await models.SeasonCastMemberPicks.count({where: {SeasonId: this.id, UserId: accessToken.userId()}});
  return pickCount < this.pickLimit;
};

Season.prototype.createPick = async function(accessToken, seasonCastMember) {
  if (await this.userMayPick(accessToken)) {
    return await models.SeasonCastMemberPicks
      .findOrCreate({
        where: {
          SeasonId: this.id,
          UserId: accessToken.userId(),
          SeasonCastMemberId: seasonCastMember.id,
        }
      });
  }
  throw new Error('picking not permitted');
};

Season.prototype.destroyPick = async function(accessToken, seasonCastMember) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) throw new MissingRoleError(roles);
  if (this.pickingLocked) throw new Error('picking locked');
  await models.SeasonCastMemberPicks
    .destroy({
      where: {
        SeasonId: this.id,
        UserId: accessToken.userId(),
        SeasonCastMemberId: seasonCastMember.id,
      }
    });
};

Season.prototype.picks = async function(accessToken) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) throw new MissingRoleError(roles);
  const picks = await models.SeasonCastMemberPicks
    .findAll({
      where: {SeasonId: this.id, UserId: accessToken.userId()},
      include: [models.SeasonCastMember],
    });
  return picks.map(p => p.toJSON());
};

Season.prototype.availablePicks = async function(accessToken) {
  const roles = ['owner', 'member'];
  if (!accessToken.hasAnyGroupRole(this.ResourceGroupId, roles)) throw new MissingRoleError(roles);
  const {seasonCastMembers} = await this.castMembers(accessToken);
  const currentPicks = await this.picks(accessToken);
  return _.filter(seasonCastMembers, castMember => -1 === _.findIndex(currentPicks, pick => pick.SeasonCastMember.id === castMember.id));
};
