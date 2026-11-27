/*
    Middleware de validación de identificadores
    Sistema de Inventario Autokimia
*/

// Creamos la función para validar el ID
const validarId = (req, res, next) => {

    // Obtenemos el ID enviado en la URL
    const id = req.params.id;

    // Convertimos el ID a un número
    const idNumero = Number(id);

    // Comprobamos que sea un número entero positivo
    if (
        !/^[0-9]+$/.test(id) ||
        !Number.isSafeInteger(idNumero) ||
        idNumero <= 0
    ) {

        // Rechazamos la solicitud si el ID es incorrecto
        return res.status(400).json({
            mensaje: "El ID debe ser un número entero positivo"
        });

    }

    // Si el ID es válido, permitimos continuar
    next();

};

// Exportamos el middleware
module.exports = validarId;