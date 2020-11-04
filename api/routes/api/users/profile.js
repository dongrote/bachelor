'use strict';
const HttpError = require("http-error-constructor"),
  log = require('debug-logger')('api:users:profile'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  const {accessToken} = req;
  if (!accessToken) {
    return next(new HttpError(400));
  }
  try {
    const user = await core.User.findById(accessToken.userId());
    res.json(user.profile());  
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};