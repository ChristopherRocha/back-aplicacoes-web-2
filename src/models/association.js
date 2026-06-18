const Filme = require('./Filme');
const Genero = require('./Genero');
const User = require('./User');


Genero.hasMany(Filme, {
  foreignKey: 'generoId',
});


Filme.belongsTo(Genero, {
  foreignKey: 'generoId',
});

module.exports = { Filme, Genero, User };
