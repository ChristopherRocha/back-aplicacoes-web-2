const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const corsOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const allowAllOrigins = corsOrigins.length === 0
  || corsOrigins.includes('*')
  || corsOrigins.some(origin => origin.toLowerCase() === 'all');
const allowedOrigins = corsOrigins
  .filter(origin => origin !== '*' && origin.toLowerCase() !== 'all');

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowAllOrigins || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origem nao permitida pelo CORS.'));
  },
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// routes
const authRoutes = require('./routes/authRoute');
const filmeRoutes = require('./routes/filmeRoute');
const generoRoutes = require('./routes/generoRoute');

app.use('/auth', authRoutes);
app.use('/filmes', filmeRoutes);
app.use('/generos', generoRoutes);

app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
