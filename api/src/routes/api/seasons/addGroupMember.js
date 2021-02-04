'use strict';
const log = require('debug-logger')('api:seasons:members:add'),
  HttpError = require('http-error-constructor'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) return setImmediate(next, new HttpError(401));
  try {
    const season = await core.Season.findById(req.accessToken, Number(req.params.id));
    const member = await core.User.findById(req.body.userId);
    await season.addUserMember(req.accessToken, member);
    res.sendStatus(204);
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};
