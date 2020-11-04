'use strict';
exports = module.exports = require('express').Router();
const create = require('./create'),
  findAll = require('./findAll'),
  profile = require('./profile'),
  updateProfile = require('./updateProfile');

exports.post('/', create);
exports.get('/', findAll);
exports.get('/profile', profile);
exports.patch('/profile', updateProfile);
