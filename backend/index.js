const express = require('express');
const path = require('path');
const cors = require('cors');
const serverless = require('serverless-http'); // <-- AÑADE ESTO

require('dotenv').config({
    path: path.resolve(__dirname, '.env')
});

const routes = require('./routes');

// Servidor
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta pública para uploads
app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'))
);

// Configuración CORS
const whiteList = [process.env.FRONTEND_URL].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (
            !origin ||
            whiteList.includes(origin)
        ) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};

app.use(cors(corsOptions));

// Rutas
app.use('/', routes());

// Configuración del servidor
const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 5000;

// Ejecutar servidor (SOLO EN LOCAL)
if (require.main === module) {
    app.listen(port, host, () => {
        console.log(`🚀 Tu app está lista en http://${host}:${port}`);
    });
}

// EXPORTAR PARA VERCEL (serverless)
module.exports = app;
module.exports.handler = serverless(app); // <-- AÑADE ESTA LÍNEA