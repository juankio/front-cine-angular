import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges, signal , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradasService } from '../../services/entradas.service';

@Component({
  selector: 'app-monitoreo-sala',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitoreo-sala.component.html'})
export class MonitoreoSalaComponent implements OnChanges {
  private destroyRef = inject(DestroyRef);
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
    this.entradasService.disponibilidadFuncion(funcionId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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