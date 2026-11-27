/*
    Rutas del Inventario Autokimia
    Protección de operaciones mediante JWT y roles
*/

// Importamos Express
const express = require("express");

// Creamos nuestro enrutador
const router = express.Router();

// Importamos el middleware de autenticación
const verificarToken = require("../middleware/verificarToken");

// Importamos el nuevo middleware de autorización
const verificarRol = require("../middleware/verificarRol");

// Importamos el middleware de validación de productos
const validarProducto = require("../middleware/validarProducto");

// Importamos el middleware de validación de identificadores
const validarId = require("../middleware/validarId");

// Importamos el middleware de validación de consultas
const validarConsulta = require("../middleware/validarConsulta");

// Importamos nuestras funciones CRUD
const {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require("../controllers/productosController");

// READ: administradores y usuarios pueden consultar
router.get(
    "/",
    verificarToken,
    verificarRol("admin", "usuario"),
    validarConsulta,
    obtenerProductos
);

// CREATE: solamente el administrador puede crear
router.post(
    "/",
    verificarToken,
    verificarRol("admin"),
    validarProducto,
    crearProducto
);

// UPDATE: solamente el administrador puede modificar
router.put(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    validarId,
    validarProducto,
    actualizarProducto
);

// DELETE: solamente el administrador puede eliminar
router.delete(
    "/:id",
    verificarToken,
    verificarRol("admin"),
    validarId,
    eliminarProducto
);

// Exportamos las rutas
module.exports = router;