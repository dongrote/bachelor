'use strict';

const { query } = require("express");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ResourceGroupRoles', [{
      name: 'member',
      description: 'Member of System Administrators Group',
      ResourceGroupId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ResourceGroupRoles', {GroupId: 1}, {});
  }
};
