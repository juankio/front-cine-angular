import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalasService } from '../../services/salas.service';

import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-sala-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmLabel, HlmInput, HlmButtonImports],
  template: `
    @if (visible) {
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <!-- Modal -->
        <div class="bg-card text-card-foreground border border-border shadow-lg rounded-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold tracking-tight">Configurar Nueva Sala</h2>
              <button hlmBtn variant="ghost" size="icon" (click)="cerrar()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span class="sr-only">Cerrar</span>
              </button>
            </div>

            <form (ngSubmit)="guardar()" #form="ngForm" class="space-y-4">
              <!-- Nombre Sala -->
              <div class="space-y-1">
                <label hlmLabel for="nombre">Nombre o Número de Sala</label>
                <input 
                  hlmInput 
                  id="nombre" 
                  name="nombre" 
                  [(ngModel)]="formData.nombre" 
                  required 
                  class="w-full"
                  placeholder="Ej: Sala 1 VIP"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <!-- Filas -->
                <div class="space-y-1">
                  <label hlmLabel for="filas">Total de Filas</label>
                  <input 
                    hlmInput 
                    type="number"
                    id="filas" 
                    name="filas" 
                    [(ngModel)]="formData.filas" 
                    required 
                    min="1"
                    max="26"
                    class="w-full"
                    placeholder="Ej: 10"
                  />
                  <p class="text-[0.8rem] text-muted-foreground mt-1">
                    (Se asignarán letras A-Z)
                  </p>
                </div>

                <!-- Asientos por fila -->
                <div class="space-y-1">
                  <label hlmLabel for="asientos">Asientos por Fila</label>
                  <input 
                    hlmInput 
                    type="number"
                    id="asientos" 
                    name="asientosPorFila" 
                    [(ngModel)]="formData.asientosPorFila" 
                    required 
                    min="1"
                    max="50"
                    class="w-full"
                    placeholder="Ej: 12"
                  />
                  <p class="text-[0.8rem] text-muted-foreground mt-1">
                    (Total: {{ totalAsientos }} asientos)
                  </p>
                </div>
              </div>

              <!-- Acciones -->
              <div class="flex justify-end gap-2 pt-4 border-t border-border mt-6">
                <button type="button" hlmBtn variant="outline" (click)="cerrar()">
                  Cancelar
                </button>
                <button type="submit" hlmBtn [disabled]="!form.valid || guardando">
                  {{ guardando ? 'Creando...' : 'Crear Sala' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class SalaFormComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private salasService = inject(SalasService);

  guardando = false;

  formData = {
    nombre: '',
    filas: 10,
    asientosPorFila: 12
  };

  get totalAsientos(): number {
    return (this.formData.filas || 0) * (this.formData.asientosPorFila || 0);
  }

  cerrar() {
    this.resetForm();
    this.closed.emit();
  }

  guardar() {
    this.guardando = true;
    
    const payload = {
      nombre: this.formData.nombre,
      filas: Number(this.formData.filas),
      asientosPorFila: Number(this.formData.asientosPorFila)
    };

    this.salasService.crear(payload).subscribe({
      next: () => {
        this.guardando = false;
        this.resetForm();
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error creando sala:', err);
        this.guardando = false;
        alert('Hubo un error al crear la sala.');
      }
    });
  }

  resetForm() {
    this.formData = {
      nombre: '',
      filas: 10,
      asientosPorFila: 12
    };
  }
}
