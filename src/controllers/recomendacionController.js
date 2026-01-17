const prisma = require('../prismaClient');

function reglasRecomendacion({ edad, saldoActual, cotizacion, ultimaProyeccion }) {
  const recs = [];

  if (edad < 30) recs.push('Estás en una etapa temprana: mantener cotizaciones constantes puede generar un fuerte efecto de capitalización a largo plazo.');
  if (edad >= 30 && edad < 50) recs.push('En esta etapa, pequeñas mejoras en tu ahorro mensual pueden aumentar significativamente tu saldo futuro.');
  if (edad >= 50) recs.push('Estás acercándote a la etapa de jubilación: conviene revisar estrategia de inversión y planificar escenarios de retiro.');

  if (cotizacion < 150000) recs.push('Tu cotización mensual es relativamente baja: evalúa complementar con APV o Cuenta 2 para mejorar tu pensión proyectada.');
  if (saldoActual < 2000000) recs.push('Tu saldo actual es bajo: prioriza continuidad de cotizaciones y un plan de ahorro gradual para acelerar crecimiento.');

  if (ultimaProyeccion) {
    const pension = Number(ultimaProyeccion.pensionEstimada);
    if (pension < 300000) recs.push('La pensión estimada es baja: considera aumentar ahorro voluntario y revisar horizonte/tasa esperada para mejorar el resultado.');
    else if (pension < 600000) recs.push('La pensión estimada es moderada: puedes mejorarla aumentando el aporte mensual o extendiendo años de cotización.');
    else recs.push('Tu pensión estimada es relativamente buena según los parámetros actuales; mantén constancia y revisa proyección periódicamente.');
  }

  return recs.slice(0, 6);
}

exports.generarRecomendaciones = async (req, res) => {
  try {
    const userId = Number(req.userId);

    const perfil = await prisma.perfilPrevisional.findUnique({ where: { userId } });
    if (!perfil) return res.status(404).json({ message: 'Debes crear tu perfil antes de generar recomendaciones' });

    const ultimaProyeccion = await prisma.proyeccion.findFirst({
      where: { userId },
      orderBy: { fecha: 'desc' }
    });

    const mensajes = reglasRecomendacion({
      edad: perfil.edad,
      saldoActual: perfil.saldoActual,
      cotizacion: perfil.cotizacion,
      ultimaProyeccion
    });

    const creadas = await prisma.recomendacion.createMany({
      data: mensajes.map(m => ({ mensaje: m, userId }))
    });

    return res.status(201).json({
      message: 'Recomendaciones generadas',
      total: creadas.count,
      recomendaciones: mensajes
    });
  } catch (error) {
    console.error('ERROR generarRecomendaciones:', error);
    return res.status(500).json({ message: 'Error al generar recomendaciones' });
  }
};

exports.listarMisRecomendaciones = async (req, res) => {
  try {
    const userId = Number(req.userId);

    const recomendaciones = await prisma.recomendacion.findMany({
      where: { userId },
      orderBy: { fecha: 'desc' }
    });

    return res.json(recomendaciones);
  } catch (error) {
    console.error('ERROR listarMisRecomendaciones:', error);
    return res.status(500).json({ message: 'Error al listar recomendaciones' });
  }
};
