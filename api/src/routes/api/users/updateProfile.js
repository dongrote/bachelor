'use strict';
const log = require('debug-logger')('api:users:update'),
  HttpError = require('http-error-constructor'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) {
    return setImmediate(next, new HttpError(401));
  }
  try {
    const user = await core.User.findById(req.accessToken.userId());
    await user.update(req.accessToken, req.body);
    setImmediate(() => res.sendStatus(204));
  } catch (e) {
    log.error(e);
    setImmediate(next, new HttpError(400, e.message));
  }
};
