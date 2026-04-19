import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngredientesService } from '../../services/ingredientes.service';
import { ToastService } from '../../services/toast.service';

import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-ingrediente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmLabel, HlmInput, HlmButtonImports],
  template: `
    @if (visible) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="bg-card text-foreground border border-border shadow-2xl shadow-primary/15 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-display tracking-widest uppercase text-foreground">Nuevo Ingrediente</h2>
              <button class="text-neutral-500 hover:text-foreground transition-colors" (click)="cerrar()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span class="sr-only">Cerrar</span>
              </button>
            </div>

            <form (ngSubmit)="guardar()" #form="ngForm" class="space-y-4">
              <!-- Nombre -->
              <div class="space-y-1">
                <label hlmLabel for="nombre" class="font-display tracking-wider text-neutral-400">Nombre del Insumo</label>
                <input 
                  hlmInput 
                  id="nombre" 
                  name="nombre" 
                  [(ngModel)]="formData.nombre" 
                  required 
                  class="w-full bg-secondary border-border text-foreground placeholder:text-neutral-600 focus:border-primary focus:ring-primary/20"
                  placeholder="Ej: Vasos Grandes, Pan para Hot Dog"
                />
              </div>

              <!-- Unidad -->
              <div class="space-y-1">
                <label hlmLabel for="unidad" class="font-display tracking-wider text-neutral-400">Unidad de Medida</label>
                <select 
                  id="unidad" 
                  name="unidad" 
                  [(ngModel)]="formData.unidad" 
                  required 
                  class="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="unidades" class="bg-neutral-900">Unidades (pz)</option>
                  <option value="gr" class="bg-neutral-900">Gramos (gr)</option>
                  <option value="ml" class="bg-neutral-900">Mililitros (ml)</option>
                  <option value="kg" class="bg-neutral-900">Kilos (kg)</option>
                  <option value="litros" class="bg-neutral-900">Litros (L)</option>
                </select>
              </div>

              <!-- Stock Inicial -->
              <div class="space-y-1">
                <label hlmLabel for="stock" class="font-display tracking-wider text-neutral-400">Stock Inicial</label>
                <input 
                  hlmInput 
                  type="number"
                  id="stock" 
                  name="stock" 
                  [(ngModel)]="formData.stock" 
                  required 
                  class="w-full bg-secondary border-border text-foreground placeholder:text-neutral-600 focus:border-primary focus:ring-primary/20"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <!-- Acciones -->
              <div class="flex justify-end gap-3 pt-6 border-t border-border mt-6">
                <button type="button" class="px-4 py-2 border border-border text-neutral-300 font-display tracking-wider uppercase rounded-sm hover:bg-secondary transition-colors" (click)="cerrar()">
                  Cancelar
                </button>
                <button type="submit" class="px-6 py-2 bg-primary text-foreground font-display tracking-widest uppercase rounded-sm shadow-lg shadow-primary/40 hover:shadow-xl shadow-primary/60 disabled:opacity-50 disabled:shadow-none transition-all" [disabled]="!form.valid || guardando">
                  {{ guardando ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class IngredienteFormComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private ingredientesService = inject(IngredientesService);
  private toastService = inject(ToastService);

  guardando = false;

  formData = {
    nombre: '',
    unidad: 'unidades',
    stock: 0
  };

  cerrar() {
    this.resetForm();
    this.closed.emit();
  }

  guardar() {
    this.guardando = true;
    
    const payload = {
      ...this.formData,
      stock: Number(this.formData.stock)
    };

    this.ingredientesService.crear(payload).subscribe({
      next: () => {
        this.guardando = false;
        this.resetForm();
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error guardando ingrediente:', err);
        this.guardando = false;
        this.toastService.error('Hubo un error al guardar el ingrediente.');
      }
    });
  }

  resetForm() {
    this.formData = {
      nombre: '',
      unidad: 'unidades',
      stock: 0
    };
  }
}
