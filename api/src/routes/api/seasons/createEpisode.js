'use strict';
const log = require('debug-logger')('api:seasons:episodes:create'),
  HttpError = require('http-error-constructor'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) return setImmediate(next, new HttpError(401));
  const options = {};
  if (req.body.title) {
    options.title = req.body.title;
  }
  try {
    const season = await core.Season.findById(req.accessToken, Number(req.params.id));
    res.json(await season.createEpisode(req.accessToken, options));
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};
