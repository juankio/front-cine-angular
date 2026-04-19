import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';
import { CombosComidaComponent } from '../../components/combos-comida/combos-comida.component';
import { PeliCarteleraComponent } from '../../components/peli-cartelera/peli-cartelera.component';
import { PeliculasService } from '../../services/peliculas.service';
import { MenuService } from '../../services/menu.service';
import { SalasService } from '../../services/salas.service';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, DefaultLayoutComponent, CombosComidaComponent, PeliCarteleraComponent, HlmCardImports, HlmInput, HlmIconImports],
  template: `
    <app-default-layout>
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-10">

        <!-- Nuevo Hero Limpio y Minimalista -->
        <hlm-card class="relative flex flex-col p-8 md:p-14 w-full shadow-sm border-border bg-card overflow-hidden">
          
          <!-- Gradiente radial sutil de fondo -->
          <div class="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pointer-events-none"></div>

          <div class="relative z-10 flex flex-col md:flex-row gap-8 w-full items-center justify-between">
            <div class="text-center md:text-left flex-1">
              <h1 class="text-5xl md:text-8xl font-display tracking-widest text-foreground uppercase drop-shadow-sm">
                Cine POOR
              </h1>
              <p class="text-muted-foreground mt-4 text-base md:text-xl font-medium max-w-lg mx-auto md:mx-0">
                Compra tu combo, elige función y reserva tu mesa en minutos.
              </p>
            </div>
            <div class="relative w-full md:w-96 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-20"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input hlmInput type="text" placeholder="Buscar película..." class="w-full pl-12 h-14 text-lg rounded-xl bg-background border-border shadow-sm focus-visible:ring-primary relative z-10 transition-all hover:border-primary/50" />
            </div>
          </div>
        </hlm-card>

        <!-- En vivo hoy -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <p class="text-lg font-semibold uppercase tracking-wider font-display">Próximas funciones</p>
          </div>
          
          @if (funcionesVivas().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (funcion of funcionesVivas(); track funcion._id || funcion.id) {
                <div class="group flex items-center p-3 sm:p-4 gap-3 sm:gap-4 bg-card border border-border shadow-sm hover:shadow-primary/20 hover:border-primary/50 transition-all cursor-pointer rounded-xl overflow-hidden" (click)="irADetalle(funcion.peliculaId)">
                  <div class="w-16 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden relative">
                    @if (funcion.peliculaImg) {
                      <img [src]="funcion.peliculaImg" class="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Poster">
                    } @else {
                      <div class="w-full h-full flex items-center justify-center bg-secondary/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/50"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      </div>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-primary font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {{ funcion.inicio | date:'shortTime' }}
                    </p>
                    <h4 class="font-display text-lg uppercase truncate font-semibold text-foreground">{{ funcion.peliculaTitulo }}</h4>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground uppercase tracking-widest">{{ funcion.formato }}</span>
                      <span class="text-xs text-muted-foreground truncate">{{ funcion.salaNombre }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <hlm-card class="flex flex-col p-10 w-full items-center justify-center text-center shadow-sm bg-card/50 backdrop-blur-xl">
              <p class="text-2xl font-medium font-display uppercase tracking-widest text-muted-foreground">Sin resultados</p>
              <p class="text-muted-foreground mt-2">No hay funciones próximas.</p>
            </hlm-card>
          }
        </div>

        <!-- Combos para hoy -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <p class="text-lg font-semibold uppercase tracking-wider font-display">Combos para hoy</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (combo of menus(); track combo._id || combo.id) {
              <app-combos-comida
                [nomProducto]="combo.nombre"
                [precioProducto]="combo.precio?.toString() || '0'"
                [infoProducto]="combo.descripcion"
                [imagenUrl]="combo.imagenUrl"
              />
            }
          </div>
        </div>

        <!-- En cartelera -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <p class="text-lg font-semibold uppercase tracking-wider font-display">En cartelera</p>
          </div>
          
          @if (peliculas().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              @for (pelicula of peliculas(); track pelicula._id || pelicula.id) {
                <app-peli-cartelera
                  [peliIdc]="pelicula._id || pelicula.id"
                  [peliTituloc]="pelicula.titulo"
                  [peliDurationc]="pelicula.duracionMinutos?.toString() || '0'"
                  [urlImgc]="pelicula.imagenUrl"
                />
              }
            </div>
          } @else {
            <hlm-card class="flex flex-col p-10 w-full items-center justify-center text-center shadow-sm bg-card/50 backdrop-blur-xl min-h-[200px]">
              <div class="relative mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/30"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
                <div class="absolute inset-0 animate-pulse bg-gradient-to-tr from-transparent via-primary/20 to-transparent rounded-full mix-blend-overlay"></div>
              </div>
              <p class="text-xl font-medium font-display uppercase tracking-widest text-muted-foreground">Buscando estrenos...</p>
              <p class="text-muted-foreground mt-2 text-sm">Cargando cartelera o no hay películas disponibles por el momento.</p>
            </hlm-card>
          }
        </div>

      </div>
    </app-default-layout>
  `
})
export class IndexComponent implements OnInit {
  private peliculasService = inject(PeliculasService);
  private menuService = inject(MenuService);
  private salasService = inject(SalasService);
  private router = inject(Router);
  
  peliculas = signal<any[]>([]);
  menus = signal<any[]>([]);
  salas = signal<any[]>([]);

  funcionesVivas = computed(() => {
    const allSalas = this.salas();
    const allPelis = this.peliculas();
    const now = new Date();
    
    let vivas: any[] = [];
    
    allSalas.forEach(sala => {
      if (sala.funciones && Array.isArray(sala.funciones)) {
        sala.funciones.forEach((f: any) => {
          const peliId = f.peliculaId?._id || f.peliculaId?.id || f.peliculaId;
          const peli = allPelis.find(p => (p._id || p.id) === peliId);
          vivas.push({
            ...f,
            salaNombre: sala.nombre,
            peliculaTitulo: peli ? peli.titulo : f.tituloPelicula || 'Película Desconocida',
            peliculaImg: peli ? peli.imagenUrl : f.pelicula?.imagenUrl || null
          });
        });
      }
    });

    const limitDate = new Date(now.getTime() - 60 * 60 * 1000); 
    vivas = vivas.filter(f => new Date(f.inicio) >= limitDate);

    vivas.sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());

    return vivas.slice(0, 4);
  });

  ngOnInit() {
    this.cargarPeliculas();
    this.cargarMenus();
    this.cargarSalas();
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

  cargarMenus() {
    this.menuService.listar().subscribe({
      next: (response) => {
        const data = response?.data || response;
        // Limitar a los primeros 3 para mantener el diseño original si hay muchos
        const items = Array.isArray(data) ? data : [];
        this.menus.set(items.slice(0, 3));
      },
      error: (err) => console.error('Error al obtener menús:', err)
    });
  }

  cargarSalas() {
    this.salasService.listar().subscribe({
      next: (response) => {
        const data = response?.data || response;
        this.salas.set(Array.isArray(data) ? data : []);
      },
      error: (err) => console.error('Error al obtener salas:', err)
    });
  }

  irADetalle(id: string) {
    const peliId = id || (this.peliculas().find(p => p._id === id || p.id === id)?._id);
    if(peliId) {
      this.router.navigate(['/pelicula', peliId]);
    }
  }
}