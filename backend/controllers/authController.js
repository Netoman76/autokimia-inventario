
/*
  Controlador de autenticación
  Sistema de Inventario Autokimia
*/

// Importamos nuestra conexión a MySQL
const db = require("../config/db");

// Importamos bcryptjs para proteger contraseñas
const bcrypt = require("bcryptjs");

// Importamos jsonwebtoken para generar tokens JWT
const jwt = require("jsonwebtoken");


// ========================================
// FUNCIÓN 1: REGISTRAR UN USUARIO
// ========================================

const registrarUsuario = async (req, res) => {

    try {

        // Permitimos registros solo cuando estén habilitados
        if (process.env.PERMITIR_REGISTRO !== "true") {
            return res.status(403).json({
                mensaje: "El registro de usuarios está deshabilitado"
            });
        }

        // Recibimos los datos enviados desde Postman
        const { nombre_usuario, password } = req.body || {};

        // Validamos el nombre de usuario y la contraseña
        if (
            typeof nombre_usuario !== "string" ||
            !/^[a-zA-Z0-9_]{3,30}$/.test(nombre_usuario) ||
            typeof password !== "string" ||
            password.length < 12
        ) {

            return res.status(400).json({
                mensaje: "Usuario inválido o contraseña menor de 12 caracteres"
            });

        }

        // Buscamos si el nombre de usuario ya existe
        const [usuarios] = await db.execute(
            "SELECT id FROM usuarios WHERE nombre_usuario = ?",
            [nombre_usuario]
        );

        // Evitamos registrar nombres de usuario repetidos
        if (usuarios.length > 0) {

            return res.status(409).json({
                mensaje: "El usuario ya existe"
            });

        }

        // Convertimos la contraseña en un hash seguro
        const passwordHash = await bcrypt.hash(password, 12);

        // Guardamos el usuario y su hash en MySQL
        const [resultado] = await db.execute(
            "INSERT INTO usuarios (nombre_usuario, password_hash) VALUES (?, ?)",
            [nombre_usuario, passwordHash]
        );

        // Confirmamos que el usuario fue registrado
        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            id: resultado.insertId
        });

    } catch (error) {

        // Manejamos el caso de un usuario duplicado
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensaje: "El usuario ya existe"
            });
        }

        // Mostramos el error en la terminal
        console.error("Error al registrar usuario:", error.message);

        // Enviamos un mensaje de error al cliente
        res.status(500).json({
            mensaje: "Error al registrar usuario"
        });

    }

};



/*
  FUNCIÓN 2: INICIAR SESIÓN (LOGIN)
  Verifica el usuario y genera un token JWT.
*/

const iniciarSesion = async (req, res) => {

    try {

        // Recibimos el usuario y la contraseña
        const { nombre_usuario, password } = req.body || {};

        // Comprobamos que se enviaron los datos
        if (
            typeof nombre_usuario !== "string" ||
            !nombre_usuario.trim() ||
            typeof password !== "string" ||
            !password
        ) {

            return res.status(400).json({
                mensaje: "Debes proporcionar usuario y contraseña"
            });

        }

        // Buscamos al usuario en MySQL
        const [usuarios] = await db.execute(
            "SELECT id, nombre_usuario, password_hash FROM usuarios WHERE nombre_usuario = ?",
            [nombre_usuario]
        );

        // Comprobamos si el usuario existe
        if (usuarios.length === 0) {

            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });

        }

        // Obtenemos los datos del usuario encontrado
        const usuario = usuarios[0];

        // Comparamos la contraseña con el hash guardado
        const passwordValida = await bcrypt.compare(
            password,
            usuario.password_hash
        );

        // Si la contraseña es incorrecta, rechazamos el acceso
        if (!passwordValida) {

            return res.status(401).json({
                mensaje: "Usuario o contraseña incorrectos"
            });

        }

        // Comprobamos que exista nuestra clave secreta JWT
        if (
            !process.env.JWT_SECRET ||
            process.env.JWT_SECRET === "REEMPLAZAR_CON_CLAVE_SEGURA"
        ) {
            throw new Error("JWT_SECRET no configurada");
        }

        // Generamos el token JWT del usuario
        const token = jwt.sign(
            {
                id: usuario.id,
                nombre_usuario: usuario.nombre_usuario
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
                algorithm: "HS256"
            }
        );

        // Enviamos una respuesta de inicio de sesión correcto
        res.json({
            mensaje: "Inicio de sesión correcto",
            token: token
        });

    } catch (error) {

        // Mostramos el error en la terminal
        console.error("Error al iniciar sesión:", error.message);

        // Enviamos una respuesta de error
        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });

    }

};






// Exportamos nuestras funciones de autenticación
module.exports = {
    registrarUsuario,
    iniciarSesion
};

