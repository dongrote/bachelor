'use strict';
exports = module.exports = require('express').Router();
const create = require('./create'),
  findAll = require('./findAll'),
  findById = require('./findById');

exports.post('/', create);
exports.get('/', findAll);
exports.get('/:id', findById);