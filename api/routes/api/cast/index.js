'use strict';
exports = module.exports = require('express').Router();
const create = require('./create'),
  findAll = require('./findAll'),
  update = require('./update');

exports.post('/', create);
exports.get('/', findAll);
exports.patch('/:id', update);