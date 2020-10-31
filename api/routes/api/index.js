'use strict';
exports = module.exports = require('express').Router();
const users = require('./users'),
  seasons = require('./seasons');

exports.use('/users', users);
exports.use('/seasons', seasons);