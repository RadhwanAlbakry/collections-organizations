'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Collections', 'Collections_userId_fkey');
    await queryInterface.addConstraint('Collections', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Collections_userId_fkey',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Collections', 'Collections_userId_fkey');
    await queryInterface.addConstraint('Collections', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Collections_userId_fkey',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
  },
};