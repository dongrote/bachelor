'use strict';
const env = require('../../env'),
  SignedUserToken = require('./SignedUserToken');

class RefreshToken extends SignedUserToken {
  cookieName() { return env.refreshTokenCookieName(); }
}

exports = module.exports = RefreshToken;