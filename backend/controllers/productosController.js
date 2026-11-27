
/*
  Controlador de productos
  Sistema de Inventario Autokimia
*/

// Importamos nuestra conexión a MySQL
const db = require("../config/db");


// ==========================================
// FUNCIÓN 1: CONSULTAR PRODUCTOS (READ)
// ==========================================

const obtenerProductos = async (req, res, next) => {

    try {

        // Recuperamos los parámetros validados por el middleware
        const {
            nombre,
            precioMin,
            precioMax,
            paginaActual,
            limiteActual,
            offset
        } = req.consultaValidada;

        // Creamos las condiciones iniciales de búsqueda
        let condiciones = " WHERE 1 = 1";

        // Arreglo para almacenar los parámetros
        const parametros = [];

        // Agregamos el filtro por nombre
        if (nombre) {

            condiciones += " AND nombre LIKE ?";
            parametros.push(`%${nombre}%`);

        }

        // Agregamos el filtro por precio mínimo
        if (precioMin !== undefined) {

            condiciones += " AND precio >= ?";
            parametros.push(precioMin);

        }

        // Agregamos el filtro por precio máximo
        if (precioMax !== undefined) {

            condiciones += " AND precio <= ?";
            parametros.push(precioMax);

        }

        // Contamos los productos que coinciden con los filtros
        const sqlTotal =
            "SELECT COUNT(*) AS total FROM productos" +
            condiciones;

        const [resultadoTotal] = await db.execute(
            sqlTotal,
            parametros
        );

        // Obtenemos el total de productos
        const totalProductos = Number(resultadoTotal[0].total);

        // Calculamos el total de páginas
        const totalPaginas = Math.ceil(
            totalProductos / limiteActual
        );

        // Construimos la consulta con paginación
        const sql =
            "SELECT * FROM productos" +
            condiciones +
            " ORDER BY id ASC LIMIT ? OFFSET ?";

        // Agregamos los parámetros de paginación
        const parametrosPaginacion = [
            ...parametros,
            limiteActual,
            offset
        ];

        // Ejecutamos la consulta en MySQL
        const [productos] = await db.execute(
            sql,
            parametrosPaginacion
        );

        // Enviamos los resultados al cliente
        res.json({
            pagina: paginaActual,
            limite: limiteActual,
            totalProductos: totalProductos,
            totalPaginas: totalPaginas,
            productos: productos
        });

        } catch (error) {

        // Enviamos el error al middleware centralizado
        next(error);

        }

};


// ==========================================
// FUNCIÓN 2: REGISTRAR PRODUCTO (CREATE)
// ==========================================

const crearProducto = async (req, res, next) => {

    try {

        // Recibimos los datos del producto
        const {
            nombre,
            descripcion = "",
            cantidad,
            precio
        } = req.body;

        // Validamos la información recibida
        if (
            typeof nombre !== "string" ||
            !nombre.trim() ||
            !Number.isInteger(cantidad) ||
            cantidad < 0 ||
            typeof precio !== "number" ||
            !Number.isFinite(precio) ||
            precio < 0 ||
            typeof descripcion !== "string"
        ) {

            return res.status(400).json({
                mensaje: "Revisa los datos del producto"
            });

        }

        // Preparamos la consulta SQL
        const sql = `
            INSERT INTO productos
            (nombre, descripcion, cantidad, precio)
            VALUES (?, ?, ?, ?)
        `;

        // Guardamos los datos en MySQL
        const [resultado] = await db.execute(sql, [
            nombre.trim(),
            descripcion,
            cantidad,
            precio
        ]);

        // Confirmamos que el producto fue registrado
        res.status(201).json({
            mensaje: "Producto registrado correctamente",
            id: resultado.insertId
        });

    } catch (error) {

    // Enviamos el error al middleware centralizado
    next(error);

    }

};


/*===========================================================
  FUNCIÓN 3: ACTUALIZAR PRODUCTOS (UPDATE)
  Modifica un producto existente en MySQL
  ===========================================================
*/

const actualizarProducto = async (req, res, next) => {

    try {

        // Obtenemos el ID del producto desde la URL
        const id = Number(req.params.id);

        // Recibimos los nuevos datos del producto
        const {
            nombre,
            descripcion = "",
            cantidad,
            precio
        } = req.body;

        // Verificamos que el ID y los datos sean válidos
        if (
            !Number.isSafeInteger(id) ||
            id <= 0 ||
            typeof nombre !== "string" ||
            !nombre.trim() ||
            typeof descripcion !== "string" ||
            !Number.isInteger(cantidad) ||
            cantidad < 0 ||
            typeof precio !== "number" ||
            !Number.isFinite(precio) ||
            precio < 0
        ) {

            return res.status(400).json({
                mensaje: "Revisa los datos del producto"
            });

        }

        // Preparamos la consulta SQL para modificar el producto
        const sql = `
            UPDATE productos
            SET nombre = ?,
                descripcion = ?,
                cantidad = ?,
                precio = ?
            WHERE id = ?
        `;

        // Ejecutamos la actualización en MySQL
        const [resultado] = await db.execute(sql, [
            nombre.trim(),
            descripcion,
            cantidad,
            precio,
            id
        ]);

        // Comprobamos si el producto existe
        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }

        // Confirmamos que el producto fue actualizado
        res.json({
            mensaje: "Producto actualizado correctamente",
            id: id
        });

        } catch (error) {

           // Enviamos el error al middleware centralizado
           next(error);

        }

};


/*==============================================================================
  FUNCIÓN 4: ELIMINAR PRODUCTOS (DELETE)
  Elimina un producto de MySQL utilizando su ID.
  =========================================================================================
*/

const eliminarProducto = async (req, res, next) => {

    try {

        // Obtenemos el ID del producto desde la URL
        const id = Number(req.params.id);

        // Verificamos que el ID sea válido
        if (!Number.isSafeInteger(id) || id <= 0) {

            return res.status(400).json({
                mensaje: "El ID del producto no es válido"
            });

        }

        // Preparamos la consulta SQL para eliminar
        const sql = "DELETE FROM productos WHERE id = ?";

        // Ejecutamos la consulta en MySQL
        const [resultado] = await db.execute(sql, [id]);

        // Verificamos si se encontró el producto
        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }

        // Confirmamos que el producto fue eliminado
        res.json({
            mensaje: "Producto eliminado correctamente",
            id: id
        });

    } catch (error) {

    // Enviamos el error al middleware centralizado
    next(error);

    }

};






// ==========================================
// EXPORTAMOS NUESTRAS CUATRO FUNCIONES
// ==========================================


// Exportamos las cuatro funciones CRUD
module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
