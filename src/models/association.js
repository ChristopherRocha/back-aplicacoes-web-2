const Avaliacao = require('./Avaliacao');
const Comentario = require('./Comentario');
const Genero = require('./Genero');
const Imagem = require('./Imagem');
const Jogo = require('./Jogo');
const User = require('./User');

User.hasMany(Jogo, {
  foreignKey: 'userId',
  as: 'jogos',
  onDelete: 'CASCADE',
});

Jogo.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Imagem, {
  foreignKey: 'userId',
  as: 'imagens',
  onDelete: 'CASCADE',
});

Imagem.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Imagem.hasOne(Jogo, {
  foreignKey: 'imagemId',
  as: 'jogo',
});

Jogo.belongsTo(Imagem, {
  foreignKey: 'imagemId',
  as: 'imagem',
});

Genero.hasMany(Jogo, {
  foreignKey: 'generoId',
  as: 'jogos',
});

Jogo.belongsTo(Genero, {
  foreignKey: 'generoId',
  as: 'genero',
});

Jogo.hasMany(Comentario, {
  foreignKey: 'jogoId',
  as: 'comentarios',
  onDelete: 'CASCADE',
});

Comentario.belongsTo(Jogo, {
  foreignKey: 'jogoId',
  as: 'jogo',
});

User.hasMany(Comentario, {
  foreignKey: 'userId',
  as: 'comentarios',
  onDelete: 'CASCADE',
});

Comentario.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Jogo.hasMany(Avaliacao, {
  foreignKey: 'jogoId',
  as: 'avaliacoes',
  onDelete: 'CASCADE',
});

Avaliacao.belongsTo(Jogo, {
  foreignKey: 'jogoId',
  as: 'jogo',
});

User.hasMany(Avaliacao, {
  foreignKey: 'userId',
  as: 'avaliacoes',
  onDelete: 'CASCADE',
});

Avaliacao.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

module.exports = {
  Avaliacao,
  Comentario,
  Genero,
  Imagem,
  Jogo,
  User,
};
