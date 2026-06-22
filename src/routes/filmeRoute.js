const express = require('express');
const router = express.Router();

const filmeController = require('../controllers/filmeController');
const { authenticate } = require('../middleware/authMiddleware');

// CRUD
router.use(authenticate);
router.post('/', filmeController.create);
router.get('/', filmeController.getAll);
router.get('/:id', filmeController.getById);
router.put('/:id', filmeController.update);
router.delete('/:id', filmeController.remove);

module.exports = router;
