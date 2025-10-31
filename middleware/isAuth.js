// middleware/isAuth.js

module.exports = (req, res, next) => {
    // Verificamos la variable que creamos en el login
    if (!req.session.isLoggedIn) {
        // Si el usuario no está autenticado, lo redirigimos
        return res.redirect('/login');
    }
    
    // Si está autenticado, le permitimos continuar
    next();
};