/*
    Servicio de tipos de cambio
    Sistema de Inventario Autokimia
*/

// Dirección de la API externa
const URL_API =
    "https://api.frankfurter.dev/v2/rates?base=MXN&quotes=USD,EUR";

// Función para consultar los tipos de cambio
const obtenerTiposCambio = async () => {

    try {

        // Consultamos la API externa
        const respuesta = await fetch(URL_API, {

            // Método de la solicitud
            method: "GET",

            // Solicitamos una respuesta JSON
            headers: {
                Accept: "application/json"
            },

            // Tiempo máximo de espera: 5 segundos
            signal: AbortSignal.timeout(5000)

        });

        // Comprobamos el estado de la respuesta HTTP
        if (!respuesta.ok) {
            throw new Error(
                "La API externa devolvió un error"
            );
        }

        // Convertimos la respuesta a JSON
        const datos = await respuesta.json();

        // Comprobamos que los datos sean un arreglo
        if (!Array.isArray(datos)) {
            throw new Error(
                "Formato de respuesta inválido"
            );
        }

        // Buscamos el tipo de cambio a dólares
        const dolar = datos.find(
            elemento => elemento?.quote === "USD"
        );

        // Buscamos el tipo de cambio a euros
        const euro = datos.find(
            elemento => elemento?.quote === "EUR"
        );

        // Validamos los datos recibidos
        if (
            !dolar ||
            !euro ||
            dolar.base !== "MXN" ||
            euro.base !== "MXN" ||
            !Number.isFinite(dolar.rate) ||
            !Number.isFinite(euro.rate) ||
            dolar.rate <= 0 ||
            euro.rate <= 0 ||
            typeof dolar.date !== "string" ||
            typeof euro.date !== "string"
        ) {
            throw new Error(
                "Tipos de cambio inválidos"
            );
        }

        // Regresamos los datos organizados
        return {
            monedaBase: "MXN",
            fechas: {
                USD: dolar.date,
                EUR: euro.date
            },
            tiposCambio: {
                MXN: 1,
                USD: dolar.rate,
                EUR: euro.rate
            }
        };

    } catch (error) {

        // Creamos un error para identificar fallas externas
        const errorAPI = new Error(
            "No se pudo consultar el tipo de cambio"
        );

        errorAPI.code =
            error.name === "TimeoutError"
                ? "API_TIMEOUT"
                : "API_EXTERNA_ERROR";

        // Conservamos el error original para diagnóstico
        errorAPI.cause = error;

        // Transferimos el error al controlador
        throw errorAPI;

    }

};

// Exportamos el servicio
module.exports = {
    obtenerTiposCambio
};