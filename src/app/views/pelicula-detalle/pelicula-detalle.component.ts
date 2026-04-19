import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PeliculasService } from '../../services/peliculas.service';
import { SalasService } from '../../services/salas.service';
import { EntradasService } from '../../services/entradas.service';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';

import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-pelicula-detalle',
  standalone: true,
  imports: [CommonModule, DefaultLayoutComponent, HlmCardImports, HlmBadge, HlmButtonImports, RouterLink],
  template: `
    <app-default-layout>
      @if (loading()) {
        <div class="h-[60vh] flex items-center justify-center">
          <p class="text-xl text-muted-foreground animate-pulse">Cargando película...</p>
        </div>
      } @else if (pelicula()) {
        
        <!-- Hero Section con Poster y Detalles Básicos -->
        <div class="relative w-full bg-black min-h-[40vh] md:min-h-[50vh] flex items-end">
          <div class="absolute inset-0 w-full h-full overflow-hidden">
            @if (pelicula().imagenUrl) {
              <img [src]="pelicula().imagenUrl" alt="Poster de Fondo" class="w-full h-full object-cover opacity-30 blur-sm scale-105" />
            }
            <div class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          
          <div class="relative z-10 w-full max-w-7xl mx-auto px-6 pb-10 flex flex-col md:flex-row gap-8 items-end md:items-start pt-20">
            <!-- Poster -->
            @if (pelicula().imagenUrl) {
              <img [src]="pelicula().imagenUrl" [alt]="pelicula().titulo" class="w-48 md:w-64 aspect-[2/3] object-cover rounded-md shadow-2xl border border-border/50 hidden md:block -mt-32" />
            }
            
            <!-- Info Text -->
            <div class="flex-1 flex flex-col">
              <div class="flex flex-wrap gap-2 mb-4">
                <hlm-badge variant="default">{{ pelicula().duracionMinutos }} MIN</hlm-badge>
              </div>
              <h1 class="text-5xl md:text-7xl font-display uppercase tracking-wider text-white drop-shadow-md mb-2">
                {{ pelicula().titulo }}
              </h1>
              <p class="text-lg text-muted-foreground max-w-3xl line-clamp-3">
                {{ pelicula().sinopsis || 'Sin sinopsis disponible para esta película.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12">
          
          <!-- SECCIÓN: Elegir Función -->
          <section>
            <h2 class="text-2xl md:text-3xl font-display uppercase mb-6 flex items-center gap-3">
              <span class="bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center rounded-full text-lg">1</span>
              Elige tu función
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @if (funciones().length === 0) {
                <p class="text-muted-foreground italic col-span-full">No hay funciones programadas para esta película.</p>
              } @else {
                @for (funcion of funciones(); track funcion._id) {
                  <hlm-card 
                    class="cursor-pointer transition-all hover:border-primary"
                    [class.border-primary]="funcionSeleccionada()?._id === funcion._id"
                    [class.bg-primary]="funcionSeleccionada()?._id === funcion._id"
                    [class.text-primary-foreground]="funcionSeleccionada()?._id === funcion._id"
                    (click)="seleccionarFuncion(funcion)">
                    <div class="p-4 flex flex-col">
                      <div class="text-sm opacity-80 mb-1">{{ funcion.fechaInicio | date:'fullDate' }}</div>
                      <div class="text-2xl font-bold mb-2">{{ funcion.fechaInicio | date:'shortTime' }}</div>
                      <div class="flex items-center gap-2 mt-auto pt-2 border-t" [class.border-primary-foreground/20]="funcionSeleccionada()?._id === funcion._id" [class.border-border]="funcionSeleccionada()?._id !== funcion._id">
                        <span class="font-medium text-sm">Sala {{ funcion.sala?.nombre || 'Desconocida' }}</span>
                        <span class="text-xs opacity-70 ml-auto">{{ funcion.formato || '2D' }} • {{ funcion.idioma || 'Sub' }}</span>
                      </div>
                    </div>
                  </hlm-card>
                }
              }
            </div>
          </section>

          <!-- SECCIÓN: Elegir Asientos -->
          @if (funcionSeleccionada()) {
            <section class="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <h2 class="text-2xl md:text-3xl font-display uppercase mb-6 flex items-center gap-3">
                <span class="bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center rounded-full text-lg">2</span>
                Selecciona tus asientos
              </h2>

              <div class="flex flex-col lg:flex-row gap-8 items-start">
                
                <!-- Mapa de Asientos -->
                <hlm-card class="flex-1 p-8 w-full overflow-x-auto bg-card/50 backdrop-blur border-border">
                  <div class="min-w-[500px] flex flex-col items-center">
                    
                    <!-- Pantalla -->
                    <div class="w-3/4 h-2 bg-gradient-to-b from-primary/50 to-transparent rounded-t-full mb-12 relative">
                      <div class="absolute -top-6 w-full text-center text-sm font-display tracking-[0.5em] text-muted-foreground uppercase">Pantalla</div>
                    </div>

                    <!-- Grilla -->
                    <div class="flex flex-col gap-3">
                      @for (fila of matrizAsientos(); track fila.letra) {
                        <div class="flex items-center gap-4">
                          <span class="w-6 text-center font-bold text-muted-foreground">{{ fila.letra }}</span>
                          <div class="flex gap-2">
                            @for (asiento of fila.asientos; track asiento.id) {
                              <button 
                                class="w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-sm border transition-all text-xs font-medium"
                                [class.bg-muted]="asiento.estado === 'ocupado'"
                                [class.border-transparent]="asiento.estado === 'ocupado'"
                                [class.text-muted-foreground/30]="asiento.estado === 'ocupado'"
                                [class.cursor-not-allowed]="asiento.estado === 'ocupado'"
                                
                                [class.bg-primary]="asiento.estado === 'seleccionado'"
                                [class.border-primary]="asiento.estado === 'seleccionado'"
                                [class.text-primary-foreground]="asiento.estado === 'seleccionado'"
                                [class.shadow-[0_0_15px_rgba(var(--primary),0.5)]]="asiento.estado === 'seleccionado'"
                                
                                [class.bg-background]="asiento.estado === 'libre'"
                                [class.border-border]="asiento.estado === 'libre'"
                                [class.hover:border-primary]="asiento.estado === 'libre'"
                                [class.hover:bg-primary/10]="asiento.estado === 'libre'"
                                
                                [disabled]="asiento.estado === 'ocupado'"
                                (click)="toggleAsiento(asiento.id)">
                                {{ asiento.numero }}
                              </button>
                            }
                          </div>
                          <span class="w-6 text-center font-bold text-muted-foreground">{{ fila.letra }}</span>
                        </div>
                      }
                    </div>

                    <!-- Leyenda -->
                    <div class="flex gap-6 mt-12 text-sm text-muted-foreground border-t border-border pt-6 w-full justify-center">
                      <div class="flex items-center gap-2"><div class="w-4 h-4 rounded-sm border border-border bg-background"></div> Disponible</div>
                      <div class="flex items-center gap-2"><div class="w-4 h-4 rounded-sm bg-primary shadow-sm"></div> Seleccionado</div>
                      <div class="flex items-center gap-2"><div class="w-4 h-4 rounded-sm bg-muted border border-transparent"></div> Ocupado</div>
                    </div>

                  </div>
                </hlm-card>

                <!-- Resumen de Compra Lateral -->
                <hlm-card class="w-full lg:w-96 shrink-0 p-6 sticky top-6">
                  <h3 class="text-xl font-bold mb-4 border-b border-border pb-4">Resumen de Compra</h3>
                  
                  <div class="space-y-4 mb-6">
                    <div>
                      <p class="text-sm text-muted-foreground">Película</p>
                      <p class="font-medium">{{ pelicula().titulo }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-muted-foreground">Función</p>
                      <p class="font-medium">{{ funcionSeleccionada()?.fechaInicio | date:'medium' }}</p>
                      <p class="text-sm">Sala {{ funcionSeleccionada()?.sala?.nombre }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-muted-foreground">Asientos ({{ asientosSeleccionados().length }})</p>
                      @if (asientosSeleccionados().length > 0) {
                        <p class="font-medium text-primary">{{ asientosSeleccionados().join(', ') }}</p>
                      } @else {
                        <p class="text-sm italic opacity-50">Ninguno seleccionado</p>
                      }
                    </div>
                  </div>

                  <div class="border-t border-border pt-4 mb-6 flex justify-between items-end">
                    <span class="text-lg">Total</span>
                    <span class="text-3xl font-display font-bold">\${{ (asientosSeleccionados().length * 1500) | number:'1.2-2' }}</span>
                  </div>

                  <button 
                    hlmBtn 
                    class="w-full h-12 text-lg font-bold" 
                    [disabled]="asientosSeleccionados().length === 0 || procesando()"
                    (click)="confirmarCompra()">
                    {{ procesando() ? 'Procesando...' : 'Pagar Entradas' }}
                  </button>
                </hlm-card>

              </div>
            </section>
          }

        </div>
      } @else {
        <div class="h-[60vh] flex flex-col items-center justify-center text-center">
          <h2 class="text-2xl font-bold mb-2">Película no encontrada</h2>
          <p class="text-muted-foreground mb-6">La película que buscas no existe o ha sido retirada.</p>
          <a routerLink="/" hlmBtn>Volver a la cartelera</a>
        </div>
      }
    </app-default-layout>
  `
})
export class PeliculaDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private peliculasService = inject(PeliculasService);
  private salasService = inject(SalasService);
  private entradasService = inject(EntradasService);

  pelicula = signal<any>(null);
  funciones = signal<any[]>([]);
  loading = signal(true);
  
  funcionSeleccionada = signal<any>(null);
  matrizAsientos = signal<any[]>([]);
  asientosSeleccionados = signal<string[]>([]);
  
  procesando = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarDatos(id);
    } else {
      this.loading.set(false);
    }
  }

  cargarDatos(id: string) {
    this.peliculasService.obtenerPorId(id).subscribe({
      next: (res) => {
        this.pelicula.set(res?.data || res);
        
        // Cargar funciones asociadas a esta pelicula (simulación rápida buscando en todas las salas por ahora)
        this.salasService.listar().subscribe(salasRes => {
          const salas = salasRes?.data || salasRes || [];
          let allFunciones: any[] = [];
          
          salas.forEach((sala: any) => {
            if (sala.funciones) {
              const funcionesSala = sala.funciones.filter((f: any) => 
                (f.peliculaId === id) || (typeof f.pelicula === 'object' && f.pelicula._id === id)
              ).map((f: any) => ({...f, sala}));
              allFunciones = [...allFunciones, ...funcionesSala];
            }
          });
          
          this.funciones.set(allFunciones);
          this.loading.set(false);
        });
      },
      error: () => this.loading.set(false)
    });
  }

  seleccionarFuncion(funcion: any) {
    this.funcionSeleccionada.set(funcion);
    this.asientosSeleccionados.set([]);
    this.generarMatrizAsientos(funcion.sala);
    
    // Obtener asientos ocupados desde el backend
    this.entradasService.disponibilidadFuncion(funcion._id).subscribe({
      next: (res) => {
        const ocupados = res?.ocupados || [];
        this.actualizarAsientosOcupados(ocupados);
      },
      error: (e) => console.log("Aun no hay endpoint de disponibilidad o fallo", e)
    });
  }

  generarMatrizAsientos(sala: any) {
    // Si la sala viene con filas y asientosPorFila del nuevo backend
    const numFilas = sala?.filas || 10;
    const asientosPorFila = sala?.asientosPorFila || 12;
    
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const matriz = [];

    for (let i = 0; i < numFilas; i++) {
      const letra = letras[i] || `F${i}`;
      const fila = { letra, asientos: [] as any[] };
      
      for (let j = 1; j <= asientosPorFila; j++) {
        fila.asientos.push({
          id: `${letra}${j}`,
          numero: j,
          estado: 'libre' // libre, ocupado, seleccionado
        });
      }
      matriz.push(fila);
    }
    
    this.matrizAsientos.set(matriz);
  }

  actualizarAsientosOcupados(asientosOcupados: string[]) {
    this.matrizAsientos.update(matriz => {
      return matriz.map(fila => ({
        ...fila,
        asientos: fila.asientos.map((a: any) => ({
          ...a,
          estado: asientosOcupados.includes(a.id) ? 'ocupado' : a.estado
        }))
      }));
    });
  }

  toggleAsiento(id: string) {
    const index = this.asientosSeleccionados().indexOf(id);
    let nuevosSeleccionados = [...this.asientosSeleccionados()];
    
    if (index > -1) {
      nuevosSeleccionados.splice(index, 1);
    } else {
      // Límite de 8 asientos por compra
      if (nuevosSeleccionados.length >= 8) {
        alert("Máximo 8 asientos por compra");
        return;
      }
      nuevosSeleccionados.push(id);
    }
    
    this.asientosSeleccionados.set(nuevosSeleccionados);

    // Actualizar visualmente la matriz
    this.matrizAsientos.update(matriz => {
      return matriz.map(fila => ({
        ...fila,
        asientos: fila.asientos.map((a: any) => {
          if (a.id === id) {
            return { ...a, estado: index > -1 ? 'libre' : 'seleccionado' };
          }
          return a;
        })
      }));
    });
  }

  confirmarCompra() {
    this.procesando.set(true);
    const funcionId = this.funcionSeleccionada()._id;
    
    const payload = {
      asientos: this.asientosSeleccionados()
    };

    this.entradasService.comprarFuncion(funcionId, payload).subscribe({
      next: () => {
        alert("¡Compra exitosa! Revisa tus reservas en el perfil.");
        this.procesando.set(false);
        // Podría redirigir a /user o limpiar
        this.seleccionarFuncion(this.funcionSeleccionada()); // Recargar
      },
      error: () => {
        alert("Error al procesar el pago o asientos ya ocupados.");
        this.procesando.set(false);
      }
    });
  }
}
