'use strict';
const AccessToken = require('./AccessToken'),
  RefreshToken = require('./RefreshToken');

exports = module.exports = async user => {
  const refreshToken = await RefreshToken.create(user);
  const accessToken = await AccessToken.create(user);
  return [refreshToken, accessToken];
};