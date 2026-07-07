const { fn, col } = require('sequelize');
const {
  Avaliacao,
  Comentario,
  Genero,
  Imagem,
  Jogo,
  User,
} = require('../models/association');

const jogoInclude = [
  {
    model: Imagem,
    as: 'imagem',
  },
  {
    model: Genero,
    as: 'genero',
  },
  {
    model: User,
    as: 'user',
    attributes: ['id', 'nome', 'email', 'role'],
  },
];

function canManageJogo(user, jogo) {
  return user && (user.role === 'admin' || jogo.userId === user.id);
}

function normalizeJogo(jogo) {
  const plain = jogo.toJSON ? jogo.toJSON() : jogo;
  const imagem = plain.imagem || null;

  return {
    ...plain,
    foto: imagem?.foto || null,
    fotoBinaria: imagem?.fotoBinaria || null,
    isUrl: imagem ? Boolean(imagem.isUrl) : true,
  };
}

async function enrichJogo(jogo, userId) {
  const plain = normalizeJogo(jogo);
  const [comentariosCount, ratingStats, minhaAvaliacao] = await Promise.all([
    Comentario.count({ where: { jogoId: plain.id } }),
    Avaliacao.findAll({
      attributes: [
        [fn('AVG', col('nota')), 'media'],
        [fn('COUNT', col('id')), 'total'],
      ],
      where: { jogoId: plain.id },
      raw: true,
    }),
    userId
      ? Avaliacao.findOne({
          where: {
            jogoId: plain.id,
            userId,
          },
        })
      : null,
  ]);

  const media = ratingStats[0]?.media;

  return {
    ...plain,
    comentariosCount,
    avaliacoesCount: Number(ratingStats[0]?.total || 0),
    avaliacaoMedia: media === null || media === undefined ? null : Number(Number(media).toFixed(1)),
    minhaAvaliacao: minhaAvaliacao?.nota || null,
  };
}

async function findJogoById(id) {
  return Jogo.findByPk(id, {
    include: jogoInclude,
  });
}

async function findGenero(generoId) {
  if (!generoId) {
    return null;
  }

  return Genero.findByPk(generoId);
}

function hasImagePayload(body) {
  return (
    Object.prototype.hasOwnProperty.call(body, 'foto') ||
    Object.prototype.hasOwnProperty.call(body, 'fotoBinaria')
  );
}

function buildImagemData(body, userId) {
  const isUrl = body.isUrl !== false;
  const foto = typeof body.foto === 'string' ? body.foto.trim() : body.foto;
  const fotoBinaria = body.fotoBinaria || null;

  if (isUrl) {
    return {
      foto: foto || null,
      fotoBinaria: null,
      isUrl: true,
      userId,
    };
  }

  return {
    foto: null,
    fotoBinaria,
    isUrl: false,
    userId,
  };
}

async function createOrUpdateImagem(body, userId, imagemId) {
  if (!hasImagePayload(body)) {
    return imagemId || null;
  }

  const data = buildImagemData(body, userId);

  if (!data.foto && !data.fotoBinaria) {
    if (imagemId) {
      await Imagem.destroy({ where: { id: imagemId } });
    }

    return null;
  }

  if (imagemId) {
    const imagem = await Imagem.findByPk(imagemId);

    if (imagem) {
      await imagem.update(data);
      return imagem.id;
    }
  }

  const imagem = await Imagem.create(data);
  return imagem.id;
}

function pickJogoPayload(body) {
  const data = {
    titulo: typeof body.titulo === 'string' ? body.titulo.trim() : body.titulo,
    descricao: body.descricao,
    generoId: body.generoId ? Number(body.generoId) : body.generoId,
  };

  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
      delete data[key];
    }
  });

  return data;
}

