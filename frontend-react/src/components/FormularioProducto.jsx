/*
    Componente para registrar y modificar productos
    Sistema de Inventario Autokimia
*/

// Importamos los Hooks de React
import { useState, useEffect } from "react";

// Definimos los valores iniciales del formulario
const valoresIniciales = {
    nombre: "",
    descripcion: "",
    cantidad: "",
    precio: ""
};


// ============================================
// COMPONENTE FORMULARIO DE PRODUCTOS
// ============================================

function FormularioProducto({
    productoEditar,
    onGuardar,
    onCancelar
}) {

    // Estado para almacenar los datos del formulario
    const [formulario, setFormulario] = useState(
        valoresIniciales
    );

    // Estado para mostrar errores
    const [error, setError] = useState("");

    // Estado para controlar el procesamiento
    const [guardando, setGuardando] = useState(false);


    // ============================================
    // CARGAR LOS DATOS DEL PRODUCTO A EDITAR
    // ============================================

    useEffect(() => {

        // Comprobamos si se seleccionó un producto
        if (productoEditar) {

            // Cargamos sus datos en el formulario
            setFormulario({
                nombre: productoEditar.nombre,
                descripcion: productoEditar.descripcion ?? "",
                cantidad: productoEditar.cantidad,
                precio: productoEditar.precioOriginal
                    ?? productoEditar.precio
            });

        } else {

            // Limpiamos el formulario
            setFormulario(valoresIniciales);

        }

        // Limpiamos los mensajes anteriores
        setError("");

    }, [productoEditar]);


    // ============================================
    // FUNCION: CAPTURAR LOS CAMBIOS
    // ============================================

    const manejarCambio = (evento) => {

        // Obtenemos el nombre y valor del campo
        const { name, value } = evento.target;

        // Actualizamos únicamente el campo modificado
        setFormulario(anterior => ({
            ...anterior,
            [name]: value
        }));

    };


    // ============================================
    // FUNCION: GUARDAR PRODUCTO
    // ============================================

    const manejarEnvio = async (evento) => {

        // Evitamos que se recargue la página
        evento.preventDefault();

        // Limpiamos los errores anteriores
        setError("");

        // Convertimos los campos numéricos
        const cantidad = Number(formulario.cantidad);
        const precio = Number(formulario.precio);


        // ========================================
        // VALIDACIONES DEL FORMULARIO
        // ========================================

        if (
            !formulario.nombre.trim() ||
            formulario.nombre.trim().length > 100
        ) {

            setError(
                "El nombre debe contener entre 1 y 100 caracteres"
            );

            return;

        }

        if (formulario.descripcion.length > 255) {

            setError(
                "La descripción no debe superar 255 caracteres"
            );

            return;

        }

        if (
            formulario.cantidad === "" ||
            !Number.isInteger(cantidad) ||
            cantidad < 0 ||
            cantidad > 2147483647
        ) {

            setError(
                "Ingresa una cantidad entera válida"
            );

            return;

        }

        if (
            formulario.precio === "" ||
            !Number.isFinite(precio) ||
            precio < 0 ||
            precio > 99999999.99
        ) {

            setError("Ingresa un precio válido");
            return;

        }

        // Preparamos los datos para el backend
        const datosProducto = {
            nombre: formulario.nombre.trim(),
            descripcion: formulario.descripcion.trim(),
            cantidad: cantidad,
            precio: precio
        };

        // Indicamos que se está guardando
        setGuardando(true);

        try {

            // Enviamos los datos al componente principal
            await onGuardar(
                datosProducto,
                productoEditar?.id
            );

            // Limpiamos el formulario
            setFormulario(valoresIniciales);

        } catch (error) {

            // Mostramos el error recibido
            setError(
                error.message || "No se pudo guardar el producto"
            );

        } finally {

            // Finalizamos el procesamiento
            setGuardando(false);

        }

    };


    // ============================================
    // FUNCION: CANCELAR EDICION
    // ============================================

    const cancelarEdicion = () => {

        setFormulario(valoresIniciales);
        setError("");

        onCancelar();

    };


    // ============================================
    // INTERFAZ GRAFICA
    // ============================================

    return (

        <section className="formulario-producto">

            <h2>
                {productoEditar
                    ? "Modificar producto"
                    : "Registrar producto"
                }
            </h2>

            <form onSubmit={manejarEnvio}>

                <fieldset disabled={guardando}>

                    <label htmlFor="nombre">
                        Nombre del producto
                    </label>

                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        placeholder="Nombre del producto"
                        maxLength={100}
                        required
                    />

                    <label htmlFor="descripcion">
                        Descripción
                    </label>

                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formulario.descripcion}
                        onChange={manejarCambio}
                        placeholder="Descripción del producto"
                        maxLength={255}
                        rows={3}
                    />

                    <div className="campos-numericos">

                        <div>

                            <label htmlFor="cantidad">
                                Cantidad
                            </label>

                            <input
                                id="cantidad"
                                name="cantidad"
                                type="number"
                                value={formulario.cantidad}
                                onChange={manejarCambio}
                                min="0"
                                max="2147483647"
                                step="1"
                                required
                            />

                        </div>

                        <div>

                            <label htmlFor="precio">
                                Precio (MXN)
                            </label>

                            <input
                                id="precio"
                                name="precio"
                                type="number"
                                value={formulario.precio}
                                onChange={manejarCambio}
                                min="0"
                                max="99999999.99"
                                step="0.01"
                                required
                            />

                        </div>

                    </div>

                    {/* Mostramos los mensajes de error */}
                    {error && (

                        <p className="mensaje-error" role="alert">
                            {error}
                        </p>

                    )}

                    <div className="botones-formulario">

                        <button
                            type="submit"
                            className="btn-guardar"
                            disabled={guardando}
                        >

                            {guardando
                                ? "Guardando..."
                                : productoEditar
                                    ? "Guardar cambios"
                                    : "Registrar producto"
                            }

                        </button>

                        {productoEditar && (

                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={cancelarEdicion}
                            >
                                Cancelar
                            </button>

                        )}

                    </div>

                </fieldset>

            </form>

        </section>

    );

}

// Exportamos el componente
export default FormularioProducto;