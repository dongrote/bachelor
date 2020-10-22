'use strict';

exports = module.exports = resourceGroupRoleBindings => {
  const groups = [];
  resourceGroupRoleBindings.forEach(binding => {
    groups.push({
      role: binding.ResourceGroupRole.name,
      name: binding.ResourceGroupRole.ResourceGroup.name,
    });
  });
  return groups;
};