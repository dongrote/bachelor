'use strict';
const env = require('../../env'),
  SignedToken = require('./SignedToken');

class RefreshToken extends SignedToken {
  cookieName() { return env.refreshTokenCookieName(); }
}

exports = module.exports = RefreshToken;