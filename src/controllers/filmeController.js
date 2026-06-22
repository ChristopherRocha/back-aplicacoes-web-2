const Filme = require('../models/Filme');
const Genero = require('../models/Genero');

async function findUserGenero(generoId, userId) {
  if (generoId === undefined || generoId === null) {
    return null;
  }

  return Genero.findOne({
    where: {
      id: generoId,
      userId,
    },
  });
}

// CREATE
exports.create = async (req, res) => {
  try {
    const { id, userId, ...data } = req.body;
    const genero = await findUserGenero(data.generoId, req.user.id);

    if (!genero) {
      return res.status(400).json({ error: 'Genero invalido' });
    }

    const filme = await Filme.create({
      ...data,
      userId: req.user.id,
    });

    res.status(201).json(filme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getAll = async (req, res) => {
  try {
    const filmes = await Filme.findAll({
      where: { userId: req.user.id },
    });

    res.json(filmes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getById = async (req, res) => {
  try {
    const filme = await Filme.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!filme) {
      return res.status(404).json({ error: 'Filme nao encontrado' });
    }

    res.json(filme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const filme = await Filme.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!filme) {
      return res.status(404).json({ error: 'Filme nao encontrado' });
    }

    const { id, userId, ...data } = req.body;

    if (data.generoId !== undefined) {
      const genero = await findUserGenero(data.generoId, req.user.id);

      if (!genero) {
        return res.status(400).json({ error: 'Genero invalido' });
      }
    }

    await filme.update(data);

    res.json(filme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const filme = await Filme.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!filme) {
      return res.status(404).json({ error: 'Filme nao encontrado' });
    }

    await filme.destroy();

    res.json({ message: 'Filme removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
