// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// 

// --- Rutas de Registro ---
// GET /register (Muestra el formulario)
router.get('/register', authController.getRegisterForm);

// POST /register (Procesa el formulario)
router.post('/register', authController.postRegister);

// --- Rutas de Login ---
// GET /login (Muestra el formulario)
router.get('/login', authController.getLoginForm);

// POST /login (Procesa el formulario)
router.post('/login', authController.postLogin);

// --- Ruta de Logout ---
// POST /logout (Cierra la sesión)
router.post('/logout', authController.postLogout);

module.exports = router;