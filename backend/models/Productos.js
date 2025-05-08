const mongoose = require("mongoose");
const db = require("../config/db.js"); 

const Schema = mongoose.Schema;

const productosSchema  = new Schema({
    nombre: {
        type: String,
        trim: true
    },
    precio: {
        type: Number
    },
    imagen: {
        type: String
    }
});

module.exports = mongoose.model('Productos', productosSchema)
