'use strict';

function Episode(data) {
  this.id = data.id;
  this.title = data.title || 'untitled';
  this.number = data.episodeNumber;
  this.airDate = data.airDate;
  this.SeasonId = data.SeasonId;
  this.ResourceGroupId = data.ResourceGroupId;
}

exports = module.exports = Episode;
const _ = require('lodash'),
  models = require('../db/models');

Episode.create = async (accessToken, season, details) => {
  if (!accessToken.hasGroupRole(season.resourceGroup.id, 'owner')) throw new Error('permission denied');
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
      }],
    });
  if (dbrow) {
    if (!accessToken.isMemberOfGroup(dbrow.Season.ResourceGroupId)) throw new Error('permission denied');
    return new Episode(_.assignIn(dbrow.toJSON(), {ResourceGroupId: dbrow.Season.ResourceGroupId}));
  }
  return null;
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
        EpisodeId: this.id,
        SeasonCastMemberId: seasonCastMember.id,
      },
    });
};
