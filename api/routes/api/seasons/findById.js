'use strict';
const HttpError = require("http-error-constructor"),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  if (!req.accessToken) return setImmediate(next, new HttpError(401));
  try {
    const season = await core.Season.findById(req.accessToken, Number(req.params.id));
    setImmediate(() => res.json(season));
  } catch (e) {
    setImmediate(next, new HttpError(400, e.message));
  }
};