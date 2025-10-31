// controllers/productController.js (Versión FINAL con CRUD completo)

const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const fs = require('fs'); // File System, para borrar archivos

// --- 1. MOSTRAR el formulario para crear un nuevo producto ---
// Lógica para GET /products/new
exports.getNewProductForm = (req, res) => {
    // Renderiza la vista 'product-form.hbs'
    // Pasamos un objeto para indicar que es un formulario de 'creación' 
    res.render('product-form', { 
        title: 'Cargar Nuevo Producto',
        isEditing: false 
    });
};

// --- 2. CREAR un nuevo producto en la BD ---
// Lógica para POST /products
exports.createProduct = async (req, res) => {
    // 1. Manejar errores de validación (Tarea 8)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Si hay errores de validación, debemos borrar la imagen que se subió
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error al borrar imagen:", err);
            });
        }
        
        // Renderizamos el formulario de nuevo, pasando los errores
        return res.status(400).render('product-form', {
            title: 'Cargar Nuevo Producto',
            isEditing: false,
            // Pasamos los errores y los datos que el usuario ya había escrito
            errors: errors.array(), 
            product: { 
                nombre: req.body.nombre, 
                precio: req.body.precio, 
                descripcion: req.body.descripcion 
            }
        });
    }

    // 2. Manejar error si no se subió imagen (Tarea 6)
    if (!req.file) {
        return res.status(400).render('product-form', {
            title: 'Cargar Nuevo Producto',
            isEditing: false,
            errors: [{ msg: 'Error: La imagen es obligatoria' }],
            product: { nombre: req.body.nombre, precio: req.body.precio, descripcion: req.body.descripcion }
        });
    }

    // 3. Si todo está OK, creamos el producto
    try {
        const { nombre, precio, descripcion } = req.body;

        // Hacemos un 'replace' para que la ruta sea relativa 
        // (cambiamos a URL pública estable: /uploads/<filename>)
        // Nota: req.file.filename viene de multer y es el nombre final ya guardado.
        const imagenPath = ('/uploads/' + req.file.filename).replace(/\\/g, "/");

        const newProduct = new Product({
            nombre,
            precio,
            descripcion,
            imagen: imagenPath // Guardamos la ruta relativa (consumible por el navegador)
        });
        
        await newProduct.save(); // Guardamos en MongoDB
        res.redirect('/products'); // Redirigimos a la lista

    } catch (error) {
        // Si hay un error al guardar en la BD, también borramos la imagen
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error al borrar imagen:", err);
            });
        }
        console.error("Error al crear producto:", error);
        res.status(500).send('Error de servidor al crear producto');
    }
};

// --- 3. LISTAR todos los productos ---
// Lógica para GET /products
exports.getProducts = async (req, res) => {
    try {
        // Buscamos TODOS los productos en la BD
        const products = await Product.find().lean(); // .lean() hace que sea más rápido para Handlebars

        // Renderizamos la vista 'products.hbs' y le pasamos la lista
        res.render('products', {
            title: 'Listado de Productos',
            products: products // 'products' es el array que irá al .hbs
        });

    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send('Error de servidor');
    }
};

// --- 4. MOSTRAR el formulario para EDITAR un producto ---
// Lógica para GET /products/:id/edit
exports.getEditProductForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        // Reutilizamos la misma vista 'product-form.hbs'
        res.render('product-form', {
            title: 'Editar Producto',
            isEditing: true, // ¡Importante! Para cambiar el formulario
            product: product   // Los datos del producto
        });

    } catch (error) {
        console.error("Error al obtener producto para editar:", error);
        res.status(500).send('Error de servidor');
    }
};

// --- 5. PROCESAR la actualización de un producto ---
// Lógica para POST /products/:id/update
exports.updateProduct = async (req, res) => {
    const productId = req.params.id;

    // 1. Manejar errores de validación (Tarea 8)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('product-form', {
            title: 'Editar Producto',
            isEditing: true,
            errors: errors.array(),
            product: { ...req.body, _id: productId }
        });
    }

    try {
        const { nombre, precio, descripcion } = req.body;
        const productToUpdate = await Product.findById(productId);

        if (!productToUpdate) {
            return res.status(404).send('Producto no encontrado');
        }

        // 2. Manejar la imagen (Tarea 6)
        let imagenPath = productToUpdate.imagen; // Mantenemos la imagen antigua por defecto

        if (req.file) { // Si el usuario subió una imagen NUEVA...
            // 1. Borramos la imagen ANTIGUA del servidor
            const oldImagePath = productToUpdate.imagen.replace("/uploads/", "uploads/");
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error al borrar imagen antigua:", err);
            });
            
            // 2. Asignamos la ruta de la imagen NUEVA
            // (URL pública estable: /uploads/<filename>)
            imagenPath = ('/uploads/' + req.file.filename).replace(/\\/g, "/");
        }

        // 3. Actualizamos los datos en la BD
        productToUpdate.nombre = nombre;
        productToUpdate.precio = precio;
        productToUpdate.descripcion = descripcion;
        productToUpdate.imagen = imagenPath;
        
        await productToUpdate.save();
        res.redirect('/products'); // Redirigimos a la lista

    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).send('Error de servidor');
    }
};

// --- 6. ELIMINAR un producto ---
// Lógica para POST /products/:id/delete
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        // 1. Borrar la imagen del sistema de archivos (uploads)
        const imagePath = product.imagen.replace("/uploads/", "uploads/");
        fs.unlink(imagePath, (err) => {
            if (err) console.error("Error al borrar imagen:", err);
        });

        // 2. Borrar el producto de la base de datos
        await Product.findByIdAndDelete(productId);

        res.redirect('/products');

    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).send('Error de servidor');
    }
};

