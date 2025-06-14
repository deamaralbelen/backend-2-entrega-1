import fs from 'fs/promises';

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo carritos:', error);
      return [];
    }
  }

  async saveCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.error('Error guardando carritos:', error);
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
      const newCart = { id: newId, products: [] };
      carts.push(newCart);
      await this.saveCarts(carts);
      return newCart;
    } catch (error) {
      console.error('Error creando carrito:', error);
      return null;
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      return carts.find(cart => cart.id === id);
    } catch (error) {
      console.error('Error buscando carrito por ID:', error);
      return null;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find(c => c.id === cartId);

      if (!cart) {
        return { error: 'Carrito no encontrado' };
      }

      const productInCart = cart.products.find(p => p.product === productId);

      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await this.saveCarts(carts);
      return { message: 'Producto agregado al carrito', cart };
    } catch (error) {
      console.error('Error agregando producto al carrito:', error);
      return { error: 'Error interno al agregar producto' };
    }
  }
}

export default CartManager;