const { prisma } = require('../config/db');

const serializeCliente = (cliente) => cliente ? { ...cliente, _id: cliente.id } : cliente;

exports.nuevoCliente = async (req, res, next) => {
  try {
    const cliente = await prisma.cliente.create({
      data: {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        empresa: req.body.empresa,
        email: req.body.email,
        telefono: req.body.telefono
      }
    });

    res.json({ mensaje: 'se agrego un nuevo cliente', cliente: serializeCliente(cliente) });
  } catch (error) {
    console.error(error);
    res.status(400).json({ mensaje: 'Error al crear cliente', error: error.message });
    next(error);
  }
};

exports.mostrarClientes = async (req, res, next) => {
  try {
    const clientes = await prisma.cliente.findMany({ orderBy: { id: 'asc' } });
    res.json(clientes.map(serializeCliente));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.mostrarCliente = async (req, res, next) => {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(req.params.idCliente) }
    });

    if (!cliente) {
      return res.status(404).json({ mensaje: 'Ese cliente no existe' });
    }

    return res.json(serializeCliente(cliente));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.actualizarCliente = async (req, res, next) => {
  try {
    const cliente = await prisma.cliente.update({
      where: { id: Number(req.params.idCliente) },
      data: req.body
    });

    res.json(serializeCliente(cliente));
  } catch (error) {
    console.error(error);
    res.status(400).json({ mensaje: 'Error al actualizar cliente', error: error.message });
    next(error);
  }
};

exports.eliminarCliente = async (req, res, next) => {
  try {
    await prisma.cliente.delete({
      where: { id: Number(req.params.idCliente) }
    });

    res.json({ mensaje: 'El cliente se ha eliminado' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};