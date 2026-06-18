const express = require('express');
const router = express.Router();

const filmeController = require('../controllers/filmeController');
const { authenticate } = require('../middleware/authMiddleware');

// CRUD
router.post('/', authenticate, filmeController.create);
router.get('/', filmeController.getAll);
router.get('/:id', filmeController.getById);
router.put('/:id', authenticate, filmeController.update);
router.delete('/:id', authenticate, filmeController.remove);

module.exports = router;
