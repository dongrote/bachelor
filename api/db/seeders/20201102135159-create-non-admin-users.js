'use strict';
const bcrypt = require('bcryptjs');
const usernames = ['foo', 'bar', 'baz'];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', usernames.map(username => ({
      username,
      displayName: username,
      firstName: username,
      passwordHash: bcrypt.hashSync(username, bcrypt.genSaltSync()),
      systemRole: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    })), {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {systemRole: 'user'}, {});
  }
};
