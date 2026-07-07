const express = require('express');
const router = express.Router();

const jogoController = require('../controllers/jogoController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/', jogoController.create);
router.get('/', jogoController.getAll);
router.get('/:id', jogoController.getById);
router.put('/:id', jogoController.update);
router.delete('/:id', jogoController.remove);

router.get('/:id/comentarios', jogoController.getComentarios);
router.post('/:id/comentarios', jogoController.createComentario);
router.put('/:id/comentarios/:comentarioId', jogoController.updateComentario);
router.delete('/:id/comentarios/:comentarioId', jogoController.deleteComentario);

router.put('/:id/avaliacao', jogoController.saveAvaliacao);
router.delete('/:id/avaliacao', jogoController.deleteAvaliacao);

module.exports = router;
