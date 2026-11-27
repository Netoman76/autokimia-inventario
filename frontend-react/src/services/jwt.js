/*
    Servicio para consultar los datos del JWT
    Sistema de Inventario Autokimia
*/

// Creamos una función para leer los datos del token
export function obtenerUsuario(token) {

    try {

        // Verificamos que exista un token
        if (!token) {

            return null;

        }

        // Dividimos el JWT en sus tres partes
        const partes = token.split(".");

        // Verificamos la estructura del token
        if (partes.length !== 3) {

            return null;

        }

        // Obtenemos la sección que contiene los datos
        const payload = partes[1];

        // Convertimos Base64URL a Base64
        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        // Completamos el formato Base64
        const base64Completo = base64.padEnd(
            Math.ceil(base64.length / 4) * 4,
            "="
        );

        // Decodificamos la información del token
        const bytes = Uint8Array.from(
            atob(base64Completo),
            caracter => caracter.charCodeAt(0)
        );

        const datos = JSON.parse(
            new TextDecoder().decode(bytes)
        );

        // Verificamos la fecha de expiración
        if (
            !Number.isFinite(datos.exp) ||
            datos.exp * 1000 <= Date.now()
        ) {

            return null;

        }

        // Verificamos que el rol sea reconocido
        if (!["admin", "usuario"].includes(datos.rol)) {

            return null;

        }

        // Regresamos los datos del usuario
        return {
            id: datos.id,
            nombre_usuario: datos.nombre_usuario,
            rol: datos.rol
        };

    } catch {

        // Si el token es incorrecto, regresamos null
        return null;

    }

}