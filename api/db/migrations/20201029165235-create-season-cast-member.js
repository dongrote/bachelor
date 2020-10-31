'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SeasonCastMembers', {
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
        },
      },
      firstName: {
        type: Sequelize.STRING(25)
      },
      lastName: {
        type: Sequelize.STRING(25)
      },
      age: {
        type: Sequelize.INTEGER
      },
      occupation: {
        type: Sequelize.STRING(50)
      },
      gender: {
        type: Sequelize.STRING(1)
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
    await queryInterface.dropTable('SeasonCastMembers');
  }
};