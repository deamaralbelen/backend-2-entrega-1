console.log('✅ Script realtime.js cargado');

const socket = io();

// Mostrar productos
socket.on('productosActualizados', (productos) => {
  const lista = document.getElementById('listaProductos');
  lista.innerHTML = '';
  productos.forEach(prod => {
    lista.innerHTML += `
      <li>
        <strong>${prod.title}</strong> - $${prod.price}
        <button onclick="eliminarProducto(${prod.id})"> Eliminar </button>
      </li>`;
  });
});

// Agregar producto
document.getElementById('formAgregarProducto').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const nuevoProducto = {
    title: form.title.value,
    description: form.description.value,
    code: form.code.value,
    price: Number(form.price.value),
    stock: Number(form.stock.value),
    category: form.category.value
  };
  socket.emit('nuevoProducto', nuevoProducto);
  form.reset();
});

// Eliminar producto
function eliminarProducto(id) {
  socket.emit('eliminarProducto', id);
}