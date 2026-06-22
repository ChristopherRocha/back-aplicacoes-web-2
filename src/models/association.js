const Filme = require('./Filme');
const Genero = require('./Genero');
const User = require('./User');

User.hasMany(Genero, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Genero.belongsTo(User, {
  foreignKey: 'userId',
});

User.hasMany(Filme, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Filme.belongsTo(User, {
  foreignKey: 'userId',
});

Genero.hasMany(Filme, {
  foreignKey: 'generoId',
});


Filme.belongsTo(Genero, {
  foreignKey: 'generoId',
});

module.exports = { Filme, Genero, User };
