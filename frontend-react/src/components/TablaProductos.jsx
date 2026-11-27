/*
    Componente para visualizar los productos
    Sistema de Inventario Autokimia
*/

// Recibimos las propiedades del componente
function TablaProductos({
    productos = [],
    esAdmin = false,
    moneda = "MXN",
    onEditar,
    onEliminar
}) {

    // ============================================
    // FUNCION: FORMATEAR EL PRECIO
    // ============================================

    const formatearPrecio = (precio) => {

        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: moneda
        }).format(Number(precio));

    };


    // ============================================
    // INTERFAZ GRAFICA DE LA TABLA
    // ============================================

    return (

        <section className="tabla-contenedor">

            <h2>Productos registrados</h2>

            {/* Verificamos si existen productos */}
            {productos.length === 0 ? (

                <p className="sin-productos">
                    No se encontraron productos.
                </p>

            ) : (

                <div className="tabla-responsive">

                    <table className="tabla-productos">

                        <thead>

                            <tr>

                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Cantidad</th>
                                <th>Precio ({moneda})</th>

                                {/* Solo el administrador ve las acciones */}
                                {esAdmin && (
                                    <th>Acciones</th>
                                )}

                            </tr>

                        </thead>

                        <tbody>

                            {/* Recorremos el arreglo de productos */}
                            {productos.map((producto) => (

                                <tr key={producto.id}>

                                    <td>{producto.id}</td>

                                    <td>{producto.nombre}</td>

                                    <td>{producto.descripcion}</td>

                                    <td>{producto.cantidad}</td>

                                    <td>
                                        {formatearPrecio(
                                            producto.precioConvertido
                                            ?? producto.precio
                                        )}
                                    </td>

                                    {/* Botones exclusivos del administrador */}
                                    {esAdmin && (

                                        <td>

                                            <div className="acciones-producto">

                                                <button
                                                    type="button"
                                                    className="btn-editar"
                                                    onClick={() => onEditar(producto)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn-eliminar"
                                                    onClick={() => onEliminar(producto.id)}
                                                >
                                                    Eliminar
                                                </button>

                                            </div>

                                        </td>

                                    )}

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            <p className="total-productos">
                Productos mostrados: {productos.length}
            </p>

        </section>

    );

}

// Exportamos nuestro componente
export default TablaProductos;