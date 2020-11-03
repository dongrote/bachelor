'use strict';
const log = require('debug-logger')('api:seasons:roles:create'),
  HttpError = require('http-error-constructor'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) return setImmediate(next, new HttpError(401));
  try {
    const season = await core.Season.findById(req.accessToken, Number(req.params.id));
    const role = await season.createRole(req.accessToken, req.body.name);
    res.json(role);
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};
