const express = require('express');
const router = express.Router();

const generoController = require('../controllers/generoController');
const { authenticate } = require('../middleware/authMiddleware');

// CRUD
router.use(authenticate);
router.post('/', generoController.create);
router.get('/', generoController.getAll);
router.get('/:id', generoController.getById);
router.put('/:id', generoController.update);
router.delete('/:id', generoController.remove);

module.exports = router;
