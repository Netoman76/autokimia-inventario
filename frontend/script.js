
/*
  JAVASCRIPT DEL INVENTARIO AUTOKIMIA

  Paso 45: Inicio de sesión con JWT
*/

// Guardaremos temporalmente el token del usuario
let tokenJWT = null;

// Identificamos el formulario de inicio de sesión
const formLogin = document.getElementById("formLogin");

// Identificamos las secciones de la página
const seccionLogin = document.getElementById("seccionLogin");
const seccionInventario = document.getElementById("seccionInventario");

// Identificamos dónde mostraremos los mensajes
const mensajeLogin = document.getElementById("mensajeLogin");
const mensajeProducto = document.getElementById("mensajeProducto");


// ==========================================
// FUNCIÓN: INICIAR SESIÓN
// ==========================================

// Detectamos cuando se envía el formulario
formLogin.addEventListener("submit", async (evento) => {

    // Evitamos que la página se recargue
    evento.preventDefault();

    // Obtenemos los datos escritos por el usuario
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("password").value;

    try {

        // Mostramos un mensaje mientras se valida
        mensajeLogin.textContent = "Verificando usuario...";

        // Enviamos las credenciales al backend
        const respuesta = await fetch("/api/auth/login", {

            // Indicamos que enviaremos información
            method: "POST",

            // Indicamos que los datos serán JSON
            headers: {
                "Content-Type": "application/json"
            },

            // Convertimos los datos de JavaScript a JSON
            body: JSON.stringify({
                nombre_usuario: usuario,
                password: contrasena
            })

        });

        // Convertimos la respuesta JSON en un objeto
        const datos = await respuesta.json();

        // Comprobamos si el inicio de sesión falló
        if (!respuesta.ok) {

            mensajeLogin.textContent =
                datos.mensaje || "No se pudo iniciar sesión";

            return;
        }

        // Comprobamos que recibimos un token
        if (!datos.token) {
            throw new Error("El servidor no devolvió un token");
        }

        // Guardamos el JWT en memoria
        tokenJWT = datos.token;

        // Limpiamos el campo de contraseña
        document.getElementById("password").value = "";

        // Ocultamos el formulario de inicio de sesión
        seccionLogin.hidden = true;

        // Mostramos la sección del inventario
        seccionInventario.hidden = false;

        // Mostramos un mensaje de confirmación
        mensajeProducto.textContent =
            "Inicio de sesión correcto";
        
        // Consultamos los productos después de iniciar sesión
        await cargarProductos();

        


    } catch (error) {

        // Mostramos un error si falla la comunicación
        console.error("Error de conexión:", error.message);

        mensajeLogin.textContent =
            "Ocurrió un error al conectar con el servidor";

    }

});


/*===================================================================
  PASO 46: CONSULTAR PRODUCTOS (READ)
  Mostramos los productos de MySQL en HTML
  ====================================================================
*/

