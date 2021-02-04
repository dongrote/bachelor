'use strict';
function User(data) {
  this.id = data.id;
  this.systemRole = data.systemRole || 'guest';
  this.username = data.username;
  this.displayName = data.displayName;
  this.firstName = data.firstName;
  this.lastName = data.lastName;
  this.ResourceGroupRoleBindings = data.ResourceGroupRoleBindings;
}

exports = module.exports = User;
const _ = require('lodash'),
  log = require('debug-logger')('User'),
  websocket = require('./websocket'),
  rbac = require('./rbac'),
  models = require('../db/models'),
  bcrypt = require('bcryptjs');

User.hashPassword = async password => await bcrypt.hash(password, await bcrypt.genSalt());

User.create = async (username, password, systemRole) => {
  try {
    const passwordHash = await User.hashPassword(password);
    const user = await models.User
      .create({username, passwordHash, systemRole, displayName: username});
    const userGroup = await rbac.createUserGroup(user.id);
    const [userGroupRole] = await rbac.createUserGroupRoles(userGroup.id);
    await rbac.createUserGroupRoleBindings(user.id, userGroupRole.id);
    return await User.findById(user.id);
  } catch (e) {
    log.error('create', e);
    return null;
  }
};

User.findAll = async options => {
  const {count, rows} = await models.User
    .findAndCountAll({
      attributes: {exclude: ['passwordHash']},
      include: [{
        model: models.ResourceGroupRoleBinding,
        include: [{
          model: models.ResourceGroupRole,
          include: [models.ResourceGroup]
        }]
      }],
      offset: _.get(options, 'offset', 0),
      limit: _.get(options, 'limit', 100),
    });
  return {count, users: rows.map(r => new User(r))};
};

User.findById = async userId => {
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
};

User.verifyCredentials = async (username, password) => {
  const user = await models.User.findOne({where: {username}, attributes: ['id', 'passwordHash']});
  if (!user) throw new Error('username not found');
  return await bcrypt.compare(password, user.passwordHash)
    ? await User.findById(user.id) : null;
};

User.changeRole = async (accessToken, userId, newRole) => {
  if (accessToken.role() !== 'admin') throw new Error('permission denied');
  const [numAffected] = await models.User.update({systemRole: newRole}, {where: {id: userId}});
  return numAffected > 0;
};

User.prototype.profile = function() {
  return {
    displayName: this.displayName,
    firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
    systemRole: this.systemRole,
    groups: this.ResourceGroupRoleBindings.map(rgrb => ({
      id: rgrb.ResourceGroupRole.ResourceGroup.id,
      name: rgrb.ResourceGroupRole.ResourceGroup.name,
      role: rgrb.ResourceGroupRole.name,
      roleDescription: rgrb.ResourceGroupRole.description,
      description: rgrb.ResourceGroupRole.ResourceGroup.description,
    })),
  };
};

User.prototype.update = async function(accessToken, values) {
  if (accessToken.userId() !== this.id && !accessToken.isAdmin()) throw new Error('permission denied');
  await models.User.update(values, {where: {id: this.id}});
  websocket.emit('User.update', await User.findById(this.id));
};
