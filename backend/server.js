/*
    Servidor principal del sistema de inventario Autokimia
    Configuración para desarrollo local y producción
*/

// Cargamos las variables de entorno
require("dotenv").config();

// Importamos las bibliotecas
const express = require("express");
const cors = require("cors");
const path = require("path");

// Importamos la conexión a MySQL
const db = require("./config/db");

// Importamos las rutas
const productosRoutes = require("./routes/productosRoutes");
const authRoutes = require("./routes/authRoutes");
const monedasRoutes = require("./routes/monedasRoutes");

// Importamos el middleware centralizado de errores
const manejarErrores = require("./middleware/manejarErrores");

// Creamos nuestra aplicación Express
const app = express();


// ============================================
// CONFIGURACION DEL ENTORNO
// ============================================

// Identificamos si estamos trabajando en producción
const esProduccion = process.env.NODE_ENV === "production";

// Obtenemos el puerto del servidor
const PORT = process.env.PORT || 3000;

// Permitimos solicitudes de otros orígenes en desarrollo
if (!esProduccion) {

    app.use(cors());

}

// Permitimos recibir datos en formato JSON
app.use(express.json());


// ============================================
// RUTAS DE LA API REST
// ============================================

// Rutas de productos
app.use("/api/productos", productosRoutes);

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de conversión de monedas
app.use("/api/monedas", monedasRoutes);


// ============================================
// VERIFICACION DEL SERVIDOR
// ============================================

app.get("/api/salud", (req, res) => {

    res.json({
        mensaje: "Servidor de Autokimia funcionando correctamente"
    });

});


// ============================================
// VERIFICACION DE LA BASE DE DATOS
// ============================================

// Esta ruta de diagnóstico solamente funciona en desarrollo
if (!esProduccion) {

    app.get("/api/db", async (req, res, next) => {

        try {

            const [filas] = await db.query(
                "SELECT DATABASE() AS baseDatos"
            );

            res.json({
                mensaje: "Conexion a MySQL correcta",
                baseDatos: filas[0].baseDatos
            });

        } catch (error) {

            next(error);

        }

    });

}


// ============================================
// CONTROL DE RUTAS API INEXISTENTES
// ============================================

app.use("/api", (req, res) => {

    res.status(404).json({
        mensaje: "Ruta no encontrada"
    });

});


// ============================================
// CONFIGURACION DEL FRONTEND
// ============================================

if (esProduccion) {

    // Localizamos los archivos compilados de React
    const rutaReact = path.join(
        __dirname,
        "../frontend-react/dist"
    );

    // Publicamos los archivos de React
    app.use(express.static(rutaReact));

    // Permitimos la navegación mediante React Router
    app.get("/{*ruta}", (req, res) => {

        res.sendFile(
            path.join(rutaReact, "index.html")
        );

    });

} else {

    // Conservamos el frontend original para desarrollo local
    app.use(express.static(
        path.join(__dirname, "../frontend")
    ));

}


// ============================================
// MANEJO CENTRALIZADO DE ERRORES
// ============================================

app.use(manejarErrores);


// ============================================
// INICIAR EL SERVIDOR
// ============================================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Servidor funcionando en el puerto ${PORT}`
    );

    console.log(
        `Entorno: ${esProduccion ? "Produccion" : "Desarrollo"}`
    );

});