'use strict';
const bcrypt = require('bcryptjs'),
  findPasswordHash = require('./findPasswordHash');

exports = module.exports = async (username, password) => {
  const passwordHash = await findPasswordHash(username);
  return await bcrypt.compare(password, passwordHash);
};