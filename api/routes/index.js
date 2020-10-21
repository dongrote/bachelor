'use strict';
exports = module.exports = require('express').Router();
const core = require('../core');

exports.get('/healthz', (req, res) => res.json(core.system.report()));