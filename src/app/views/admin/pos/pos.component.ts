import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../services/menu.service';
import { ToastService } from '../../../services/toast.service';

import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';

interface CartItem {
  producto: any;
  cantidad: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, HlmCardImports, HlmButtonImports],
  template: `
    <div class="h-full flex flex-col md:flex-row bg-transparent text-foreground gap-6 p-6 animate-in fade-in zoom-in-95 duration-500">
      
      <!-- Listado de Productos -->
      <div class="flex-1 overflow-y-auto">
        <h2 class="text-4xl md:text-5xl font-display tracking-widest uppercase mb-6 px-2 drop-shadow-sm text-foreground">Mostrador (POS)</h2>
        
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 pb-8">
          @if (loading()) {
            <div class="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
               <div class="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
               <p class="font-display tracking-wider uppercase">Cargando catálogo...</p>
            </div>
          } @else if (productos().length === 0) {
            <div class="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center opacity-50">
               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
               <p class="font-display tracking-wider uppercase text-xl">El menú está vacío</p>
            </div>
          } @else {
            @for (item of productos(); track item._id || item.id) {
              <div class="cursor-pointer group hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col bg-card/40 backdrop-blur-md shadow-sm border border-border/50 rounded-xl hover:shadow-md hover:-translate-y-1" (click)="agregarAlCarrito(item)">
                <div class="relative overflow-hidden">
                  <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground drop-shadow-md transform scale-50 group-hover:scale-100 transition-transform duration-300"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                  </div>
                  @if (item.imagenUrl) {
                    <img [src]="item.imagenUrl" alt="Producto" class="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  } @else {
                    <div class="h-36 w-full bg-muted/50 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="1" y2="3"/><line x1="10" x2="10" y1="1" y2="3"/><line x1="14" x2="14" y1="1" y2="3"/></svg>
                    </div>
                  }
                </div>
                <div class="p-4 flex-1 flex flex-col justify-between relative z-20 bg-card/80 backdrop-blur-sm border-t border-border/50">
                  <h3 class="font-body font-medium text-lg text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">{{ item.nombre }}</h3>
                  <div class="font-display tracking-widest text-primary text-2xl">\${{ item.precio | number:'1.2-2' }}</div>
                </div>
              </div>
            }
          }
        </div>
      </div>

      <!-- Carrito / Ticket -->
      <aside class="w-full md:w-[400px] shrink-0 flex flex-col h-[calc(100vh-120px)] relative z-20">
        <div class="flex-1 flex flex-col h-full bg-card/60 backdrop-blur-xl shadow-lg border border-border/50 rounded-xl overflow-hidden relative">
          <!-- Borde superior decorativo -->
          <div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
          
          <div class="p-5 border-b border-border/50 bg-muted/10 backdrop-blur-md">
            <h3 class="font-display tracking-widest uppercase text-2xl flex items-center gap-3 text-foreground">
              <span class="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </span>
              Ticket Actual
            </h3>
          </div>
          
          <!-- Lista de Items en Carrito -->
          <div class="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            @if (carrito().length === 0) {
              <div class="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-4"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <p class="font-display tracking-widest uppercase text-lg">No hay productos</p>
              </div>
            } @else {
              @for (item of carrito(); track item.producto._id || item.producto.id) {
                <div class="flex items-center justify-between p-3 bg-card backdrop-blur-sm rounded-lg border border-border hover:border-primary/30 transition-colors group">
                  <div class="flex-1 min-w-0 pr-3">
                    <div class="font-body font-medium text-base text-foreground truncate">{{ item.producto.nombre }}</div>
                    <div class="text-xs text-muted-foreground font-display tracking-wider">\${{ item.producto.precio | number:'1.2-2' }} c/u</div>
                  </div>
                  
                  <div class="flex flex-col items-end gap-2">
                    <div class="font-display tracking-widest text-xl text-primary">
                      \${{ (item.producto.precio * item.cantidad) | number:'1.2-2' }}
                    </div>
                    <div class="flex items-center bg-muted/50 rounded-md border border-border overflow-hidden">
                      <button class="w-8 h-7 flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors" (click)="restar(item)">-</button>
                      <span class="w-8 text-center text-sm font-bold bg-background h-7 flex items-center justify-center text-foreground">{{ item.cantidad }}</span>
                      <button class="w-8 h-7 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors" (click)="sumar(item)">+</button>
                    </div>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Totales y Pagar -->
          <div class="p-6 border-t border-border/50 bg-card/80 backdrop-blur-xl">
            <div class="flex justify-between items-center mb-2 text-muted-foreground">
              <span class="font-display tracking-wider uppercase text-sm">Artículos</span>
              <span class="font-bold font-body text-lg text-foreground">{{ totalArticulos() }}</span>
            </div>
            <div class="flex justify-between items-end mb-6">
              <span class="text-xl font-display tracking-widest uppercase text-muted-foreground">Total:</span>
              <span class="text-5xl font-display tracking-widest text-primary drop-shadow-sm">\${{ totalPrecio() | number:'1.2-2' }}</span>
            </div>
            
            <div class="grid grid-cols-[1fr_2fr] gap-3">
              <button class="w-full h-14 font-display tracking-widest uppercase border border-border text-foreground bg-card rounded-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors" (click)="limpiarCarrito()" [disabled]="carrito().length === 0">
                Anular
              </button>
              <button class="w-full h-14 font-display tracking-[0.2em] uppercase text-xl text-primary-foreground bg-primary rounded-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all" (click)="cobrar()" [disabled]="carrito().length === 0 || procesando()">
                {{ procesando() ? 'PROCESANDO...' : 'COBRAR' }}
              </button>
            </div>
          </div>
        </div>
      </aside>

    </div>
  `
})
export class PosComponent implements OnInit {
  private menuService = inject(MenuService);
  private toastService = inject(ToastService);

