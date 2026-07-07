const express = require('express');
const router = express.Router();

const generoController = require('../controllers/generoController');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// CRUD
router.use(authenticate);
router.get('/', generoController.getAll);
router.get('/:id', generoController.getById);
router.post('/', requireAdmin, generoController.create);
router.put('/:id', requireAdmin, generoController.update);
router.delete('/:id', requireAdmin, generoController.remove);

module.exports = router;
