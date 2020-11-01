'use strict';
const SignedUserToken = require('./SignedUserToken');
function AccessToken() {
  SignedUserToken.call(this, ...arguments);
}
exports = module.exports = AccessToken;

AccessToken.prototype = Object.create(SignedUserToken.prototype);
Object.defineProperty(AccessToken.prototype, 'constructor', {
  value: AccessToken,
  enumerable: false,
  writable: true,
});

const _ = require('lodash'),
  log = require('debug-logger')('AccessToken'),
  env = require('../../env');

AccessToken.bindingsToGroups = user => {
  const groups = [];
  user.ResourceGroupRoleBindings.forEach(binding => {
    groups.push({
      id: binding.ResourceGroupRole.ResourceGroup.id,
      role: binding.ResourceGroupRole.name,
      name: binding.ResourceGroupRole.ResourceGroup.name,
    });
  });
  return groups;
};

AccessToken.createPayload = user => ({userId: user.id, role: user.systemRole, groups: AccessToken.bindingsToGroups(user)});

AccessToken.create = async user => {
  const token = new AccessToken({key: env.tokenSigningKey(), algorithm: env.tokenSigningAlgorithm()});
  await token.sign(AccessToken.createPayload(user));
  return token;
};

AccessToken.verify = async (signed, key, options) => {
  const algorithm = _.get(options, 'algorithm', env.tokenSigningAlgorithm());
  const token = new AccessToken({key, algorithm});
  await token.verify(signed);
  return token;
};

AccessToken.cookieName = () => env.accessTokenCookieName();

AccessToken.prototype.cookieName = () => env.accessTokenCookieName();

AccessToken.prototype.groups = function() {
  return this.token().groups;
};

AccessToken.prototype.role = function() {
  return this.token().role;
};

AccessToken.prototype.isMemberOfGroup = function(groupId) {
  if (this.role() === 'admin') return true;
  const group = _.find(this.groups(), g => g.id === groupId);
  return Boolean(group);
};

AccessToken.prototype.hasGroupRole = function(groupId, role) {
  if (this.role() === 'admin') return true;
  const group = _.find(this.groups(), g => g.id === groupId);
  return group ? group.role === role : false;
};

AccessToken.prototype.hasAnyGroupRole = function(groupId, roles) {
  if (this.role() === 'admin') return true;
  return _.some(roles.map(r => this.hasGroupRole(groupId, r)));
};
