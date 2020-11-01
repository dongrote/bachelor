'use strict';
function SeasonCastMember(data) {
  this.id = data.id;
  this.ResourceGroupId = data.ResourceGroupId;
  this.SeasonId = data.SeasonId;
  this.firstName = data.firstName;
  this.lastName = data.lastName;
  this.age = data.age;
  this.occupation = data.occupation;
  this.gender = data.gender;
}

exports = module.exports = SeasonCastMember;
const _ = require('lodash'),
  {MissingMembershipError} = require('./rbac'),
  models = require('../db/models');

SeasonCastMember.findById = async (accessToken, id) => {
  const dbrow = await models.SeasonCastMember
    .findByPk(id, {
      include: [{
        model: models.Season,
        attributes: ['ResourceGroupId']
      }]
    });
  if (dbrow) {
    if (!accessToken.isMemberOfGroup(dbrow.Season.ResourceGroupId)) throw new MissingMembershipError(dbrow.Season.ResourceGroupId);
    return new SeasonCastMember(_.assignIn(dbrow.toJSON(), {ResourceGroupId: dbrow.Season.ResourceGroupId}));
  }
  return null;
};

SeasonCastMember.findForSeason = async (accessToken, season) => {
  if (!accessToken.isMemberOfGroup(season.ResourceGroupId)) throw new MissingMembershipError(season.ResourceGroupId);
  const rows = await models.SeasonCastMember
    .findAll({where: {SeasonId: season.id}});
  return rows.map(r => new SeasonCastMember(_.assignIn(r.toJSON(), {ResourceGroupId: season.ResourceGroupId})));
};