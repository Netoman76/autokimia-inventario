
# Sistema de Inventario Autokimia

## 1. Descripción del proyecto

El Sistema de Inventario Autokimia es una aplicación web
Full Stack desarrollada para administrar los productos
de un inventario.

La aplicación permite registrar, consultar, modificar,
eliminar, buscar y filtrar productos, mediante una
interfaz gráfica desarrollada con React.

También incorpora autenticación de usuarios, control
de acceso por roles, paginación de resultados e
integración con una API externa para consultar tipos
de cambio internacionales.

Este proyecto se desarrolla como parte de la materia
Desarrollo Full Stack de la Universidad Tecmilenio.

## 2. Objetivo

Desarrollar una aplicación web funcional que permita
administrar un inventario de productos mediante una
arquitectura Full Stack, incorporando una base de
datos relacional, seguridad, componentes reutilizables
y servicios externos.

## 3. Tecnologías utilizadas

### Frontend

- React 19: desarrollo de interfaces gráficas.
- Vite 8: servidor de desarrollo y compilación.
- JavaScript: programación de funcionalidades.
- JSX: creación de componentes de React.
- HTML5: estructura de la aplicación.
- CSS3: estilos y diseño adaptable.
- Fetch API: comunicación con el backend.
- Oxlint: análisis del código.

### Backend

- Node.js: entorno de ejecución de JavaScript.
- Express 5: servidor y administración de rutas HTTP.
- MySQL2: comunicación con MySQL.
- jsonwebtoken: autenticación mediante JWT.
- bcryptjs: generación y verificación de hashes.
- dotenv: administración de variables de entorno.
- CORS: comunicación entre diferentes orígenes.

### Base de datos

- MySQL 8.0: almacenamiento de usuarios y productos.

### Servicios externos

- Frankfurter API: consulta de tipos de cambio.

### Herramientas de desarrollo

- Visual Studio Code.
- MySQL Workbench.
- Postman.
- Google Chrome.
- Git.
- GitHub.

## 4. Arquitectura del sistema

La aplicación está organizada en cuatro elementos:

1. Frontend: interfaz gráfica desarrollada con React.
2. Backend: servidor desarrollado con Node.js y Express.
3. Base de datos: almacenamiento mediante MySQL.
4. API externa: consulta de tipos de cambio.

Flujo de comunicación:

    Usuario
       |
    Frontend React
       |
    API REST - Node.js y Express
       |
       +-------- MySQL
       |
       +-------- Frankfurter API

El frontend envía solicitudes HTTP al backend.

El backend verifica los permisos del usuario,
valida los datos, realiza las operaciones necesarias
y devuelve los resultados en formato JSON.

## 5. Funcionalidades principales

- Inicio de sesión.
- Cierre de sesión.
- Registro de usuarios mediante la API.
- Autenticación mediante JWT.
- Control de acceso por roles.
- Registro de productos.
- Consulta de productos.
- Modificación de productos.
- Eliminación previa confirmación.
- Cancelación de modificaciones.
- Validación de formularios.
- Búsqueda por nombre.
- Filtrado por precio mínimo y máximo.
- Paginación de resultados.
- Selección de productos por página.
- Conversión de precios a USD y EUR.
- Consulta de tipos de cambio externos.
- Manejo de errores.
- Interfaz adaptable a dispositivos móviles.

## 6. Roles y permisos

| Funcionalidad | Administrador | Usuario |
|---|---|---|
| Iniciar sesión | Sí | Sí |
| Consultar productos | Sí | Sí |
| Buscar productos | Sí | Sí |
| Filtrar productos | Sí | Sí |
| Utilizar paginación | Sí | Sí |
| Cambiar moneda | Sí | Sí |
| Registrar productos | Sí | No |
| Modificar productos | Sí | No |
| Eliminar productos | Sí | No |
| Cerrar sesión | Sí | Sí |

El administrador tiene permisos para gestionar
los productos del inventario.

El usuario normal tiene acceso de solo consulta.

Los nuevos usuarios reciben el rol usuario de
manera predeterminada.

