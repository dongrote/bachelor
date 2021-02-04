'use strict';
const SignedToken = require('./SignedToken');
function SignedUserToken(options) {
  SignedToken.call(this, options);
}
exports = module.exports = SignedUserToken;

SignedUserToken.prototype = Object.create(SignedToken.prototype);
Object.defineProperty(SignedUserToken.prototype, 'constructor', {
  value: SignedUserToken,
  enumerable: false,
  writable: true,
});

SignedUserToken.prototype.userId = function() {
  return this.token().userId;
};
