'use strict';
const core = require('../../core');

exports = module.exports = async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const tokens = await core.users.createTokens(username, password);
    tokens.forEach(token => res.cookie(token.cookieName(), token.cookieValue(), {httpOnly: true}));
    res.sendStatus(tokens.length === 0 ? 400 : 204);
  } catch (e) {
    return next(e);
  }
};