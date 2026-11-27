
/*
    Componente principal de la aplicación
    Sistema de Inventario Autokimia
*/

// Importamos los Hooks de React
import { useState, useCallback } from "react";

// Importamos los componentes de navegación
import {
    Routes,
    Route,
    Navigate
} from "react-router";

// Importamos las páginas de la aplicación
import Login from "./pages/Login";
import Inventario from "./pages/Inventario";

// Importamos el servicio JWT
import { obtenerUsuario } from "./services/jwt";

// Importamos los estilos
import "./App.css";


// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function App() {

    // Estado para almacenar el token del usuario
    const [token, setToken] = useState(null);


    // ============================================
    // FUNCION: INICIAR SESION
    // ============================================

    const iniciarSesion = (nuevoToken) => {

        // Guardamos el token recibido del backend
        setToken(nuevoToken);

    };


    // ============================================
    // FUNCION: CERRAR SESION
    // ============================================

    const cerrarSesion = useCallback(() => {

        // Eliminamos el token de la memoria
        setToken(null);

    }, []);


    // ============================================
    // VALIDAR LA SESION
    // ============================================

    const usuario = obtenerUsuario(token);


    // ============================================
    // CONFIGURACION DE RUTAS
    // ============================================

    return (

        <Routes>

            {/* Ruta principal */}
            <Route
                path="/"
                element={
                    <Navigate
                        to={usuario ? "/inventario" : "/login"}
                        replace
                    />
                }
            />

            {/* Ruta pública de inicio de sesión */}
            <Route
                path="/login"
                element={
                    usuario ? (

                        <Navigate
                            to="/inventario"
                            replace
                        />

                    ) : (

                        <Login
                            onLogin={iniciarSesion}
                        />

                    )
                }
            />

            {/* Ruta protegida del inventario */}
            <Route
                path="/inventario"
                element={
                    usuario ? (

                        <Inventario
                            token={token}
                            onLogout={cerrarSesion}
                        />

                    ) : (

                        <Navigate
                            to="/login"
                            replace
                        />

                    )
                }
            />

            {/* Control de rutas inexistentes */}
            <Route
                path="*"
                element={
                    <Navigate
                        to={usuario ? "/inventario" : "/login"}
                        replace
                    />
                }
            />

        </Routes>

    );

}

// Exportamos el componente principal
export default App;