'use strict';
const env = require('../../env');

exports = module.exports = (req, res) => {
  res.clearCookie(env.refreshTokenCookieName(), {httpOnly: true});
  res.clearCookie(env.accessTokenCookieName(), {httpOnly: true});
  res.sendStatus(204);
};