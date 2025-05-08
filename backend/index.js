const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

// cors permite que un cliente se conecte a otro servidor 
const cors = require('cors');

// conectar mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL);

// servidorr
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carpeta pública para "uploads", debe estar ANTES de habilitar CORS
app.use('/uploads', express.static('uploads'));

// Definir un dominio para recibir las peticiones
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) => {
        // Revisar si la petición viene de un servidor que está en whiteList
        const existe = whiteList.some(dominio => dominio === origin);
        if (existe || !origin) { // Permitir peticiones sin `origin` (p. ej., Postman)
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

// Puerto
//app.listen(5000, () => {
  //  console.log('Tu app está lista en http://localhost:5000');
//});

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 5000

//iniciar app
app.listen(port, host, () =>{
    console.log('el servidor esta funcionando')
})