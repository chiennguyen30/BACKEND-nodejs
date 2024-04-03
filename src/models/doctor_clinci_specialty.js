"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Clinci_specialty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Doctor_Clinci_specialty.init(
    {
      doctorId: DataTypes.INTEGER,
      clinciId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Doctor_Clinci_specialty",
    }
  );
  return Doctor_Clinci_specialty;
};
