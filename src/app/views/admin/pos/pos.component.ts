import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/menu.service';
import { SalasService } from '../../../services/salas.service';
import { EntradasService } from '../../../services/entradas.service';
import { ToastService } from '../../../services/toast.service';

import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';

export interface CartItem {
  id: string;
  tipo: 'entrada' | 'producto';
  ref: any;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, HlmCardImports, HlmButtonImports],
  template: `
    <div class="h-[calc(100vh-64px)] w-full flex flex-col md:flex-row text-foreground gap-6 p-6 font-body overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      <!-- Zona Principal (Tabs + Grid) -->
      <div class="flex-1 flex flex-col h-full overflow-hidden">
        
        <div class="flex gap-4 mb-6 shrink-0">
          <button 
            (click)="modo.set('taquilla')" 
            [class.bg-primary]="modo() === 'taquilla'"
            [class.text-primary-foreground]="modo() === 'taquilla'"
            [class.border-primary]="modo() === 'taquilla'"
            [class.border-border]="modo() !== 'taquilla'"
            [class.text-muted-foreground]="modo() !== 'taquilla'"
            class="flex-1 py-4 text-3xl font-display uppercase tracking-widest border-2 transition-all hover:border-primary shadow-sm hover:shadow-md">
            Taquilla
          </button>
          <button 
            (click)="modo.set('dulceria')"
            [class.bg-primary]="modo() === 'dulceria'"
            [class.text-primary-foreground]="modo() === 'dulceria'"
            [class.border-primary]="modo() === 'dulceria'"
            [class.border-border]="modo() !== 'dulceria'"
            [class.text-muted-foreground]="modo() !== 'dulceria'"
            class="flex-1 py-4 text-3xl font-display uppercase tracking-widest border-2 transition-all hover:border-primary shadow-sm hover:shadow-md">
            Dulcería
          </button>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 pb-8 custom-scrollbar">
          
          <!-- TAB: TAQUILLA -->
          @if (modo() === 'taquilla') {
            @if (loadingFunciones()) {
              <div class="py-20 text-center text-primary/50 flex flex-col items-center">
                <div class="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
                <p class="font-display tracking-widest uppercase">Cargando funciones...</p>
              </div>
            } @else if (funciones().length === 0) {
              <div class="py-20 text-center text-muted-foreground flex flex-col items-center">
                <p class="font-display tracking-widest uppercase text-xl">No hay funciones hoy</p>
              </div>
            } @else {
              <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                @for (funcion of funciones(); track funcion._id || funcion.id) {
                  <div class="cursor-pointer group hover:border-primary/50 transition-all bg-card/60 backdrop-blur-md shadow-sm border border-border/50 rounded-xl flex flex-col p-4 relative overflow-hidden hover:shadow-md hover:-translate-y-1" (click)="agregarEntrada(funcion)">
                    <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative z-10 flex flex-col h-full justify-between gap-4">
                      <div class="flex items-start justify-between">
                        <div>
                          <p class="text-xs text-primary font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {{ funcion.inicio | date:'shortTime' }}
                          </p>
                          <h3 class="font-display text-xl uppercase font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{{ funcion.pelicula?.titulo || funcion.tituloPelicula || 'Película Desconocida' }}</h3>
                        </div>
                        <div class="text-right">
                          <div class="font-display tracking-widest text-primary text-xl">\${{ funcion.precio | number:'1.2-2' }}</div>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-2 mt-auto">
                        <span class="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-muted/50 text-muted-foreground uppercase tracking-widest border border-border/50">{{ funcion.formato }}</span>
                        <span class="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-muted/50 text-muted-foreground uppercase tracking-widest border border-border/50">{{ funcion.idioma }}</span>
                        <span class="text-xs text-muted-foreground truncate ml-auto font-medium">{{ funcion.salaNombre }}</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          }

          <!-- TAB: DULCERÍA -->
          @if (modo() === 'dulceria') {
            @if (loadingProductos()) {
              <div class="py-20 text-center text-primary/50 flex flex-col items-center">
                <div class="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
                <p class="font-display tracking-widest uppercase">Cargando menú...</p>
              </div>
            } @else if (productos().length === 0) {
              <div class="py-20 text-center text-muted-foreground flex flex-col items-center">
                <p class="font-display tracking-widest uppercase text-xl">El menú está vacío</p>
              </div>
            } @else {
              <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                @for (item of productos(); track item._id || item.id) {
                  <div class="cursor-pointer group hover:border-primary/50 transition-all bg-card/60 backdrop-blur-md shadow-sm border border-border/50 rounded-xl flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-1" (click)="agregarProducto(item)">
                    <div class="relative h-32 overflow-hidden bg-muted/50 flex items-center justify-center">
                      <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                      @if (item.imagenUrl) {
                        <img [src]="item.imagenUrl" alt="Producto" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/30 transition-transform duration-500 group-hover:scale-110"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="1" y2="3"/><line x1="10" x2="10" y1="1" y2="3"/><line x1="14" x2="14" y1="1" y2="3"/></svg>
                      }
                    </div>
                    <div class="p-4 flex-1 flex flex-col justify-between bg-card/80 backdrop-blur-sm border-t border-border/50 relative z-20">
                      <h3 class="font-body font-medium text-lg text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">{{ item.nombre }}</h3>
                      <div class="font-display tracking-widest text-primary text-2xl">\${{ item.precio | number:'1.2-2' }}</div>
                    </div>
                  </div>
                }
              </div>
            }
          }
        </div>
      </div>

      <!-- TICKET -->
      <aside class="w-full md:w-[450px] shrink-0 flex flex-col h-full overflow-hidden relative z-20">
        <div class="flex-1 flex flex-col h-full bg-card border-2 border-border rounded-none overflow-hidden relative shadow-lg">
          
          <div class="absolute top-0 inset-x-0 h-1 bg-primary"></div>
          
          <div class="p-5 border-b border-border bg-muted/30">
            <h3 class="font-display tracking-widest uppercase text-3xl flex items-center gap-3 text-foreground">
              <span class="text-primary">>></span> TICKET
            </h3>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
            @if (carrito().length === 0) {
              <div class="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <p class="font-display tracking-widest uppercase text-lg">No hay productos</p>
              </div>
            } @else {
              @for (item of carrito(); track item.id) {
                <div class="flex items-center justify-between p-3 bg-background border border-border/50 hover:border-primary/30 rounded-lg transition-colors group">
                  <div class="flex-1 min-w-0 pr-3">
                    <div class="text-[10px] font-bold uppercase tracking-wider mb-1 text-primary">{{ item.tipo }}</div>
                    <div class="font-body font-medium text-base text-foreground leading-tight truncate">{{ item.nombre }}</div>
                    <div class="text-xs text-muted-foreground font-display tracking-wider mt-1">\${{ item.precio | number:'1.2-2' }} C/U</div>
                  </div>
                  
                  <div class="flex flex-col items-end gap-2">
                    <div class="font-display tracking-widest text-xl text-primary">
                      \${{ (item.precio * item.cantidad) | number:'1.2-2' }}
                    </div>
                    <div class="flex items-center bg-muted/50 rounded-md border border-border/50 overflow-hidden">
                      <button class="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all font-bold" (click)="restar(item)">-</button>
                      <span class="w-8 text-center text-sm font-bold bg-background h-8 flex items-center justify-center text-foreground">{{ item.cantidad }}</span>
                      <button class="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary transition-all font-bold" (click)="sumar(item)">+</button>
                    </div>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Total y Botones -->
          <div class="p-6 border-t border-border/50 bg-card/80 backdrop-blur-xl">
            <div class="flex justify-between items-center mb-2 text-muted-foreground">
              <span class="font-display tracking-wider uppercase text-sm">Artículos</span>
              <span class="font-bold font-body text-lg text-foreground">{{ totalArticulos() }}</span>
            </div>
            <div class="flex justify-between items-end mb-6">
              <span class="text-xl font-display tracking-widest uppercase text-muted-foreground">Total:</span>
              <span class="text-5xl font-display tracking-widest text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]">\${{ totalPrecio() | number:'1.2-2' }}</span>
            </div>
            
            <div class="grid grid-cols-[1fr_2fr] gap-3">
              <button class="w-full h-16 font-display tracking-widest uppercase border border-border text-foreground bg-card rounded-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors" (click)="limpiarCarrito()" [disabled]="carrito().length === 0">
                Anular
              </button>
              <button class="w-full h-16 font-display tracking-[0.2em] uppercase text-2xl text-primary-foreground bg-primary rounded-sm shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] disabled:opacity-50 disabled:shadow-none transition-all" (click)="cobrar()" [disabled]="carrito().length === 0 || procesando()">
                {{ procesando() ? 'PROCESANDO...' : 'COBRAR' }}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: hsl(var(--background));
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: hsl(var(--border));
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: hsl(var(--primary));
    }
  `]
})
export class PosComponent implements OnInit {
  private menuService = inject(MenuService);
  private salasService = inject(SalasService);
  private entradasService = inject(EntradasService);
  private toastService = inject(ToastService);

