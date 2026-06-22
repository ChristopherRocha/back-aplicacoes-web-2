const Genero = require('../models/Genero');

// CREATE
exports.create = async (req, res) => {
  try {
    const { id, userId, ...data } = req.body;
    const genero = await Genero.create({
      ...data,
      userId: req.user.id,
    });

    res.status(201).json(genero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getAll = async (req, res) => {
  try {
    const generos = await Genero.findAll({
      where: { userId: req.user.id },
    });

    res.json(generos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getById = async (req, res) => {
  try {
    const genero = await Genero.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!genero) {
      return res.status(404).json({ error: 'Genero nao encontrado' });
    }

    res.json(genero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const genero = await Genero.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!genero) {
      return res.status(404).json({ error: 'Genero nao encontrado' });
    }

    const { id, userId, ...data } = req.body;
    await genero.update(data);

    res.json(genero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const genero = await Genero.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!genero) {
      return res.status(404).json({ error: 'Genero nao encontrado' });
    }

    await genero.destroy();

    res.json({ message: 'Genero removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
