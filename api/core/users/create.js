'use strict';
const bcrypt = require('bcryptjs'),
  models = require('../../db/models');

exports = module.exports = async (username, password) => {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  try {
    const user = await models.User.create({username, passwordHash});
    return user.toJSON();
  } catch (e) {
    if (e instanceof models.Sequelize.UniqueConstraintError) {
      throw new Error('username already exists');
    }
    throw e;
  }
};
