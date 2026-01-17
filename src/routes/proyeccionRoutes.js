const express = require('express');
const router = express.Router();
const controller = require('../controllers/proyeccionController');
const auth = require('../middlewares/auth');

// crear proyección y guardarla
router.post('/', auth, controller.crearProyeccion);

// listar mis proyecciones
router.get('/', auth, controller.listarMisProyecciones);

// eliminar una proyección por id
router.delete('/:id', auth, controller.eliminarProyeccion);

module.exports = router;

