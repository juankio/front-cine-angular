import { Component, EventEmitter, Input, Output, inject, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeliculasService } from '../../services/peliculas.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-pelicula-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (visible) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" (click)="cerrar()"></div>
        
        <!-- Modal Content -->
        <div class="relative z-10 w-full max-w-lg bg-card text-foreground border border-border shadow-2xl shadow-primary/15 rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          <div class="flex flex-row items-center justify-between p-6 border-b border-border bg-secondary">
            <h3 class="text-2xl font-display tracking-widest uppercase text-foreground drop-shadow-sm">
              {{ peliculaEditar ? 'Editar Película' : 'Nueva Película' }}
            </h3>
            <button (click)="cerrar()" class="text-muted-foreground hover:text-foreground transition-colors h-8 w-8 flex items-center justify-center rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="p-6">
            <form (ngSubmit)="guardar()" #formEl="ngForm" class="space-y-5">
              
              <!-- Título -->
              <div class="space-y-1.5">
                <label class="block text-sm font-display tracking-wider text-muted-foreground uppercase">Título</label>
                <input [(ngModel)]="form.titulo" name="titulo" placeholder="Ej: Inception" required 
                       class="flex h-12 w-full rounded-sm border border-border bg-input px-4 py-2 text-lg font-body text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>

              <!-- Duración -->
              <div class="space-y-1.5">
                <label class="block text-sm font-display tracking-wider text-muted-foreground uppercase">Duración (minutos)</label>
                <div class="relative">
                  <input [(ngModel)]="form.duracionMinutos" name="duracionMinutos" type="number" placeholder="120" required min="1"
                         class="flex h-12 w-full rounded-sm border border-border bg-input px-4 py-2 text-lg font-body text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary pr-12" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-display tracking-wider uppercase text-sm pointer-events-none">MIN</span>
                </div>
              </div>

              <!-- URL Imagen -->
              <div class="space-y-1.5">
                <label class="block text-sm font-display tracking-wider text-muted-foreground uppercase flex justify-between">
                  URL de Imagen (Poster)
                  @if (form.imagenUrl && !imageError) {
                    <span class="text-green-500 text-xs flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> URL Válida</span>
                  }
                </label>
                <input [(ngModel)]="form.imagenUrl" name="imagenUrl" type="url" placeholder="https://..." required (input)="imageError = false"
                       class="flex h-12 w-full rounded-sm border border-border bg-input px-4 py-2 text-base font-body text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                <p class="text-xs text-muted-foreground font-body">Pegue la URL directa de la imagen (formatos recomendados: JPG, PNG, WEBP).</p>
              </div>

              <!-- Vista previa (Si hay URL) -->
              @if (form.imagenUrl) {
                <div class="mt-4 p-4 border border-border bg-secondary rounded-sm flex items-center gap-4">
                  <div class="w-16 h-24 bg-input border border-border shadow-md shrink-0">
                    <img [src]="form.imagenUrl" class="w-full h-full object-cover" alt="Preview" (error)="imageError = true" (load)="imageError = false" />
                  </div>
                  <div class="flex-1">
                    @if (imageError) {
                      <p class="text-primary font-medium text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                        La imagen no pudo cargar.
                      </p>
                      <p class="text-xs text-muted-foreground mt-1">Intente con otra URL. Esta parece estar bloqueada o caída.</p>
                    } @else {
                      <p class="text-green-500 font-medium text-sm flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                        Vista previa correcta
                      </p>
                    }
                  </div>
                </div>
              }

              <!-- Actions -->
              <div class="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" class="px-6 py-3 border border-border text-muted-foreground font-display tracking-widest uppercase rounded-sm hover:bg-secondary transition-colors text-sm" (click)="cerrar()">
                  Cancelar
                </button>
                <button type="submit" class="px-8 py-3 bg-primary text-primary-foreground font-display tracking-[0.2em] uppercase rounded-sm shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/60 disabled:opacity-50 disabled:shadow-none transition-all text-base" [disabled]="!formEl.valid || guardando() || (form.imagenUrl && imageError)">
                  {{ guardando() ? 'Guardando...' : (peliculaEditar ? 'Actualizar' : 'Crear Película') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class PeliculaFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() peliculaEditar: any = null; // Nueva prop para recibir datos a editar
  
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private peliculasService = inject(PeliculasService);
  private toastService = inject(ToastService);
  guardando = signal(false);
  imageError = false;

  form = {
    titulo: '',
    duracionMinutos: '',
    imagenUrl: '',
    anio: new Date().getFullYear(),
    genero: 'Acción',
    descripcion: 'Sin sinopsis',
  };

  ngOnChanges(changes: SimpleChanges) {
    // Si pasamos una película para editar, llenamos el formulario
    if (changes['peliculaEditar'] && this.peliculaEditar) {
      this.form = {
        titulo: this.peliculaEditar.titulo || '',
        duracionMinutos: this.peliculaEditar.duracionMinutos?.toString() || '',
        imagenUrl: this.peliculaEditar.imagenUrl || '',
        anio: this.peliculaEditar.anio || new Date().getFullYear(),
        genero: this.peliculaEditar.genero || 'Acción',
        descripcion: this.peliculaEditar.descripcion || 'Sin sinopsis',
      };
      this.imageError = false;
    }
  }

  cerrar() {
    this.form = { titulo: '', duracionMinutos: '', imagenUrl: '', anio: new Date().getFullYear(), genero: 'Acción', descripcion: 'Sin sinopsis' };
    this.imageError = false;
    this.closed.emit();
  }

  guardar() {
    this.guardando.set(true);
    const payload = {
      titulo: this.form.titulo,
      duracionMinutos: Number(this.form.duracionMinutos),
      imagenUrl: this.form.imagenUrl,
      anio: Number(this.form.anio) || new Date().getFullYear(),
      genero: this.form.genero || 'Acción',
      descripcion: this.form.descripcion || 'Sin descripción proporcionada.',
    };

    if (this.peliculaEditar && (this.peliculaEditar._id || this.peliculaEditar.id)) {
      // Editar
      const id = this.peliculaEditar._id || this.peliculaEditar.id;
      this.peliculasService.actualizar(id, payload).subscribe({
        next: () => {
          this.guardando.set(false);
          this.cerrar();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          this.guardando.set(false);
          this.toastService.error('Error al actualizar la película.');
        }
      });
    } else {
      // Crear nueva
      this.peliculasService.crear(payload).subscribe({
        next: () => {
          this.guardando.set(false);
          this.cerrar();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al guardar', err);
          this.guardando.set(false);
          this.toastService.error('Error al crear la película.');
        }
      });
    }
  }
}
