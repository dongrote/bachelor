'use strict';
const models = require('../../db/models');

exports = module.exports = async userId => {
  const row = await models.User.findById(userId);
  return row ? row.toJSON() : null;
};