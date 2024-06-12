'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Collections', 'isOrganizationCollection', {
      type: Sequelize.BOOLEAN,
      allowNull: true, // Adjust as needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Collections', 'isOrganizationCollection');
  }
};