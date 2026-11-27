/*
    Script de instalación de la base de datos
    Proyecto Final - Desarrollo Full Stack
    Sistema de Inventario Autokimia

    Motor de base de datos: MySQL 8.0
*/


-- ============================================
-- 1. CREAR LA BASE DE DATOS
-- ============================================

CREATE DATABASE IF NOT EXISTS autokimia_inventario
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;


-- Seleccionamos la base de datos

USE autokimia_inventario;


-- ============================================
-- 2. CREAR LA TABLA PRODUCTOS
-- ============================================

CREATE TABLE IF NOT EXISTS productos (

    -- Identificador único del producto
    id INT NOT NULL AUTO_INCREMENT,

    -- Nombre del producto
    nombre VARCHAR(100) NOT NULL,

    -- Descripción del producto
    descripcion VARCHAR(255) DEFAULT NULL,

    -- Cantidad disponible en el inventario
    cantidad INT NOT NULL DEFAULT 0,

    -- Precio original en pesos mexicanos
    precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    -- Definimos la llave primaria
    PRIMARY KEY (id)

) ENGINE=InnoDB;


-- ============================================
-- 3. CREAR LA TABLA USUARIOS
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios (

    -- Identificador único del usuario
    id INT NOT NULL AUTO_INCREMENT,

    -- Nombre utilizado para iniciar sesión
    nombre_usuario VARCHAR(50) NOT NULL,

    -- Hash de la contraseña generado con bcrypt
    password_hash VARCHAR(255) NOT NULL,

    -- Rol que determina los permisos del usuario
    rol ENUM('admin', 'usuario')
        NOT NULL DEFAULT 'usuario',

    -- Definimos la llave primaria
    PRIMARY KEY (id),

    -- Evitamos nombres de usuario duplicados
    UNIQUE KEY nombre_usuario (nombre_usuario)

) ENGINE=InnoDB;


-- ============================================
-- 4. VERIFICAR LA CREACION DE LAS TABLAS
-- ============================================

SHOW TABLES;


-- Consultamos la estructura de las tablas

DESCRIBE productos;

DESCRIBE usuarios;


/*
    NOTAS DE SEGURIDAD:

    1. Las credenciales de MySQL se configuran
       mediante el archivo .env.

    2. Las contraseñas de los usuarios se
       almacenan como hashes mediante bcrypt.

    3. Los usuarios nuevos tienen el rol
       usuario de manera predeterminada.

    4. Los precios se almacenan en MXN.
       La conversión a USD y EUR se realiza
       únicamente para efectos de visualización.

    5. Este archivo no contiene contraseñas,
       tokens JWT ni registros confidenciales.

    6. Este script está diseñado para una
       instalación nueva. No modifica la
       estructura de tablas ya existentes.
*/