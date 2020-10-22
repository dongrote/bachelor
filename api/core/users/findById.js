'use strict';
const models = require('../../db/models');

exports = module.exports = async userId => {
  const row = await models.User.findByPk(userId, {
    attributes: {exclude: ['passwordHash']},
  });
  return row ? row.toJSON() : null;
};