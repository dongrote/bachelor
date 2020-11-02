'use strict';
const HttpError = require("http-error-constructor"),
  log = require('debug-logger')('api:seasons:members'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) {
    return setImmediate(next, new HttpError(401));
  }
  try {
    const season = await core.Season.findById(req.accessToken, Number(req.params.id));
    const members = await season.userMembers(req.accessToken);
    setImmediate(() => res.json(members));
  } catch (e) {
    log.error(e);
    setImmediate(next, new HttpError(400, e.message));
  }
};
