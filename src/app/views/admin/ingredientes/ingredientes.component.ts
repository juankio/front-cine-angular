import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientesService } from '../../../services/ingredientes.service';
import { IngredienteFormComponent } from '../../../components/ingrediente-form/ingrediente-form.component';

@Component({
  selector: 'app-ingredientes',
  standalone: true,
  imports: [CommonModule, IngredienteFormComponent],
  template: `
    <div class="w-full max-w-7xl mx-auto p-8 md:p-12 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 class="text-5xl md:text-6xl font-display tracking-widest uppercase text-white drop-shadow-md">Ingredientes y Stock</h1>
          <p class="text-neutral-400 mt-2 text-lg">Gestiona el inventario de insumos para las recetas del cine.</p>
        </div>
        <button class="bg-white text-black hover:bg-neutral-200 transition-colors font-display tracking-wider uppercase text-lg h-12 px-6 flex items-center justify-center rounded-sm" (click)="abrirModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nuevo Insumo
        </button>
      </div>

      <!-- Tabla de Ingredientes -->
      <div class="bg-black/40 border border-white/5 shadow-2xl overflow-hidden rounded-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/5 bg-white/5">
                <th class="font-display tracking-widest uppercase text-neutral-400 text-sm py-4 px-4">Nombre Insumo</th>
                <th class="font-display tracking-widest uppercase text-neutral-400 text-sm py-4 px-4 text-center">Unidad</th>
                <th class="font-display tracking-widest uppercase text-neutral-400 text-sm py-4 px-4 text-right">Stock Actual</th>
                <th class="font-display tracking-widest uppercase text-neutral-400 text-sm py-4 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @if (loading()) {
                <tr>
                  <td colspan="4" class="py-16 text-center text-neutral-500 animate-pulse">
                    <div class="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <span class="font-display tracking-wider uppercase">Cargando inventario...</span>
                  </td>
                </tr>
              } @else if (ingredientes().length === 0) {
                <tr>
                  <td colspan="4" class="py-20 text-center text-neutral-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
                    <span class="font-display tracking-wider uppercase text-xl">No hay ingredientes registrados</span>
                  </td>
                </tr>
              } @else {
                @for (item of ingredientes(); track item._id || item.id) {
                  <tr class="hover:bg-white/5 transition-colors border-b border-white/5 group">
                    <td class="p-4">
                      <span class="font-display tracking-wider text-xl text-white">{{ item.nombre }}</span>
                    </td>
                    <td class="p-4 text-center">
                      <span class="inline-flex items-center rounded-sm bg-white/10 px-2 py-1 text-sm font-display tracking-wider text-neutral-300 uppercase">
                        {{ item.unidad }}
                      </span>
                    </td>
                    <td class="p-4 text-right">
                      <span class="font-display tracking-widest text-2xl" [class.text-red-500]="item.stock <= 5" [class.text-white]="item.stock > 5">
                        {{ item.stock | number:'1.0-2' }}
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      <button (click)="eliminar(item._id || item.id)" class="text-neutral-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors opacity-0 group-hover:opacity-100" title="Eliminar">
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

      <app-ingrediente-form 
        [visible]="modalAbierto()" 
        (closed)="cerrarModal()" 
        (saved)="onGuardado()">
      </app-ingrediente-form>
    </div>
  `
})
export class IngredientesComponent implements OnInit {
  private service = inject(IngredientesService);

  ingredientes = signal<any[]>([]);
  loading = signal(false);
  modalAbierto = signal(false);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.service.listar().subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.ingredientes.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando', err);
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

  onGuardado() {
    this.cerrarModal();
    this.cargar();
  }

  eliminar(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este ingrediente?')) return;
    this.service.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: (err) => console.error('Error al eliminar', err)
    });
  }
}
