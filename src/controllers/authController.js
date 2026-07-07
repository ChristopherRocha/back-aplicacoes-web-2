const User = require('../models/User');
const { hashPassword, verifyPassword, signToken } = require('../utils/auth');

function userResponse(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role,
  };
}

exports.register = async (req, res) => {
  try {
    const nome = String(req.body.nome || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const isAdmin = req.body.isAdmin === true || req.body.isAdmin === 'true' || req.body.role === 'admin';

    if (!nome || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e password sao obrigatorios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A password deve ter pelo menos 6 caracteres.' });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: 'Ja existe um utilizador com este email.' });
    }

    const user = await User.create({
      nome,
      email,
      passwordHash: hashPassword(password),
      role: isAdmin ? 'admin' : 'user',
    });

    const token = signToken({ sub: user.id, email: user.email, role: user.role });

    res.status(201).json({
      user: userResponse(user),
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password sao obrigatorios.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Credenciais invalidas.' });
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });

    res.json({
      user: userResponse(user),
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.me = (req, res) => {
  res.json({ user: userResponse(req.user) });
};
