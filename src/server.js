require('dotenv').config();

const sequelize = require('./config/database');
const app = require('./app');
require('./models/association');

const PORT = process.env.PORT || 3000;

function getSyncOptions() {
  if (process.env.DB_SYNC_FORCE === 'true') {
    return { force: true };
  }

  if (process.env.DB_SYNC_ALTER === 'true') {
    return { alter: true };
  }

  return {};
}

const syncOptions = getSyncOptions();

sequelize.authenticate()
  .then(() => sequelize.sync(syncOptions))
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Falha ao iniciar servidor. Verifique a conexao PostgreSQL e a sincronizacao das tabelas.');
    console.error(err);
    process.exit(1);
  });
