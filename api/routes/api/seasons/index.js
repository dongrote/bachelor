'use strict';
exports = module.exports = require('express').Router();
const create = require('./create'),
  findAll = require('./findAll'),
  findById = require('./findById'),
  findAllSeasonCastMembers = require('./findAllCast'),
  findAllSeasonGroupMembers = require('./findAllUsers');

exports.post('/', create);
exports.get('/', findAll);
exports.get('/:id', findById);
exports.get('/:id/cast', findAllSeasonCastMembers);
exports.get('/:id/members', findAllSeasonGroupMembers);
