/*
    Componente de filtros de búsqueda
    Sistema de Inventario Autokimia
*/

// Importamos el Hook useState de React
import { useState } from "react";


// Creamos el componente de filtros
function FiltrosProductos({
    onBuscar,
    onLimpiar,
    cargando = false
}) {

    // Estados para almacenar los filtros
    const [nombre, setNombre] = useState("");
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");

    // Estado para mostrar errores de validación
    const [error, setError] = useState("");


    // ==========================================
    // FUNCION 1: BUSCAR PRODUCTOS
    // ==========================================

    const buscarProductos = (evento) => {

        // Evitamos que se recargue la página
        evento.preventDefault();

        // Limpiamos los errores anteriores
        setError("");

        // Validamos el rango de precios
        if (
            precioMin !== "" &&
            precioMax !== "" &&
            Number(precioMin) > Number(precioMax)
        ) {

            setError(
                "El precio mínimo no puede ser mayor al máximo"
            );

            return;

        }

        // Enviamos los filtros al componente padre
        onBuscar({
            nombre: nombre.trim(),
            precioMin: precioMin,
            precioMax: precioMax
        });

    };


    // ==========================================
    // FUNCION 2: LIMPIAR FILTROS
    // ==========================================

    const limpiarFiltros = () => {

        // Restablecemos los campos del formulario
        setNombre("");
        setPrecioMin("");
        setPrecioMax("");
        setError("");

        // Notificamos al componente padre
        onLimpiar();

    };


    // ==========================================
    // INTERFAZ GRAFICA
    // ==========================================

    return (

        <section className="filtros-productos">

            <h2>Buscar productos</h2>

            <form onSubmit={buscarProductos}>

                {/* Filtro por nombre */}

                <div className="campo-filtro">

                    <label htmlFor="filtroNombre">
                        Nombre del producto
                    </label>

                    <input
                        id="filtroNombre"
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={nombre}
                        maxLength={100}
                        onChange={(evento) =>
                            setNombre(evento.target.value)
                        }
                    />

                </div>


                {/* Filtros por precio */}

                <div className="filtros-precios">

                    <div className="campo-filtro">

                        <label htmlFor="precioMin">
                            Precio mínimo (MXN)
                        </label>

                        <input
                            id="precioMin"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={precioMin}
                            onChange={(evento) =>
                                setPrecioMin(evento.target.value)
                            }
                        />

                    </div>


                    <div className="campo-filtro">

                        <label htmlFor="precioMax">
                            Precio máximo (MXN)
                        </label>

                        <input
                            id="precioMax"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="500.00"
                            value={precioMax}
                            onChange={(evento) =>
                                setPrecioMax(evento.target.value)
                            }
                        />

                    </div>

                </div>


                {/* Mensaje de error */}

                {error && (

                    <p
                        className="mensaje-error"
                        role="alert"
                    >
                        {error}
                    </p>

                )}


                {/* Botones del formulario */}

                <div className="botones-filtros">

                    <button
                        type="submit"
                        className="btn-buscar"
                        disabled={cargando}
                    >
                        Buscar
                    </button>

                    <button
                        type="button"
                        className="btn-limpiar-filtros"
                        onClick={limpiarFiltros}
                        disabled={cargando}
                    >
                        Limpiar filtros
                    </button>

                </div>

            </form>

        </section>

    );

}


// Exportamos nuestro componente
export default FiltrosProductos;