'use strict';
const hashPassword = require('./hashPassword'),
  rbac = require('../rbac'),
  findById = require('./findById'),
  models = require('../../db/models');

exports = module.exports = async (username, password) => {
  const passwordHash = await hashPassword(password);
  try {
    const user = await models.User
      .create({username, passwordHash, displayName: username});
    const userGroup = await rbac.createUserGroup(user.id);
    const userGroupRole = await rbac.createUserGroupRoles(userGroup.id);
    await rbac.createUserGroupRoleBindings(user.id, userGroupRole.id);
    return await findById(user.id);
  } catch (e) {
    if (e instanceof models.Sequelize.UniqueConstraintError) {
      throw new Error('username already exists');
    }
    throw e;
  }
};
