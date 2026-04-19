import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecetasService } from '../../services/recetas.service';
import { MenuService } from '../../services/menu.service';
import { IngredientesService } from '../../services/ingredientes.service';

import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-receta-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmLabel, HlmInput, HlmButtonImports],
  template: `
    @if (visible) {
      <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div class="bg-black/90 text-white border border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.15)] rounded-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <h2 class="text-2xl font-display tracking-widest uppercase text-white">Nueva Receta de Menú</h2>
              <button class="text-neutral-500 hover:text-white transition-colors" (click)="cerrar()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span class="sr-only">Cerrar</span>
              </button>
            </div>

            <form (ngSubmit)="guardar()" #form="ngForm" class="space-y-6">
              
              <!-- Seleccionar Producto del Menú -->
              <div class="space-y-1">
                <label hlmLabel for="menuId" class="font-display tracking-wider text-neutral-400 text-sm">Producto del Menú</label>
                <select 
                  id="menuId" 
                  name="menuId" 
                  [(ngModel)]="formData.menuId" 
                  required 
                  class="flex h-12 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-base font-body text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                >
                  <option value="" disabled class="bg-neutral-900 text-neutral-500">Selecciona un combo/producto...</option>
                  @for (menu of menus; track menu._id) {
                    <option [value]="menu._id" class="bg-neutral-900">{{ menu.nombre }}</option>
                  }
                </select>
              </div>

              <!-- Lista de Ingredientes Dinámica -->
              <div class="space-y-4 border border-white/10 rounded-md p-4 bg-white/5">
                <div class="flex items-center justify-between mb-2">
                  <label class="font-display tracking-wider text-neutral-400 text-sm">Insumos Necesarios</label>
                  <button type="button" (click)="agregarIngredienteFila()" class="text-xs font-display tracking-widest uppercase text-red-500 hover:text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                    + Añadir Insumo
                  </button>
                </div>

                @if (formData.ingredientes.length === 0) {
                  <p class="text-sm text-neutral-500 italic text-center py-4">No has agregado ningún ingrediente a la receta.</p>
                }

                @for (item of formData.ingredientes; track $index; let i = $index) {
                  <div class="flex gap-2 items-end">
                    <div class="flex-1">
                      <select 
                        [name]="'ingredienteId_' + i" 
                        [(ngModel)]="item.ingredienteId" 
                        required 
                        class="flex h-10 w-full rounded-sm border border-white/10 bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="" disabled>Seleccionar...</option>
                        @for (ingrediente of ingredientesDb; track ingrediente._id) {
                          <option [value]="ingrediente._id">{{ ingrediente.nombre }} ({{ ingrediente.unidad }})</option>
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
                        class="flex h-10 w-full rounded-sm border border-white/10 bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Cant."
                      />
                    </div>
                    <button type="button" class="h-10 w-10 bg-white/5 hover:bg-red-500/20 text-neutral-500 hover:text-red-500 rounded-sm flex items-center justify-center border border-white/10 transition-colors" (click)="removerIngredienteFila(i)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                }
              </div>

              <!-- Acciones -->
              <div class="flex justify-end gap-3 pt-6 mt-6">
                <button type="button" class="px-4 py-2 border border-white/20 text-neutral-300 font-display tracking-wider uppercase rounded-sm hover:bg-white/5 transition-colors" (click)="cerrar()">
                  Cancelar
                </button>
                <button type="submit" class="px-6 py-2 bg-red-600 text-white font-display tracking-widest uppercase rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] disabled:opacity-50 disabled:shadow-none transition-all" [disabled]="!form.valid || guardando || formData.ingredientes.length === 0">
                  {{ guardando ? 'Guardando...' : 'Guardar Receta' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class RecetaFormComponent implements OnInit {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private recetasService = inject(RecetasService);
  private menuService = inject(MenuService);
  private ingredientesService = inject(IngredientesService);

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
    
    // Parsear numeros
    const payload = {
      menuId: this.formData.menuId,
      ingredientes: this.formData.ingredientes.map(i => ({
        ingredienteId: i.ingredienteId,
        cantidadNecesaria: Number(i.cantidadNecesaria)
      }))
    };

    this.recetasService.crear(payload).subscribe({
      next: () => {
        this.guardando = false;
        this.resetForm();
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error guardando receta:', err);
        this.guardando = false;
        alert('Hubo un error al guardar la receta. Puede que este producto ya tenga una receta.');
      }
    });
  }

  resetForm() {
    this.formData = {
      menuId: '',
      ingredientes: []
    };
  }
}
