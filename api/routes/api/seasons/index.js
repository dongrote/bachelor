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
  findAllRoles = require('./findAllRoles'),
  findAllEpisodes = require('./findAllEpisodes'),
  findEpisode = require('./findEpisode'),
  createEpisode = require('./createEpisode'),
  findEligibleCastMembers = require('./findEligibleCastMembers'),
  awardRose = require('./awardRose'),
  revokeRose = require('./revokeRose');

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
exports.get('/:id/episodes', findAllEpisodes);
exports.post('/:id/episodes', createEpisode);
exports.get('/:id/episodes/:num', findEpisode);
exports.get('/:id/episodes/:num/eligible', findEligibleCastMembers);
exports.post('/:id/episodes/:num/rose', awardRose);
exports.delete('/:id/episodes/:num/rose', revokeRose);
