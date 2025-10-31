// models/Product.js
const mongoose = require('mongoose');

// Definimos el Schema (la estructura del producto)
const productSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'], 
        trim: true // Quita espacios en blanco al inicio y final
    },
    precio: { 
        type: Number, 
        required: [true, 'El precio es obligatorio'], 
        min: [0, 'El precio no puede ser negativo'] 
    },
    descripcion: { 
        type: String, 
        trim: true 
    },
    imagen: { 
        type: String, 
        required: [true, 'La imagen es obligatoria'] 
        // Guardaremos la RUTA al archivo (ej: /uploads/imagen-123.jpg)
    }
}, { 
    timestamps: true // Esto añade automáticamente createdAt y updatedAt
});

// Creamos el Modelo a partir del Schema y lo exportamos
module.exports = mongoose.model('Product', productSchema);