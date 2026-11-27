/*
    Componente principal de la aplicación
    Sistema de Inventario Autokimia
*/

// Importamos los Hooks de React
import { useState, useCallback } from "react";

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
    // INTERFAZ PRINCIPAL
    // ============================================

    return (

        <>

            {/* Verificamos si existe una sesión */}

            {usuario ? (

                <Inventario
                    token={token}
                    onLogout={cerrarSesion}
                />

            ) : (

                <Login
                    onLogin={iniciarSesion}
                />

            )}

        </>

    );

}

// Exportamos el componente principal
export default App;