'use strict';
exports = module.exports = require('express').Router();
const users = require('./users'),
  cast = require('./cast'),
  seasons = require('./seasons');

exports.use('/users', users);
exports.use('/cast', cast);
exports.use('/seasons', seasons);
