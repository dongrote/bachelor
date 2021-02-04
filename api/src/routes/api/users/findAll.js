'use strict';
const log = require('debug-logger')('api:users:findAll'),
  HttpError = require('http-error-constructor'),
  core = require('../../../core');

exports = module.exports = async (req, res, next) => {
  const options = {};
  if (req.query.offset) {
    options.offset = Number(req.query.offset);
  }
  if (req.query.limit) {
    options.limit = Number(req.query.limit);
  }
  try {
    const {count, users} = await core.User.findAll(options);
    res.json({count, users});
  } catch (e) {
    log.error(e);
    next(new HttpError(400, e.message));
  }
};
