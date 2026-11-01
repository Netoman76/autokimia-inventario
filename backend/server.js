
/*
  Servidor principal del sistema de inventario Autokimia
  Utilizaremos Node.js y Express.
*/

// Cargamos las variables de nuestro archivo .env
require("dotenv").config();

// Importamos Express para crear nuestro servidor
const express = require("express");

// Importamos CORS para permitir solicitudes del frontend
const cors = require("cors");


// Importamos nuestra configuración de MySQL----------------------
const db = require("./config/db");

// Importamos las rutas de productos------------------------------------
const productosRoutes = require("./routes/productosRoutes");

// Importamos las rutas de autenticación de usuarios
const authRoutes = require("./routes/authRoutes");

// Importamos path para trabajar con rutas de carpetas
const path = require("path");





// Creamos nuestra aplicación Express
const app = express();

// Permitimos solicitudes del frontend
app.use(cors());

// Permitimos que el servidor reciba datos en formato JSON
app.use(express.json());

// Todas las rutas de productos comenzarán con /api/productos--------------------
app.use("/api/productos", productosRoutes);

// Todas las rutas de autenticación comienzan con /api/auth
app.use("/api/auth", authRoutes);

// Permitimos que Express muestre los archivos del frontend
app.use(express.static(
    path.join(__dirname, "../frontend")
));




// Obtenemos el puerto desde el archivo .env
const PORT = process.env.PORT || 3000;

// Creamos una ruta para comprobar el funcionamiento
app.get("/api/salud", (req, res) => {

    // Enviamos una respuesta en formato JSON
    res.json({
        mensaje: "Servidor de Autokimia funcionando correctamente"
    });

});
//---------------------------------------------------------------------

// Ruta temporal para probar la conexión a MySQL
app.get("/api/db", async (req, res) => {

    try {

        // Consultamos el nombre de la base de datos activa
        const [filas] = await db.query(
            "SELECT DATABASE() AS baseDatos"
        );

        // Enviamos el resultado al navegador
        res.json({
            mensaje: "Conexion a MySQL correcta",
            baseDatos: filas[0].baseDatos
        });

    } catch (error) {

        // Mostramos el error en la terminal
        console.error("Error de MySQL:", error.message);

        // Enviamos una respuesta de error
        res.status(500).json({
            mensaje: "No se pudo conectar a MySQL"
        });

    }

});
//---------------------------------------------------------------------





// Iniciamos nuestro servidor
app.listen(PORT, () => {

    // Mostramos un mensaje en la terminal
    console.log(`Servidor funcionando en http://localhost:${PORT}`);

});
