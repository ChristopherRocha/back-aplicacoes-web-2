const Filme = require('../models/Filme');

// CREATE
exports.create = async (req, res) => {
  try {
    const filme = await Filme.create(req.body);
    res.status(201).json(filme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getAll = async (req, res) => {
  try {
    const filmes = await Filme.findAll();
    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getById = async (req, res) => {
  try {
    const filme = await Filme.findByPk(req.params.id);

    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }

    res.json(filme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const filme = await Filme.findByPk(req.params.id);

    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }

    await filme.update(req.body);

    res.json(filme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const filme = await Filme.findByPk(req.params.id);

    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }

    await filme.destroy();

    res.json({ message: 'Filme removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};