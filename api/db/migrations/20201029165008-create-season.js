'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Seasons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ResourceGroupId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ResourceGroups',
          key: 'id',
        },
      },
      type: {
        type: Sequelize.STRING(16)
      },
      name: {
        type: Sequelize.STRING(64)
      },
      startedAt: {
        type: Sequelize.DATE
      },
      endedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Seasons');
  }
};