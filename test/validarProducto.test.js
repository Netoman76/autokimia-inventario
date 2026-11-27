
/*
    Prueba unitaria de validación de productos
    Sistema de Inventario Autokimia
*/

// Importamos el middleware que vamos a probar
const validarProducto = require(
    "../backend/middleware/validarProducto"
);

// Creamos nuestra prueba unitaria
test("Rechazar un producto con precio negativo", () => {

    // Simulamos los datos enviados por el usuario
    const req = {
        body: {
            nombre: "Producto de prueba",
            descripcion: "Prueba unitaria",
            cantidad: 10,
            precio: -50
        }
    };

    // Simulamos la respuesta de Express
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    // Simulamos la función next
    const next = jest.fn();

    // Ejecutamos el middleware de validación
    validarProducto(req, res, next);

    // Verificamos que se genere un error HTTP 400
    expect(res.status).toHaveBeenCalledWith(400);

    // Verificamos el mensaje de error
    expect(res.json).toHaveBeenCalledWith({
        mensaje: "Datos del producto inválidos",
        errores: [
            "El precio debe ser un número mayor o igual a cero"
        ]
    });

    // Verificamos que la solicitud no continúe
    expect(next).not.toHaveBeenCalled();

});
