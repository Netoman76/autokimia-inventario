/*
    Servicio de comunicación con el backend
    Sistema de Inventario Autokimia
*/

// Obtenemos la dirección de nuestra API
const API_URL = import.meta.env.VITE_API_URL;


// ============================================
// FUNCION 1: REALIZAR SOLICITUDES HTTP
// ============================================

async function solicitud(
    ruta,
    metodo = "GET",
    datos = null,
    token = null
) {

    // Creamos los encabezados de la solicitud
    const headers = {
        "Content-Type": "application/json"
    };

    // Agregamos el token JWT cuando sea necesario
    if (token) {

        headers.Authorization = `Bearer ${token}`;

    }

    // Configuramos la solicitud HTTP
    const opciones = {
        method: metodo,
        headers: headers
    };

    // Agregamos los datos cuando existen
    if (datos !== null) {

        opciones.body = JSON.stringify(datos);

    }

    // Enviamos la solicitud al backend
    const respuesta = await fetch(
        `${API_URL}${ruta}`,
        opciones
    );

    // Convertimos la respuesta a un objeto JavaScript
    const resultado = await respuesta.json();

    // Comprobamos si el servidor devolvió un error
    if (!respuesta.ok) {

        const error = new Error(
            resultado.mensaje || "Error en la solicitud"
        );

        error.status = respuesta.status;
        error.detalles = resultado.errores;

        throw error;

    }

    // Regresamos la información recibida
    return resultado;

}


// ============================================
// FUNCION 2: INICIAR SESION
// ============================================

export function iniciarSesion(nombre_usuario, password) {

    return solicitud(
        "/auth/login",
        "POST",
        {
            nombre_usuario,
            password
        }
    );

}


// ============================================
// FUNCION 3: CONSULTAR PRODUCTOS
// ============================================

export function obtenerProductos(token, filtros = {}) {

    // Creamos los parámetros de consulta
    const parametros = new URLSearchParams();

    // Agregamos únicamente los filtros que tienen valor
    Object.entries(filtros).forEach(([clave, valor]) => {

        if (
            valor !== "" &&
            valor !== null &&
            valor !== undefined
        ) {

            parametros.set(clave, valor);

        }

    });

    // Construimos la dirección de consulta
    const consulta = parametros.toString();

    const ruta = consulta
        ? `/productos?${consulta}`
        : "/productos";

    return solicitud(ruta, "GET", null, token);

}


// ============================================
// FUNCION 4: REGISTRAR PRODUCTO
// ============================================

export function crearProducto(token, producto) {

    return solicitud(
        "/productos",
        "POST",
        producto,
        token
    );

}


// ============================================
// FUNCION 5: ACTUALIZAR PRODUCTO
// ============================================

export function actualizarProducto(token, id, producto) {

    return solicitud(
        `/productos/${id}`,
        "PUT",
        producto,
        token
    );

}


// ============================================
// FUNCION 6: ELIMINAR PRODUCTO
// ============================================

export function eliminarProducto(token, id) {

    return solicitud(
        `/productos/${id}`,
        "DELETE",
        null,
        token
    );

}


// ============================================
// FUNCION 7: CONSULTAR TIPOS DE CAMBIO
// ============================================

export function obtenerTiposCambio(token) {

    return solicitud(
        "/monedas",
        "GET",
        null,
        token
    );

}


// ============================================
// FUNCION 8: CONSULTAR PRECIOS CONVERTIDOS
// ============================================

export function obtenerProductosConvertidos(
    token,
    moneda = "MXN"
) {

    return solicitud(
        `/monedas/productos?moneda=${encodeURIComponent(moneda)}`,
        "GET",
        null,
        token
    );

}