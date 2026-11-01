
/*
  Configuración de conexión a MySQL
  Proyecto: Inventario Autokimia
*/

// Importamos la biblioteca mysql2
const mysql = require("mysql2/promise");

// Creamos un conjunto de conexiones a MySQL
const db = mysql.createPool({

    // Dirección del servidor MySQL
    host: process.env.DB_HOST,

    // Usuario de MySQL
    user: process.env.DB_USER,

    // Contraseña de MySQL
    password: process.env.DB_PASSWORD,

    // Nombre de nuestra base de datos
    database: process.env.DB_NAME,

    // Número de puerto utilizado por MySQL
    port: 3306,

    // Esperamos si todas las conexiones están ocupadas
    waitForConnections: true,

    // Máximo de conexiones simultáneas
    connectionLimit: 10
});

// Exportamos la conexión para utilizarla en otros archivos
module.exports = db;