## 7. Estructura del proyecto

    autokimia-inventario/
    |
    |-- backend/
    |   |-- config/
    |   |   |-- db.js
    |   |-- controllers/
    |   |   |-- authController.js
    |   |   |-- productosController.js
    |   |   |-- monedasController.js
    |   |-- middleware/
    |   |   |-- verificarToken.js
    |   |   |-- verificarRol.js
    |   |   |-- validarProducto.js
    |   |   |-- validarConsulta.js
    |   |   |-- validarId.js
    |   |   |-- manejarErrores.js
    |   |-- routes/
    |   |   |-- authRoutes.js
    |   |   |-- productosRoutes.js
    |   |   |-- monedasRoutes.js
    |   |-- services/
    |   |   |-- tipoCambioService.js
    |   |-- server.js
    |
    |-- database/
    |   |-- autokimia_inventario.sql
    |
    |-- frontend/
    |   |-- index.html
    |   |-- styles.css
    |   |-- script.js
    |
    |-- frontend-react/
    |   |-- public/
    |   |-- src/
    |   |   |-- components/
    |   |   |   |-- Encabezado.jsx
    |   |   |   |-- FiltrosProductos.jsx
    |   |   |   |-- FormularioProducto.jsx
    |   |   |   |-- Paginacion.jsx
    |   |   |   |-- SelectorMoneda.jsx
    |   |   |   |-- TablaProductos.jsx
    |   |   |-- pages/
    |   |   |   |-- Login.jsx
    |   |   |   |-- Inventario.jsx
    |   |   |-- services/
    |   |   |   |-- api.js
    |   |   |   |-- jwt.js
    |   |   |-- App.jsx
    |   |   |-- App.css
    |   |   |-- index.css
    |   |   |-- main.jsx
    |   |-- .env.example
    |   |-- package.json
    |   |-- package-lock.json
    |   |-- vite.config.js
    |
    |-- .env.example
    |-- .gitignore
    |-- package.json
    |-- package-lock.json
    |-- README.md

La carpeta frontend contiene la versión original
desarrollada con HTML, CSS y JavaScript.

La carpeta frontend-react contiene la nueva
interfaz gráfica del proyecto final.

## 8. Base de datos

Nombre de la base de datos:

    autokimia_inventario

### Tabla productos

| Campo | Tipo de dato | Descripción |
|---|---|---|
| id | INT | Identificador único |
| nombre | VARCHAR(100) | Nombre del producto |
| descripcion | VARCHAR(255) | Descripción |
| cantidad | INT | Existencias |
| precio | DECIMAL(10,2) | Precio en MXN |

### Tabla usuarios

| Campo | Tipo de dato | Descripción |
|---|---|---|
| id | INT | Identificador único |
| nombre_usuario | VARCHAR(50) | Nombre de usuario |
| password_hash | VARCHAR(255) | Hash de contraseña |
| rol | ENUM | admin o usuario |

Las contraseñas se almacenan como hashes mediante
bcryptjs, utilizando un factor de costo de 12.

Los precios originales se almacenan en pesos
mexicanos.

El archivo de instalación de la base de datos se
encuentra en:

    database/autokimia_inventario.sql

El script crea la base de datos y sus tablas sin
incluir registros confidenciales ni instrucciones
para eliminar tablas existentes.

Está diseñado para instalaciones nuevas y no
actualiza automáticamente tablas existentes.

## 9. API REST

REST: Representational State Transfer.

La API utiliza los métodos HTTP GET, POST, PUT
y DELETE.

### Rutas de autenticación

| Método | Ruta | Función |
|---|---|---|
| POST | /api/auth/registro | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |

### Rutas de productos

| Método | Ruta | Función | Permiso |
|---|---|---|---|
| GET | /api/productos | Consultar productos | Autenticado |
| POST | /api/productos | Registrar producto | Administrador |
| PUT | /api/productos/:id | Modificar producto | Administrador |
| DELETE | /api/productos/:id | Eliminar producto | Administrador |

### Rutas de monedas

| Método | Ruta | Función |
|---|---|---|
| GET | /api/monedas | Consultar tipos de cambio |
| GET | /api/monedas/productos | Consultar precios convertidos |

Las rutas protegidas requieren el encabezado:

    Authorization: Bearer TOKEN_JWT

### Parámetros de búsqueda

- nombre
- precioMin
- precioMax
- pagina
- limite

Ejemplo de consulta:

    GET /api/productos?nombre=Aceite

Ejemplo de filtrado:

    GET /api/productos?precioMin=200&precioMax=300

Ejemplo de paginación:

    GET /api/productos?pagina=1&limite=10

Ejemplo de conversión:

    GET /api/monedas/productos?moneda=USD

## 10. Integración de la API externa

