'use strict';
const HttpError = require("http-error-constructor"),
  log = require('debug-logger')('api:seasons:cast'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) return setImmediate(next, new HttpError(401));
  try {
    const season = await core.Season.findById(req.accessToken, Number(req.params.id));
    res.json(await season.castMembers(req.accessToken));
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};
