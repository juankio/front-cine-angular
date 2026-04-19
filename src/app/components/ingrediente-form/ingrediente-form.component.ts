import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
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
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" (click)="cerrar()"></div>
        
        <div class="bg-card text-foreground border border-border shadow-2xl shadow-primary/15 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative z-10">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-display tracking-widest uppercase text-foreground">
                {{ ingredienteEditar ? 'Editar Ingrediente' : 'Nuevo Ingrediente' }}
              </h2>
              <button class="text-muted-foreground hover:text-foreground transition-colors" (click)="cerrar()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span class="sr-only">Cerrar</span>
              </button>
            </div>

            <form (ngSubmit)="guardar()" #form="ngForm" class="space-y-4">
              <!-- Nombre -->
              <div class="space-y-1">
                <label hlmLabel for="nombre" class="font-display tracking-wider text-muted-foreground">Nombre del Insumo</label>
                <input 
                  hlmInput 
                  id="nombre" 
                  name="nombre" 
                  [(ngModel)]="formData.nombre" 
                  required 
                  class="w-full bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                  placeholder="Ej: Vasos Grandes, Pan para Hot Dog"
                />
              </div>

              <!-- Unidad -->
              <div class="space-y-1">
                <label hlmLabel for="unidad" class="font-display tracking-wider text-muted-foreground">Unidad de Medida</label>
                <select 
                  id="unidad" 
                  name="unidad" 
                  [(ngModel)]="formData.unidad" 
                  required 
                  class="flex h-10 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="unidades" class="bg-background">Unidades (pz)</option>
                  <option value="gr" class="bg-background">Gramos (gr)</option>
                  <option value="ml" class="bg-background">Mililitros (ml)</option>
                  <option value="kg" class="bg-background">Kilos (kg)</option>
                  <option value="litros" class="bg-background">Litros (L)</option>
                </select>
              </div>

              <!-- Stock Inicial / Actual -->
              <div class="space-y-1">
                <label hlmLabel for="stock" class="font-display tracking-wider text-muted-foreground">Stock Inicial / Actual</label>
                <input 
                  hlmInput 
                  type="number"
                  id="stock" 
                  name="stock" 
                  [(ngModel)]="formData.stock" 
                  required 
                  class="w-full bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <!-- Acciones -->
              <div class="flex justify-end gap-3 pt-6 border-t border-border mt-6">
                <button type="button" class="px-4 py-2 border border-border text-muted-foreground font-display tracking-wider uppercase rounded-sm hover:bg-secondary transition-colors" (click)="cerrar()">
                  Cancelar
                </button>
                <button type="submit" class="px-6 py-2 bg-primary text-primary-foreground font-display tracking-widest uppercase rounded-sm shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/60 disabled:opacity-50 disabled:shadow-none transition-all" [disabled]="!form.valid || guardando">
                  {{ guardando ? 'Guardando...' : (ingredienteEditar ? 'Actualizar' : 'Guardar') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class IngredienteFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() ingredienteEditar: any = null;
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ingredienteEditar']) {
      if (this.ingredienteEditar) {
        this.formData = {
          nombre: this.ingredienteEditar.nombre || '',
          unidad: this.ingredienteEditar.unidad || 'unidades',
          stock: this.ingredienteEditar.stock || 0
        };
      } else {
        this.resetForm();
      }
    }
  }

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

    if (this.ingredienteEditar) {
      const id = this.ingredienteEditar._id || this.ingredienteEditar.id;
      this.ingredientesService.actualizar(id, payload).subscribe({
        next: () => {
          this.guardando = false;
          this.toastService.success('Ingrediente actualizado correctamente.');
          this.resetForm();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error actualizando ingrediente:', err);
          this.guardando = false;
          this.toastService.error('Hubo un error al actualizar el ingrediente.');
        }
      });
    } else {
      this.ingredientesService.crear(payload).subscribe({
        next: () => {
          this.guardando = false;
          this.toastService.success('Ingrediente creado correctamente.');
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
  }

  resetForm() {
    this.formData = {
      nombre: '',
      unidad: 'unidades',
      stock: 0
    };
  }
}