'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SeasonCastMemberPicks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SeasonId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Seasons',
          key: 'id'
        }
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      SeasonCastMemberId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SeasonCastMembers',
          key: 'id'
        }
      },
      eliminatedAt: {
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
    await queryInterface.dropTable('SeasonCastMemberPicks');
  }
};
