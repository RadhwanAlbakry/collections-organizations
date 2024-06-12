'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('OrganizationCollections', {
        organizationId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Organizations',
            key: 'id'
          },
          onDelete: 'CASCADE',
          primaryKey: true
        },
        collectionId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Collections',
            key: 'id'
          },
          onDelete: 'CASCADE',
          primaryKey: true
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
      await queryInterface.dropTable('OrganizationCollections');
    }
  };

