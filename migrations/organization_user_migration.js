'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('OrganizationUsers', {
        organizationId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Organizations',
            key: 'id'
          },
          onDelete: 'CASCADE',
          primaryKey: true
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          primaryKey: true
        },
        role: {
          type: Sequelize.ENUM('owner', 'admin', 'member'),
          allowNull: false,
          defaultValue: 'member'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now')
        }
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('OrganizationUsers');
    }
  };

