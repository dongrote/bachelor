'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ResourceGroups', [{
      name: 'System',
      description: 'System User Group',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ResourceGroups', {name: 'System'}, {});
  }
};
