const User = require('../models/User');
const { verifyToken } = require('../utils/auth');

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Token nao enviado.' });
    }

    const payload = verifyToken(token);
    const user = await User.findByPk(payload.sub);

    if (!user) {
      return res.status(401).json({ error: 'Utilizador nao encontrado.' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso reservado a administradores.' });
  }

  next();
};
