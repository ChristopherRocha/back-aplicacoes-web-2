const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Genero = sequelize.define(
  'Genero',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'generos',
    timestamps: false,
  }
);

module.exports = Genero;
