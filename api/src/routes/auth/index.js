'use strict';
exports = module.exports = require('express').Router();
const login = require('./login'),
  logout = require('./logout');

exports.post('/login', login);
exports.get('/logout', logout);