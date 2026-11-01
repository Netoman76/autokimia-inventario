
/*
  Rutas de autenticación
  Sistema de Inventario Autokimia
*/

// Importamos Express
const express = require("express");

// Creamos un enrutador de Express
const router = express.Router();

// Importamos las funciones de autenticación
const {
    registrarUsuario,
    iniciarSesion
} = require("../controllers/authController");

// Ruta POST para registrar usuarios nuevos
router.post("/registro", registrarUsuario);

// Ruta POST para iniciar sesión
router.post("/login", iniciarSesion);

// Exportamos las rutas de autenticación
module.exports = router;
