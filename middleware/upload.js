// middleware/upload.js
const multer = require('multer');
const path = require('path');

// 1. Dónde guardar los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Le decimos que los guarde en la carpeta 'uploads/'
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        // Generamos un nombre único: timestamp + nombre original// middleware/upload.js
const multer = require('multer');
const path = require('path');

// 1. Dónde guardar los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Le decimos que los guarde en la carpeta 'uploads/'
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        // Generamos un nombre único: timestamp + nombre original
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// 2. Filtro de archivos (Validación de tipo y tamaño - Tarea 6)
const fileFilter = (req, file, cb) => {
    // Validar tipo de archivo (solo imágenes)
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    // Si no es una imagen, rechazamos el archivo
    cb(new Error('Error: Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'));
};

// 3. Exportar la configuración de Multer
module.exports = multer({
    storage: storage,
    limits: { 
        fileSize: 2 * 1024 * 1024 // Límite de 2MB (como pide la Tarea 6)
    },
    fileFilter: fileFilter
});
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// 2. Filtro de archivos (Validación de tipo y tamaño - Tarea 6)
const fileFilter = (req, file, cb) => {
    // Validar tipo de archivo (solo imágenes)
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    // Si no es una imagen, rechazamos el archivo
    cb(new Error('Error: Solo se permiten archivos de imagen (jpeg, jpg, png, gif)'));
};

// 3. Exportar la configuración de Multer
module.exports = multer({
    storage: storage,
    limits: { 
        fileSize: 2 * 1024 * 1024 // Límite de 2MB (como pide la Tarea 6)
    },
    fileFilter: fileFilter
});