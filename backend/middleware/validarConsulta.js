/*
    Middleware de validación de consultas
    Sistema de Inventario Autokimia
*/

const validarConsulta = (req, res, next) => {

    // Obtenemos los parámetros enviados desde la URL
    const {
        nombre,
        precioMin,
        precioMax,
        pagina = "1",
        limite = "10"
    } = req.query;

    // Arreglo para almacenar los errores
    const errores = [];

    // Validamos el filtro por nombre
    if (
        nombre !== undefined &&
        (
            typeof nombre !== "string" ||
            nombre.trim().length > 100
        )
    ) {
        errores.push("Filtro de nombre inválido");
    }

    // Validamos los filtros de precio
    const precios = [precioMin, precioMax];

    for (const precio of precios) {

        if (
            precio !== undefined &&
            (
                typeof precio !== "string" ||
                !/^\d+(\.\d{1,2})?$/.test(precio) ||
                !Number.isFinite(Number(precio)) ||
                Number(precio) > 99999999.99
            )
        ) {
            errores.push("Filtro de precio inválido");
        }

    }

    // Validamos el rango de precios
    if (
        precioMin !== undefined &&
        precioMax !== undefined &&
        typeof precioMin === "string" &&
        typeof precioMax === "string" &&
        Number(precioMin) > Number(precioMax)
    ) {
        errores.push(
            "El precio mínimo no puede superar al máximo"
        );
    }

    // Validamos el formato de página y límite
    if (
        typeof pagina !== "string" ||
        typeof limite !== "string" ||
        !/^[0-9]+$/.test(pagina) ||
        !/^[0-9]+$/.test(limite)
    ) {
        return res.status(400).json({
            mensaje: "Parámetros de consulta inválidos",
            errores: [
                ...errores,
                "La página y el límite deben ser números enteros"
            ]
        });
    }

    // Convertimos los parámetros a números
    const paginaActual = Number(pagina);
    const limiteActual = Number(limite);

    // Validamos los rangos permitidos
    if (
        !Number.isSafeInteger(paginaActual) ||
        !Number.isSafeInteger(limiteActual) ||
        paginaActual < 1 ||
        limiteActual < 1 ||
        limiteActual > 100
    ) {
        errores.push(
            "Página o límite fuera del rango permitido"
        );
    }

    // Calculamos el desplazamiento de registros
    const offset = (paginaActual - 1) * limiteActual;

    if (!Number.isSafeInteger(offset)) {
        errores.push("Número de página demasiado grande");
    }

    // Si existen errores, rechazamos la solicitud
    if (errores.length > 0) {

        return res.status(400).json({
            mensaje: "Parámetros de consulta inválidos",
            errores: errores
        });

    }

    // Guardamos los parámetros ya validados
    req.consultaValidada = {
        nombre: nombre ? nombre.trim() : "",
        precioMin: precioMin !== undefined
            ? Number(precioMin)
            : undefined,
        precioMax: precioMax !== undefined
            ? Number(precioMax)
            : undefined,
        paginaActual,
        limiteActual,
        offset
    };

    // Permitimos continuar hacia el controlador
    next();

};

// Exportamos el middleware
module.exports = validarConsulta;