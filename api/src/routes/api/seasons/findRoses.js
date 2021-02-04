'use strict';
const log = require('debug-logger')('api:seasons:episodes:roses'),
  HttpError = require('http-error-constructor'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) return setImmediate(next, new HttpError(401));
  try {
    const season = await core.Season.findById(req.accessToken, Number(req.params.id));
    const episode = await season.episode(req.accessToken, Number(req.params.num));
    res.json(await episode.roses());
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};
