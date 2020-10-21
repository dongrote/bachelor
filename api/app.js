'use strict';
const express = require('express');
exports = module.exports = express();
const log = require('debug-logger')('api:app'),
  env = require('./env'),
  HttpError = require('http-error-constructor'),
  cookieParser = require('cookie-parser'),
  core = require('./core'),
  models = require('./db/models'),
  logger = require('morgan');

const router = require('./routes');

/** middleware */
exports.use(logger('dev'));
exports.use(express.json());
exports.use(express.urlencoded({ extended: false }));
exports.use(cookieParser());

/** routes */
exports.use('/', router);

/** HTTP 404 File Not Found */
exports.use((req, res, next) => next(new HttpError(404)));

/** catch all error handler */
exports.use((err, req, res, next) => {
  log.error(err);
  res.status(_.get(err, 'statusCode', 500))
    .json({
      error: {
        message: err.message, 
        stack: err.stack,
      },
    });
});

models.sequelize.authenticate()
  .then(() => core.system.databaseConnect(env.sqliteDatabasePath()))
  .catch(err => {
    log.error('sequelize error', err);
    core.system.databaseDisconnect();
  });