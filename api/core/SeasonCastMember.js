'use strict';
function SeasonCastMember(data) {
  this.id = data.id;
  this.SeasonId = data.SeasonId;
  this.firstName = data.firstName;
  this.lastName = data.lastName;
  this.age = data.age;
  this.occupation = data.occupation;
  this.gender = data.gender;
  this.homeLocation = data.homeLocation;
  this.imageFilename = data.imageFilename;
  this.Roses = data.Roses || [];
}

exports = module.exports = SeasonCastMember;
const _ = require('lodash'),
  env = require('../env'),
  fs = require('fs'),
  path = require('path'),
  {uid} = require('uid'),
  models = require('../db/models');

const createImageFilename = () => {
  const imagesDirectory = env.imagesDirectory();
  return new Promise((resolve, reject) => {
    (function tryAgain() {
      const filename = uid(),
        filepath = path.join(imagesDirectory, filename);
      fs.open(filepath, 'wx', 0o644, (err, fd) => {
        if (err) return setImmediate(tryAgain);
        fs.close(fd, err => err ? reject(err) : resolve(filename));
      });
    }());  
  });
};

SeasonCastMember.create = async (season, details) => {
  const imageFilename = await createImageFilename();
  const dbrow = await models.SeasonCastMember
    .create({
      imageFilename,
      SeasonId: season.id,
      firstName: _.get(details, 'firstName'),
      lastName: _.get(details, 'lastName'),
      occupation: _.get(details, 'occupation'),
      age: _.get(details, 'age'),
      gender: _.get(details, 'gender'),
      homeLocation: _.get(details, 'homeLocation'),
    });
  return dbrow ? new SeasonCastMember(dbrow.toJSON()) : null;
};

SeasonCastMember.findById = async seasonCastMemberId => {
  const dbrow = await models.SeasonCastMember
    .findByPk(seasonCastMemberId);
  return dbrow ? new SeasonCastMember(dbrow) : null;
};

SeasonCastMember.prototype.imageFilepath = function() {
  return path.join(env.imagesDirectory(), this.imageFilename);
};

SeasonCastMember.prototype.setPhoto = function(accessToken, localfilepath) {
  return new Promise((resolve, reject) => {
    fs.copyFile(localfilepath, this.imageFilepath(), err => err ? reject(err) : resolve());
  });
};
