'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Bookmarks', 'Bookmarks_collectionId_fkey');
    await queryInterface.addConstraint('Bookmarks', {
      fields: ['collectionId'],
      type: 'foreign key',
      name: 'Bookmarks_collectionId_fkey',
      references: {
        table: 'Collections',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Bookmarks', 'Bookmarks_collectionId_fkey');
    await queryInterface.addConstraint('Bookmarks', {
      fields: ['collectionId'],
      type: 'foreign key',
      name: '',
      references: {
        table: 'Collections',
        field: 'id',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
  },
};