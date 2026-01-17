const prisma = require('../prismaClient');

exports.crearLog = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const { evento } = req.body;

    if (!evento) return res.status(400).json({ message: 'evento es obligatorio' });

    const log = await prisma.logEvento.create({
      data: { evento: String(evento), userId }
    });

    return res.status(201).json(log);
  } catch (error) {
    console.error('ERROR crearLog:', error);
    return res.status(500).json({ message: 'Error al crear log' });
  }
};

exports.listarMisLogs = async (req, res) => {
  try {
    const userId = Number(req.userId);

    const logs = await prisma.logEvento.findMany({
      where: { userId },
      orderBy: { fecha: 'desc' }
    });

    return res.json(logs);
  } catch (error) {
    console.error('ERROR listarMisLogs:', error);
    return res.status(500).json({ message: 'Error al listar logs' });
  }
};

