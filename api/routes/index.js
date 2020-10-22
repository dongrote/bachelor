'use strict';
exports = module.exports = require('express').Router();
const auth = require('./auth');
const api = require('./api');
const core = require('../core');

exports.get('/healthz', (req, res) => res.json(core.system.report()));
exports.use('/auth', auth);
exports.use('/api', api);