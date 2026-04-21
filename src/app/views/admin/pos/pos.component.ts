import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/menu.service';
import { SalasService } from '../../../services/salas.service';
import { EntradasService } from '../../../services/entradas.service';
import { ToastService } from '../../../services/toast.service';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';

export interface CartItem { id: string; tipo: 'entrada' | 'producto'; ref: any; nombre: string; precio: number; cantidad: number; }

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, HlmCardImports, HlmButtonImports],
  templateUrl: './pos.component.html',
  styles: [`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: hsl(var(--background)); } .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--primary)); }`]
})
export class PosComponent implements OnInit {
  private ms = inject(MenuService);
  private ss = inject(SalasService);
  private es = inject(EntradasService);
  private ts = inject(ToastService);

  modo = signal<'taquilla' | 'dulceria'>('taquilla');
  productos = signal<any[]>([]);
  funciones = signal<any[]>([]);
  loadingFunciones = signal(false);
  loadingProductos = signal(false);
  carrito = signal<CartItem[]>([]);
  procesando = signal(false);

  totalArticulos = computed(() => this.carrito().reduce((acc, c) => acc + c.cantidad, 0));
  totalPrecio = computed(() => this.carrito().reduce((acc, c) => acc + (c.precio * c.cantidad), 0));

  ngOnInit() {
    this.loadingFunciones.set(true);
    this.ss.listar().subscribe({
      next: (res) => {
        this.funciones.set((res?.data || res || []).flatMap((s: any) => (s.funciones || []).map((f: any) => ({ ...f, sala: s }))));
        this.loadingFunciones.set(false);
      },
      error: () => this.loadingFunciones.set(false)
    });

    this.loadingProductos.set(true);
    this.ms.listar().subscribe({
      next: (res) => {
        this.productos.set(Array.isArray(res?.data || res) ? (res?.data || res) : []);
        this.loadingProductos.set(false);
      },
      error: () => this.loadingProductos.set(false)
    });
  }

  agregar(item: any, tipo: 'entrada' | 'producto') {
    const id = `${tipo}-${item._id || item.id}`;
    const nombre = tipo === 'entrada' ? `${item.pelicula?.titulo || item.tituloPelicula || '?'} (SALA ${item.sala?.nombre || '?'})` : item.nombre;
    const precio = item.precio || (tipo === 'entrada' ? 1500 : 0);
    
    this.carrito.update(items => {
      const ex = items.find(i => i.id === id);
      return ex ? items.map(i => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i) : [...items, { id, tipo, ref: item, nombre, precio, cantidad: 1 }];
    });
    if(tipo === 'entrada') this.ts.success(`Añadido: ${nombre}`);
  }

  agregarEntrada(f: any) { this.agregar(f, 'entrada'); }
  agregarProducto(p: any) { this.agregar(p, 'producto'); }
  
  updateCant(id: string, delta: number) {
    this.carrito.update(items => items.map(i => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i).filter(i => i.cantidad > 0));
  }
  
  sumar(item: CartItem) { this.updateCant(item.id, 1); }
  restar(item: CartItem) { this.updateCant(item.id, -1); }
  
  limpiarCarrito() { if(confirm('¿VACIAR TICKET?')) this.carrito.set([]); }

  cobrar() {
    if (!this.carrito().length) return;
    this.procesando.set(true);
    const entradas = this.carrito().filter(i => i.tipo === 'entrada');
    
    if (entradas.length) {
      Promise.all(entradas.map(item => new Promise(res => this.es.comprarFuncion(item.ref.id || item.ref._id, { 
        asientos: Array.from({length: item.cantidad}).map((_, i) => `TQ${Math.floor(Math.random()*1000)}-${i}`) 
      }).subscribe({next: res, error: res})))).then(() => this.completarCobro());
    } else {
      setTimeout(() => this.completarCobro(true), 800);
    }
  }

  private completarCobro(dulceria = false) {
    this.ts.success(`VENTA ${dulceria ? 'DULCERÍA ' : ''}REGISTRADA: $${this.totalPrecio().toFixed(2)}`);
    this.carrito.set([]);
    this.procesando.set(false);
  }
}
