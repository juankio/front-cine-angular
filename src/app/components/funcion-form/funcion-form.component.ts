import { Component, EventEmitter, Input, Output, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalasService } from '../../services/salas.service';
import { PeliculasService } from '../../services/peliculas.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-funcion-form',
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
              Programar Función en {{ sala?.nombre }}
            </h3>
            <button (click)="cerrar()" class="text-muted-foreground hover:text-foreground transition-colors h-8 w-8 flex items-center justify-center rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="p-6">
            <form (ngSubmit)="guardar()" #formEl="ngForm" class="space-y-5">
              
              <!-- Película -->
              <div class="space-y-1.5">
                <label class="block text-sm font-display tracking-wider text-muted-foreground uppercase">Película a proyectar</label>
                <select [(ngModel)]="form.peliculaId" name="peliculaId" required 
                       class="flex h-12 w-full rounded-sm border border-border bg-input px-4 py-2 text-base font-body text-foreground transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                  <option value="" disabled selected class="text-muted-foreground bg-background">Seleccione una película...</option>
                  @for (pelicula of peliculas(); track pelicula.id) {
                    <option [value]="pelicula.id" class="bg-background">{{ pelicula.titulo }} ({{ pelicula.duracionMinutos }} min)</option>
                  }
                </select>
              </div>

              <!-- Fecha y Hora de Inicio -->
              <div class="space-y-1.5">
                <label class="block text-sm font-display tracking-wider text-muted-foreground uppercase">Fecha y Hora de Inicio</label>
                <input [(ngModel)]="form.inicio" name="inicio" type="datetime-local" required
                       class="flex h-12 w-full rounded-sm border border-border bg-input px-4 py-2 text-base font-body text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>

              <!-- Opciones de Proyección -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="block text-sm font-display tracking-wider text-muted-foreground uppercase">Idioma</label>
                  <select [(ngModel)]="form.idioma" name="idioma" required 
                         class="flex h-12 w-full rounded-sm border border-border bg-input px-4 py-2 text-base font-body text-foreground transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    <option value="doblada" class="bg-background">Doblada (Esp)</option>
                    <option value="subtitulada" class="bg-background">Subtitulada</option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-sm font-display tracking-wider text-muted-foreground uppercase">Formato</label>
                  <select [(ngModel)]="form.formato" name="formato" required 
                         class="flex h-12 w-full rounded-sm border border-border bg-input px-4 py-2 text-base font-body text-foreground transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    <option value="2D" class="bg-background">2D Estandar</option>
                    <option value="3D" class="bg-background">3D</option>
                    <option value="IMAX" class="bg-background">IMAX</option>
                    <option value="4DX" class="bg-background">4DX</option>
                  </select>
                </div>
              </div>

              <!-- Precio Base -->
              <div class="space-y-1.5">
                <label class="block text-sm font-display tracking-wider text-muted-foreground uppercase">Precio Base Ticket ($)</label>
                <input [(ngModel)]="form.precio" name="precio" type="number" required min="0" step="0.01"
                       class="flex h-12 w-full rounded-sm border border-border bg-input px-4 py-2 text-base font-body text-foreground transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <button type="button" class="px-6 py-3 border border-border text-muted-foreground font-display tracking-widest uppercase rounded-sm hover:bg-secondary transition-colors text-sm" (click)="cerrar()">
                  Cancelar
                </button>
                <button type="submit" class="px-8 py-3 bg-primary text-primary-foreground font-display tracking-[0.2em] uppercase rounded-sm shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/60 disabled:opacity-50 disabled:shadow-none transition-all text-base" [disabled]="!formEl.valid || guardando()">
                  {{ guardando() ? 'Agendando...' : 'Agendar Función' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `
})
export class FuncionFormComponent implements OnInit {
  @Input() visible = false;
  @Input() sala: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private salasService = inject(SalasService);
  private peliculasService = inject(PeliculasService);
  private toastService = inject(ToastService);

  peliculas = signal<any[]>([]);
  guardando = signal(false);

  form = {
    peliculaId: '',
    inicio: '',
    idioma: 'doblada',
    formato: '2D',
    precio: 1500
  };

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.peliculasService.listar().subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.peliculas.set(Array.isArray(data) ? data : []);
      }
    });
  }

  cerrar() {
    this.resetForm();
    this.closed.emit();
  }

  resetForm() {
    this.form = {
      peliculaId: '',
      inicio: '',
      idioma: 'doblada',
      formato: '2D',
      precio: 1500
    };
  }

  guardar() {
    if (!this.sala || !this.form.peliculaId || !this.form.inicio) return;
    this.guardando.set(true);

    const payload = {
      peliculaId: this.form.peliculaId,
      inicio: new Date(this.form.inicio).toISOString(),
      idioma: this.form.idioma,
      formato: this.form.formato,
      precio: Number(this.form.precio)
    };

    const salaId = this.sala._id || this.sala.id;

    this.salasService.crearFuncion(salaId, payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.toastService.success('Función programada con éxito.');
        this.cerrar();
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error al guardar la función', err);
        this.guardando.set(false);
        const msg = err.error?.message || 'Error al programar. Verifica que no haya choque de horarios.';
        this.toastService.error(msg);
      }
    });
  }
}
