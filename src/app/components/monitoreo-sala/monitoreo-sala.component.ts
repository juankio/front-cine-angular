import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradasService } from '../../services/entradas.service';

@Component({
  selector: 'app-monitoreo-sala',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" (click)="cerrar()"></div>
        
        <!-- Modal Content -->
        <div class="relative z-10 w-full max-w-4xl bg-card text-foreground border border-border shadow-2xl shadow-primary/15 rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          <div class="flex flex-row items-center justify-between p-6 border-b border-border bg-secondary">
            <div>
              <h3 class="text-2xl font-display tracking-widest uppercase text-foreground drop-shadow-sm">
                Monitor de Sala: {{ sala?.nombre }}
              </h3>
              <p class="text-sm font-display tracking-wider text-neutral-400 mt-1">Selecciona una función programada para ver el estado de los asientos en tiempo real.</p>
            </div>
            <button (click)="cerrar()" class="text-neutral-500 hover:text-foreground transition-colors h-8 w-8 flex items-center justify-center rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="flex flex-col md:flex-row h-[70vh] md:h-[60vh] overflow-hidden">
            
            <!-- Barra Lateral: Funciones de la sala -->
            <div class="w-full md:w-1/3 border-r border-border overflow-y-auto bg-background/40">
              <div class="p-4 border-b border-border font-display tracking-widest uppercase text-neutral-500 sticky top-0 bg-card z-10 backdrop-blur-sm">
                Funciones Asignadas
              </div>
              <div class="flex flex-col">
                @if (!sala?.funciones || sala?.funciones?.length === 0) {
                  <p class="text-center p-6 text-neutral-500 italic font-body text-sm">No hay funciones en esta sala.</p>
                } @else {
                  @for (funcion of sala.funciones; track funcion._id || funcion.id) {
                    <button 
                      class="text-left p-4 border-b border-border/50 hover:bg-secondary transition-colors group"
                      [class.bg-primary/10]="(funcionSeleccionada()?._id || funcionSeleccionada()?.id) === (funcion._id || funcion.id)"
                      [class.border-l-4]="(funcionSeleccionada()?._id || funcionSeleccionada()?.id) === (funcion._id || funcion.id)"
                      [class.border-l-primary]="(funcionSeleccionada()?._id || funcionSeleccionada()?.id) === (funcion._id || funcion.id)"
                      (click)="verFuncion(funcion)"
                    >
                      <div class="font-body font-medium text-lg mb-1 group-hover:text-primary/80 transition-colors" [class.text-primary]="(funcionSeleccionada()?._id || funcionSeleccionada()?.id) === (funcion._id || funcion.id)">
                        {{ funcion.pelicula?.titulo || 'Película ID: ' + (funcion.peliculaId?._id || funcion.peliculaId) }}
                      </div>
                      <div class="font-display tracking-wider text-neutral-400 text-sm">
                        {{ funcion.inicio | date:'short' }}
                      </div>
                      <div class="mt-2 flex gap-2">
                        <span class="text-xs border border-border bg-secondary px-2 rounded-sm text-neutral-300 font-display">{{ funcion.formato }}</span>
                        <span class="text-xs border border-border bg-secondary px-2 rounded-sm text-neutral-300 font-display">{{ funcion.idioma }}</span>
                      </div>
                    </button>
                  }
                }
              </div>
            </div>

            <!-- Panel Principal: Mapa de Asientos -->
            <div class="w-full md:w-2/3 p-6 overflow-y-auto relative flex flex-col items-center bg-background/60">
              @if (!funcionSeleccionada()) {
                <div class="h-full flex flex-col items-center justify-center opacity-50 absolute inset-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
                  <p class="font-display tracking-widest uppercase text-xl">Seleccione una función</p>
                </div>
              } @else {
                <!-- Stats de Ocupacion -->
                <div class="w-full flex items-center justify-between mb-10 bg-secondary p-4 rounded-xl border border-border">
                  <div>
                    <p class="text-xs font-display tracking-widest text-neutral-500 uppercase">Disponibilidad</p>
                    <p class="font-display text-3xl mt-1 text-foreground">
                      {{ statusFuncion().sillasDisponibles }} <span class="text-lg text-neutral-500">libres</span>
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-display tracking-widest text-neutral-500 uppercase">Ocupadas</p>
                    <p class="font-display text-3xl mt-1 text-primary drop-shadow-md shadow-primary/50">
                      {{ statusFuncion().sillasOcupadas }} <span class="text-lg text-neutral-500">/ {{ statusFuncion().capacidadTotal }}</span>
                    </p>
                  </div>
                </div>

                <!-- Pantalla -->
                <div class="w-2/3 h-2 bg-gradient-to-b from-primary/50 to-transparent rounded-t-full mb-12 relative shadow-xl shadow-primary/20">
                  <div class="absolute -top-6 w-full text-center text-xs font-display tracking-[0.5em] text-primary uppercase">Pantalla</div>
                </div>

                <!-- Grilla Curved Admin -->
                <div class="flex flex-col gap-4 perspective-1000 mb-8 w-full max-w-lg overflow-x-auto pb-8">
                  @for (fila of matrizAsientos(); track fila.letra; let i = $index) {
                    <div class="flex items-center gap-4 justify-center" [style.transform]="'translateY(' + (i * -2) + 'px)'">
                      <span class="w-6 text-center font-display text-base text-neutral-600">{{ fila.letra }}</span>
                      <div class="flex gap-1.5">
                        @for (asiento of fila.asientos; track asiento.id; let j = $index) {
                          <div 
                            class="relative w-6 h-6 sm:w-8 sm:h-8 rounded-t-lg rounded-b-sm border transition-all text-[0.6rem] font-display flex items-center justify-center overflow-hidden shadow-sm"
                            [style.transform]="'translateY(' + (Math.abs((fila.asientos.length / 2) - j) * 1.5) + 'px)'"
                            
                            [class.bg-card]="asiento.estado === 'ocupado'"
                            [class.border-primary]="asiento.estado === 'ocupado'"
                            [class.text-primary]="asiento.estado === 'ocupado'"
                            [class.shadow-primary/20]="asiento.estado === 'ocupado'"
                            
                            [class.bg-card]="asiento.estado === 'libre'"
                            [class.border-border]="asiento.estado === 'libre'"
                            [class.text-foreground]="asiento.estado === 'libre'">
                            
                            <!-- Forma de Asiento Frontal (Detalle Visual adaptativo) -->
                            <div class="absolute bottom-0 w-full h-[25%] bg-gradient-to-t from-black/5 dark:from-black/40 to-transparent pointer-events-none rounded-b-sm"></div>
                            <div class="absolute inset-x-1 bottom-0.5 h-[2px] rounded-full pointer-events-none transition-all duration-300" 
                                 [class.bg-neutral-300]="asiento.estado === 'libre'" 
                                 [class.dark:bg-neutral-600]="asiento.estado === 'libre'"
                                 [class.bg-primary]="asiento.estado === 'ocupado'"
                                 [class.shadow-[0_0_5px_rgba(var(--primary),0.8)]]="asiento.estado === 'ocupado'"></div>
                            <span class="relative z-10">{{ asiento.numero }}</span>
                          </div>
                        }
                      </div>
                      <span class="w-6 text-center font-display text-base text-neutral-600">{{ fila.letra }}</span>
                    </div>
                  }
                </div>

                <div class="flex gap-8 mt-auto text-sm font-display tracking-widest uppercase text-muted-foreground border-t border-border/50 pt-6 w-full justify-center">
                  <div class="flex items-center gap-3"><div class="w-4 h-4 rounded-sm border border-border bg-card shadow-sm relative overflow-hidden"><div class="absolute inset-x-1 bottom-0.5 h-[2px] rounded-full bg-neutral-300 dark:bg-neutral-600"></div></div> Libre</div>
                  <div class="flex items-center gap-3"><div class="w-4 h-4 rounded-sm border border-primary bg-card shadow-sm shadow-primary/20 relative overflow-hidden"><div class="absolute inset-x-1 bottom-0.5 h-[2px] rounded-full bg-primary shadow-[0_0_5px_rgba(var(--primary),0.8)]"></div></div> Ocupado / Vendido</div>
                </div>
              }
            </div>

          </div>
        </div>
      </div>
    }
  `
})
export class MonitoreoSalaComponent implements OnChanges {
  @Input() visible = false;
  @Input() sala: any = null;
  @Output() closed = new EventEmitter<void>();

  private entradasService = inject(EntradasService);

  funcionSeleccionada = signal<any>(null);
  matrizAsientos = signal<any[]>([]);
  statusFuncion = signal<any>({ capacidadTotal: 0, sillasOcupadas: 0, sillasDisponibles: 0 });

  Math = Math;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible && this.sala) {
      this.funcionSeleccionada.set(null);
    }
  }

  verFuncion(funcion: any) {
    this.funcionSeleccionada.set(funcion);
    this.generarMatrizAsientos(this.sala);
    
    const funcionId = funcion._id || funcion.id;
    this.entradasService.disponibilidadFuncion(funcionId).subscribe({
      next: (res) => {
        this.statusFuncion.set({
          capacidadTotal: res?.capacidadTotal || 0,
          sillasOcupadas: res?.sillasOcupadas || 0,
          sillasDisponibles: res?.sillasDisponibles || 0,
        });

        const ocupados = res?.ocupados || [];
        this.matrizAsientos.update(matriz => {
          return matriz.map(fila => ({
            ...fila,
            asientos: fila.asientos.map((a: any) => ({
              ...a,
              estado: ocupados.includes(a.id) ? 'ocupado' : 'libre'
            }))
          }));
        });
      },
      error: (e) => console.log("Fallo al obtener estado de función", e)
    });
  }

  generarMatrizAsientos(sala: any) {
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
          estado: 'libre'
        });
      }
      matriz.push(fila);
    }
    
    this.matrizAsientos.set(matriz);
  }

  cerrar() {
    this.funcionSeleccionada.set(null);
    this.closed.emit();
  }
}