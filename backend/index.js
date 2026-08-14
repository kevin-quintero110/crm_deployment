const express = require('express');
const path = require('path');
const routes = require('./routes');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { connectDB } = require('./config/db');


// cors permite que un cliente se conecte a otro servidor 
const cors = require('cors');

if (process.env.DB_URL || process.env.DATABASE_URL) {
    connectDB();
} else {
    console.warn('⚠️ DB_URL/DATABASE_URL no está definido. Define la variable de entorno para conectar a PostgreSQL/Supabase.');
}

// servidor
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta pública para "uploads", debe estar ANTES de habilitar CORS
app.use('/uploads', express.static('uploads'));

// Definir un dominio para recibir las peticiones
const whiteList = [process.env.FRONTEND_URL].filter(Boolean);
const corsOptions = {
    origin: (origin, callback) => {
        if (!whiteList.length || whiteList.some(dominio => dominio === origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};

// Habilitar CORS después de configurar archivos estáticos
app.use(cors(corsOptions));

// Rutas de la app
app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 5000;

if (require.main === module) {
    app.listen(port, host, () => {
        console.log(`Tu app está lista en http://${host}:${port}`);
    });
}

// Exportar app para entornos serverless (Vercel)
module.exports = app;