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
      unique: true,
    },
  },
  {
    tableName: 'generos',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['descricao'],
      },
    ],
  }
);

module.exports = Genero;
