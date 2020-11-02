'use strict';
const HttpError = require('http-error-constructor'),
  log = require('debug-logger')('api:middleware:accessToken'),
  env = require('../../../env'),
  auth = require('../../auth'),
  User = require('../../User');

exports = module.exports = async (req, res, next) => {
  const {AccessToken} = auth;
  const accessTokenCookie = req.cookies[AccessToken.cookieName()];
  let error;
  try {
    if (accessTokenCookie) {
      req.accessToken = await AccessToken.verify(accessTokenCookie, env.tokenSigningKey(), {algorithm: env.tokenSigningAlgorithm()});
    } else if (req.refreshToken) {
      req.accessToken = await AccessToken.create(await User.findById(req.refreshToken.userId()));
      res.cookie(req.accessToken.cookieName(), req.accessToken.cookieValue(), {httpOnly: true});
    }
  } catch (e) {
    log.error(e);
    try {
      req.accessToken = await AccessToken.create(await User.findById(req.refreshToken.userId()));
      res.cookie(req.accessToken.cookieName(), req.accessToken.cookieValue(), {httpOnly: true});
    } catch (refreshError) {
      return next(new HttpError(400, refreshError.message));
    }
    error = new HttpError(400, e.message);
  }
  next(error);
};
