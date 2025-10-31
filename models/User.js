// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Importamos bcrypt (Tarea 7)

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true, // No pueden existir dos usuarios con el mismo email
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    }
}, { timestamps: true }); // Añade createdAt y updatedAt

// --- Hook de Mongoose (Middleware) ---
// Esto se ejecuta AUTOMÁTICAMENTE antes de que un usuario sea guardado ('save')
userSchema.pre('save', async function(next) {
    // 'this' se refiere al documento (usuario) que se va a guardar
    
    // Si la contraseña no ha sido modificada, no la volvemos a encriptar
    if (!this.isModified('password')) {
        return next();
    }

    // Si la contraseña es nueva o se modificó, la encriptamos
    try {
        // Generamos un 'salt' (aleatoriedad) y encriptamos
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// --- Método de instancia ---
// Añadimos una función a cada usuario para comparar contraseñas
userSchema.methods.comparePassword = function(candidatePassword) {
    // 'this.password' es la contraseña encriptada en la BD
    // 'candidatePassword' es la que el usuario escribe en el login
    return bcrypt.compare(candidatePassword, this.password);
};

// Exportamos el modelo
module.exports = mongoose.model('User', userSchema);