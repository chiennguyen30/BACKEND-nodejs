"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Doctor_Infor", "specialtyId", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("Doctor_Infor", "clinicId", {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Doctor_Infor", "specialtyId");
    await queryInterface.removeColumn("Doctor_Infor", "clinicId");
  },
};
