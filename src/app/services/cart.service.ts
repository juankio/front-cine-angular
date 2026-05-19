import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string; // Puede ser el id de la pelicula/funcion o del producto
  tipo: 'entrada' | 'producto';
  nombre: string;
  precio: number;
  cantidad: number;
  // Específico para entradas
  funcionId?: string;
  salaNombre?: string;
  asientos?: string[];
  fechaInicio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cine_poor_cart';
  items = signal<CartItem[]>([]);

  totalArticulos = computed(() => this.items().reduce((acc, item) => acc + item.cantidad, 0));
  totalPrecio = computed(() => this.items().reduce((acc, item) => acc + (item.precio * item.cantidad), 0));

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    try {
      const stored = localStorage.getItem(this.CART_KEY);
      if (stored) {
        this.items.set(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading cart', e);
    }
  }

  private saveCart() {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.items()));
  }

  addEntradas(funcion: any, asientos: string[], precioUnitario: number) {
    const id = `entrada-${funcion._id || funcion.id}-${asientos.join('-')}`;
    const nombre = `${funcion.pelicula?.titulo || funcion.tituloPelicula || 'Película'}`;
    
    this.items.update(curr => {
      // Las entradas se agregan como un solo item en el carrito con cantidad = numero de asientos
      return [...curr, {
        id,
        tipo: 'entrada',
        nombre,
        precio: precioUnitario,
        cantidad: asientos.length,
        funcionId: funcion._id || funcion.id,
        salaNombre: funcion.sala?.nombre,
        asientos,
        fechaInicio: funcion.inicio || funcion.fechaInicio
      }];
    });
    this.saveCart();
  }

  addProducto(producto: any, cantidad: number = 1) {
    const id = `prod-${producto._id || producto.id}`;
    this.items.update(curr => {
      const ex = curr.find(i => i.id === id);
      if (ex) {
        return curr.map(i => i.id === id ? { ...i, cantidad: i.cantidad + cantidad } : i);
      }
      return [...curr, {
        id,
        tipo: 'producto',
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad
      }];
    });
    this.saveCart();
  }

  removeItem(id: string) {
    this.items.update(curr => curr.filter(i => i.id !== id));
    this.saveCart();
  }

  clear() {
    this.items.set([]);
    localStorage.removeItem(this.CART_KEY);
  }
}
