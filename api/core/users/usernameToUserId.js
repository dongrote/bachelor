'use strict';
const models = require('../../db/models');

exports = module.exports = async username => {
  const user = await models.User.findOne({where: {username}, attributes: ['id']});
  return user ? user.id : null;
};