async function cargarProductos() {

    try {

        // Consultamos los productos desde nuestra API
        const respuesta = await fetch("/api/productos");

        // Comprobamos si ocurrió algún error HTTP
        if (!respuesta.ok) {
            throw new Error("No se pudieron consultar los productos");
        }

        // Convertimos la respuesta JSON en un arreglo
        const productos = await respuesta.json();

        // Buscamos el cuerpo de nuestra tabla HTML
        const tabla = document.getElementById("listaProductos");

        // Limpiamos la tabla antes de mostrar los productos
        tabla.replaceChildren();

        // Comprobamos si existen productos registrados
        if (productos.length === 0) {

            const fila = document.createElement("tr");
            const celda = document.createElement("td");

            celda.colSpan = 5;
            celda.textContent = "No hay productos registrados";

            fila.appendChild(celda);
            tabla.appendChild(fila);

            return;
        }

        // Recorremos todos los productos recibidos
        
        // Recorremos los productos recibidos
        productos.forEach((producto) => {

            // Creamos una nueva fila en la tabla
            const fila = document.createElement("tr");

            // Preparamos los datos del producto
            const valores = [
                producto.id,
                producto.nombre,
                producto.cantidad,
                Number(producto.precio).toFixed(2)
            ];

            // Creamos una celda para cada dato
            valores.forEach((valor) => {

                const celda = document.createElement("td");

                // Escribimos el contenido de la celda
                celda.textContent = valor;

                // Agregamos la celda a la fila
                fila.appendChild(celda);

            });

            // Creamos una celda para las acciones
            const celdaAcciones = document.createElement("td");

            // Creamos el botón Editar
            const botonEditar = document.createElement("button");

            // Configuramos el botón
            botonEditar.type = "button";
            botonEditar.textContent = "Editar";
            botonEditar.className = "btn-editar";

            // Detectamos cuando se presiona Editar
            botonEditar.addEventListener("click", () => {

                // Guardamos el ID del producto seleccionado
                document.getElementById("productoId").value =
                    producto.id;

                // Cargamos el nombre
                document.getElementById("nombre").value =
                    producto.nombre;

                // Cargamos la descripción
                document.getElementById("descripcion").value =
                    producto.descripcion || "";

                // Cargamos la cantidad
                document.getElementById("cantidad").value =
                    producto.cantidad;

                // Cargamos el precio
                document.getElementById("precio").value =
                    producto.precio;

                // Mostramos un mensaje informativo
                mensajeProducto.textContent =
                    "Editando producto: " + producto.nombre;

                // Desplazamos la página hasta el formulario
                document.getElementById("formProducto")
                    .scrollIntoView({ behavior: "smooth" });

            });

            // Agregamos el botón a la celda de acciones
            celdaAcciones.appendChild(botonEditar);

/*=============================================================================
  BOTÓN ELIMINAR PRODUCTO

  ============================================================================
*/

// Creamos el botón Eliminar
const botonEliminar = document.createElement("button");

// Configuramos el botón
botonEliminar.type = "button";
botonEliminar.textContent = "Eliminar";
botonEliminar.className = "btn-eliminar";

// Detectamos cuando el usuario presiona Eliminar
botonEliminar.addEventListener("click", async () => {

    // Verificamos que exista un token JWT
    if (!tokenJWT) {
        mensajeProducto.textContent = "Debes iniciar sesión";
        return;
    }

    // Solicitamos confirmación antes de borrar
    const confirmar = window.confirm(
        `¿Deseas eliminar el producto "${producto.nombre}"?`
    );

    // Si el usuario cancela, no eliminamos nada
    if (!confirmar) {
        return;
    }

    try {

        // Enviamos la solicitud DELETE al backend
        const respuesta = await fetch(
            `/api/productos/${producto.id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${tokenJWT}`
                }
            }
        );

        // Convertimos la respuesta a JSON
        const datos = await respuesta.json();

        // Comprobamos si ocurrió algún error
        if (!respuesta.ok) {
            mensajeProducto.textContent =
                datos.mensaje || "Error al eliminar producto";
            return;
        }

        // Limpiamos el formulario si editábamos ese producto
        const campoId = document.getElementById("productoId");

        if (campoId.value === String(producto.id)) {
            formProducto.reset();
            campoId.value = "";
        }

        // Actualizamos nuestra tabla
        await cargarProductos();

        // Mostramos un mensaje de confirmación
        mensajeProducto.textContent =
            "Producto eliminado correctamente";

    } catch (error) {

        // Mostramos el error en la consola
        console.error("Error al eliminar:", error.message);

        mensajeProducto.textContent =
            "Error de comunicación con el servidor";

    }

});

// Agregamos el botón Eliminar a la celda
celdaAcciones.appendChild(botonEliminar);

            // Agregamos la celda a nuestra fila
            fila.appendChild(celdaAcciones);

            // Mostramos la fila en la tabla
            tabla.appendChild(fila);

        });


    } catch (error) {

        // Mostramos los errores en la consola
        console.error("Error al cargar productos:", error.message);

        // Informamos al usuario
        mensajeProducto.textContent =
            "No se pudieron cargar los productos";

    }

}

/*
  PASO 49: CREAR Y ACTUALIZAR PRODUCTOS
  POST = Registrar un producto nuevo
  PUT  = Modificar un producto existente
*/

// Identificamos el formulario HTML
const formProducto = document.getElementById("formProducto");

