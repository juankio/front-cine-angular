import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, OnInit, inject, signal, computed , DestroyRef } from '@angular/core';
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
  templateUrl: './index.component.html'})
export class IndexComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private peliculasService = inject(PeliculasService);
  private menuService = inject(MenuService);
  private salasService = inject(SalasService);
  private router = inject(Router);
  
  peliculas = signal<any[]>([]);
  menus = signal<any[]>([]);
  salas = signal<any[]>([]);
  searchTerm = signal('');

  peliculasFiltradas = computed(() => {
    const p = this.peliculas();
    const s = this.searchTerm().trim().toLowerCase();
    
    if (!s) return p;
    
    return p.filter(pelicula => 
      pelicula.titulo?.toLowerCase().includes(s)
    );
  });

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
    this.peliculasService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        const data = response?.data || response;
        this.peliculas.set(Array.isArray(data) ? data : []);
      },
      error: (err) => console.error('Error al obtener peliculas:', err)
    });
  }

  cargarMenus() {
    this.menuService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.salasService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        const data = response?.data || response;
        this.salas.set(Array.isArray(data) ? data : []);
      },
      error: (err) => console.error('Error al obtener salas:', err)
    });
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  irADetalle(id: string) {
    const peliId = id || (this.peliculas().find(p => p._id === id || p.id === id)?._id);
    if(peliId) {
      this.router.navigate(['/pelicula', peliId]);
    }
  }
}