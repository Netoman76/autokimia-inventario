
/*
    Prueba funcional de seguridad de la API
    Sistema de Inventario Autokimia
*/

// Importamos Express y Supertest
const express = require("express");
const request = require("supertest");

// Simulamos las operaciones del controlador
// para evitar utilizar la base de datos real
jest.mock("../backend/controllers/productosController", () => ({
    obtenerProductos: jest.fn(),
    crearProducto: jest.fn(),
    actualizarProducto: jest.fn(),
    eliminarProducto: jest.fn()
}));

// Importamos las rutas reales de productos
const productosRoutes = require(
    "../backend/routes/productosRoutes"
);

// Importamos el controlador simulado
const { obtenerProductos } = require(
    "../backend/controllers/productosController"
);

// Creamos una aplicación Express para las pruebas
const app = express();

// Permitimos recibir información en formato JSON
app.use(express.json());

// Registramos las rutas de productos
app.use("/api/productos", productosRoutes);

// Creamos nuestra prueba funcional
test("Rechazar una consulta de productos sin JWT", async () => {

    // Realizamos una solicitud HTTP sin token
    const respuesta = await request(app)
        .get("/api/productos");

    // Verificamos que el acceso sea rechazado
    expect(respuesta.status).toBe(401);

    // Verificamos el mensaje de respuesta
    expect(respuesta.body.mensaje).toBe(
        "Acceso denegado. Token requerido"
    );

    // Comprobamos que no se consulten los productos
    expect(obtenerProductos).not.toHaveBeenCalled();

});
