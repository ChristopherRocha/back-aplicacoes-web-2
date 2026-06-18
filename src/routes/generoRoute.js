const express = require('express');
const router = express.Router();

const generoController = require('../controllers/generoController');
const { authenticate } = require('../middleware/authMiddleware');

// CRUD
router.post('/', authenticate, generoController.create);
router.get('/', generoController.getAll);
router.get('/:id', generoController.getById);
router.put('/:id', authenticate, generoController.update);
router.delete('/:id', authenticate, generoController.remove);

module.exports = router;
