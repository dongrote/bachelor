'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Roses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      EpisodeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Episodes',
          key: 'id',
        },
      },
      SeasonCastMemberId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SeasonCastMembers',
          key: 'id',
        },
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
    await queryInterface.dropTable('Roses');
  }
};