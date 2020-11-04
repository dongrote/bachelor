'use strict';
const SignedUserToken = require('./SignedUserToken');
function RefreshToken() {
  SignedUserToken.call(this, ...arguments);
}
exports = module.exports = RefreshToken;

RefreshToken.prototype = Object.create(SignedUserToken.prototype);
Object.defineProperty(RefreshToken.prototype, 'constructor', {
  value: RefreshToken,
  enumerable: false,
  writable: true,
});

const _ = require('lodash'),
  env = require('../../env');

RefreshToken.create = async user => {
  const token = new RefreshToken({key: env.tokenSigningKey(), algorithm: env.tokenSigningAlgorithm()});
  await token.sign({userId: user.id});
  return token;
};

RefreshToken.verify = async (signed, key, options) => {
  const algorithm = _.get(options, 'algorithm', env.tokenSigningAlgorithm());
  const token = new RefreshToken({key, algorithm});
  await token.verify(signed);
  return token;
};

RefreshToken.cookieName = () => env.refreshTokenCookieName();
RefreshToken.prototype.cookieName = () => env.refreshTokenCookieName();
