'use strict';

class MissingRoleError extends Error {
  constructor(role) {
    const message = Array.isArray(role) ? `missing any one of ${role.join(', ')}` : `missing role ${role}`;
    super(message);
  }
}

exports = module.exports = MissingRoleError;