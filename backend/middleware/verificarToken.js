
/*
  Middleware de autenticacion JWT
  Sistema de Inventario Autokimia
*/

// Importamos la biblioteca jsonwebtoken
const jwt = require("jsonwebtoken");

// Creamos una función para verificar el token
const verificarToken = (req, res, next) => {

    // Obtenemos el encabezado Authorization
    const autorizacion = req.headers.authorization;

    // Verificamos si se recibió un token
    if (!autorizacion ||
        !autorizacion.startsWith("Bearer ")) {

        return res.status(401).json({
            mensaje: "Acceso denegado. Token requerido"
        });

    }

    // Extraemos el token eliminando la palabra Bearer
    const token = autorizacion.slice(7).trim();

    // Comprobamos que el token no esté vacío
    if (!token) {
        return res.status(401).json({
            mensaje: "Acceso denegado. Token requerido"
        });
    }

    try {

        // Verificamos la firma y vigencia del token
        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        // Guardamos los datos del usuario autenticado
        req.usuario = usuario;

        // Permitimos continuar con la solicitud
        next();

    } catch (error) {

        // Rechazamos tokens inválidos o vencidos
        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });

    }

};

// Exportamos el middleware
module.exports = verificarToken;
