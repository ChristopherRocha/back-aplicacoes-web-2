const { Jogo, Genero } = require('../models/association');

function normalizeDescricao(value) {
  return String(value || '').trim();
}

exports.create = async (req, res) => {
  try {
    const descricao = normalizeDescricao(req.body.descricao);

    if (!descricao) {
      return res.status(400).json({ error: 'Descricao e obrigatoria.' });
    }

    const existingGenero = await Genero.findOne({ where: { descricao } });

    if (existingGenero) {
      return res.status(409).json({ error: 'Ja existe um genero com esta descricao.' });
    }

    const genero = await Genero.create({ descricao });

    res.status(201).json(genero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const generos = await Genero.findAll({
      order: [['descricao', 'ASC']],
    });

    res.json(generos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id);

    if (!genero) {
      return res.status(404).json({ error: 'Genero nao encontrado.' });
    }

    res.json(genero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id);
    const descricao = normalizeDescricao(req.body.descricao);

    if (!genero) {
      return res.status(404).json({ error: 'Genero nao encontrado.' });
    }

    if (!descricao) {
      return res.status(400).json({ error: 'Descricao e obrigatoria.' });
    }

    const existingGenero = await Genero.findOne({ where: { descricao } });

    if (existingGenero && existingGenero.id !== genero.id) {
      return res.status(409).json({ error: 'Ja existe um genero com esta descricao.' });
    }

    await genero.update({ descricao });

    res.json(genero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id);

    if (!genero) {
      return res.status(404).json({ error: 'Genero nao encontrado.' });
    }

    const jogosCount = await Jogo.count({
      where: {
        generoId: genero.id,
      },
    });

    if (jogosCount > 0) {
      return res.status(409).json({
        error: 'Nao e possivel apagar um genero que ja possui jogos.',
      });
    }

    await genero.destroy();

    res.json({ message: 'Genero removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
