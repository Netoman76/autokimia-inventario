
/*
  Rutas del Inventario Autokimia
  Proteccion de operaciones mediante JWT
*/

// Importamos Express
const express = require("express");

// Creamos nuestro enrutador
const router = express.Router();

// Importamos el middleware para verificar tokens
const verificarToken = require("../middleware/verificarToken");

// Importamos nuestras funciones CRUD
const {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require("../controllers/productosController");

// READ: cualquier usuario puede consultar productos
router.get("/", obtenerProductos);

// CREATE: requiere un token JWT valido
router.post("/", verificarToken, crearProducto);

// UPDATE: requiere un token JWT valido
router.put("/:id", verificarToken, actualizarProducto);

// DELETE: requiere un token JWT valido
router.delete("/:id", verificarToken, eliminarProducto);

// Exportamos las rutas
module.exports = router;
