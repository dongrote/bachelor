'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      displayName: 'Administrator',
      firstName: 'Administrator',
      passwordHash: bcrypt.hashSync('admin', bcrypt.genSaltSync()),
      systemRole: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {username: 'admin'}, {});
  }
};
