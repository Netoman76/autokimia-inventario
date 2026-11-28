
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
router.post("/registro", (req, res, next) => {

    // Impedimos el registro público en producción
    if (process.env.NODE_ENV === "production") {

        return res.status(403).json({
            mensaje: "El registro público de usuarios está deshabilitado"
        });

    }

    // Permitimos el registro en desarrollo local
    return registrarUsuario(req, res, next);

});

// Ruta POST para iniciar sesión
router.post("/login", iniciarSesion);

// Exportamos las rutas de autenticación
module.exports = router;
