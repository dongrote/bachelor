'use strict';
const groups = require('./groups');

exports = module.exports = async user => {
  return {
    userId: user.id,
    groups: await groups(user.id),
  }
};