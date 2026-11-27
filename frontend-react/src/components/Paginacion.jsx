/*
    Componente de paginación de productos
    Sistema de Inventario Autokimia
*/

// Creamos nuestro componente de paginación
function Paginacion({
    pagina,
    limite,
    totalPaginas,
    totalProductos,
    onCambiarPagina,
    onCambiarLimite,
    cargando
}) {

    // Calculamos el primer producto mostrado
    const inicio = totalProductos === 0
        ? 0
        : (pagina - 1) * limite + 1;

    // Calculamos el último producto mostrado
    const fin = Math.min(
        pagina * limite,
        totalProductos
    );

    return (

        <section className="paginacion">

            {/* Información de los productos mostrados */}
            <p className="paginacion-informacion">

                Mostrando {inicio} - {fin} de {totalProductos} productos

            </p>

            {/* Selector de productos por página */}
            <div className="paginacion-limite">

                <label htmlFor="limite">

                    Productos por página:

                </label>

                <select
                    id="limite"
                    value={limite}
                    disabled={cargando}
                    onChange={(evento) =>
                        onCambiarLimite(
                            Number(evento.target.value)
                        )
                    }
                >

                    <option value={1}>1</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>

                </select>

            </div>

            {/* Controles de navegación */}
            <div className="paginacion-controles">

                {/* Botón para regresar */}
                <button
                    type="button"
                    className="btn-paginacion"
                    disabled={pagina <= 1 || cargando}
                    onClick={() =>
                        onCambiarPagina(pagina - 1)
                    }
                >

                    Anterior

                </button>

                {/* Mostramos la página actual */}
                <span className="paginacion-pagina">

                    Página {totalPaginas === 0 ? 0 : pagina}
                    {" "}de {totalPaginas}

                </span>

                {/* Botón para avanzar */}
                <button
                    type="button"
                    className="btn-paginacion"
                    disabled={
                        pagina >= totalPaginas || cargando
                    }
                    onClick={() =>
                        onCambiarPagina(pagina + 1)
                    }
                >

                    Siguiente

                </button>

            </div>

        </section>

    );

}

// Exportamos nuestro componente
export default Paginacion;