El sistema utiliza Frankfurter API para consultar
tipos de cambio de monedas.

Sitio del proveedor:

https://frankfurter.dev/

Monedas disponibles en la interfaz:

- MXN: peso mexicano.
- USD: dólar estadounidense.
- EUR: euro.

Los precios originales permanecen almacenados en
pesos mexicanos dentro de MySQL.

La conversión se realiza únicamente para mostrar
los precios en la moneda seleccionada.

La interfaz muestra:

- Moneda seleccionada.
- Tipo de cambio.
- Fecha de referencia.
- Proveedor de información.

Cuando ocurre un error al consultar el servicio
externo, la aplicación muestra un mensaje y
permite continuar trabajando en pesos mexicanos.

## 11. Requisitos de instalación

- Node.js compatible con la versión instalada de Vite.
- npm.
- MySQL Server 8.0.
- MySQL Workbench.
- Git.
- Navegador web.
- Conexión a Internet para consultar tipos de cambio.

## 12. Instalación del proyecto

### 12.1. Clonar el repositorio

    git clone https://github.com/Netoman76/autokimia-inventario.git

    cd autokimia-inventario

Seleccionar la rama que contiene el proyecto final
si todavía no está integrada en main.

### 12.2. Instalar las dependencias del backend

Desde la carpeta principal del proyecto:

    npm.cmd ci

### 12.3. Configurar la base de datos

Abrir MySQL Workbench.

Abrir y ejecutar el archivo:

    database/autokimia_inventario.sql

Utilizar este procedimiento para una instalación
nueva de la base de datos.

### 12.4. Configurar las variables del backend

Crear el archivo .env a partir de .env.example.

En PowerShell:

    Copy-Item .env.example .env

Configurar las siguientes variables:

    PORT=3000
    DB_HOST=localhost
    DB_USER=usuario_mysql
    DB_PASSWORD=contraseña_mysql
    DB_NAME=autokimia_inventario
    DB_PORT=3306
    JWT_SECRET=clave_secreta_segura

Los valores anteriores son únicamente ejemplos.

Utilizar las credenciales reales de la instalación
local de MySQL.

Para generar una clave secreta aleatoria:

    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Copiar el resultado generado en JWT_SECRET.

No compartir ni publicar el archivo .env.

### 12.5. Instalar las dependencias del frontend

    cd frontend-react

    npm.cmd ci

### 12.6. Configurar las variables del frontend

Desde la carpeta frontend-react:

    Copy-Item .env.example .env

El archivo deberá contener:

    VITE_API_URL=http://localhost:3000/api

Esta variable indica la dirección del backend.

Las variables VITE_ son accesibles desde el
navegador y no deben contener secretos.

## 13. Ejecución de la aplicación

Es necesario utilizar dos terminales.

### Terminal 1: Backend

Desde la carpeta principal:

    node backend/server.js

Dirección del backend:

    http://localhost:3000

### Terminal 2: Frontend

Desde la carpeta principal:

    cd frontend-react

    npm.cmd run dev

Dirección del frontend:

    http://localhost:5173

Abrir la dirección del frontend en el navegador.

Ambos servidores deben permanecer funcionando
mientras se utiliza la aplicación.

## 14. Creación de usuarios iniciales

El script SQL no incluye usuarios ni contraseñas.

Para crear un usuario, utilizar Postman:

Método:

    POST

Dirección:

    http://localhost:3000/api/auth/registro

Seleccionar Body, raw y JSON.

Ejemplo de contenido:

    {
        "nombre_usuario": "admin",
        "password": "SustituirPorUnaClaveSegura"
    }

Utilizar una contraseña propia y segura.

El usuario se crea inicialmente con el rol usuario.

Para asignar el rol administrador, un operador
autorizado de la base de datos deberá ejecutar:

    USE autokimia_inventario;

    UPDATE usuarios
    SET rol = 'admin'
    WHERE nombre_usuario = 'admin';

Para comprobar los usuarios y sus roles:

    SELECT id, nombre_usuario, rol
    FROM usuarios;

Posteriormente, iniciar sesión desde la aplicación.

Para crear un usuario de solo consulta, repetir
el registro con otro nombre de usuario y una
contraseña diferente, sin modificar su rol.

## 15. Seguridad de la aplicación

El sistema incorpora:

