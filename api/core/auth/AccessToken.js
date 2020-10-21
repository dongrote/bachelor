'use strict';
const env = require('../../env'),
  SignedToken = require('./SignedToken');

class AccessToken extends SignedToken {
  cookieName() { return env.accessTokenCookieName(); }
}

exports = module.exports = AccessToken;