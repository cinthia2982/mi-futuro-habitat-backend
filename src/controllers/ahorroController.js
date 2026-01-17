const prisma = require('../prismaClient');

exports.listarMisAhorros = async (req, res) => {
  try {
    const userId = Number(req.userId);

    const ahorros = await prisma.instrumentoAhorro.findMany({
      where: { userId },
      orderBy: { fecha: 'desc' }
    });

    return res.json(ahorros);
  } catch (error) {
    console.error('ERROR listarMisAhorros:', error);
    return res.status(500).json({ message: 'Error al listar ahorros' });
  }
};

exports.crearAhorro = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const { tipo, monto } = req.body;

    if (!tipo || monto === undefined) {
      return res.status(400).json({ message: 'tipo y monto son obligatorios' });
    }

    const ahorro = await prisma.instrumentoAhorro.create({
      data: {
        tipo: String(tipo),
        monto: Number(monto),
        userId
      }
    });

    return res.status(201).json(ahorro);
  } catch (error) {
    console.error('ERROR crearAhorro:', error);
    return res.status(500).json({ message: 'Error al crear ahorro' });
  }
};

exports.actualizarAhorro = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const id = Number(req.params.id);
    const { tipo, monto } = req.body;

    const existe = await prisma.instrumentoAhorro.findFirst({
      where: { id, userId }
    });

    if (!existe) {
      return res.status(404).json({ message: 'Ahorro no encontrado' });
    }

    const ahorro = await prisma.instrumentoAhorro.update({
      where: { id },
      data: {
        tipo: tipo !== undefined ? String(tipo) : undefined,
        monto: monto !== undefined ? Number(monto) : undefined
      }
    });

    return res.json(ahorro);
  } catch (error) {
    console.error('ERROR actualizarAhorro:', error);
    return res.status(500).json({ message: 'Error al actualizar ahorro' });
  }
};

exports.eliminarAhorro = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const id = Number(req.params.id);

    const existe = await prisma.instrumentoAhorro.findFirst({
      where: { id, userId }
    });

    if (!existe) {
      return res.status(404).json({ message: 'Ahorro no encontrado' });
    }

    await prisma.instrumentoAhorro.delete({ where: { id } });

    return res.json({ message: 'Ahorro eliminado correctamente' });
  } catch (error) {
    console.error('ERROR eliminarAhorro:', error);
    return res.status(500).json({ message: 'Error al eliminar ahorro' });
  }
};
