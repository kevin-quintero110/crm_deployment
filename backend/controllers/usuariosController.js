const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');

exports.registrarUsuario = async (req, res) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 12);

        const usuario = await prisma.usuario.create({
            data: {
                nombre: req.body.nombre,
                email: req.body.email,
                password: passwordHash
            }
        });

        return res.json({ mensaje: 'Usuario creado correctamente', usuario: { id: usuario.id, _id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ mensaje: 'hubo un error', error: error.message });
    }
};

exports.autenticarUsuario = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        const secret = process.env.JWT_SECRET || 'LLAVESECRETA';

        if (!usuario) {
            return res.status(401).json({ mensaje: 'ese usuario no existe' });
        }

        if (!bcrypt.compareSync(password, usuario.password)) {
            return res.status(401).json({ mensaje: 'Password Incorrecto' });
        }

        const token = jwt.sign({
            email: usuario.email,
            nombre: usuario.nombre,
            id: usuario.id
        }, secret, {
            expiresIn: '1h'
        });

        return res.json({ token });
    } catch (error) {
        console.error(error);
        next(error);
    }
};