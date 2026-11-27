/*
    Middleware centralizado para el manejo de errores
    Sistema de Inventario Autokimia
*/

// Creamos la función para gestionar los errores
const manejarErrores = (error, req, res, next) => {

    // Registramos información del error en la terminal
    console.error("================================");
    console.error("ERROR EN EL SERVIDOR");
    console.error("Fecha:", new Date().toISOString());
    console.error("Método:", req.method);
    console.error("Ruta:", req.path);
    console.error("Código:", error.code || "Sin código");
    console.error("================================");

    // Si Express ya comenzó a enviar la respuesta
    if (res.headersSent) {
        return next(error);
    }

    // Definimos una respuesta predeterminada
    let codigo = 500;
    let mensaje = "Error interno del servidor";

    // Error por un registro duplicado en MySQL
    if (error.code === "ER_DUP_ENTRY") {

        codigo = 409;
        mensaje = "El registro ya existe";

    }

    // Error de conexión con la base de datos
    else if (
        error.code === "ECONNREFUSED" ||
        error.code === "ETIMEDOUT" ||
        error.code === "PROTOCOL_CONNECTION_LOST"
    ) {

        codigo = 503;
        mensaje = "Base de datos temporalmente no disponible";

    }

    // Error por datos JSON mal escritos
    else if (error.type === "entity.parse.failed") {

        codigo = 400;
        mensaje = "El formato JSON enviado no es válido";

    }

    // Error por valores fuera del rango de MySQL
    else if (
        error.code === "ER_DATA_TOO_LONG" ||
        error.code === "ER_WARN_DATA_OUT_OF_RANGE"
    ) {

        codigo = 400;
        mensaje = "Los datos superan los límites permitidos";

    }

    // Error por tiempo de espera de la API externa
    else if (error.code === "API_TIMEOUT") {

        codigo = 504;
        mensaje = "La API externa tardó demasiado en responder";

    }

    // Error de comunicación con la API externa
    else if (error.code === "API_EXTERNA_ERROR") {

        codigo = 502;
        mensaje = "No se pudo consultar el tipo de cambio";

    }

    // Enviamos una respuesta segura al cliente
    res.status(codigo).json({
        mensaje: mensaje
    });

};

// Exportamos el middleware
module.exports = manejarErrores;