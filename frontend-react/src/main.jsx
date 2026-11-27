
/*
    Punto de entrada de la aplicación React
    Sistema de Inventario Autokimia
*/

// Importamos el modo estricto de React
import { StrictMode } from 'react';

// Importamos la función para renderizar React
import { createRoot } from 'react-dom/client';

// Importamos el administrador de rutas
import { BrowserRouter } from 'react-router';

// Importamos los estilos generales
import './index.css';

// Importamos el componente principal
import App from './App.jsx';


// ============================================
// INICIALIZACION DE LA APLICACION
// ============================================

createRoot(document.getElementById('root')).render(

    <StrictMode>

        <BrowserRouter>

            <App />

        </BrowserRouter>

    </StrictMode>

);
