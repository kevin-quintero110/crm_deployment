const { prisma } = require('../config/db');

const serializePedido = (pedido) => pedido ? { ...pedido, _id: pedido.id } : pedido;

exports.nuevoPedido = async (req, res, next) => {
    try {
        const clienteId = Number(req.body.clienteId ?? req.params.idUsuario);
        const pedidoItems = Array.isArray(req.body.pedido) ? req.body.pedido : [];

        const pedido = await prisma.pedido.create({
            data: {
                clienteId,
                total: Number(req.body.total) || 0,
                items: {
                    create: pedidoItems.map(item => ({
                        cantidad: Number(item.cantidad) || 1,
                        productoId: Number(item.productoId || item.producto)
                    }))
                }
            },
            include: {
                cliente: true,
                items: {
                    include: { producto: true }
                }
            }
        });

        res.json({ mensaje: 'se agrego un nuevo pedido', pedido: serializePedido(pedido) });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.mostrarPedidos = async (req, res, next) => {
    try {
        const pedidos = await prisma.pedido.findMany({
            include: {
                cliente: true,
                items: {
                    include: { producto: true }
                }
            },
            orderBy: { id: 'asc' }
        });

        res.json(pedidos.map(serializePedido));
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.mostrarPedido = async (req, res, next) => {
    try {
        const pedido = await prisma.pedido.findUnique({
            where: { id: Number(req.params.idPedido) },
            include: {
                cliente: true,
                items: {
                    include: { producto: true }
                }
            }
        });

        if (!pedido) {
            return res.status(404).json({ mensaje: 'ese pedido no existe' });
        }

        return res.json(serializePedido(pedido));
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.actualizarPedido = async (req, res, next) => {
    try {
        const pedidoId = Number(req.params.idPedido);
        const items = Array.isArray(req.body.pedido) ? req.body.pedido : [];

        await prisma.pedidoItem.deleteMany({ where: { pedidoId } });

        const pedido = await prisma.pedido.update({
            where: { id: pedidoId },
            data: {
                total: req.body.total !== undefined ? Number(req.body.total) : undefined,
                clienteId: req.body.clienteId ? Number(req.body.clienteId) : undefined,
                items: {
                    create: items.map(item => ({
                        cantidad: Number(item.cantidad) || 1,
                        productoId: Number(item.productoId || item.producto)
                    }))
                }
            },
            include: {
                cliente: true,
                items: {
                    include: { producto: true }
                }
            }
        });

        res.json(serializePedido(pedido));
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.eliminarPedido = async (req, res, next) => {
    try {
        await prisma.pedido.delete({
            where: { id: Number(req.params.idPedido) }
        });
        res.json({ mensaje: 'se ha eliminado el pedido' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};