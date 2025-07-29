## Proyecto Final Backend - Reset Store

Este proyecto es la entrega final del curso de Backend I, donde desarrollé una API REST con Node.js, Express y MongoDB para gestionar mi e-commerce básico llamado Reset Store.

Implementé endpoints para productos y carritos, con paginación, filtros, ordenamiento y vistas dinámicas con Handlebars.
También integré WebSocket para actualización en tiempo real.

El objetivo principal fue profesionalizar las consultas y la gestión del carrito, respetando la consigna del curso y mejores prácticas.


## Funcionalidades principales implementadas

- Productos:

· Listado paginado con filtros (por categoría o disponibilidad) y orden ascendente/descendente por precio.

· Endpoint GET /api/products con query params limit, page, sort y query.

· Vista web en Handlebars con paginación (/ o /products).

· Vista detalle de producto (/products/:pid) con información completa.


- Carritos:

· Creación, consulta y gestión de productos en el carrito.

· Endpoints para eliminar productos individuales, actualizar cantidades y vaciar carrito.

· Relación entre productos y carritos mediante referencia (populate).

· Vista web con detalle de carrito y productos en /carts/:cid.


- WebSockets:

· Actualización en tiempo real de productos en /realtimeproducts.

· Eventos para agregar y eliminar productos desde el cliente.


- Organización y buenas prácticas:

· Separación de rutas API y vistas en archivos específicos.

· Uso de Handlebars como motor de vistas.

· Manejo de errores y respuestas estándar.

· Uso de Mongoose con paginación.


- Cómo ejecutar el proyecto: 

1. Clonar el repositorio:

git clone https://github.com/belen-deamaral/backend-entrega-final.git
cd backend-entrega-final

2. Instalar dependencias:

npm install

3. Configurar y levantar MongoDB localmente (asegurarse que esté corriendo en mongodb://localhost:27017/backend-1-proyecto-final).

4. Ejecutar el servidor:

npm start

5. Abrir en navegador:

Listado productos: http://localhost:8080/

Vista detalle producto: http://localhost:8080/products/6888705d0ff1f4f7fceec4ac

Vista carrito: http://localhost:8080/carts/6888705d0ff1f4f7fceec4ac

Productos en tiempo real: http://localhost:8080/realtimeproducts


🛠 Cambios desde la entrega anterior:

· Implementación de filtros, paginación y ordenamiento en el listado de productos, según consigna.

· Agregué vistas Handlebars para listado, detalle de productos y carrito.

· Endpoints para actualizar y eliminar productos del carrito.

· Relación de productos en carritos usando populate para obtener detalles completos.

· Integración completa y funcional de WebSockets para actualización en tiempo real.

· Separación de rutas API y vistas en archivos distintos (mejora sugerida por el profe).

· Manejo de errores con vistas personalizadas.


✅ Lo que está completo:

· Backend con MongoDB funcionando correctamente.

· Endpoints de productos y carritos según consigna.

· Vistas Handlebars para productos y carrito.

· WebSockets para productos en tiempo real.

" Manejo básico de errores y rutas.


## Agradecimientos:

Gracias al profe Martín por las correcciones y sugerencias que ayudaron a mejorar este proyecto y la enseñanza.

Saludos, Belén, fue un placer!