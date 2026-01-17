const prisma = require('../prismaClient');

// Crear perfil
exports.crearPerfil = async (req, res) => {
  try {
    const { edad, saldoActual, cotizacion, userId } = req.body;

    const perfil = await prisma.perfilPrevisional.create({
      data: {
        edad: Number(edad),
        saldoActual: Number(saldoActual),
        cotizacion: Number(cotizacion),
        userId: Number(userId)
      }
    });

    return res.status(201).json(perfil);

  } catch (error) {
    console.error('ERROR crearPerfil:', error);

    // userId duplicado (perfil ya existe)
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: 'Ya existe un perfil para este usuario'
      });
    }

    return res.status(500).json({
      message: 'Error al crear perfil'
    });
  }
};

// Obtener perfil por userId
exports.obtenerPerfil = async (req, res) => {
  try {
    const { userId } = req.params;

    const perfil = await prisma.perfilPrevisional.findUnique({
      where: { userId: Number(userId) }
    });

    if (!perfil) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    return res.json(perfil);
  } catch (error) {
    console.error('ERROR obtenerPerfil:', error);
    return res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar perfil
exports.actualizarPerfil = async (req, res) => {
  try {
    const { userId } = req.params;
    const { edad, saldoActual, cotizacion } = req.body;

    const perfil = await prisma.perfilPrevisional.update({
      where: { userId: Number(userId) },
      data: { edad, saldoActual, cotizacion }
    });

    res.json(perfil);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

// Eliminar perfil
exports.eliminarPerfil = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.perfilPrevisional.delete({
      where: { userId: Number(userId) }
    });

    res.json({ message: 'Perfil eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar perfil' });
  }
};

// Obtener perfil del usuario autenticado (por token)
exports.obtenerPerfilMe = async (req, res) => {
  try {
    const userId = req.userId;

    const perfil = await prisma.perfilPrevisional.findUnique({
      where: { userId: Number(userId) }
    });

    if (!perfil) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    return res.json(perfil);
  } catch (error) {
    console.error('ERROR obtenerPerfilMe:', error);
    return res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Crear perfil del usuario autenticado
exports.crearPerfilMe = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const { edad, saldoActual, cotizacion } = req.body;

    const perfil = await prisma.perfilPrevisional.create({
      data: {
        edad: Number(edad),
        saldoActual: Number(saldoActual),
        cotizacion: Number(cotizacion),
        userId
      }
    });

    return res.status(201).json(perfil);
  } catch (error) {
    console.error('ERROR crearPerfilMe:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Ya existe un perfil para este usuario' });
    }

    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'El usuario no existe' });
    }

    return res.status(500).json({ message: 'Error al crear perfil' });
  }
};

// Actualizar perfil del usuario autenticado
exports.actualizarPerfilMe = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const { edad, saldoActual, cotizacion } = req.body;

    const perfil = await prisma.perfilPrevisional.update({
      where: { userId },
      data: {
        edad: Number(edad),
        saldoActual: Number(saldoActual),
        cotizacion: Number(cotizacion),
      }
    });

    return res.json(perfil);
  } catch (error) {
    console.error('ERROR actualizarPerfilMe:', error);

    // Prisma: registro no existe
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    return res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

// Eliminar perfil del usuario autenticado
exports.eliminarPerfilMe = async (req, res) => {
  try {
    const userId = Number(req.userId);

    await prisma.perfilPrevisional.delete({
      where: { userId }
    });

    return res.json({ message: 'Perfil eliminado correctamente' });
  } catch (error) {
    console.error('ERROR eliminarPerfilMe:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    return res.status(500).json({ message: 'Error al eliminar perfil' });
  }
};

