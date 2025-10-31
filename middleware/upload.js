// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Dónde guardar los archivos
// Aseguramos que la carpeta exista (evita fallos si no está creada)
const uploadsDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // <-- mantenemos la intención de la Tarea 6
}

// 1. Dónde guardar los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Le decimos que los guarde en la carpeta 'uploads/'
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generamos un nombre único: timestamp + nombre original
        // (sanitizamos espacios para evitar rutas raras en URL)
        const safeOriginal = file.originalname.replace(/\s+/g, '_');
        cb(null, Date.now() + '-' + safeOriginal);
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
