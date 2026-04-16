import { Component, OnInit, inject, signal } from '@angular/core';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';
import { CombosComidaComponent } from '../../components/combos-comida/combos-comida.component';
import { PeliCarteleraComponent } from '../../components/peli-cartelera/peli-cartelera.component';
import { PeliculasService } from '../../services/peliculas.service';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [DefaultLayoutComponent, CombosComidaComponent, PeliCarteleraComponent, HlmCardImports, HlmInput, HlmIconImports],
  template: `
    <app-default-layout>
      <div class="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-10">

        <!-- Hero -->
        <hlm-card class="flex flex-col md:flex-row gap-6 p-10 w-full items-center justify-between shadow-sm bg-card/50 backdrop-blur-xl">
          <div class="text-center md:text-left">
            <h1 class="text-4xl font-bold">Cine POOR</h1>
            <p class="text-muted-foreground mt-2">Compra tu combo, elige función y reserva tu mesa en minutos.</p>
          </div>
          <div class="relative w-full md:w-80">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input hlmInput type="text" placeholder="Buscar película..." class="w-full pl-10" />
          </div>
        </hlm-card>

        <!-- En vivo hoy -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <p class="text-lg font-semibold">En vivo hoy</p>
          </div>
          <hlm-card class="flex flex-col p-10 w-full items-center justify-center text-center shadow-sm bg-card/50 backdrop-blur-xl">
            <p class="text-2xl font-medium">Sin resultados</p>
            <p class="text-muted-foreground mt-2">No hay funciones próximas en las próximas 48 horas.</p>
          </hlm-card>
        </div>

        <!-- Combos para hoy -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <p class="text-lg font-semibold">Combos para hoy</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (combo of combos; track combo.nomProducto) {
              <app-combos-comida
                [nomProducto]="combo.nomProducto"
                [precioProducto]="combo.precioProducto"
                [infoProducto]="combo.infoProducto"
              />
            }
          </div>
        </div>

        <!-- En cartelera -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <p class="text-lg font-semibold">En cartelera</p>
          </div>
          
          @if (peliculas().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              @for (pelicula of peliculas(); track pelicula._id || pelicula.id) {
                <app-peli-cartelera
                  [peliTituloc]="pelicula.titulo"
                  [peliDurationc]="pelicula.duracionMinutos?.toString() || '0'"
                  [urlImgc]="pelicula.imagenUrl"
                />
              }
            </div>
          } @else {
            <hlm-card class="p-8 text-center shadow-sm">
              <p class="text-muted-foreground">Cargando cartelera o no hay películas disponibles.</p>
            </hlm-card>
          }
        </div>

      </div>
    </app-default-layout>
  `
})
export class IndexComponent implements OnInit {
  private peliculasService = inject(PeliculasService);
  
  peliculas = signal<any[]>([]);

  combos = [
    { nomProducto: 'Pizza en combo', precioProducto: '50.000', infoProducto: 'Pizza familiar con papas' },
    { nomProducto: 'Combo de nachos', precioProducto: '30.000', infoProducto: 'Nachos con queso y guacamole' },
    { nomProducto: 'Combo de hot dogs', precioProducto: '40.000', infoProducto: '2 hot dogs con papas' },
  ];

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.peliculasService.listar().subscribe({
      next: (response) => {
        const data = response?.data || response;
        this.peliculas.set(Array.isArray(data) ? data : []);
      },
      error: (err) => console.error('Error al obtener peliculas:', err)
    });
  }
}