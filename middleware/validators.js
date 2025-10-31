// middleware/validators.js
const { body, validationResult } = require('express-validator');

// Reglas de validación para crear/actualizar un producto
const productValidationRules = () => {
  return [
    // El nombre no debe estar vacío
    body('nombre')
      .notEmpty().withMessage('El nombre es obligatorio')
      .trim(), // Quita espacios

    // El precio debe ser un número y mayor a 0
    body('precio')
      .isNumeric().withMessage('El precio debe ser un número')
      .custom(value => value > 0).withMessage('El precio debe ser mayor a 0'),

    // La descripción es opcional, pero la limpiamos
    body('descripcion')
      .optional()
      .trim()
  ];
};

// Función middleware para manejar los errores de validación
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // No hay errores
  }

  // Si hay errores
  //
  return res.status(400).json({ errors: errors.array() });
};

module.exports = {
  productValidationRules,
  validate
  // 
};