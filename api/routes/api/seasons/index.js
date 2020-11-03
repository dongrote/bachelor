'use strict';
exports = module.exports = require('express').Router();
const create = require('./create'),
  findAll = require('./findAll'),
  findById = require('./findById'),
  findAllSeasonCastMembers = require('./findAllCast'),
  findAllSeasonGroupMembers = require('./findAllUsers'),
  addGroupMember = require('./addGroupMember'),
  removeGroupMember = require('./removeGroupMember'),
  createCastMember = require('./createCastMember'),
  createRole = require('./createRole'),
  findAllRoles = require('./findAllRoles');

exports.post('/', create);
exports.get('/', findAll);
exports.get('/:id', findById);
exports.get('/:id/cast', findAllSeasonCastMembers);
exports.post('/:id/cast', createCastMember);
exports.get('/:id/members', findAllSeasonGroupMembers);
exports.post('/:id/members', addGroupMember);
exports.delete('/:id/members', removeGroupMember);
exports.get('/:id/roles', findAllRoles);
exports.post('/:id/roles', createRole);
