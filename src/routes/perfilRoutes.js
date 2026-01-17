const express = require('express');
const router = express.Router();
const controller = require('../controllers/perfilController');
const auth = require('../middlewares/auth');

// Rutas seguras (usuario autenticado)
router.get('/me', auth, controller.obtenerPerfilMe);
router.post('/me', auth, controller.crearPerfilMe);
router.put('/me', auth, controller.actualizarPerfilMe);
router.delete('/me', auth, controller.eliminarPerfilMe);

// (Opcional) Rutas antiguas (si las mantienes, mejor protegerlas o dejarlas solo para admin)
router.post('/', controller.crearPerfil);
router.get('/:userId', controller.obtenerPerfil);
router.put('/:userId', controller.actualizarPerfil);
router.delete('/:userId', controller.eliminarPerfil);

module.exports = router;


