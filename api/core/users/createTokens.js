'use strict';
const _ = require('lodash'),
  usernameToUserId = require('./usernameToUserId'),
  verifyCredentials = require('./verifyCredentials');

exports = module.exports = async (username, password) => {
  const tokens = [];
  const verified = await verifyCredentials(username, password);
  if (verified) {
    tokens.push(await createRefreshToken(await usernameToUserId(username)));
    tokens.push(await createAccessToken(_.first(tokens)));
  }
  return tokens;
};