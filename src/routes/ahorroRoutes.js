const express = require('express');
const router = express.Router();
const controller = require('../controllers/ahorroController');
const auth = require('../middlewares/auth');

router.get('/', auth, controller.listarMisAhorros);
router.post('/', auth, controller.crearAhorro);
router.put('/:id', auth, controller.actualizarAhorro);
router.delete('/:id', auth, controller.eliminarAhorro);

module.exports = router;
