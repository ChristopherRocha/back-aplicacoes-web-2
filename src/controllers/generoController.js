const Genero = require('../models/Genero');

// CREATE
exports.create = async (req, res) => {
  try {
    const genero = await Genero.create(req.body);
    res.status(201).json(genero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getAll = async (req, res) => {
  try {
    const generos = await Genero.findAll();
    res.json(generos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getById = async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id);

    if (!genero) {
      return res.status(404).json({ error: 'Genero não encontrado' });
    }

    res.json(genero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id);

    if (!genero) {
      return res.status(404).json({ error: 'Genero não encontrado' });
    }

    await genero.update(req.body);

    res.json(genero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id);

    if (!genero) {
      return res.status(404).json({ error: 'Genero não encontrado' });
    }

    await genero.destroy();

    res.json({ message: 'Genero removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};