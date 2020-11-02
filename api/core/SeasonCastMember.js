'use strict';
function SeasonCastMember(data) {
  this.id = data.id;
  this.SeasonId = data.SeasonId;
  this.firstName = data.firstName;
  this.lastName = data.lastName;
  this.age = data.age;
  this.occupation = data.occupation;
  this.gender = data.gender;
}

exports = module.exports = SeasonCastMember;
const _ = require('lodash'),
  models = require('../db/models');

SeasonCastMember.create = async (season, details) => {
  const dbrow = await models.SeasonCastMember
    .create({
      SeasonId: season.id,
      firstName: _.get(details, 'firstName'),
      lastName: _.get(details, 'lastName'),
      occupation: _.get(details, 'occupation'),
      age: _.get(details, 'age'),
      gender: _.get(details, 'gender'),
    });
  return dbrow ? new SeasonCastMember(dbrow.toJSON()) : null;
};