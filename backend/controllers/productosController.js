const { prisma } = require('../config/db');

const serializeProducto = (producto) => producto ? { ...producto, _id: producto.id } : producto;

const multer = require('multer');
const shortid = require('shortid');

const configuracionMulter = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '/../../uploads/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato No válido'));
        }
    }
};

const upload = multer(configuracionMulter).single('imagen');

exports.subirArchivo = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            return res.status(400).json({ mensaje: error.message || error });
        }
        return next();
    });
};

exports.nuevoProducto = async (req, res, next) => {
    try {
        const producto = await prisma.producto.create({
            data: {
                nombre: req.body.nombre,
                precio: Number(req.body.precio) || 0,
                imagen: req.file ? req.file.filename : req.body.imagen || null
            }
        });

        res.json({ mensaje: 'Se agrego un nuevo producto', producto: serializeProducto(producto) });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.mostrarProdutos = async (req, res, next) => {
    try {
        const productos = await prisma.producto.findMany({ orderBy: { id: 'asc' } });
        res.json(productos.map(serializeProducto));
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.mostrarProduto = async (req, res, next) => {
    try {
        const producto = await prisma.producto.findUnique({
            where: { id: Number(req.params.idProducto) }
        });

        if (!producto) {
            return res.status(404).json({ mensaje: 'Ese producto no existe' });
        }

        return res.json(serializeProducto(producto));
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.actualizarProducto = async (req, res, next) => {
    try {
        const productoAnterior = await prisma.producto.findUnique({
            where: { id: Number(req.params.idProducto) }
        });

        const producto = await prisma.producto.update({
            where: { id: Number(req.params.idProducto) },
            data: {
                nombre: req.body.nombre ?? productoAnterior?.nombre,
                precio: req.body.precio !== undefined ? Number(req.body.precio) : productoAnterior?.precio,
                imagen: req.file ? req.file.filename : productoAnterior?.imagen
            }
        });

        res.json(serializeProducto(producto));
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.eliminarProducto = async (req, res, next) => {
    try {
        await prisma.producto.delete({
            where: { id: Number(req.params.idProducto) }
        });
        res.json({ mensaje: 'El Producto se ha eliminado' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.buscarProducto = async (req, res, next) => {
    try {
        const { query } = req.params;
        const productos = await prisma.producto.findMany({
            where: {
                nombre: {
                    contains: query,
                    mode: 'insensitive'
                }
            }
        });

        res.json(productos.map(serializeProducto));
    } catch (error) {
        console.error(error);
        next(error);
    }
};