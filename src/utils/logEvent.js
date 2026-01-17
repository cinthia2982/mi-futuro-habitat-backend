const prisma = require('../prismaClient');

async function logEvent(userId, evento) {
  try {
    if (!userId || !evento) return;

    await prisma.logEvento.create({
      data: {
        userId: Number(userId),
        evento: String(evento)
      }
    });
  } catch (error) {
    // Importante: no romper la ejecución principal por un error de log
    console.error('ERROR logEvent:', error.message);
  }
}

module.exports = { logEvent };

