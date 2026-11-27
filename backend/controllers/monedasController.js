/*
    Controlador de monedas
    Sistema de Inventario Autokimia
*/

// Importamos nuestro servicio de tipos de cambio
const {
    obtenerTiposCambio
} = require("../services/tipoCambioService");

// Importamos nuestra conexión a MySQL
const db = require("../config/db");

// ============================================
// FUNCION 1: CONSULTAR TIPOS DE CAMBIO
// ============================================

const consultarTiposCambio = async (req, res, next) => {

    try {

        // Consultamos los tipos de cambio de la API externa
        const datos = await obtenerTiposCambio();

        // Enviamos los resultados al cliente
        res.status(200).json({
            mensaje: "Tipos de cambio consultados correctamente",
            proveedor: "Frankfurter",
            monedaBase: datos.monedaBase,
            fechas: datos.fechas,
            tiposCambio: datos.tiposCambio
        });

    } catch (error) {

        // Enviamos el error al middleware centralizado
        next(error);

    }

};


// ============================================
// FUNCION 2: CONSULTAR PRODUCTOS CON CONVERSION
// ============================================

const consultarProductosConvertidos = async (req, res, next) => {

    try {

        // Obtenemos la moneda solicitada por el usuario
        const moneda = req.query.moneda ?? "MXN";

        // Definimos las monedas permitidas
        const monedasPermitidas = ["MXN", "USD", "EUR"];

        // Validamos la moneda recibida
        if (
            typeof moneda !== "string" ||
            !monedasPermitidas.includes(moneda)
        ) {

            return res.status(400).json({
                mensaje: "Moneda no válida. Utiliza MXN, USD o EUR"
            });

        }

        // Consultamos los productos almacenados en MySQL
        const [productos] = await db.execute(
            `SELECT id, nombre, descripcion, cantidad, precio
             FROM productos
             ORDER BY id`
        );

        // Establecemos los valores predeterminados para MXN
        let tipoCambio = 1;
        let fecha = null;

        // Consultamos Frankfurter solamente si es necesario
        if (moneda !== "MXN") {

            const datos = await obtenerTiposCambio();

            tipoCambio = datos.tiposCambio[moneda];
            fecha = datos.fechas[moneda];

        }

        // Convertimos los precios de cada producto
        const productosConvertidos = productos.map(producto => {

            // Convertimos el precio de MySQL a número
            const precioOriginal = Number(producto.precio);

            // Calculamos el precio en la moneda solicitada
            const precioConvertido = Number(
                (precioOriginal * tipoCambio).toFixed(2)
            );

            // Regresamos los datos del producto
            return {
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                cantidad: producto.cantidad,
                precioOriginal: precioOriginal,
                monedaOriginal: "MXN",
                precioConvertido: precioConvertido,
                moneda: moneda
            };

        });

        // Enviamos los resultados al cliente
        res.status(200).json({
            mensaje: "Productos consultados correctamente",
            monedaBase: "MXN",
            monedaDestino: moneda,
            tipoCambio: tipoCambio,
            fechaReferencia: fecha,
            proveedor: moneda === "MXN" ? null : "Frankfurter",
            totalProductos: productosConvertidos.length,
            productos: productosConvertidos
        });

    } catch (error) {

        // Enviamos el error al middleware centralizado
        next(error);

    }

};

// Exportamos las funciones del controlador
module.exports = {
    consultarTiposCambio,
    consultarProductosConvertidos
};