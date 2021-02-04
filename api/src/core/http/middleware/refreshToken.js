'use strict';
const HttpError = require('http-error-constructor'),
  log = require('debug-logger')('api:middleware:refreshToken'),
  env = require('../../../env'),
  auth = require('../../auth');

exports = module.exports = async (req, res, next) => {
  const {RefreshToken} = auth;
  const refreshTokenCookie = req.cookies[RefreshToken.cookieName()];
  let error;
  try {
    if (refreshTokenCookie) {
      req.refreshToken = await RefreshToken.verify(refreshTokenCookie, env.tokenSigningKey(), {algorithm: env.tokenSigningAlgorithm()});
    }
  } catch (e) {
    log.error(e);
    error = new HttpError(400, e.message);
  }
  next(error);
};
