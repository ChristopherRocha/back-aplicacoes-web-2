require('dotenv').config();

const sequelize = require('./config/database');
const app = require('./app');
require('./models/association');

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

function shouldSyncDatabase() {
  if (process.env.DB_SYNC_FORCE === 'true' || process.env.DB_SYNC_ALTER === 'true') {
    return true;
  }

  if (process.env.DB_SYNC === 'true') {
    return true;
  }

  if (process.env.DB_SYNC === 'false') {
    return false;
  }

  return !isProduction;
}

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
const syncDatabase = shouldSyncDatabase();

sequelize.authenticate()
  .then(() => {
    if (!syncDatabase) {
      console.log('Sincronizacao automatica das tabelas ignorada em producao.');
      return null;
    }

    return sequelize.sync(syncOptions);
  })
  .then(() => {
    if (syncDatabase) {
      console.log('Tabelas sincronizadas com sucesso.');
    }

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Falha ao iniciar servidor. Verifique a conexao PostgreSQL e a sincronizacao das tabelas.');
    console.error(err);
    process.exit(1);
  });
