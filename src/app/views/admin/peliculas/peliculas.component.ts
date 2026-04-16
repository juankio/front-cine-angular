import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeliculasService } from '../../../services/peliculas.service';

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Películas</h1>
          <p class="text-gray-500 text-sm">Gestiona el catálogo de películas en cartelera.</p>
        </div>
        <button (click)="abrirModal()" class="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nueva Película
        </button>
      </div>

      <!-- Lista de películas -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th scope="col" class="px-6 py-4 font-medium">Poster</th>
                <th scope="col" class="px-6 py-4 font-medium">Título</th>
                <th scope="col" class="px-6 py-4 font-medium">Duración (min)</th>
                <th scope="col" class="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @if (loading()) {
                <tr>
                  <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                    Cargando películas...
                  </td>
                </tr>
              } @else if (peliculas().length === 0) {
                <tr>
                  <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                    No hay películas registradas.
                  </td>
                </tr>
              } @else {
                @for (row of peliculas(); track row._id || row.id) {
                  <tr class="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td class="px-6 py-3">
                      @if (row.imagenUrl) {
                        <img [src]="row.imagenUrl" alt="Poster" class="h-12 w-8 object-cover rounded shadow-sm" />
                      } @else {
                        <div class="h-12 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      }
                    </td>
                    <td class="px-6 py-3 font-medium text-gray-900 dark:text-white">
                      {{ row.titulo }}
                    </td>
                    <td class="px-6 py-3 text-gray-600 dark:text-gray-400">
                      {{ row.duracionMinutos }}
                    </td>
                    <td class="px-6 py-3 text-right">
                      <button (click)="eliminar(row._id || row.id)" class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal para crear -->
      @if (modalAbierto()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" (click)="cerrarModal()"></div>
          
          <div class="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Agregar Película</h3>
                <button (click)="cerrarModal()" class="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              <form (ngSubmit)="guardarPelicula()" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input [(ngModel)]="form.titulo" name="titulo" placeholder="Ej: Inception" required class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duración (minutos)</label>
                  <input [(ngModel)]="form.duracionMinutos" name="duracionMinutos" type="number" placeholder="120" required class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de Imagen</label>
                  <input [(ngModel)]="form.imagenUrl" name="imagenUrl" placeholder="https://..." required class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>

                <div class="flex justify-end gap-3 mt-8">
                  <button type="button" (click)="cerrarModal()" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" [disabled]="guardando()" class="px-4 py-2 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50">
                    {{ guardando() ? 'Guardando...' : 'Guardar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PeliculasComponent implements OnInit {
  private peliculasService = inject(PeliculasService);

  peliculas = signal<any[]>([]);
  loading = signal(false);
  modalAbierto = signal(false);
  guardando = signal(false);

  form = {
    titulo: '',
    duracionMinutos: '',
    imagenUrl: ''
  };

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.loading.set(true);
    this.peliculasService.listar().subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.peliculas.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando películas', err);
        this.loading.set(false);
      }
    });
  }

  abrirModal() {
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.form = { titulo: '', duracionMinutos: '', imagenUrl: '' };
  }

  guardarPelicula() {
    this.guardando.set(true);
    const payload = {
      ...this.form,
      duracionMinutos: Number(this.form.duracionMinutos)
    };

    this.peliculasService.crear(payload).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarPeliculas();
        this.guardando.set(false);
      },
      error: (err) => {
        console.error('Error al guardar', err);
        this.guardando.set(false);
      }
    });
  }

  eliminar(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta película?')) return;
    this.peliculasService.eliminar(id).subscribe({
      next: () => {
        this.cargarPeliculas();
      },
      error: (err) => {
        console.error('Error al eliminar', err);
      }
    });
  }
}