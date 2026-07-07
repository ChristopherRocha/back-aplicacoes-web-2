const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jogo = sequelize.define(
  'Jogo',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    descricao: {
      type: DataTypes.TEXT,
    },

    generoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    imagemId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'jogos',
    timestamps: true,
  }
);

module.exports = Jogo;
