import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, OnInit, inject, signal , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalasService } from '../../../services/salas.service';
import { ToastService } from '../../../services/toast.service';

import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SalaFormComponent } from '../../../components/sala-form/sala-form.component';
import { FuncionFormComponent } from '../../../components/funcion-form/funcion-form.component';
import { MonitoreoSalaComponent } from '../../../components/monitoreo-sala/monitoreo-sala.component';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, HlmTableImports, HlmCardImports, HlmButtonImports, SalaFormComponent, FuncionFormComponent, MonitoreoSalaComponent],
  templateUrl: './salas.component.html'})
export class SalasComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private salasService = inject(SalasService);
  private toastService = inject(ToastService);

  salas = signal<any[]>([]);
  loading = signal(false);
  modalAbierto = signal(false);
  modalFuncionAbierto = signal(false);
  modalMonitoreoAbierto = signal(false);
  salaSeleccionada: any = null;

  ngOnInit() {
    this.cargarSalas();
  }

  cargarSalas() {
    this.loading.set(true);
    this.salasService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.salas.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando salas', err);
        this.loading.set(false);
      }
    });
  }

  calcularTotalAsientos(sala: any): number {
    return sala.capacidad || ((sala.filas || 0) * (sala.asientosPorFila || 0));
  }

  abrirModal() {
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  onSalaGuardada() {
    this.cerrarModal();
    this.cargarSalas();
  }

  abrirModalFuncion(sala: any) {
    this.salaSeleccionada = sala;
    this.modalFuncionAbierto.set(true);
  }

  cerrarModalFuncion() {
    this.modalFuncionAbierto.set(false);
    this.salaSeleccionada = null;
  }

  abrirModalMonitoreo(sala: any) {
    this.salaSeleccionada = sala;
    this.modalMonitoreoAbierto.set(true);
  }

  cerrarModalMonitoreo() {
    this.modalMonitoreoAbierto.set(false);
    this.salaSeleccionada = null;
  }

  onFuncionGuardada() {
    this.cerrarModalFuncion();
    this.cargarSalas(); // Recargar para ver el cambio de "Funciones Asignadas"
  }

  eliminar(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta sala?')) return;
    
    this.salasService.eliminar(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.cargarSalas();
      },
      error: (err) => {
        console.error('Error al eliminar la sala', err);
        this.toastService.error('No se puede eliminar la sala si ya tiene funciones programadas o compras.');
      }
    });
  }
}
