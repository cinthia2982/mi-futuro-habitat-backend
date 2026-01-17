const express = require('express');
const router = express.Router();
const controller = require('../controllers/recomendacionController');
const auth = require('../middlewares/auth');

router.get('/', auth, controller.listarMisRecomendaciones);
router.post('/generar', auth, controller.generarRecomendaciones);

module.exports = router;