// Detectamos cuando presionamos Guardar producto
formProducto.addEventListener("submit", async (evento) => {

    // Evitamos que la página se recargue
    evento.preventDefault();

    // Verificamos que exista una sesión
    if (!tokenJWT) {
        mensajeProducto.textContent = "Debes iniciar sesión";
        return;
    }

    // Obtenemos los datos del formulario
    const nombre = document.getElementById("nombre").value.trim();

    const descripcion = document.getElementById("descripcion").value.trim();

    const cantidadTexto = document.getElementById("cantidad").value;

    const precioTexto = document.getElementById("precio").value;

    // Convertimos los datos numéricos
    const cantidad = Number(cantidadTexto);
    const precio = Number(precioTexto);

    // Validamos los datos
    if (
        !nombre ||
        cantidadTexto === "" ||
        precioTexto === "" ||
        !Number.isInteger(cantidad) ||
        cantidad < 0 ||
        !Number.isFinite(precio) ||
        precio < 0
    ) {
        mensajeProducto.textContent = "Revisa los datos del producto";
        return;
    }

    // Obtenemos el ID del producto seleccionado
    const productoId = document.getElementById("productoId").value;

    // Si existe un ID, estamos editando
    const editando = productoId !== "";

    // Elegimos la dirección de nuestra API
    const url = editando
        ? `/api/productos/${productoId}`
        : "/api/productos";

    // Elegimos PUT para editar o POST para crear
    const metodo = editando ? "PUT" : "POST";

    try {

        // Informamos que estamos procesando los datos
        mensajeProducto.textContent = "Guardando producto...";

        // Enviamos los datos al servidor
        const respuesta = await fetch(url, {

            method: metodo,

            // Enviamos los datos y nuestro JWT
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenJWT}`
            },

            // Convertimos los datos a JSON
            body: JSON.stringify({
                nombre,
                descripcion,
                cantidad,
                precio
            })

        });

        // Recibimos la respuesta del servidor
        const datos = await respuesta.json();

        // Verificamos si hubo algún error
        if (!respuesta.ok) {

            mensajeProducto.textContent =
                datos.mensaje || "Error al guardar el producto";

            return;
        }

        // Limpiamos los campos del formulario
        formProducto.reset();

        // Borramos el ID para salir del modo edición
        document.getElementById("productoId").value = "";

        // Actualizamos la tabla con los datos de MySQL
        await cargarProductos();

        // Mostramos el resultado
        if (editando) {

            mensajeProducto.textContent =
                "Producto actualizado correctamente";

        } else {

            mensajeProducto.textContent =
                `Producto registrado correctamente (ID ${datos.id})`;

        }

    } catch (error) {

        // Mostramos el error en la consola
        console.error("Error al guardar:", error.message);

        mensajeProducto.textContent =
            "Error de comunicación con el servidor";

    }

});

/*
  BOTÓN CANCELAR EDICIÓN
*/

// Identificamos el botón
const btnCancelar = document.getElementById("btnCancelar");

// Detectamos cuando lo presionamos
btnCancelar.addEventListener("click", () => {

    // Limpiamos todos los campos
    formProducto.reset();

    // Eliminamos el ID del producto seleccionado
    document.getElementById("productoId").value = "";

    // Mostramos un mensaje
    mensajeProducto.textContent = "Edición cancelada";

});

/*
  PASO 52: CERRAR SESIÓN
  Sistema de Inventario Autokimia
*/

// Identificamos el botón Cerrar sesión
const btnSalir = document.getElementById("btnSalir");

// Detectamos cuando el usuario presiona el botón
btnSalir.addEventListener("click", () => {

    // Eliminamos nuestro token JWT de memoria
    tokenJWT = null;

    // Limpiamos el formulario de inicio de sesión
    formLogin.reset();

    // Limpiamos el formulario de productos
    formProducto.reset();

    // Eliminamos el ID del producto seleccionado
    document.getElementById("productoId").value = "";

    // Quitamos los productos mostrados en la tabla
    document.getElementById("listaProductos").replaceChildren();

    // Limpiamos los mensajes anteriores
    mensajeProducto.textContent = "";

    // Ocultamos la sección del inventario
    seccionInventario.hidden = true;

    // Mostramos nuevamente el formulario de login
    seccionLogin.hidden = false;

    // Mostramos un mensaje de confirmación
    mensajeLogin.textContent =
        "Sesión cerrada correctamente";

    // Regresamos al inicio de la página
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
