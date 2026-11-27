/*
    Página principal del inventario
    Sistema de Inventario Autokimia
*/

// Importamos los Hooks de React
import { useState, useEffect, useCallback } from "react";

// Importamos nuestros componentes
import Encabezado from "../components/Encabezado";
import TablaProductos from "../components/TablaProductos";
import FormularioProducto from "../components/FormularioProducto";

// Importamos el componente de filtros de búsqueda
import FiltrosProductos from "../components/FiltrosProductos";

import Paginacion from "../components/Paginacion";

// Importamos el componente para seleccionar la moneda
import SelectorMoneda from "../components/SelectorMoneda";

// Importamos el servicio JWT
import { obtenerUsuario } from "../services/jwt";

// Importamos las funciones de comunicación con el backend
import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerTiposCambio
} from "../services/api";


// ============================================
// COMPONENTE PRINCIPAL DEL INVENTARIO
// ============================================

function Inventario({ token, onLogout }) {

    // Obtenemos la información del usuario
    const usuario = obtenerUsuario(token);

    // Comprobamos si es administrador
    const esAdmin = usuario?.rol === "admin";

    // Estado para almacenar los productos
    const [productos, setProductos] = useState([]);

    // Estado para seleccionar un producto a editar
    const [productoEditar, setProductoEditar] = useState(null);

    // Estado para mostrar mensajes de error
    const [error, setError] = useState("");

    // Estado para mostrar mensajes satisfactorios
    const [mensaje, setMensaje] = useState("");

    // Estado para indicar que se están cargando datos
    const [cargando, setCargando] = useState(true);

    // Estado para controlar las operaciones
    const [procesando, setProcesando] = useState(false);

    // Estado para almacenar los filtros de búsqueda
    const [filtros, setFiltros] = useState({
    nombre: "",
    precioMin: "",
    precioMax: ""
    });

        // Estado para controlar la página actual
    const [pagina, setPagina] = useState(1);

    // Estado para controlar los productos por página
    const [limite, setLimite] = useState(10);

    // Estado para almacenar el total de productos
    const [totalProductos, setTotalProductos] = useState(0);

    // Estado para almacenar el total de páginas
    const [totalPaginas, setTotalPaginas] = useState(0);

    // Estado para controlar la moneda seleccionada
    const [moneda, setMoneda] = useState("MXN");

    // Estado para almacenar los tipos de cambio
    const [tiposCambio, setTiposCambio] = useState({
        MXN: 1
    });

    // Estado para almacenar las fechas de referencia
    const [fechasCambio, setFechasCambio] = useState({});

    // Estado para controlar la consulta de monedas
    const [cargandoMonedas, setCargandoMonedas] = useState(false);

    // ============================================
    // FUNCION: CAMBIAR MONEDA DE VISUALIZACION
    // ============================================

    const cambiarMoneda = async (nuevaMoneda) => {

        // Limpiamos los mensajes anteriores
        setError("");
        setMensaje("");

        // Si seleccionamos pesos mexicanos,
        // no necesitamos consultar la API externa
        if (nuevaMoneda === "MXN") {

            setMoneda("MXN");
            return;

        }

        // Activamos el indicador de carga
        setCargandoMonedas(true);

        try {

            // Consultamos los tipos de cambio
            const respuesta = await obtenerTiposCambio(token);

            // Verificamos que exista un tipo de cambio válido
            const tasa = respuesta.tiposCambio?.[nuevaMoneda];

            if (!Number.isFinite(tasa) || tasa <= 0) {

                throw new Error("Tipo de cambio no válido");

            }

            // Guardamos los tipos de cambio recibidos
            setTiposCambio(respuesta.tiposCambio);

            // Guardamos las fechas de referencia
            setFechasCambio(respuesta.fechas);

            // Actualizamos la moneda seleccionada
            setMoneda(nuevaMoneda);

        } catch (error) {

            // Mostramos un mensaje si ocurre un error
            setError(
                error.message ||
                "No se pudieron consultar los tipos de cambio"
            );

        } finally {

            // Desactivamos el indicador de carga
            setCargandoMonedas(false);

        }

    };


    // ============================================
    // FUNCION 1: CONSULTAR PRODUCTOS (READ)
    // ============================================

    const cargarProductos = useCallback(async () => {

    // Activamos el indicador de carga
    setCargando(true);
    setError("");

    try {

        // Consultamos los productos utilizando
        // los filtros y los parámetros de paginación
        const respuesta = await obtenerProductos(
            token,
            {
                ...filtros,
                pagina: pagina,
                limite: limite
            }
        );

        // Verificamos que la página solicitada siga existiendo
        const ultimaPagina = Math.max(
            1,
            respuesta.totalPaginas
        );

        if (pagina > ultimaPagina) {

            setPagina(ultimaPagina);
            return;

        }

        // Guardamos los productos recibidos
        setProductos(respuesta.productos);

        // Guardamos el total de productos encontrados
        setTotalProductos(respuesta.totalProductos);

        // Guardamos el total de páginas disponibles
        setTotalPaginas(respuesta.totalPaginas);

    } catch (error) {

        // Mostramos el mensaje de error
        setError(
            error.message ||
            "No se pudieron consultar los productos"
        );

    } finally {

        // Desactivamos el indicador de carga
        setCargando(false);

    }

    }, [token, filtros, pagina, limite]);


    // ============================================
    // CARGAR PRODUCTOS AL INICIAR
    // ============================================

    useEffect(() => {

        if (!obtenerUsuario(token)) {

            onLogout();
            return;

        }

        cargarProductos();

    }, [token, onLogout, cargarProductos]);


    // ==========================================
    // FUNCIONES DE BUSQUEDA Y FILTRADO
    // ==========================================

    // Aplicamos los filtros de búsqueda
    const buscarProductos = (nuevosFiltros) => {

    // Regresamos a la primera página
    setPagina(1);

    // Guardamos los filtros seleccionados
    setFiltros(nuevosFiltros);

    };


    // Eliminamos los filtros de búsqueda
    const limpiarFiltros = () => {

    // Regresamos a la primera página
    setPagina(1);

    // Restablecemos los filtros
    setFiltros({
        nombre: "",
        precioMin: "",
        precioMax: ""
    });

    };

    // =============================================
    // FUNCIONES PARA CONTROLAR LA PAGINACION
    // =============================================

    // Cambiamos la página actual
    const cambiarPagina = (nuevaPagina) => {

    // Verificamos que la página sea válida
    if (
        Number.isSafeInteger(nuevaPagina) &&
        nuevaPagina >= 1 &&
        nuevaPagina <= totalPaginas
    ) {

        setPagina(nuevaPagina);

    }

    };

    // Cambiamos la cantidad de productos por página
    const cambiarLimite = (nuevoLimite) => {

    // Convertimos el valor a un número
    const limiteNuevo = Number(nuevoLimite);

    // Validamos la cantidad seleccionada
    if (
        Number.isSafeInteger(limiteNuevo) &&
        limiteNuevo >= 1 &&
        limiteNuevo <= 100
    ) {

        // Regresamos a la primera página
        setPagina(1);

        // Actualizamos el límite
        setLimite(limiteNuevo);

    }

    };


    // ============================================
    // FUNCION 2: REGISTRAR O MODIFICAR PRODUCTOS
    // ============================================

    const guardarProducto = async (datosProducto, id) => {

        // Comprobamos los permisos del usuario
        if (!esAdmin) {

            throw new Error("No tienes permisos");

        }

        setMensaje("");
        setError("");
        setProcesando(true);

        try {

            // Si existe un ID, modificamos el producto
            if (id) {

                await actualizarProducto(
                    token,
                    id,
                    datosProducto
                );

                setMensaje(
                    "Producto actualizado correctamente"
                );

            } else {

                // Si no existe un ID, creamos un producto
                await crearProducto(
                    token,
                    datosProducto
                );

                setMensaje(
                    "Producto registrado correctamente"
                );

            }

            // Finalizamos el modo de edición
            setProductoEditar(null);

            // Actualizamos la tabla
            await cargarProductos();

        } catch (error) {

            // Enviamos el error al formulario
            throw error;

        } finally {

            setProcesando(false);

        }

    };


    // ============================================
    // FUNCION 3: SELECCIONAR PRODUCTO PARA EDITAR
    // ============================================

    const seleccionarProducto = (producto) => {

        if (!esAdmin || procesando) {

            return;

        }

        setMensaje("");
        setError("");

        // Enviamos el producto seleccionado al formulario
        setProductoEditar(producto);

        // Desplazamos la pantalla hacia el formulario
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ============================================
    // FUNCION 4: CANCELAR EDICION
    // ============================================

    const cancelarEdicion = () => {

        setProductoEditar(null);
        setMensaje("");
        setError("");

    };


    // ============================================
    // FUNCION 5: ELIMINAR PRODUCTO (DELETE)
    // ============================================

    const borrarProducto = async (id) => {

        if (!esAdmin || procesando) {

            return;

        }

        // Solicitamos confirmación al administrador
        const confirmar = window.confirm(
            "¿Estás seguro de eliminar este producto?"
        );

        if (!confirmar) {

            return;

        }

        setMensaje("");
        setError("");
        setProcesando(true);

        try {

            // Enviamos la solicitud DELETE
            await eliminarProducto(token, id);

            setMensaje(
                "Producto eliminado correctamente"
            );

            // Limpiamos el formulario si estaba editando
            // el producto que acaba de eliminarse
            if (productoEditar?.id === id) {

                setProductoEditar(null);

            }

            // Actualizamos la tabla
            await cargarProductos();

        } catch (error) {

            setError(
                error.message || "No se pudo eliminar el producto"
            );

        } finally {

            setProcesando(false);

        }

    };

    // ============================================
    // CONVERSION DE PRECIOS PARA VISUALIZACION
    // ============================================

    // Creamos un nuevo arreglo sin modificar los productos originales
    const productosVisualizados = productos.map((producto) => {

        // Obtenemos el precio original en pesos mexicanos
        const precioOriginal = Number(producto.precio);

        // Obtenemos el tipo de cambio de la moneda seleccionada
        const tasa = tiposCambio[moneda];

        // Calculamos el precio convertido
        const precioConvertido = Number(
            (precioOriginal * tasa).toFixed(2)
        );

        // Regresamos el producto con su precio convertido
        return {
            ...producto,
            precioConvertido: precioConvertido
        };

    });

    // Evitamos mostrar el inventario sin un usuario válido
    if (!usuario) {

        return null;

    }


    // ============================================
    // INTERFAZ GRAFICA DEL INVENTARIO
    // ============================================

    return (

        <div className="inventario">

            {/* Encabezado principal */}
            <Encabezado
                usuario={usuario}
                onLogout={onLogout}
            />

            <main className="inventario-contenido">

                <h2 className="titulo-inventario">
                    Gestión de inventario
                </h2>

                {/* Información para usuarios normales */}
                {!esAdmin && (

                    <p className="mensaje-informacion">

                        Tienes acceso de solo consulta
                        a los productos del inventario.

                    </p>

                )}

                {/* Mensajes satisfactorios */}
                {mensaje && (

                    <p className="mensaje-exito" role="status">
                        {mensaje}
                    </p>

                )}

                {/* Mensajes de error */}
                {error && (

                    <p className="mensaje-error" role="alert">
                        {error}
                    </p>

                )}

                {/* Formulario exclusivo del administrador */}
                {esAdmin && (

                    <FormularioProducto
                        productoEditar={productoEditar}
                        onGuardar={guardarProducto}
                        onCancelar={cancelarEdicion}
                    />

                )}

                {/* Formulario de búsqueda de productos */}

                    <FiltrosProductos
                        onBuscar={buscarProductos}
                        onLimpiar={limpiarFiltros}
                        cargando={cargando}
                    />

                {/* Selector de moneda de visualización */}
                    <SelectorMoneda
                        moneda={moneda}
                        tiposCambio={tiposCambio}
                        fechas={fechasCambio}
                        onCambiarMoneda={cambiarMoneda}
                        cargando={cargandoMonedas}
                    />

                {/* Indicador de carga */}
                {cargando ? (

                    <p className="mensaje-cargando">
                        Cargando productos...
                    </p>

                ) : (

                    <>

                        {/* Tabla de productos */}
                        <TablaProductos
                            productos={productosVisualizados}
                            esAdmin={esAdmin}
                            moneda={moneda}
                            onEditar={seleccionarProducto}
                            onEliminar={borrarProducto}
                        />

                        {/* Controles de paginación */}
                        <Paginacion
                            pagina={pagina}
                            limite={limite}
                            totalPaginas={totalPaginas}
                            totalProductos={totalProductos}
                            onCambiarPagina={cambiarPagina}
                            onCambiarLimite={cambiarLimite}
                            cargando={cargando}
                        />

                    </>

                )}

            </main>

        </div>

    );

}

// Exportamos la página principal
export default Inventario;