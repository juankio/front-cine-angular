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
        <div class="bg-black/90 text-white border border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.15)] rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-display tracking-widest uppercase text-white">Nuevo Ingrediente</h2>
              <button class="text-neutral-500 hover:text-white transition-colors" (click)="cerrar()">
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
                  class="w-full bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20"
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
                  class="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
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
                  class="w-full bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus:border-red-500 focus:ring-red-500/20"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <!-- Acciones -->
              <div class="flex justify-end gap-3 pt-6 border-t border-white/10 mt-6">
                <button type="button" class="px-4 py-2 border border-white/20 text-neutral-300 font-display tracking-wider uppercase rounded-sm hover:bg-white/5 transition-colors" (click)="cerrar()">
                  Cancelar
                </button>
                <button type="submit" class="px-6 py-2 bg-red-600 text-white font-display tracking-widest uppercase rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] disabled:opacity-50 disabled:shadow-none transition-all" [disabled]="!form.valid || guardando">
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
