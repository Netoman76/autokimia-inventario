/*
    Componente del encabezado principal
    Sistema de Inventario Autokimia
*/

// Recibimos los datos del usuario y la función de cierre de sesión
function Encabezado({ usuario, onLogout }) {

    // Determinamos el nombre del rol que mostraremos
    const nombreRol = usuario.rol === "admin"
        ? "Administrador"
        : "Usuario";


    // ============================================
    // INTERFAZ GRAFICA DEL ENCABEZADO
    // ============================================

    return (

        <header className="encabezado">

            <div className="encabezado-principal">

                {/* Información de la empresa */}
                <div>

                    <h1>AUTOKIMIA</h1>

                    <p>Sistema de gestión de inventario</p>

                </div>

                {/* Botón para cerrar sesión */}
                <button
                    className="btn-cerrar-sesion"
                    onClick={onLogout}
                >
                    Cerrar sesión
                </button>

            </div>

            {/* Información del usuario autenticado */}
            <div className="encabezado-usuario">

                <span>

                    Bienvenido:{" "}
                    <strong>
                        {usuario.nombre_usuario}
                    </strong>

                </span>

                {/* Mostramos el rol del usuario */}
                <span className="etiqueta-rol">

                    {nombreRol}

                </span>

            </div>

        </header>

    );

}

// Exportamos el componente
export default Encabezado;