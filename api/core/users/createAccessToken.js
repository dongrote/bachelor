'use strict';
const env = require('../../env'),
  auth = require('../auth'),
  accessTokenPayload = require('./accessTokenPayload'),
  findById = require('./findById');

exports = module.exports = async refreshToken => {
  const token = new auth.AccessToken({
    key: env.tokenSigningKey(),
    algorithm: env.tokenSigningAlgorithm(),
  });
  const user = await findById(refreshToken.userId());
  if (!user) throw new Error(`userId not found ${refreshToken.userId()}`);
  await token.sign(await accessTokenPayload(user));
  return token;
};