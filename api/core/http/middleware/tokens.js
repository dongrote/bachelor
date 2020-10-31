'use strict';
const HttpError = require('http-error-constructor'),
  log = require('debug-logger')('api:middleware:tokens'),
  env = require('../../../env'),
  auth = require('../../auth');

exports = module.exports = async (req, res, next) => {
  const {AccessToken, RefreshToken} = auth;
  const accessTokenCookie = req.cookies[AccessToken.cookieName()],
    refreshTokenCookie = req.cookies[RefreshToken.cookieName()];
  let error;
  try {
    if (accessTokenCookie) {
      req.accessToken = await AccessToken.verify(accessTokenCookie, env.tokenSigningKey(), {algorithm: env.tokenSigningAlgorithm()});
    }
    if (refreshTokenCookie) {
      req.refreshToken = await RefreshToken.verify(refreshTokenCookie, env.tokenSigningKey(), {algorithm: env.tokenSigningAlgorithm()});
    } 
  } catch (e) {
    log.error(e);
    error = new HttpError(400, e.message);
  }
  next(error);
};
