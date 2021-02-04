'use strict';
const HttpError = require("http-error-constructor");

exports = module.exports = (req, res, next) => setImmediate(next, new HttpError(501));