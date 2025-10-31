// app.js 

// --- 1. Importaciones ---
require('dotenv').config(); // Para cargar variables de entorno 
const express = require('express');
const { create } = require('express-handlebars'); // Motor de plantillas (Tarea 9)
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session'); // Importa express-session
const http = require('http'); // <-- 1. AÑADIDO: Módulo http de Node
const { Server } = require("socket.io"); // <-- 2. AÑADIDO: Socket.io

// Importar rutas
const productRoutes = require('./routes/products'); // Importa el enrutador de productos
const authRoutes = require('./routes/auth'); // Importa el enrutador de auth
const isAuth = require('./middleware/isAuth'); // <-- 3. AÑADIDO: Para proteger el chat

// --- 2. Inicialización ---
const app = express();
const server = http.createServer(app); // <-- 4. CAMBIADO: Creamos servidor http CON app
const io = new Server(server); // <-- 5. AÑADIDO: Inicializamos Socket.io

// --- 3. Configuración de Middlewares ---
app.use(express.json()); // Permite al servidor entender JSON
app.use(express.urlencoded({ extended: true })); // Permite al servidor entender datos de formularios
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos (CSS, JS del cliente)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Hace la carpeta 'uploads' accesible (Tarea 6)
// Nota: esta línea es clave para que <img src="/uploads/..."> funcione en el navegador.

// --- Configuración de Sesión (Tarea 7) ---
// La movemos a una variable para poder compartirla con Socket.io
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'unsecretoSuperDificil', // Secreto para firmar la cookie
    resave: false, // No vuelve a guardar si no hay cambios
    saveUninitialized: false, // No guarda sesiones vacías
});

app.use(sessionMiddleware); // Express usa la sesión

// --- AÑADIDO: Compartir sesión con Socket.io (Tarea 10) ---
io.engine.use(sessionMiddleware); 
// --- FIN DE LO AÑADIDO ---

// --- Middleware Global para Vistas ---
// Esto pasa variables a TODAS las plantillas Handlebars
app.use((req, res, next) => {
    // res.locals son variables disponibles en todas las vistas
    res.locals.isAuthenticated = req.session.isLoggedIn; // true o undefined
    res.locals.userEmail = req.session.user ? req.session.user.email : null;
    next();
});
// --- FIN DE LO AÑADIDO ---

// --- 4. Configuración de Handlebars (Tarea 9) ---
const hbs = create({
    extname: '.hbs', // Usaremos la extensión .hbs para los archivos
    defaultLayout: 'main', // Plantilla principal por defecto
    layoutsDir: path.join(__dirname, 'views/layouts') // Dónde buscar las plantillas
});

app.engine('.hbs', hbs.engine); // Registra el motor de plantillas
app.set('view engine', '.hbs'); // Establece Handlebars como motor de vistas
app.set('views', path.join(__dirname, 'views')); // Dónde están las vistas

// --- 5. Conexión a MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Base de datos conectada 👍')) 
  .catch(err => {
    // Esto mostrará el error si falla
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('Error de conexión a DB:', err.message);
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  });

// --- 6. Rutas ---
app.get('/', (req, res) => { 
    // Renderiza la vista 'home.hbs' 
    res.render('home', { title: 'Inicio' }); 
});

// --- AÑADIDO: Ruta para la vista del chat (Tarea 10) ---
app.get('/chat', isAuth, (req, res) => {
    res.render('chat', { title: 'Chat en Vivo' });
});
// --- FIN DE LO AÑADIDO ---

// Le decimos a Express que use el enrutador de productos
// para todas las URLs que comiencen con '/products'
app.use('/products', productRoutes); //  Usa el enrutador de productos

// Usa el enrutador de autenticación
app.use('/', authRoutes); // Usa las rutas de /login, /register, /logout

// --- 7. Lógica de Socket.io (Tarea 10) ---
io.on('connection', (socket) => {
    // Verificamos si el usuario del socket está autenticado
    const session = socket.request.session;
    if (!session || !session.isLoggedIn) {
        console.log('Usuario de socket no autenticado. Desconectando.');
        socket.disconnect(true); // Desconecta al usuario
        return;
    }

    const userEmail = session.user.email;
    console.log(`Usuario conectado al chat: ${userEmail}`);

    // Notificamos a todos (incluido el remitente) que se unió un usuario
    io.emit('chatMessage', { 
        user: 'Sistema', 
        message: `${userEmail} se ha unido al chat.`
    });

    // Escuchamos por mensajes del cliente ('chatMessage')
    socket.on('chatMessage', (msg) => {
        // Cuando recibimos un mensaje (msg), lo re-transmitimos a TODOS
        io.emit('chatMessage', {
            user: userEmail,
            message: msg // msg ya es el texto del mensaje
        });
    });

    // Manejamos la desconexión
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${userEmail}`);
        if (userEmail) { // Nos aseguramos que el usuario existía
            io.emit('chatMessage', {
                user: 'Sistema',
                message: `${userEmail} ha abandonado el chat.`
            });
        }
    });
});
// --- FIN DE LÓGICA DE SOCKET.IO ---

// --- 8. Iniciar Servidor (era 7) ---
const PORT = process.env.PORT || 3000;
// --- CAMBIADO: Usamos 'server.listen' en lugar de 'app.listen' ---
server.listen(PORT, () => {
    console.log(`Servidor (y Socket.io) corriendo en http://localhost:${PORT}`);
});
