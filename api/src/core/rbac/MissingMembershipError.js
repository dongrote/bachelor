'use strict';

class MissingMembershipError extends Error {
  constructor(groupId) {
    super(`missing membership to group id ${groupId}`);
  }
}

exports = module.exports = MissingMembershipError;
