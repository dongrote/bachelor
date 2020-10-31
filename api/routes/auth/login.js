'use strict';
const HttpError = require('http-error-constructor'),
  core = require('../../core');

exports = module.exports = async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const user = await core.User.verifyCredentials(username, password);
    if (user) {
      core.http.loginUser(res, await core.auth.createUserTokens(user));
    }
    res.sendStatus(user ? 204 : 400);
  } catch (e) {
    next(new HttpError(400, e.message));
  }
};