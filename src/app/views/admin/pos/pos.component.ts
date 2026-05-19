import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/menu.service';
import { SalasService } from '../../../services/salas.service';
import { EntradasService } from '../../../services/entradas.service';
import { ToastService } from '../../../services/toast.service';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';

export interface CartItem { id: string; tipo: 'entrada' | 'producto'; ref: any; nombre: string; precio: number; cantidad: number; asientos?: string[]; }

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
  
  // Asientos modal
  modalAsientos = signal(false);
  funcionSeleccionada = signal<any>(null);
  matrizAsientos = signal<any[]>([]);
  asientosSeleccionados = signal<string[]>([]);
  Math = Math;

  totalArticulos = computed(() => this.carrito().reduce((acc, c) => acc + c.cantidad, 0));
  totalPrecio = computed(() => this.carrito().reduce((acc, c) => acc + (c.precio * c.cantidad), 0));

  ngOnInit() {
    this.loadingFunciones.set(true);
    this.ss.listar().subscribe({
      next: (res) => {
        const limite = new Date(Date.now() - 60 * 60 * 1000); // Hasta 1 hora después de iniciada
        const funcList = (res?.data || res || []).flatMap((s: any) => 
          (s.funciones || [])
            .filter((f: any) => new Date(f.fechaInicio || f.inicio) >= limite)
            .map((f: any) => ({ ...f, sala: s }))
        );
        funcList.sort((a: any, b: any) => new Date(a.fechaInicio || a.inicio).getTime() - new Date(b.fechaInicio || b.inicio).getTime());
        this.funciones.set(funcList);
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
  
  abrirModalAsientos(f: any) {
    this.funcionSeleccionada.set(f);
    this.asientosSeleccionados.set([]);
    
    const { filas = 10, asientosPorFila = 12 } = f.sala || {};
    const l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.matrizAsientos.set(Array.from({ length: filas }, (_, i) => ({
      letra: l[i] || `F${i}`, asientos: Array.from({ length: asientosPorFila }, (_, j) => ({ id: `${l[i] || `F${i}`}${j + 1}`, numero: j + 1, estado: 'libre' }))
    })));
    
    this.es.disponibilidadFuncion(f._id || f.id).subscribe({
      next: (res) => this.matrizAsientos.update(m => m.map(fila => ({ ...fila, asientos: fila.asientos.map((a: any) => ({ ...a, estado: (res?.ocupados || []).includes(a.id) ? 'ocupado' : a.estado })) })))
    });
    
    this.modalAsientos.set(true);
  }

  toggleAsiento(id: string) {
    const sel = this.asientosSeleccionados();
    const idx = sel.indexOf(id);
    this.asientosSeleccionados.set(idx > -1 ? sel.filter(s => s !== id) : [...sel, id]);
    this.matrizAsientos.update(m => m.map(f => ({ ...f, asientos: f.asientos.map((a: any) => a.id === id ? { ...a, estado: idx > -1 ? 'libre' : 'seleccionado' } : a) })));
  }
  
  confirmarAsientos() {
    if (this.asientosSeleccionados().length === 0) return;
    const f = this.funcionSeleccionada();
    const itemRef = { ...f, asientosSel: this.asientosSeleccionados() };
    const id = `entrada-${f._id || f.id}-${this.asientosSeleccionados().join('-')}`;
    const nombre = `${f.pelicula?.titulo || f.tituloPelicula || '?'} (SALA ${f.sala?.nombre || '?'}) [${this.asientosSeleccionados().join(', ')}]`;
    const precio = f.precio || 1500;
    
    this.carrito.update(items => [...items, { id, tipo: 'entrada', ref: itemRef, nombre, precio, cantidad: this.asientosSeleccionados().length, asientos: this.asientosSeleccionados() }]);
    this.ts.success(`Añadido: ${nombre}`);
    this.modalAsientos.set(false);
  }

  agregar(item: any, tipo: 'entrada' | 'producto') {
    if (tipo === 'entrada') {
      this.abrirModalAsientos(item);
      return;
    }
    
    const id = `${tipo}-${item._id || item.id}`;
    const nombre = item.nombre;
    const precio = item.precio || 0;
    
    this.carrito.update(items => {
      const ex = items.find(i => i.id === id);
      return ex ? items.map(i => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i) : [...items, { id, tipo, ref: item, nombre, precio, cantidad: 1 }];
    });
  }

  agregarEntrada(f: any) { this.agregar(f, 'entrada'); }
  agregarProducto(p: any) { this.agregar(p, 'producto'); }
  
  updateCant(id: string, delta: number) {
    this.carrito.update(items => items.map(i => {
      if (i.id === id) {
        if (i.tipo === 'entrada') return i; // No cambiar cantidad de entradas asi nomas
        return { ...i, cantidad: i.cantidad + delta };
      }
      return i;
    }).filter(i => i.cantidad > 0));
  }
  
  sumar(item: CartItem) { this.updateCant(item.id, 1); }
  restar(item: CartItem) { 
    if (item.tipo === 'entrada') {
      this.carrito.update(items => items.filter(i => i.id !== item.id));
    } else {
      this.updateCant(item.id, -1);
    }
  }
  
  limpiarCarrito() { if(confirm('¿VACIAR TICKET?')) this.carrito.set([]); }

  cobrar() {
    if (!this.carrito().length) return;
    this.procesando.set(true);
    const entradas = this.carrito().filter(i => i.tipo === 'entrada');
    const productos = this.carrito().filter(i => i.tipo === 'producto').map(p => ({
      nombre: p.nombre,
      precio: p.precio,
      cantidad: p.cantidad
    }));
    
    if (entradas.length) {
      Promise.all(entradas.map(item => new Promise(res => this.es.comprarFuncion(item.ref._id || item.ref.id, { 
        asientos: item.asientos,
        productos: productos // Se mandan los productos en el body
      }).subscribe({next: res, error: res})))).then(() => this.completarCobro());
    } else if (productos.length) {
      this.es.comprarDulceria(productos).subscribe({
        next: () => this.completarCobro(true),
        error: () => {
          this.ts.error('Error registrando venta en dulcería.');
          this.procesando.set(false);
        }
      });
    }
  }

  private completarCobro(dulceria = false) {
    this.ts.success(`VENTA ${dulceria ? 'DULCERÍA ' : ''}REGISTRADA: $${this.totalPrecio().toFixed(2)}`);
    this.carrito.set([]);
    this.procesando.set(false);
  }
}
