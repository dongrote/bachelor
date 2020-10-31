'use strict';
const HttpError = require("http-error-constructor"),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  try {
    res.json(await core.Season.findAll(req.accessToken));
  } catch (e) {
    next(new HttpError(400, e.message));
  }
};