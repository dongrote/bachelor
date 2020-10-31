'use strict';
exports = module.exports = require('express').Router();
const create = require('./create'),
  profile = require('./profile');

exports.post('/', create);
exports.get('/profile', profile);