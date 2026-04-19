import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../../services/menu.service';
import { ToastService } from '../../../services/toast.service';

import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { MenuFormComponent } from '../../../components/menu-form/menu-form.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmTableImports, HlmCardImports, HlmButtonImports, MenuFormComponent],
  template: `
    <div class="w-full max-w-7xl mx-auto p-8 md:p-12 flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500 text-foreground">
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 class="text-5xl md:text-6xl font-display tracking-widest uppercase text-foreground drop-shadow-sm">Menú y Combos</h1>
          <p class="text-muted-foreground mt-2 text-lg">Gestiona los productos de comida y bebida disponibles para comprar.</p>
        </div>
        <button class="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-display tracking-wider uppercase text-lg h-12 px-6 flex items-center justify-center rounded-sm" (click)="abrirModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nuevo Producto
        </button>
      </div>

      <!-- Tabla de Productos -->
      <div class="bg-card/60 border border-border shadow-sm overflow-hidden rounded-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-border/50 bg-muted/20">
                <th class="font-display tracking-widest uppercase text-muted-foreground text-sm py-4 px-4">Imagen</th>
                <th class="font-display tracking-widest uppercase text-muted-foreground text-sm py-4 px-4">Nombre</th>
                <th class="font-display tracking-widest uppercase text-muted-foreground text-sm py-4 px-4">Descripción</th>
                <th class="font-display tracking-widest uppercase text-muted-foreground text-sm py-4 px-4 text-right">Precio</th>
                <th class="font-display tracking-widest uppercase text-muted-foreground text-sm py-4 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @if (loading()) {
                <tr>
                  <td colspan="5" class="py-16 text-center text-muted-foreground animate-pulse">
                    <div class="w-8 h-8 border-2 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                    <span class="font-display tracking-wider uppercase">Cargando menú...</span>
                  </td>
                </tr>
              } @else if (productos().length === 0) {
                <tr>
                  <td colspan="5" class="py-20 text-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 opacity-50"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="1" y2="3"/><line x1="10" x2="10" y1="1" y2="3"/><line x1="14" x2="14" y1="1" y2="3"/></svg>
                    <span class="font-display tracking-wider uppercase text-xl">No hay productos en el menú</span>
                  </td>
                </tr>
              } @else {
                @for (item of productos(); track item._id || item.id) {
                  <tr class="hover:bg-muted/30 transition-colors border-b border-border/30 group">
                    <td class="p-4">
                      @if (item.imagenUrl) {
                        <img [src]="item.imagenUrl" alt="Producto" class="h-20 w-20 object-cover shadow-sm border border-border/50 group-hover:scale-105 transition-transform" />
                      } @else {
                        <div class="h-20 w-20 bg-muted/50 border border-border/50 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="1" y2="3"/><line x1="10" x2="10" y1="1" y2="3"/><line x1="14" x2="14" y1="1" y2="3"/></svg>
                        </div>
                      }
                    </td>
                    <td class="p-4">
                      <span class="font-display tracking-wider text-xl text-foreground">{{ item.nombre }}</span>
                    </td>
                    <td class="p-4">
                      <p class="text-muted-foreground text-sm max-w-xs line-clamp-2 leading-relaxed">{{ item.descripcion }}</p>
                    </td>
                    <td class="p-4 text-right">
                      <span class="font-display tracking-widest text-2xl text-primary">\${{ item.precio | number:'1.2-2' }}</span>
                    </td>
                    <td class="p-4 text-center">
                      <button (click)="eliminar(item._id || item.id)" class="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded transition-colors opacity-0 group-hover:opacity-100" title="Eliminar producto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Componente del formulario en Modal -->
      <app-menu-form
        [visible]="modalAbierto()"
        (closed)="cerrarModal()"
        (saved)="onProductoGuardado()"
      ></app-menu-form>
    </div>
  `
})
export class MenuComponent implements OnInit {
  private menuService = inject(MenuService);
  private toastService = inject(ToastService);

  productos = signal<any[]>([]);
  loading = signal(false);
  modalAbierto = signal(false);

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
        console.error('Error cargando productos del menú', err);
        this.loading.set(false);
      }
    });
  }

  abrirModal() {
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  onProductoGuardado() {
    this.cerrarModal();
    this.cargarProductos();
  }

  eliminar(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    this.menuService.eliminar(id).subscribe({
      next: () => {
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al eliminar producto', err);
        this.toastService.error('Hubo un error al eliminar el producto.');
      }
    });
  }
}
