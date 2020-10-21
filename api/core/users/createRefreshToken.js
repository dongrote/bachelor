'use strict';
const env = require('../../env'),
  auth = require('../auth');

exports = module.exports = userId => {
  const token = new auth.RefreshToken({
    key: env.tokenSigningKey(),
    algorithm: env.tokenSigningAlgorithm(),
  });
  await token.sign({userId});
  return token;
};