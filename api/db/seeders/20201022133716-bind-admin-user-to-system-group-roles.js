'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ResourceGroupRoleBindings', [{
      UserId: 1,
      ResourceGroupRoleId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ResourceGroupRoleBindings', {UserId: 1}, {});
  }
};
