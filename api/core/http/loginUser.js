'use strict';

exports = module.exports = (res, tokens) => {
  tokens.forEach(token => res.cookie(token.cookieName(), token.cookieValue(), {httpOnly: true}));
};