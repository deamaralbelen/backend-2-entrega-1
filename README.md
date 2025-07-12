Backend - Entrega 2  
Coderhouse | Desarrollo Full Stack, Backend I: Desarrollo Avanzado de Backend
Estudiante: Belén De Amaral


Descripción general:

Este proyecto es una tienda ficticia llamada "Reset Store".  


Se trabajó en dos entregas:

Entrega 1 (Base del proyecto):
- Creé un servidor con (Express).
- Trabajé con archivos JSON para guardar los productos.
- Implementé dos rutas API:
  - "/api/products"
  - "/api/carts"
- Incluí una vista con Handlebars ("/") que muestra todos los productos disponibles (vista pública).



Entrega 2 (Sockets + vistas dinámicas):
- Configuré (WebSocket con Socket.IO).
- Creé una nueva vista: "/realtimeproducts" para administrar productos en tiempo real.
  - Permite agregar nuevos productos.
  - Permite eliminar productos con botón.
  - La lista se actualiza automáticamente sin recargar la página.
- Agregué un archivo "realtime.js" para manejar los eventos desde el lado del cliente.