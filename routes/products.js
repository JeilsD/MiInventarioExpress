// routes/products.js (Versión FINAL con Rutas Protegidas)
const express = require('express');
const router = express.Router();

// --- 1. Importaciones ---
const productController = require('../controllers/productController');
const upload = require('../middleware/upload'); // Tarea 6 (Imágenes)
const { productValidationRules } = require('../middleware/validators'); // Tarea 8 (Validación)
const isAuth = require('../middleware/isAuth'); // <-- AÑADIDO: Importa el "guardia"

// --- 2. Definición de Rutas ---

// GET /products/ (Listar)
// Esta ruta es PÚBLICA. Cualquiera puede ver los productos.
router.get('/', productController.getProducts);

// GET /products/new (Mostrar formulario de crear)
// Esta ruta es PRIVADA.
router.get('/new', isAuth, productController.getNewProductForm); // <-- AÑADIDO 'isAuth'

// POST /products/ (Procesar creación)
// Esta ruta es PRIVADA.
router.post(
    '/',
    isAuth, // <-- AÑADIDO 'isAuth'
    upload.single('imagen'),    
    productValidationRules(),   
    productController.createProduct 
);

// GET /products/:id/edit
// Esta ruta es PRIVADA.
router.get('/:id/edit', isAuth, productController.getEditProductForm); // <-- AÑADIDO 'isAuth'

// POST /products/:id/update
// Esta ruta es PRIVADA.
router.post(
    '/:id/update',
    isAuth, // <-- AÑADIDO 'isAuth'
    upload.single('imagen'),    
    productValidationRules(),   
    productController.updateProduct
);

// POST /products/:id/delete
// Esta ruta es PRIVADA.
router.post('/:id/delete', isAuth, productController.deleteProduct); // <-- AÑADIDO 'isAuth'

// --- FIN ---

module.exports = router;