import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeliculasService } from '../../../services/peliculas.service';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmTableImports, HlmCardImports, HlmButtonImports],
  template: `
    <div class="max-w-4xl mx-auto p-6 flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Películas</h1>
          <p class="text-gray-500 text-sm">Gestiona el catálogo de películas en cartelera.</p>
        </div>
        <button hlmBtn size="sm" (click)="abrirModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nueva Película
        </button>
      </div>

      <!-- Lista de películas -->
      <hlm-card>
        <div hlmTableContainer>
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh>Poster</th>
                <th hlmTh>Título</th>
                <th hlmTh>Duración (min)</th>
                <th hlmTh class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @if (loading()) {
                <tr hlmTr>
                  <td hlmTd colspan="4" class="py-8 text-center text-gray-500">
                    Cargando películas...
                  </td>
                </tr>
              } @else if (peliculas().length === 0) {
                <tr hlmTr>
                  <td hlmTd colspan="4" class="py-8 text-center text-gray-500">
                    No hay películas registradas.
                  </td>
                </tr>
              } @else {
                @for (row of peliculas(); track row._id || row.id) {
                  <tr hlmTr>
                    <td hlmTd>
                      @if (row.imagenUrl) {
                        <img [src]="row.imagenUrl" alt="Poster" class="h-12 w-8 object-cover rounded shadow-sm" />
                      } @else {
                        <div class="h-12 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      }
                    </td>
                    <td hlmTd class="font-medium text-gray-900 dark:text-white">
                      {{ row.titulo }}
                    </td>
                    <td hlmTd class="text-gray-600 dark:text-gray-400">
                      {{ row.duracionMinutos }}
                    </td>
                    <td hlmTd class="text-right">
                      <button hlmBtn variant="ghost" size="icon" (click)="eliminar(row._id || row.id)" class="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </hlm-card>

      <!-- Modal para crear -->
      @if (modalAbierto()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" (click)="cerrarModal()"></div>
          
          <hlm-card class="relative z-10 w-full max-w-md shadow-xl bg-card border-border">
            <div hlmCardHeader class="flex flex-row items-center justify-between pb-6">
              <h3 hlmCardTitle>Agregar Película</h3>
              <button hlmBtn variant="ghost" size="icon" (click)="cerrarModal()" class="h-8 w-8 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div hlmCardContent>
              <form (ngSubmit)="guardarPelicula()" class="space-y-4">
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
                  <button type="button" hlmBtn variant="outline" (click)="cerrarModal()">
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