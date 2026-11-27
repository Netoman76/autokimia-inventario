/*
    Middleware de autorización por roles
    Sistema de Inventario Autokimia
*/

// Creamos una función que recibe los roles permitidos
const verificarRol = (...rolesPermitidos) => {

    return (req, res, next) => {

        // Comprobamos que el usuario esté autenticado
        if (!req.usuario) {

            return res.status(401).json({
                mensaje: "Usuario no autenticado"
            });

        }

        // Verificamos si el usuario tiene un rol permitido
        if (!rolesPermitidos.includes(req.usuario.rol)) {

            return res.status(403).json({
                mensaje: "No tienes permisos para realizar esta operación"
            });

        }

        // Si tiene los permisos, permitimos continuar
        next();

    };

};

// Exportamos el middleware
module.exports = verificarRol;