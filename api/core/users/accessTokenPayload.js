'use strict';
const bindingsToGroups = require('./bindingsToGroups');

exports = module.exports = user => Promise.resolve({
  userId: user.id,
  groups: bindingsToGroups(user.ResourceGroupRoleBindings),
});
