/*
    Pantalla de inicio de sesión
    Sistema de Inventario Autokimia
*/

// Importamos useState de React
import { useState } from "react";

// Importamos la función de comunicación con el backend
import { iniciarSesion } from "../services/api";

// Creamos el componente Login
function Login({ onLogin }) {

    // Estados para almacenar las credenciales
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");

    // Estado para mostrar mensajes de error
    const [error, setError] = useState("");

    // Estado para indicar que se está procesando la solicitud
    const [cargando, setCargando] = useState(false);


    // ============================================
    // FUNCION: PROCESAR INICIO DE SESION
    // ============================================

    const manejarLogin = async (evento) => {

        // Evitamos que el formulario recargue la página
        evento.preventDefault();

        // Limpiamos los errores anteriores
        setError("");

        // Validamos que se ingresaron las credenciales
        if (!usuario.trim() || !password) {

            setError("Ingresa el usuario y la contraseña");
            return;

        }

        // Indicamos que estamos procesando la solicitud
        setCargando(true);

        try {

            // Enviamos las credenciales al backend
            const resultado = await iniciarSesion(
                usuario.trim(),
                password
            );

            // Comprobamos que recibimos un token
            if (!resultado.token) {

                throw new Error("No se recibió el token");

            }

            // Enviamos el token al componente principal
            onLogin(resultado.token);

        } catch (error) {

            // Mostramos el mensaje de error
            setError(
                error.message || "No se pudo iniciar sesión"
            );

        } finally {

            // Finalizamos el estado de carga
            setCargando(false);

        }

    };


    // ============================================
    // INTERFAZ GRAFICA DEL COMPONENTE
    // ============================================

    return (

        <div className="login-contenedor">

            <div className="login-tarjeta">

                <h1 className="login-logo">
                    AUTOKIMIA
                </h1>

                <p className="login-subtitulo">
                    Sistema de gestión de inventario
                </p>

                <h2>Iniciar sesión</h2>

                <form onSubmit={manejarLogin}>

                    <label htmlFor="usuario">
                        Nombre de usuario
                    </label>

                    <input
                        id="usuario"
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        placeholder="Ingresa tu usuario"
                        autoComplete="username"
                        required
                    />

                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        autoComplete="current-password"
                        required
                    />

                    {error && (

                        <p className="mensaje-error" role="alert">
                            {error}
                        </p>

                    )}

                    <button
                        type="submit"
                        disabled={cargando}
                    >

                        {cargando
                            ? "Iniciando sesión..."
                            : "Iniciar sesión"
                        }

                    </button>

                </form>

                <p className="login-pie">
                    Acceso exclusivo para usuarios autorizados
                </p>

            </div>

        </div>

    );

}

// Exportamos nuestro componente
export default Login;