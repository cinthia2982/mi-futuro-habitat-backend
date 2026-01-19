require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const perfilRoutes = require('./src/routes/perfilRoutes');
const authRoutes = require('./src/routes/authRoutes');
const ahorroRoutes = require('./src/routes/ahorroRoutes');
const proyeccionRoutes = require('./src/routes/proyeccionRoutes');
const recomendacionRoutes = require('./src/routes/recomendacionRoutes');
const logRoutes = require('./src/routes/logRoutes');

app.use('/perfil', perfilRoutes);
app.use('/auth', authRoutes);
app.use('/ahorros', ahorroRoutes);
app.use('/proyecciones', proyeccionRoutes);
app.use('/recomendaciones', recomendacionRoutes);
app.use('/logs', logRoutes);

app.get('/', (req, res) => {
  res.send('API Mi Futuro Habitat funcionando');
});
app.get('/health', (req, res) => {
  res.json({ ok: true });
});
app.listen(3001, () => {
  console.log('Servidor backend corriendo en puerto 3001');
});
