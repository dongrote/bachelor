'use strict';
const log = require('debug-logger')('api:seasons:cast:create'),
  HttpError = require('http-error-constructor'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) return setImmediate(next, new HttpError(401));
  try {
    const season = await core.Season.findById(req.accessToken, Number(req.params.id));
    const castMember = await season.createCastMember(req.accessToken, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      occupation: req.body.occupation,
      gender: req.body.gender,
      homeLocation:  req.body.homeLocation,
    });
    res.json(castMember);
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};
