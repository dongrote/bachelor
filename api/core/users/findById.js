'use strict';
const models = require('../../db/models');

exports = module.exports = async userId => {
  const row = await models.User.findByPk(userId, {
    attributes: {exclude: ['passwordHash']},
    include: [{
      model: models.ResourceGroupRoleBinding,
      include: [{
        model: models.ResourceGroupRole,
        include: [models.ResourceGroup]
      }]
    }]
  });
  return row ? row.toJSON() : null;
};