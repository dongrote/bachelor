'use strict';
const models = require('../../db/models');

exports = module.exports = async username => {
  const user = await models.User
    .findOne({where: {username}, attributes: ['passwordHash']});
  if (!user) throw new Error(`username not found '${username}'`);
  return user.passwordHash;
};