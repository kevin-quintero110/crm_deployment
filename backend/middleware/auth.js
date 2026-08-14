const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    const secret = process.env.JWT_SECRET || 'LLAVESECRETA';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = new Error('No autenticado, no hay JWT');
        error.statusCode = 401;
        return next(error);
    }

    const token = authHeader.split(' ')[1];

    try {
        jwt.verify(token, secret);
        next();
    } catch (error) {
        error.statusCode = 401;
        return next(error);
    }
};