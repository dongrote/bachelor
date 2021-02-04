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
  if (accessTokenCookie) {
    try {
      req.accessToken = await AccessToken.verify(accessTokenCookie, env.tokenSigningKey(), {algorithm: env.tokenSigningAlgorithm()});
    } catch (e) {
      if (req.refreshToken) {
        log.info('refreshing access token');
        req.accessToken = await AccessToken.create(await User.findById(req.refreshToken.userId()));
        res.cookie(req.accessToken.cookieName(), req.accessToken.cookieValue(), {httpOnly: true});
      } else {
        log.error(e);
        res.clearCookie(AccessToken.cookieName(), {httpOnly: true});
        error = new HttpError(400, e.message);
      }
    }
  }
  setImmediate(next, error);
};
