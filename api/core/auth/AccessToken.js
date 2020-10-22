'use strict';
const env = require('../../env'),
  SignedUserToken = require('./SignedUserToken');

class AccessToken extends SignedUserToken {
  cookieName() { return env.accessTokenCookieName(); }
}

exports = module.exports = AccessToken;