'use strict';
const log = require('debug-logger')('api:seasons:episodes:eligible'),
  HttpError = require('http-error-constructor'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) return setImmediate(next, new HttpError(401));
  try {
    const season = await core.Season.findById(req.accessToken, Number(req.params.id));
    const episode = await season.episode(req.accessToken, Number(req.params.num));
    const cast = await season.eligibleCastMembers(req.accessToken, episode);
    res.json(cast);
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};
