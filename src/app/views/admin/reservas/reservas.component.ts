import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, OnInit, inject, signal , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradasService } from '../../../services/entradas.service';

import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, HlmTableImports, HlmCardImports],
  templateUrl: './reservas.component.html'})
export class ReservasComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private entradasService = inject(EntradasService);

  reservas = signal<any[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    this.loading.set(true);
    // Asegurarse de que `todasLasReservas` está implementado en el backend
    this.entradasService.todasLasReservas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.reservas.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando reservas', err);
        this.loading.set(false);
      }
    });
  }
}