- Autenticación mediante JWT.
- Hash de contraseñas mediante bcryptjs.
- Factor de costo bcrypt de 12.
- Vigencia del token de una hora.
- Control de acceso mediante roles.
- Middleware de verificación de tokens.
- Middleware de verificación de permisos.
- Validación de datos en el frontend.
- Validación de datos en el backend.
- Consultas SQL parametrizadas.
- Manejo centralizado de errores.
- Confirmación antes de eliminar productos.
- Variables de entorno para credenciales privadas.
- Exclusión de archivos confidenciales mediante Git.

Los archivos .env no se incluyen en el repositorio.

El archivo .env.example contiene únicamente
configuraciones de ejemplo.

La aplicación está diseñada para fines académicos
y ejecución local.

Antes de utilizarla en producción se recomienda
configurar HTTPS, restringir CORS, limitar intentos
de autenticación y revisar la administración de
sesiones y permisos.

## 16. Pruebas realizadas

Las pruebas se realizaron utilizando Postman,
Google Chrome y MySQL Workbench.

| Prueba | Resultado |
|---|---|
| Conexión con MySQL | Correcto |
| Registro de usuarios | Correcto |
| Inicio de sesión válido | Correcto |
| Rechazo de contraseña incorrecta | Correcto |
| Consulta de productos | Correcto |
| Registro de productos | Correcto |
| Modificación de productos | Correcto |
| Cancelación de modificaciones | Correcto |
| Eliminación de productos | Correcto |
| Validación de campos obligatorios | Correcto |
| Rechazo de cantidades negativas | Correcto |
| Rechazo de precios negativos | Correcto |
| Rechazo de cantidades decimales | Correcto |
| Búsqueda por nombre | Correcto |
| Filtrado por precio | Correcto |
| Búsqueda sin resultados | Correcto |
| Validación de rango de precios | Correcto |
| Navegación entre páginas | Correcto |
| Cambio de productos por página | Correcto |
| Conversión de MXN a USD | Correcto |
| Conversión de MXN a EUR | Correcto |
| Regreso a precios en MXN | Correcto |
| Paginación con moneda extranjera | Correcto |
| Filtrado con moneda extranjera | Correcto |
| Conservación de precios en MySQL | Correcto |
| Interfaz de administrador | Correcto |
| Interfaz de usuario de solo consulta | Correcto |
| Manejo de errores de la API externa | Correcto |
| Cierre de sesión | Correcto |
| Compilación del frontend React | Correcto |

Las operaciones de registro, modificación y
eliminación de productos fueron comprobadas
también directamente en MySQL Workbench.

Las pruebas realizadas fueron principalmente
manuales y funcionales.

## 17. Compilación del frontend

Desde la carpeta frontend-react:

    npm.cmd run build

Vite genera una versión optimizada de la aplicación
dentro de la carpeta dist.

Para visualizar la compilación localmente:

    npm.cmd run preview

El backend debe permanecer disponible para que
las funcionalidades de la aplicación operen.

## 18. Control de versiones

El proyecto utiliza Git y GitHub para administrar
las diferentes versiones del código fuente.

Repositorio:

https://github.com/Netoman76/autokimia-inventario

Ramas de desarrollo:

- main: rama principal.
- proyecto-final: desarrollo del proyecto final.

Se utilizan archivos .gitignore para excluir:

- Variables de entorno privadas.
- Dependencias node_modules.
- Archivos de registro.
- Archivos de configuración local.
- Archivos de compilación dist.

## 19. Conclusión

El Sistema de Inventario Autokimia permitió aplicar
los conocimientos adquiridos durante la materia
Desarrollo Full Stack.

Se implementó una aplicación web que integra una
interfaz gráfica desarrollada con React, un backend
con Node.js y Express, una base de datos MySQL y
un servicio externo para consultar tipos de cambio.

También se incorporaron mecanismos de autenticación,
control de roles, validaciones, manejo de errores,
búsqueda, filtrado y paginación.

El proyecto demuestra la comunicación entre las
diferentes capas de una aplicación Full Stack y
la importancia de organizar el código mediante
componentes reutilizables y servicios.

## 20. Información académica

Universidad: Tecmilenio.

Carrera: Ingeniería en Desarrollo de Software.

Materia: Desarrollo Full Stack.

Entrega: Proyecto Final.

Proyecto: Sistema de Inventario Autokimia.

Año: 2026.

---

## Mejora final: implementación de React Router

### Descripción

