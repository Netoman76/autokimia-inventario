/*
    Rutas de monedas
    Sistema de Inventario Autokimia
*/

// Importamos Express
const express = require("express");

// Creamos nuestro enrutador
const router = express.Router();

// Importamos el middleware de autenticación
const verificarToken = require("../middleware/verificarToken");

// Importamos el middleware de autorización
const verificarRol = require("../middleware/verificarRol");

// Importamos las funciones del controlador
const {
    consultarTiposCambio,
    consultarProductosConvertidos
} = require("../controllers/monedasController");

// ============================================
// RUTA GET: CONSULTAR TIPOS DE CAMBIO
// ============================================

router.get(
    "/",
    verificarToken,
    verificarRol("admin", "usuario"),
    consultarTiposCambio
);


// ============================================
// RUTA GET: CONSULTAR PRODUCTOS CON CONVERSION
// ============================================

router.get(
    "/productos",
    verificarToken,
    verificarRol("admin", "usuario"),
    consultarProductosConvertidos
);


// Exportamos las rutas de monedas
module.exports = router;