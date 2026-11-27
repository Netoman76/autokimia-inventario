/*
    Middleware de validación de productos
    Sistema de Inventario Autokimia
*/

// Creamos la función para validar los datos
const validarProducto = (req, res, next) => {

    // Obtenemos los datos enviados por el cliente
    const {
        nombre,
        descripcion,
        cantidad,
        precio
    } = req.body || {};

    // Creamos un arreglo para almacenar los errores
    const errores = [];

    // Validamos el nombre del producto
    if (
        typeof nombre !== "string" ||
        nombre.trim() === ""
    ) {
        errores.push("El nombre del producto es obligatorio");
    }

    // Validamos la descripción, si fue proporcionada
    if (
        descripcion !== undefined &&
        typeof descripcion !== "string"
    ) {
        errores.push("La descripción debe ser texto");
    }

    // Validamos la cantidad del producto
    if (
        !Number.isInteger(cantidad) ||
        cantidad < 0
    ) {
        errores.push(
            "La cantidad debe ser un número entero mayor o igual a cero"
        );
    }

    // Validamos el precio del producto
    if (
        typeof precio !== "number" ||
        !Number.isFinite(precio) ||
        precio < 0
    ) {
        errores.push(
            "El precio debe ser un número mayor o igual a cero"
        );
    }

    // Si encontramos errores, rechazamos la solicitud
    if (errores.length > 0) {

        return res.status(400).json({
            mensaje: "Datos del producto inválidos",
            errores: errores
        });

    }

    // Si todos los datos son correctos, continuamos
    next();

};

// Exportamos el middleware
module.exports = validarProducto;