  productos = signal<any[]>([]);
  loading = signal(false);
  
  carrito = signal<CartItem[]>([]);
  procesando = signal(false);

  totalArticulos = computed(() => {
    return this.carrito().reduce((acc, curr) => acc + curr.cantidad, 0);
  });

  totalPrecio = computed(() => {
    return this.carrito().reduce((acc, curr) => acc + (curr.producto.precio * curr.cantidad), 0);
  });

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading.set(true);
    this.menuService.listar().subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.productos.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando catálogo para POS', err);
        this.loading.set(false);
      }
    });
  }

  agregarAlCarrito(producto: any) {
    this.carrito.update(items => {
      const id = producto._id || producto.id;
      const existingItem = items.find(i => (i.producto._id || i.producto.id) === id);
      
      if (existingItem) {
        return items.map(i => 
          (i.producto._id || i.producto.id) === id 
            ? { ...i, cantidad: i.cantidad + 1 } 
            : i
        );
      }
      
      return [...items, { producto, cantidad: 1 }];
    });
  }

  sumar(item: CartItem) {
    this.agregarAlCarrito(item.producto);
  }

  restar(item: CartItem) {
    this.carrito.update(items => {
      const id = item.producto._id || item.producto.id;
      return items.map(i => {
        if ((i.producto._id || i.producto.id) === id) {
          return { ...i, cantidad: i.cantidad - 1 };
        }
        return i;
      }).filter(i => i.cantidad > 0);
    });
  }

  limpiarCarrito() {
    if(confirm('¿Limpiar todo el ticket?')) {
      this.carrito.set([]);
    }
  }

  cobrar() {
    if (this.carrito().length === 0) return;
    
    this.procesando.set(true);
    // Simulación de llamada a backend para registrar venta directa
    setTimeout(() => {
      this.toastService.success(`¡Venta registrada con éxito!\nTotal cobrado: \$${this.totalPrecio().toFixed(2)}`);
      this.carrito.set([]);
      this.procesando.set(false);
    }, 800);
  }
}
