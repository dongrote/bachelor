'use strict';
const SignedToken = require('./SignedToken');

class SignedUserToken extends SignedToken {
  userId() {
    return this.token().userId;
  }
}

exports = module.exports = SignedUserToken;