const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comentario = sequelize.define(
  'Comentario',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    jogoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'comentarios',
    timestamps: true,
  }
);

module.exports = Comentario;
