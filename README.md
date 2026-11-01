
# Sistema de Inventario Autokimia

## 1. Descripción del proyecto

El Sistema de Inventario Autokimia es una aplicación
web desarrollada para administrar productos de un
inventario.

Permite registrar, consultar, modificar y eliminar
productos mediante una interfaz web sencilla.

La aplicación utiliza una arquitectura Fullstack,
conectando el frontend, el backend y una base de datos
MySQL.

Este proyecto se desarrolla como parte de la materia
Desarrollo Fullstack de Tecmilenio.

## 2. Objetivo

Desarrollar una aplicación web que permita administrar
productos de un inventario mediante operaciones CRUD,
incorporando autenticación de usuarios y conexión
a una base de datos relacional.

## 3. Tecnologías utilizadas

### Frontend
- HTML5: estructura de la página.
- CSS3: estilos y diseño visual.
- JavaScript: interacción con el usuario y API REST.

### Backend
- Node.js: entorno de ejecución de JavaScript.
- Express: servidor y rutas HTTP.
- MySQL2: conexión entre Node.js y MySQL.
- JWT: autenticación mediante tokens.
- bcryptjs: almacenamiento seguro de contraseñas.
- dotenv: configuración de variables de entorno.
- CORS: configuración de solicitudes entre orígenes.

### Base de datos
- MySQL 8: almacenamiento de la información.

### Herramientas
- Visual Studio Code.
- MySQL Workbench.
- Postman.
- Git y GitHub.

## 4. Funcionalidades

El sistema permite:

1. Iniciar sesión con usuario y contraseña.
2. Consultar los productos registrados.
3. Registrar productos nuevos.
4. Modificar productos existentes.
5. Eliminar productos previa confirmación.
6. Proteger las operaciones de modificación mediante JWT.
7. Cerrar sesión desde la interfaz web.

## 5. Estructura del proyecto

autokimia-inventario/
  backend/
    config/
      db.js
    controllers/
      authController.js
      productosController.js
    middleware/
      verificarToken.js
    routes/
      authRoutes.js
      productosRoutes.js
    server.js

  frontend/
    index.html
    styles.css
    script.js

  package.json
  package-lock.json
  .gitignore
  README.md

## 6. Base de datos

La aplicación utiliza la base de datos:

autokimia_inventario

Contiene las siguientes tablas:

### productos
Almacena la información del inventario.

Campos:
- id
- nombre
- descripcion
- cantidad
- precio

### usuarios
Almacena la información de autenticación.

Campos:
- id
- nombre_usuario
- password_hash

Las contraseñas se almacenan utilizando bcryptjs.

## 7. API REST

El backend proporciona las siguientes rutas:

GET /api/productos
Consultar productos registrados.

POST /api/productos
Registrar un producto nuevo. Requiere JWT.

PUT /api/productos/:id
Modificar un producto existente. Requiere JWT.

DELETE /api/productos/:id
Eliminar un producto. Requiere JWT.

POST /api/auth/registro
Registrar un usuario.

POST /api/auth/login
Iniciar sesión y obtener un JWT.

## 8. Instalación y ejecución local

Requisitos:
- Node.js y npm instalados.
- MySQL Server disponible.
- Base de datos y tablas configuradas.

Pasos:

1. Descargar el proyecto.
2. Abrir la carpeta principal en Visual Studio Code.
3. Abrir una terminal.
4. Ejecutar:

   npm.cmd install

5. Configurar el archivo .env con los datos locales
   de conexión y la clave secreta JWT.

6. Preparar la base de datos autokimia_inventario
   y sus tablas en MySQL.

7. Iniciar el servidor:

   node backend/server.js

8. Abrir en el navegador:

   http://localhost:3000

Nota: la configuración de MySQL y el archivo .env
deben prepararse antes de ejecutar la aplicación.

## 9. Seguridad

La aplicación utiliza:

- Contraseñas protegidas con bcryptjs.
- Tokens JWT para autenticación.
- Middleware para proteger rutas.
- Validación de datos en el backend.
- Variables de entorno para datos privados.

El archivo .env no debe publicarse en GitHub.

El cierre de sesión elimina el token del frontend,
pero no revoca anticipadamente un token ya emitido.

## 10. Pruebas realizadas

Se realizaron pruebas utilizando Postman,
Google Chrome y MySQL Workbench.

Se comprobó el funcionamiento de:

- Conexión del servidor con MySQL.
- Registro de usuarios.
- Inicio de sesión con JWT.
- Registro de productos.
- Consulta de productos.
- Actualización de productos.
- Eliminación de productos.
- Rechazo de solicitudes sin JWT.
- Cierre de sesión desde la página web.

## 11. Estado del proyecto

Las funcionalidades principales de la aplicación
están implementadas y se han realizado pruebas
de funcionamiento.

El proyecto se encuentra en etapa de documentación
y preparación de la entrega académica.