Se incorporó React Router al frontend del Sistema de
Inventario Autokimia para administrar la navegación
entre las diferentes páginas de la aplicación.

Esta implementación permite definir rutas públicas,
rutas protegidas y redireccionamientos automáticos
según el estado de autenticación del usuario.

### Tecnología incorporada

- React Router 7.18.7.
- BrowserRouter.
- Routes.
- Route.
- Navigate.

### Rutas de la aplicación

| Ruta | Descripción | Acceso |
|---|---|---|
| / | Redireccionamiento automático | Público |
| /login | Inicio de sesión | Público |
| /inventario | Gestión de inventario | Autenticado |
| * | Control de rutas inexistentes | Público |

### Protección de rutas

La aplicación utiliza el token JWT para consultar
el estado de autenticación del usuario.

Cuando un usuario no cuenta con una sesión válida,
el sistema lo redirecciona automáticamente a la
pantalla de inicio de sesión.

El backend continúa siendo responsable de verificar
la firma, vigencia y permisos del token JWT.

Los permisos de administrador y usuario se conservan
de acuerdo con el rol asignado.

### Administración de sesiones

El token JWT se almacena temporalmente en la memoria
del frontend mediante el Hook useState de React.

Al cerrar sesión o recargar completamente la página,
el token se elimina de la memoria y el usuario debe
autenticarse nuevamente.

### Archivos modificados

- frontend-react/src/main.jsx
- frontend-react/src/App.jsx
- frontend-react/package.json
- frontend-react/package-lock.json

### Pruebas de funcionamiento

Se realizaron pruebas de:

- Inicio de sesión con credenciales correctas.
- Rechazo de credenciales incorrectas.
- Acceso a rutas protegidas sin autenticación.
- Redireccionamiento entre páginas.
- Control de acceso según el rol del usuario.
- Cierre de sesión.
- Actualización de la página.
- Compilación del frontend.

### Resultado

La incorporación de React Router permite contar
con una navegación organizada y un control de acceso
a las páginas de la aplicación.

Se conservan las funcionalidades de gestión de
productos, búsqueda, filtros, paginación y
conversión de monedas.

La compilación de producción se realizó
satisfactoriamente mediante Vite.
## Pruebas automatizadas con Jest y Supertest

### Objetivo

Implementar pruebas automatizadas para comprobar el funcionamiento de la validación de datos y la protección de las rutas de la API REST del Sistema de Inventario Autokimia.

### Herramientas utilizadas

- Jest: framework para realizar pruebas automatizadas en JavaScript.
- Supertest: biblioteca para realizar solicitudes HTTP y verificar las respuestas de una API REST.

### Prueba unitaria

Archivo: `validarProducto.test.js`

Se comprobó que el middleware de validación rechaza los productos que contienen un precio negativo.

El resultado esperado fue una respuesta HTTP 400 (Bad Request), impidiendo que la solicitud continúe hacia el controlador.

Resultado: prueba aprobada.

### Prueba funcional

Archivo: `productos.test.js`

Se realizó una solicitud GET a la ruta `/api/productos` sin proporcionar un token JWT.

El resultado esperado fue una respuesta HTTP 401 (Unauthorized), impidiendo el acceso de usuarios no autenticados.

Se utilizó un controlador simulado para evitar modificar o consultar la base de datos real.

Resultado: prueba aprobada.

### Ejecución de las pruebas

Para ejecutar las pruebas automatizadas desde la carpeta principal del proyecto:

```bash
npm test
```

### Resultados obtenidos

| Indicador | Resultado |
|---|---|
| Conjuntos de pruebas ejecutados | 2 |
| Pruebas aprobadas | 2 |
| Pruebas fallidas | 0 |
| Tiempo de ejecución | 0.902 segundos |

### Auditoría de dependencias

Se realizó una auditoría de las dependencias mediante npm audit.

No se detectaron vulnerabilidades en las dependencias del backend necesarias para producción al ejecutar npm audit --omit=dev.

La auditoría completa reportó 18 vulnerabilidades moderadas relacionadas con dependencias de las herramientas de pruebas.

Estas vulnerabilidades quedan registradas como un punto de mantenimiento pendiente.

### Conclusión

Las dos pruebas automatizadas permitieron comprobar que el sistema rechaza precios negativos e impide el acceso a la API de productos cuando no se proporciona un token JWT.

Los resultados fueron satisfactorios para los casos evaluados, sin afectar la información almacenada en MySQL.