  modo = signal<'taquilla' | 'dulceria'>('taquilla');

  productos = signal<any[]>([]);
  funciones = signal<any[]>([]);
  
  loadingProductos = signal(false);
  loadingFunciones = signal(false);
  
  carrito = signal<CartItem[]>([]);
  procesando = signal(false);

  totalArticulos = computed(() => {
    return this.carrito().reduce((acc, curr) => acc + curr.cantidad, 0);
  });

  totalPrecio = computed(() => {
    return this.carrito().reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0);
  });

  ngOnInit() {
    this.cargarFunciones();
    this.cargarProductos();
  }

  cargarFunciones() {
    this.loadingFunciones.set(true);
    this.salasService.listar().subscribe({
      next: (res) => {
        const salas = res?.data || res || [];
        let all: any[] = [];
        salas.forEach((sala: any) => {
          if (sala.funciones) {
            const f = sala.funciones.map((func: any) => ({ ...func, sala }));
            all = [...all, ...f];
          }
        });
        // Ordenar por hora de inicio si se desea, o dejar tal cual
        this.funciones.set(all);
        this.loadingFunciones.set(false);
      },
      error: (err) => {
        console.error('Error cargando funciones POS', err);
        this.loadingFunciones.set(false);
      }
    });
  }

  cargarProductos() {
    this.loadingProductos.set(true);
    this.menuService.listar().subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.productos.set(Array.isArray(data) ? data : []);
        this.loadingProductos.set(false);
      },
      error: (err) => {
        console.error('Error cargando catálogo POS', err);
        this.loadingProductos.set(false);
      }
    });
  }

  agregarEntrada(funcion: any) {
    const id = `entrada-${funcion._id || funcion.id}`;
    const peliculaTitulo = funcion.pelicula?.titulo || funcion.tituloPelicula || 'Película Sin Título';
    const salaNombre = funcion.sala?.nombre || '?';
    const precio = funcion.precio || 1500;

    this.carrito.update(items => {
      const exists = items.find(i => i.id === id);
      if (exists) {
        return items.map(i => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...items, {
        id,
        tipo: 'entrada',
        ref: funcion,
        nombre: `${peliculaTitulo} (SALA ${salaNombre})`,
        precio,
        cantidad: 1
      }];
    });
    this.toastService.success(`Entrada añadida: ${peliculaTitulo}`);
  }

  agregarProducto(producto: any) {
    const id = `producto-${producto._id || producto.id}`;
    
    this.carrito.update(items => {
      const exists = items.find(i => i.id === id);
      if (exists) {
        return items.map(i => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...items, {
        id,
        tipo: 'producto',
        ref: producto,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      }];
    });
  }

  sumar(item: CartItem) {
    this.carrito.update(items =>
      items.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i)
    );
  }

  restar(item: CartItem) {
    this.carrito.update(items =>
      items.map(i => {
        if (i.id === item.id) {
          return { ...i, cantidad: i.cantidad - 1 };
        }
        return i;
      }).filter(i => i.cantidad > 0)
    );
  }

  limpiarCarrito() {
    if(confirm('¿VACIAR TICKET COMPLETO?')) {
      this.carrito.set([]);
    }
  }

  cobrar() {
    if (this.carrito().length === 0) return;
    
    this.procesando.set(true);

    // Separar los items de tipo "entrada"
    const entradas = this.carrito().filter(i => i.tipo === 'entrada');
    
    if (entradas.length > 0) {
      // Por cada función, simular el envío de las entradas. En la vida real, se seleccionan asientos en POS también.
      // Aquí, como el POS es "Taquilla express", le enviamos asientos genéricos al backend
      // ya que el backend espera un array de asientos.
      const peticiones = entradas.map(item => {
        // Mock de asientos: TQ1, TQ2... (Taquilla)
        const asientosRandom = Array.from({length: item.cantidad}).map((_, i) => 'TQ' + Math.floor(Math.random()*1000) + '-' + i);
        return this.entradasService.comprarFuncion(item.ref.id || item.ref._id, { asientos: asientosRandom });
      });

      // Simple simulacion de espera por promesas
      Promise.all(peticiones.map(p => new Promise(resolve => p.subscribe({next: resolve, error: resolve}))))
        .then(() => {
          this.toastService.success('VENTA REGISTRADA. TOTAL: $' + this.totalPrecio().toFixed(2));
          this.carrito.set([]);
          this.procesando.set(false);
        });
    } else {
      setTimeout(() => {
        this.toastService.success('VENTA DULCERÍA REGISTRADA. TOTAL: $' + this.totalPrecio().toFixed(2));
        this.carrito.set([]);
        this.procesando.set(false);
      }, 800);
    }
  }
}
