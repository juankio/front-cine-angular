import { Component, EventEmitter, Input, Output, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecetasService } from '../../services/recetas.service';
import { MenuService } from '../../services/menu.service';
import { IngredientesService } from '../../services/ingredientes.service';
import { ToastService } from '../../services/toast.service';

import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-receta-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmLabel, HlmButtonImports],
  template: `
    @if (visible) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="bg-card text-foreground border border-border shadow-2xl shadow-primary/15 rounded-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6 border-b border-border pb-4">
              <h2 class="text-2xl font-display tracking-widest uppercase text-foreground">
                {{ recetaEditar ? 'Editar Receta' : 'Nueva Receta de Menú' }}
              </h2>
              <button class="text-muted-foreground hover:text-foreground transition-colors" (click)="cerrar()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span class="sr-only">Cerrar</span>
              </button>
            </div>

            <form (ngSubmit)="guardar()" #form="ngForm" class="space-y-6">
              
              <!-- Seleccionar Producto del Menú -->
              <div class="space-y-1">
                <label hlmLabel for="menuId" class="font-display tracking-wider text-muted-foreground text-sm">Producto del Menú</label>
                <select 
                  id="menuId" 
                  name="menuId" 
                  [(ngModel)]="formData.menuId" 
                  required 
                  class="flex h-12 w-full rounded-md border border-border bg-secondary px-3 py-2 text-base font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="" disabled class="text-muted-foreground bg-background">Selecciona un combo/producto...</option>
                  @for (menu of menus; track $index) {
                    <option [value]="menu._id || menu.id" class="bg-background">{{ menu.nombre }}</option>
                  }
                </select>
              </div>

              <!-- Lista de Ingredientes Dinámica -->
              <div class="space-y-4 border border-border rounded-md p-4 bg-secondary">
                <div class="flex items-center justify-between mb-2">
                  <label class="font-display tracking-wider text-muted-foreground text-sm">Insumos Necesarios</label>
                  <button type="button" (click)="agregarIngredienteFila()" class="text-xs font-display tracking-widest uppercase text-primary hover:text-primary/80 bg-primary/10 px-2 py-1 rounded border border-primary/20">
                    + Añadir Insumo
                  </button>
                </div>

                @if (formData.ingredientes.length === 0) {
                  <p class="text-sm text-muted-foreground italic text-center py-4">No has agregado ningún ingrediente a la receta.</p>
                }

                @for (item of formData.ingredientes; track $index; let i = $index) {
                  <div class="flex gap-2 items-end">
                    <div class="flex-1">
                      <select 
                        [name]="'ingredienteId_' + i" 
                        [(ngModel)]="item.ingredienteId" 
                        required 
                        class="flex h-10 w-full rounded-sm border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="" disabled class="bg-background">Seleccionar...</option>
                        @for (ingrediente of ingredientesDb; track $index) {
                          <option [value]="ingrediente._id || ingrediente.id" class="bg-background">{{ ingrediente.nombre }} ({{ ingrediente.unidad }})</option>
                        }
                      </select>
                    </div>
                    <div class="w-24">
                      <input 
                        type="number"
                        [name]="'cantidad_' + i" 
                        [(ngModel)]="item.cantidadNecesaria" 
                        required 
                        min="0.01"
                        step="0.01"
                        class="flex h-10 w-full rounded-sm border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Cant."
                      />
                    </div>
                    <button type="button" class="h-10 w-10 bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary rounded-sm flex items-center justify-center border border-border transition-colors" (click)="removerIngredienteFila(i)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                }
              </div>

              <!-- Acciones -->
              <div class="flex justify-end gap-3 pt-6 mt-6">
                <button type="button" class="px-4 py-2 border border-border text-muted-foreground font-display tracking-wider uppercase rounded-sm hover:bg-secondary transition-colors" (click)="cerrar()">
                  Cancelar
                </button>
                <button type="submit" class="px-6 py-2 bg-primary text-primary-foreground font-display tracking-widest uppercase rounded-sm shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/60 disabled:opacity-50 disabled:shadow-none transition-all" [disabled]="!form.valid || guardando || formData.ingredientes.length === 0">
                  {{ guardando ? 'Guardando...' : (recetaEditar ? 'Actualizar Receta' : 'Guardar Receta') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class RecetaFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() recetaEditar: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private recetasService = inject(RecetasService);
  private menuService = inject(MenuService);
  private ingredientesService = inject(IngredientesService);
  private toastService = inject(ToastService);

  menus: any[] = [];
  ingredientesDb: any[] = [];

  guardando = false;

  formData = {
    menuId: '',
    ingredientes: [] as Array<{ ingredienteId: string, cantidadNecesaria: number }>
  };

  ngOnInit() {
    this.cargarSelects();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recetaEditar']) {
      if (this.recetaEditar) {
        this.formData = {
          menuId: this.recetaEditar.menu?._id || this.recetaEditar.menu?.id || this.recetaEditar.menu || '',
          ingredientes: (this.recetaEditar.ingredientes || []).map((i: any) => ({
            ingredienteId: i.ingrediente?._id || i.ingrediente?.id || i.ingrediente || '',
            cantidadNecesaria: i.cantidadNecesaria
          }))
        };
      } else {
        this.resetForm();
      }
    }
  }

  cargarSelects() {
    this.menuService.listar().subscribe(res => {
      this.menus = res?.data || res || [];
    });
    this.ingredientesService.listar().subscribe(res => {
      this.ingredientesDb = res?.data || res || [];
    });
  }

  agregarIngredienteFila() {
    this.formData.ingredientes.push({ ingredienteId: '', cantidadNecesaria: 1 });
  }

  removerIngredienteFila(index: number) {
    this.formData.ingredientes.splice(index, 1);
  }

  cerrar() {
    this.resetForm();
    this.closed.emit();
  }

  guardar() {
    this.guardando = true;
    
    const payload = {
      menuId: this.formData.menuId,
      ingredientes: this.formData.ingredientes.map(i => ({
        ingredienteId: i.ingredienteId,
        cantidadNecesaria: Number(i.cantidadNecesaria)
      }))
    };

    if (this.recetaEditar) {
      this.recetasService.actualizar(this.recetaEditar._id, payload).subscribe({
        next: () => {
          this.guardando = false;
          this.toastService.success('Receta actualizada correctamente');
          this.resetForm();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error actualizando receta:', err);
          this.guardando = false;
          this.toastService.error('Hubo un error al actualizar la receta.');
        }
      });
    } else {
      this.recetasService.crear(payload).subscribe({
        next: () => {
          this.guardando = false;
          this.toastService.success('Receta creada correctamente');
          this.resetForm();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error guardando receta:', err);
          this.guardando = false;
          this.toastService.error('Hubo un error al guardar la receta. Puede que este producto ya tenga una receta.');
        }
      });
    }
  }

  resetForm() {
    this.formData = {
      menuId: '',
      ingredientes: []
    };
  }
}
