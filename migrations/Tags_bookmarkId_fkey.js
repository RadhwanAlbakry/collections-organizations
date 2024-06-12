'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Tags', 'Tags_bookmarkId_fkey');
    await queryInterface.addConstraint('Tags', {
      fields: ['bookmarkId'],
      type: 'foreign key',
      name: 'Tags_bookmarkId_fkey',
      references: {
        table: 'Bookmarks',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Tags', 'Tags_bookmarkId_fkey');
    await queryInterface.addConstraint('Tags', {
      fields: ['bookmarkId'],
      type: 'foreign key',
      name: 'Tags_bookmarkId_fkey',
      references: {
        table: 'Bookmarks',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
  },
};