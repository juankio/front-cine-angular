import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeliculasService } from '../../services/peliculas.service';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-pelicula-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmCardImports, HlmButtonImports],
  template: `
    @if (visible) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" (click)="cerrar()"></div>
        
        <hlm-card class="relative z-10 w-full max-w-md shadow-xl bg-card border-border">
          <div hlmCardHeader class="flex flex-row items-center justify-between pb-6">
            <h3 hlmCardTitle>Agregar Película</h3>
            <button hlmBtn variant="ghost" size="icon" (click)="cerrar()" class="h-8 w-8 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div hlmCardContent>
            <form (ngSubmit)="guardar()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Título</label>
                <input [(ngModel)]="form.titulo" name="titulo" placeholder="Ej: Inception" required class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Duración (minutos)</label>
                <input [(ngModel)]="form.duracionMinutos" name="duracionMinutos" type="number" placeholder="120" required class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">URL de Imagen</label>
                <input [(ngModel)]="form.imagenUrl" name="imagenUrl" placeholder="https://..." required class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              </div>

              <div class="flex justify-end gap-3 mt-8">
                <button type="button" hlmBtn variant="outline" (click)="cerrar()">
                  Cancelar
                </button>
                <button type="submit" hlmBtn [disabled]="guardando()">
                  {{ guardando() ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </hlm-card>
      </div>
    }
  `
})
export class PeliculaFormComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private peliculasService = inject(PeliculasService);
  guardando = signal(false);

  form = {
    titulo: '',
    duracionMinutos: '',
    imagenUrl: ''
  };

  cerrar() {
    this.form = { titulo: '', duracionMinutos: '', imagenUrl: '' };
    this.closed.emit();
  }

  guardar() {
    this.guardando.set(true);
    const payload = {
      ...this.form,
      duracionMinutos: Number(this.form.duracionMinutos)
    };

    this.peliculasService.crear(payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.form = { titulo: '', duracionMinutos: '', imagenUrl: '' };
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error al guardar', err);
        this.guardando.set(false);
      }
    });
  }
}
