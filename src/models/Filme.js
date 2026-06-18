const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Filme = sequelize.define(
  'Filme',
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

    foto: {
      type: DataTypes.STRING,
    },

    fotoBinaria: {
      type: DataTypes.BLOB,
    },

    isUrl: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    generoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'filmes',
    timestamps: true,
  }
);

module.exports = Filme;