exports.create = async (req, res) => {
  try {
    const data = pickJogoPayload(req.body);

    if (!data.titulo) {
      return res.status(400).json({ error: 'Titulo e obrigatorio.' });
    }

    const genero = await findGenero(data.generoId);

    if (!genero) {
      return res.status(400).json({ error: 'Genero invalido.' });
    }

    const imagemId = await createOrUpdateImagem(req.body, req.user.id);
    const jogo = await Jogo.create({
      ...data,
      imagemId,
      userId: req.user.id,
    });
    const savedJogo = await findJogoById(jogo.id);

    res.status(201).json(await enrichJogo(savedJogo, req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const jogos = await Jogo.findAll({
      include: jogoInclude,
      order: [['createdAt', 'DESC']],
    });

    res.json(await Promise.all(jogos.map((jogo) => enrichJogo(jogo, req.user.id))));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const jogo = await findJogoById(req.params.id);

    if (!jogo) {
      return res.status(404).json({ error: 'Jogo nao encontrado.' });
    }

    res.json(await enrichJogo(jogo, req.user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const jogo = await Jogo.findByPk(req.params.id);

    if (!jogo) {
      return res.status(404).json({ error: 'Jogo nao encontrado.' });
    }

    if (!canManageJogo(req.user, jogo)) {
      return res.status(403).json({ error: 'Apenas o dono ou admin pode editar este jogo.' });
    }

    const data = pickJogoPayload(req.body);

    if (data.generoId !== undefined) {
      const genero = await findGenero(data.generoId);

      if (!genero) {
        return res.status(400).json({ error: 'Genero invalido.' });
      }
    }

    if (data.titulo !== undefined && !data.titulo) {
      return res.status(400).json({ error: 'Titulo e obrigatorio.' });
    }

    const imagemId = await createOrUpdateImagem(req.body, req.user.id, jogo.imagemId);
    await jogo.update({
      ...data,
      imagemId,
    });

    const updatedJogo = await findJogoById(jogo.id);
    res.json(await enrichJogo(updatedJogo, req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const jogo = await Jogo.findByPk(req.params.id);

    if (!jogo) {
      return res.status(404).json({ error: 'Jogo nao encontrado.' });
    }

    if (!canManageJogo(req.user, jogo)) {
      return res.status(403).json({ error: 'Apenas o dono ou admin pode apagar este jogo.' });
    }

    const imagemId = jogo.imagemId;
    await jogo.destroy();

    if (imagemId) {
      await Imagem.destroy({ where: { id: imagemId } });
    }

    res.json({ message: 'Jogo removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComentarios = async (req, res) => {
  try {
    const jogo = await Jogo.findByPk(req.params.id);

    if (!jogo) {
      return res.status(404).json({ error: 'Jogo nao encontrado.' });
    }

    const comentarios = await Comentario.findAll({
      where: { jogoId: jogo.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nome', 'email', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createComentario = async (req, res) => {
  try {
    const texto = String(req.body.texto || '').trim();
    const jogo = await Jogo.findByPk(req.params.id);

    if (!jogo) {
      return res.status(404).json({ error: 'Jogo nao encontrado.' });
    }

    if (!texto) {
      return res.status(400).json({ error: 'Comentario nao pode ser vazio.' });
    }

    const comentario = await Comentario.create({
      texto,
      jogoId: jogo.id,
      userId: req.user.id,
    });

    const savedComentario = await Comentario.findByPk(comentario.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nome', 'email', 'role'],
        },
      ],
    });

    res.status(201).json(savedComentario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findOne({
      where: {
        id: req.params.comentarioId,
        jogoId: req.params.id,
      },
    });

    if (!comentario) {
      return res.status(404).json({ error: 'Comentario nao encontrado.' });
    }

    if (comentario.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas o autor ou admin pode editar este comentario.' });
    }

    const texto = String(req.body.texto || '').trim();

    if (!texto) {
      return res.status(400).json({ error: 'Comentario nao pode ser vazio.' });
    }

    await comentario.update({ texto });

    res.json(comentario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findOne({
      where: {
        id: req.params.comentarioId,
        jogoId: req.params.id,
      },
    });

    if (!comentario) {
      return res.status(404).json({ error: 'Comentario nao encontrado.' });
    }

    if (comentario.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Apenas o autor ou admin pode apagar este comentario.' });
    }

    await comentario.destroy();

    res.json({ message: 'Comentario removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveAvaliacao = async (req, res) => {
  try {
    const jogo = await findJogoById(req.params.id);
    const nota = Number(req.body.nota);

    if (!jogo) {
      return res.status(404).json({ error: 'Jogo nao encontrado.' });
    }

    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
      return res.status(400).json({ error: 'A avaliacao deve ser um numero entre 1 e 5.' });
    }

    const [avaliacao, created] = await Avaliacao.findOrCreate({
      where: {
        jogoId: jogo.id,
        userId: req.user.id,
      },
      defaults: {
        nota,
        jogoId: jogo.id,
        userId: req.user.id,
      },
    });

    if (!created) {
      await avaliacao.update({ nota });
    }

    const updatedJogo = await findJogoById(jogo.id);
    res.json(await enrichJogo(updatedJogo, req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAvaliacao = async (req, res) => {
  try {
    const jogo = await findJogoById(req.params.id);

    if (!jogo) {
      return res.status(404).json({ error: 'Jogo nao encontrado.' });
    }

    await Avaliacao.destroy({
      where: {
        jogoId: jogo.id,
        userId: req.user.id,
      },
    });

    const updatedJogo = await findJogoById(jogo.id);
    res.json(await enrichJogo(updatedJogo, req.user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
