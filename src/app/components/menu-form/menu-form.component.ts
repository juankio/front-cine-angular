import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { ToastService } from '../../services/toast.service';

import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmLabel, HlmInput, HlmButtonImports],
  template: `
    @if (visible) {
      <!-- Backdrop -->
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Modal -->
        <div class="bg-card text-card-foreground border border-border shadow-lg rounded-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold tracking-tight">Nuevo Combo/Snack</h2>
              <button hlmBtn variant="ghost" size="icon" (click)="cerrar()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span class="sr-only">Cerrar</span>
              </button>
            </div>

            <form (ngSubmit)="guardar()" #form="ngForm" class="space-y-4">
              <!-- Nombre -->
              <div class="space-y-1">
                <label hlmLabel for="nombre">Nombre</label>
                <input 
                  hlmInput 
                  id="nombre" 
                  name="nombre" 
                  [(ngModel)]="formData.nombre" 
                  required 
                  class="w-full"
                  placeholder="Ej: Combo Pareja"
                />
              </div>

              <!-- Descripción -->
              <div class="space-y-1">
                <label hlmLabel for="descripcion">Descripción</label>
                <textarea 
                  hlmInput 
                  id="descripcion" 
                  name="descripcion" 
                  [(ngModel)]="formData.descripcion" 
                  required 
                  class="w-full min-h-[80px]"
                  placeholder="Ej: 2 Entradas + Palomitas Grandes + 2 Refrescos"
                ></textarea>
              </div>

              <!-- Precio -->
              <div class="space-y-1">
                <label hlmLabel for="precio">Precio ($)</label>
                <input 
                  hlmInput 
                  type="number"
                  id="precio" 
                  name="precio" 
                  [(ngModel)]="formData.precio" 
                  required 
                  class="w-full"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <!-- Imagen URL -->
              <div class="space-y-1">
                <label hlmLabel for="imagenUrl">URL de la Imagen</label>
                <input 
                  hlmInput 
                  type="url"
                  id="imagenUrl" 
                  name="imagenUrl" 
                  [(ngModel)]="formData.imagenUrl" 
                  class="w-full"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <!-- Acciones -->
              <div class="flex justify-end gap-2 pt-4">
                <button type="button" hlmBtn variant="outline" (click)="cerrar()">
                  Cancelar
                </button>
                <button type="submit" hlmBtn [disabled]="!form.valid || guardando">
                  {{ guardando ? 'Guardando...' : 'Guardar Producto' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class MenuFormComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private menuService = inject(MenuService);
  private toastService = inject(ToastService);

  guardando = false;

  formData = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenUrl: ''
  };

  cerrar() {
    this.resetForm();
    this.closed.emit();
  }

  guardar() {
    this.guardando = true;
    
    // Convert string to number for price
    const payload = {
      ...this.formData,
      precio: Number(this.formData.precio)
    };

    this.menuService.crear(payload).subscribe({
      next: () => {
        this.guardando = false;
        this.resetForm();
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error guardando ítem del menú:', err);
        this.guardando = false;
        this.toastService.error('Hubo un error al guardar el producto.');
      }
    });
  }

  resetForm() {
    this.formData = {
      nombre: '',
      descripcion: '',
      precio: 0,
      imagenUrl: ''
    };
  }
}
