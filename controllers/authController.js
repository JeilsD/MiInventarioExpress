// controllers/authController.js
const User = require('../models/User');
const { validationResult } = require('express-validator');

// --- 1. MOSTRAR el formulario de Registro ---
exports.getRegisterForm = (req, res) => {
    res.render('auth/register', { // Usaremos una carpeta 'auth' para las vistas
        title: 'Registro de Usuario',
        errors: [],
        oldInput: {}
    });
};

// --- 2. PROCESAR el Registro ---
exports.postRegister = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    // (Aquí añadiremos validación de express-validator luego)
    // Validación simple por ahora:
    if (password !== confirmPassword) {
        return res.status(400).render('auth/register', {
            title: 'Registro de Usuario',
            errors: [{ msg: 'Las contraseñas no coinciden' }],
            oldInput: { email } // Devolvemos el email que ya escribió
        });
    }

    try {
        // Revisamos si el email ya existe
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).render('auth/register', {
                title: 'Registro de Usuario',
                errors: [{ msg: 'El email ya está en uso' }],
                oldInput: { email }
            });
        }

        // Creamos el nuevo usuario
        const user = new User({
            email,
            password // Pasamos la contraseña en texto plano
            // El 'hook' pre-save en User.js se encargará de encriptarla
        });

        await user.save(); // Aquí se encripta y guarda

        console.log('Usuario registrado:', email);
        // Redirigimos al login después del registro exitoso
        res.redirect('/login');

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).send('Error de servidor');
    }
};

// --- 3. MOSTRAR el formulario de Login ---
exports.getLoginForm = (req, res) => {
    res.render('auth/login', {
        title: 'Iniciar Sesión',
        errors: [],
        oldInput: {}
    });
};

// --- 4. PROCESAR el Login ---
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar al usuario por email
        const user = await User.findOne({ email: email });
        if (!user) {
            // No encontramos el email
            return res.status(400).render('auth/login', {
                title: 'Iniciar Sesión',
                errors: [{ msg: 'Email o contraseña incorrectos' }],
                oldInput: { email }
            });
        }

        // 2. Comparar la contraseña (usando el método que creamos en User.js)
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            // La contraseña no coincidió
            return res.status(400).render('auth/login', {
                title: 'Iniciar Sesión',
                errors: [{ msg: 'Email o contraseña incorrectos' }],
                oldInput: { email }
            });
        }

        // 3. ¡ÉXITO! Guardamos al usuario en la sesión (Tarea 7)
        req.session.isLoggedIn = true;
        req.session.user = user; // Guardamos el objeto de usuario completo

        // Nos aseguramos de que la sesión se guarde antes de redirigir
        req.session.save(err => {
            if (err) {
                console.error("Error al guardar sesión:", err);
            }
            // Redirigimos a la lista de productos
            res.redirect('/products');
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).send('Error de servidor');
    }
};

// --- 5. PROCESAR el Logout ---
exports.postLogout = (req, res) => {
    // Destruimos la sesión (Tarea 7)
    req.session.destroy(err => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
        }
        res.redirect('/'); // Redirigimos al inicio
    });
};