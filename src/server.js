require('dotenv').config();

const sequelize = require('./config/database');
const app = require('./app');
require('./models/association');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Falha ao conectar no PostgreSQL. Verifique DATABASE_URL ou credenciais DB_*.');
    console.error(err);
  });
