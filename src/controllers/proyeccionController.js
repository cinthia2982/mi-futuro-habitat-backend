const prisma = require('../prismaClient');

function calcularFV(S0, A, tasaAnual, anios) {
  const r = Number(tasaAnual) / 12;
  const n = Number(anios) * 12;

  // si r = 0, evitar división por cero
  if (r === 0) {
    return S0 + (A * n);
  }

  const factor = Math.pow(1 + r, n);
  const fv = (S0 * factor) + (A * ((factor - 1) / r));
  return fv;
}

exports.crearProyeccion = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const { tasaAnual, anios } = req.body;

    if (tasaAnual === undefined || anios === undefined) {
      return res.status(400).json({ message: 'tasaAnual y anios son obligatorios' });
    }

    // 1) traer perfil
    const perfil = await prisma.perfilPrevisional.findUnique({
      where: { userId }
    });

    if (!perfil) {
      return res.status(404).json({ message: 'Debes crear tu perfil antes de proyectar' });
    }

    const S0 = Number(perfil.saldoActual);
    const A = Number(perfil.cotizacion);

    // 2) calcular
    const saldoFuturo = calcularFV(S0, A, Number(tasaAnual), Number(anios));

    // pensión simple (20 años)
    const pensionEstimada = saldoFuturo / (20 * 12);

    // 3) guardar proyección
    const proyeccion = await prisma.proyeccion.create({
      data: {
        saldoFuturo,
        pensionEstimada,
        userId
      }
    });

    return res.status(201).json({
      ...proyeccion,
      inputs: { tasaAnual: Number(tasaAnual), anios: Number(anios) },
      usados: { saldoActual: S0, cotizacionMensual: A }
    });
  } catch (error) {
    console.error('ERROR crearProyeccion:', error);
    return res.status(500).json({ message: 'Error al crear proyección' });
  }
};

exports.listarMisProyecciones = async (req, res) => {
  try {
    const userId = Number(req.userId);

    const proyecciones = await prisma.proyeccion.findMany({
      where: { userId },
      orderBy: { fecha: 'desc' }
    });

    return res.json(proyecciones);
  } catch (error) {
    console.error('ERROR listarMisProyecciones:', error);
    return res.status(500).json({ message: 'Error al listar proyecciones' });
  }
};

exports.eliminarProyeccion = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const id = Number(req.params.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // Solo elimina si la proyección pertenece al usuario autenticado
    const deleted = await prisma.proyeccion.deleteMany({
      where: { id, userId }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: 'Proyección no encontrada' });
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error('ERROR eliminarProyeccion:', error);
    return res.status(500).json({ message: 'Error al eliminar proyección' });
  }
};

