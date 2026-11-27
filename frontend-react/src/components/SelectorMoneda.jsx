/*
    Componente para seleccionar la moneda
    Sistema de Inventario Autokimia
*/

// Recibimos las propiedades del componente
function SelectorMoneda({
    moneda = "MXN",
    tiposCambio = null,
    fechas = null,
    cargando = false,
    onCambiarMoneda
}) {

    // Obtenemos el tipo de cambio de la moneda seleccionada
    const tipoCambio = moneda === "MXN"
        ? 1
        : tiposCambio?.[moneda];

    // Obtenemos la fecha de referencia
    const fecha = fechas?.[moneda];

    // ============================================
    // INTERFAZ GRAFICA DEL SELECTOR DE MONEDAS
    // ============================================

    return (

        <section className="selector-moneda">

            <h2>Moneda de visualización</h2>

            <div className="selector-moneda-contenido">

                {/* Selector de monedas */}
                <div className="campo-moneda">

                    <label htmlFor="moneda">

                        Selecciona la moneda

                    </label>

                    <select
                        id="moneda"
                        value={moneda}
                        onChange={(e) =>
                            onCambiarMoneda(e.target.value)
                        }
                        disabled={cargando}
                    >

                        <option value="MXN">
                            Peso mexicano (MXN)
                        </option>

                        <option value="USD">
                            Dólar estadounidense (USD)
                        </option>

                        <option value="EUR">
                            Euro (EUR)
                        </option>

                    </select>

                </div>

                {/* Información del tipo de cambio */}
                <div className="informacion-moneda">

                    {cargando ? (

                        <p>
                            Consultando tipos de cambio...
                        </p>

                    ) : (

                        <>

                            <p>
                                Moneda seleccionada:
                                <strong> {moneda}</strong>
                            </p>

                            {tipoCambio !== undefined && (

                                <p>
                                    Tipo de cambio:
                                    <strong>
                                        {" "}1 MXN = {tipoCambio} {moneda}
                                    </strong>
                                </p>

                            )}

                            {moneda !== "MXN" && fecha && (

                                <p>
                                    Fecha de referencia: {fecha}
                                </p>

                            )}

                            {moneda !== "MXN" && (

                                <p>
                                    Proveedor: Frankfurter
                                </p>

                            )}

                        </>

                    )}

                </div>

            </div>

            <p className="nota-moneda">

                Los precios originales se almacenan en pesos
                mexicanos. La conversión es únicamente para
                efectos de visualización.

            </p>

        </section>

    );

}

// Exportamos nuestro componente
export default SelectorMoneda;
