const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Imagem = sequelize.define(
  'Imagem',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    foto: {
      type: DataTypes.TEXT,
    },

    fotoBinaria: {
      type: DataTypes.BLOB,
    },

    isUrl: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'imagens',
    timestamps: true,
  }
);

module.exports = Imagem;
