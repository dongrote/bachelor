'use strict';
const core = require('../../core');

exports = module.exports = async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const tokens = await core.auth.createUserTokens(username, password);
    tokens.forEach(token => res.cookie(token.cookieName(), token.cookieValue(), {httpOnly: true}));
    res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};