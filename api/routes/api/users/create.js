'use strict';
const _ = require('lodash'),
  log = require('debug-logger')('api:users:create'),
  HttpError = require('http-error-constructor'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  const {username, password} = _.pick(req.body, ['username', 'password']);
  try {
    const user = await core.User.create(username, password);
    core.http.loginUser(res, await core.auth.createUserTokens(user));
    res.sendStatus(204);
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};