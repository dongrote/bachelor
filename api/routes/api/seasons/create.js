'use strict';
const HttpError = require("http-error-constructor"),
  log = require('debug-logger')('api:seasons:create'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  const {type, name, startDate, endDate} = req.body;
  try {
    const season = await core.Season
      .create(req.accessToken, {type, name, startDate, endDate});
    res.clearCookie(core.auth.AccessToken.cookieName(), {httpOnly: true});
    res.json(season);
  } catch(e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};