'use strict';
const log = require('debug-logger')('User'),
  rbac = require('./rbac'),
  models = require('../db/models'),
  Season = require('./Season'),
  bcrypt = require('bcryptjs');

class User {
  static async hashPassword(password) {
    return await bcrypt.hash(password, await bcrypt.genSalt());
  }
  static async create(username, password) {
    try {
      const passwordHash = await User.hashPassword(password);
      const user = await models.User
        .create({username, passwordHash, displayName: username});
      const userGroup = await rbac.createUserGroup(user.id);
      const [userGroupRole] = await rbac.createUserGroupRoles(userGroup.id);
      await rbac.createUserGroupRoleBindings(user.id, userGroupRole.id);
      return await User.findById(user.id);
    } catch (e) {
      log.error('create', e);
      return null;
    }
  }
  static async findById(userId) {
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
    return row ? new User(row.toJSON()) : null;
  }
  static async usernameToId(username) {
    const user = await models.User.findOne({where: {username}, attributes: ['id']});
    return user ? user.id : null;
  }
  static async verifyCredentials(username, password) {
    const user = await models.User.findOne({where: {username}, attributes: ['id', 'passwordHash']});
    if (!user) throw new Error('username not found');
    return await bcrypt.compare(password, user.passwordHash)
      ? await User.findById(user.id) : null;
  }
  constructor(data) {
    log.debug(data);
    this.dbrow = data;
    this.id = data.id;
    this.username = data.username;
    this.displayName = data.displayName;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.ResourceGroupRoleBindings = data.ResourceGroupRoleBindings;
  }
  profile() {
    return {
      displayName: this.displayName,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      groups: this.ResourceGroupRoleBindings.map(rgrb => ({
        name: rgrb.ResourceGroupRole.ResourceGroup.name,
        role: rgrb.ResourceGroupRole.name,
        roleDescription: rgrb.ResourceGroupRole.description,
        description: rgrb.ResourceGroupRole.ResourceGroup.description,
      })),
    };
  }
}

exports = module.exports = User;
