'use strict';
exports = module.exports = require('express').Router();
const create = require('./create'),
  findAll = require('./findAll');

exports.post('/', create);
exports.get('/', findAll);