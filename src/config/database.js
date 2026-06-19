const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';
const DATABASE_URL = process.env.DATABASE_URL && process.env.DATABASE_URL.trim();
const DB_NAME = process.env.DB_NAME || 'ai2';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || (isProduction ? undefined : 'postgres');
const DB_HOST = process.env.DB_HOST || (isProduction ? undefined : 'localhost');
const DB_PORT = Number(process.env.DB_PORT) || 5432;
const useSSL = process.env.DB_SSL === 'true' || isProduction || Boolean(DATABASE_URL);

function parseDatabaseUrl(databaseUrl) {
  try {
    if (/%(?![0-9a-fA-F]{2})/.test(databaseUrl)) {
      throw new URIError('Invalid percent encoding');
    }

    const parsed = new URL(databaseUrl);
    const database = parsed.pathname ? parsed.pathname.replace(/^\//, '') : undefined;

    return {
      host: parsed.hostname,
      port: parsed.port,
      database,
      username: parsed.username,
    };
  } catch (err) {
    if (err instanceof TypeError || err instanceof URIError) {
      throw new Error(
        'DATABASE_URL malformada. Codifique a password na URL antes de salvar no Render. ' +
        'Exemplos: & vira %26, % vira %25, @ vira %40.'
      );
    }

    throw err;
  }
}

if (isProduction && !DATABASE_URL) {
  const missing = [
    ['DB_HOST', DB_HOST],
    ['DB_NAME', DB_NAME],
    ['DB_USER', DB_USER],
    ['DB_PASSWORD', DB_PASSWORD],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Variaveis de ambiente da BD em falta: ${missing.join(', ')}. Configure DATABASE_URL ou DB_* no Render.`);
  }
}

if (DATABASE_URL) {
  const databaseInfo = parseDatabaseUrl(DATABASE_URL);
  console.log(
    `BD via DATABASE_URL: host=${databaseInfo.host || 'indefinido'} ` +
    `port=${databaseInfo.port || 'padrao'} database=${databaseInfo.database || 'indefinida'} ` +
    `user=${databaseInfo.username || 'indefinido'}`
  );
} else {
  console.log(`BD via DB_*: host=${DB_HOST || 'indefinido'} port=${DB_PORT} database=${DB_NAME} user=${DB_USER}`);
}

const options = {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: Number(process.env.DB_POOL_MAX) || 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

if (useSSL) {
  options.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, options)
  : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      ...options,
      host: DB_HOST,
      port: DB_PORT,
    });

module.exports = sequelize;
