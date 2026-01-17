const express = require('express');
const router = express.Router();
const controller = require('../controllers/logController');
const auth = require('../middlewares/auth');

router.get('/', auth, controller.listarMisLogs);
router.post('/', auth, controller.crearLog);

module.exports = router;

