# Milnventario Express

Este es un proyecto de aplicación web full-stack para la gestión de un inventario, como parte de un ejercicio académico. La aplicación implementa un CRUD completo de productos, autenticación de usuarios y un chat en tiempo real.

---

## 🧑‍💻 Autor

* **Nombre:** = David Beltran
* **Curso/Materia:** = Aplicaciones web
* **Profesor:** = Rodrigo Trufiño

---

## 🚀 Funcionalidades Implementadas

La aplicación cumple con todos los requisitos solicitados:

* **Autenticación de Usuarios (Tarea 7):**
    * Registro de nuevos usuarios (email y contraseña).
    * Inicio de sesión (Login) y Cierre de sesión (Logout).
    * Contraseñas encriptadas en la base de datos usando `bcrypt`.
    * Manejo de sesiones con `express-session` para "recordar" al usuario.

* **Gestión de Productos (CRUD Completo - Tarea 4 y 5):**
    * **Crear:** Formulario para añadir nuevos productos al inventario.
    * **Leer:** Vista que lista todos los productos de la base de datos.
    * **Actualizar:** Formulario de edición para modificar productos existentes.
    * **Eliminar:** Funcionalidad para borrar productos.

* **Protección de Rutas (Middleware):**
    * Las rutas de Crear, Actualizar y Eliminar productos están protegidas.
    * Solo los usuarios autenticados (que han iniciado sesión) pueden acceder a estas funciones.
    * Los usuarios no autenticados son redirigidos a la página de login.

* **Carga de Imágenes (Tarea 6):**
    * Uso de `multer` para subir imágenes de productos.
    * Validación de tipo de archivo (solo imágenes) y tamaño (límite de 2MB).
    * Las imágenes se guardan en el servidor (carpeta `/uploads`) y se borran del servidor cuando el producto asociado es eliminado.

* **Validación de Formularios (Tarea 8):**
    * Uso de `express-validator` para validar los datos del lado del servidor (ej. que el nombre no esté vacío y el precio sea un número).
    * Los errores de validación se muestran de forma amigable al usuario en el formulario.

* **Chat en Tiempo Real (Tarea 10):**
    * Un módulo de chat en vivo usando `socket.io`.
    * El chat es **seguro**: solo los usuarios autenticados pueden conectarse.
    * Los mensajes muestran el email del usuario que los envía.
    * Muestra notificaciones cuando un usuario se une o abandona el chat.

* **Vistas Dinámicas (Tarea 9):**
    * Uso del motor de plantillas `Handlebars (.hbs)` para renderizar el HTML dinámicamente.
    * Un `layout` principal (`main.hbs`) que incluye una barra de navegación que cambia si el usuario está o no autenticado.

---

## 🛠️ Stack Tecnológico (Dependencias)

### Backend
* **Servidor:** Node.js, Express
* **Base de Datos:** MongoDB (conectado vía Mongoose)
* **Autenticación:** `bcrypt` (encriptado), `express-session` (manejo de sesiones)
* **Carga de Archivos:** `multer`
* **Validación:** `express-validator`
* **Tiempo Real:** `socket.io`
* **Vistas:** `express-handlebars`
* **Variables de Entorno:** `dotenv`

### Frontend
* HTML5 semántico
* CSS (estilos en línea en `main.hbs`)
* JavaScript (para el cliente de Socket.io en `chat.hbs`)

---

## 📋 Configuración y Ejecución

Sigue estos pasos para levantar el proyecto localmente:

### 1. Clonar el repositorio
(O simplemente, tener la carpeta del proyecto).

### 2. Instalar Dependencias
Para usar la pagina, abre una terminal en la raíz del proyecto y ejecuta:
```bash
npm install


# Para modo de desarrollo (se reinicia automáticamente con cambios)
nodemon app.js

# Para modo de producción
node app.js


# Tu cadena de conexión de MongoDB Atlas
MONGO_URI=mongodb+srv://<tu_usuario>:<tu_password>@tu_cluster.mongodb.net/MilnventarioDB?retryWrites=true&w=majority

# Una frase secreta larga y aleatoria para firmar las sesiones
SESSION_SECRET=aqui_va_tu_frase_secreta_para_sesiones

