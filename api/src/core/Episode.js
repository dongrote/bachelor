'use strict';
function Episode(data) {
  this.id = data.id;
  this.title = data.title || 'untitled';
  this.number = data.episodeNumber;
  this.airDate = data.airDate;
  this.SeasonId = data.SeasonId;
  this.ResourceGroupId = data.ResourceGroupId;
  this.Roses = data.Roses || [];
}

exports = module.exports = Episode;
const _ = require('lodash'),
  log = require('debug-logger')('Episode'),
  models = require('../db/models'),
  {Op} = models.Sequelize,
  SeasonCastMember = require('./SeasonCastMember');

Episode.create = async (season, details) => {
  const dbrow = await models.Episode
    .create({
      SeasonId: season.id,
      episodeNumber: _.get(details, 'episodeNumber'),
      title: _.get(details, 'title'),
    });
  return dbrow ? new Episode(_.assignIn(dbrow, {ResourceGroupId: season.ResourceGroupId})) : null;
};

Episode.findById = async (accessToken, episodeId) => {
  const dbrow = await models.Episode
    .findByPk(episodeId, {
      include: [{
        model: models.Season,
        attributes: ['ResourceGroupId']
      }, models.Rose],
    });
  if (dbrow) {
    if (!accessToken.isMemberOfGroup(dbrow.Season.ResourceGroupId)) throw new Error('permission denied');
    return new Episode(_.assignIn(dbrow.toJSON(), {ResourceGroupId: dbrow.Season.ResourceGroupId}));
  }
  return null;
};

Episode.findByNumber = async (season, episodeNumber) => {
  const dbrow = await models.Episode
    .findOne({
      where: {SeasonId: season.id, episodeNumber},
      include: [models.Rose],
    });
  return dbrow ? new Episode(dbrow) : null;
};

Episode.findAllForSeason = async (season, options) => {
  const {count, rows} = await models.Episode
    .findAndCountAll({
      where: {SeasonId: season.id},
      offset: _.get(options, 'offset', 0),
    });
  return {count, episodes: rows.map(r => new Episode(r.toJSON()))};
};

Episode.prototype.roses = async function() {
  const roses = await models.Rose
    .findAll({
      where: {EpisodeId: this.id},
      include: [models.SeasonCastMember],
    });
  return roses.map(r => r.toJSON());
};

Episode.prototype.awardRose = async function(seasonCastMember) {
  await models.Rose
    .create({
      EpisodeId: this.id,
      SeasonCastMemberId: seasonCastMember.id,
    });
};

Episode.prototype.revokeRose = async function(seasonCastMember) {
  await models.Rose
    .destroy({
      where: {
        EpisodeId: {[Op.gte]: this.id},
        SeasonCastMemberId: seasonCastMember.id,
      },
    });
};

Episode.prototype.castMembers = async function(season) {
  const castMembers = await models.SeasonCastMember
    .findAll({where: {SeasonId: season.id}});
  const seasonCastMembers = castMembers.map(cm => new SeasonCastMember(cm));
  seasonCastMembers.forEach(seasonCastMember => {
    seasonCastMember.hasRose = this.Roses.findIndex(r => r.SeasonCastMemberId === seasonCastMember.id) > -1;
  });
  return seasonCastMembers;
};

Episode.prototype.eligibleCastMembers = async function(season) {
  log.info('eligibleCastMembers season', season);
  if (this.number === 1) {
    return await this.castMembers(season);
  }
  const previousEpisode = await Episode.findByNumber(season, this.number - 1);
  const previousEpisodeRoses = await models.Rose
    .findAll({
      where: {EpisodeId: previousEpisode.id},
      include: [models.SeasonCastMember]
    });
  const eligible = previousEpisodeRoses.map(r => new SeasonCastMember(r.SeasonCastMember));
  const currentEpisodeRoses = await models.Rose
    .findAll({where: {EpisodeId: this.id}});
  eligible.forEach(castMember => {
    castMember.hasRose = currentEpisodeRoses.findIndex(rose => rose.SeasonCastMemberId === castMember.id) > -1;
  });
  return eligible;
};
