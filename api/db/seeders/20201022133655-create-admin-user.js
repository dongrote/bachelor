'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      // password: admin
      passwordHash: '$2a$10$kRXbp.1G0KEEgXwLJyo/A.A7Y3wTzU67HSmFAnvRXiMfhw48P2Uc2',
      systemRole: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {username: 'admin'}, {});
  }
};
