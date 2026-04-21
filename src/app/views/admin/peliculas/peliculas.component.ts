import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, OnInit, inject, signal , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeliculasService } from '../../../services/peliculas.service';

import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { PeliculaFormComponent } from '../../../components/pelicula-form/pelicula-form.component';

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmTableImports, HlmCardImports, HlmButtonImports, PeliculaFormComponent],
  templateUrl: './peliculas.component.html'})
export class PeliculasComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private peliculasService = inject(PeliculasService);

  peliculas = signal<any[]>([]);
  loading = signal(false);
  modalAbierto = signal(false);
  peliculaEditar: any = null;

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.loading.set(true);
    this.peliculasService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.peliculaEditar = null;
    this.modalAbierto.set(true);
  }

  editar(pelicula: any) {
    this.peliculaEditar = pelicula;
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  onPeliculaGuardada() {
    this.cerrarModal();
    this.cargarPeliculas();
  }

  eliminar(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta película?')) return;
    this.peliculasService.eliminar(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.cargarPeliculas();
      },
      error: (err) => {
        console.error('Error al eliminar', err);
      }
    });
  }
}
