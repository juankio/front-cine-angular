import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalasService } from '../../../services/salas.service';

import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { SalaFormComponent } from '../../../components/sala-form/sala-form.component';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule, HlmTableImports, HlmCardImports, HlmButtonImports, SalaFormComponent],
  template: `
    <div class="w-full max-w-7xl mx-auto p-8 md:p-12 flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500 text-foreground">
      <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 class="text-5xl md:text-6xl font-display tracking-widest uppercase text-foreground drop-shadow-sm">Salas del Cine</h1>
          <p class="text-muted-foreground mt-2 text-lg">Configura y gestiona las dimensiones y capacidades de las salas.</p>
        </div>
        <button class="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-display tracking-wider uppercase text-lg h-12 px-6 flex items-center justify-center rounded-sm" (click)="abrirModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nueva Sala
        </button>
      </div>

      <!-- Tabla de Salas -->
      <div class="bg-card/60 border border-border shadow-sm overflow-hidden rounded-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-border/50 bg-muted/20">
                <th class="font-display tracking-widest uppercase text-muted-foreground p-4">Nombre de Sala</th>
                <th class="font-display tracking-widest uppercase text-muted-foreground p-4">Dimensiones (F x A)</th>
                <th class="font-display tracking-widest uppercase text-muted-foreground p-4">Capacidad Total</th>
                <th class="font-display tracking-widest uppercase text-muted-foreground p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @if (loading()) {
                <tr>
                  <td colspan="4" class="py-16 text-center text-muted-foreground animate-pulse">
                    <div class="w-8 h-8 border-2 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                    <span class="font-display tracking-wider uppercase">Cargando salas...</span>
                  </td>
                </tr>
              } @else if (salas().length === 0) {
                <tr>
                  <td colspan="4" class="py-20 text-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/><path d="M7 12h10"/></svg>
                    <span class="font-display tracking-wider uppercase text-xl">No hay salas configuradas</span>
                  </td>
                </tr>
              } @else {
                @for (sala of salas(); track sala._id || sala.id) {
                  <tr class="hover:bg-muted/30 transition-colors border-b border-border/30 group">
                    <td class="p-4">
                      <span class="font-display tracking-wider text-2xl text-foreground">{{ sala.nombre }}</span>
                    </td>
                    <td class="p-4">
                      <span class="inline-flex items-center rounded-sm bg-muted/50 px-3 py-1 text-sm font-display tracking-widest text-muted-foreground border border-border/50">
                        {{ sala.asientos?.length || 0 }} FILAS
                      </span>
                    </td>
                    <td class="p-4">
                      <span class="font-display tracking-widest text-primary text-3xl">{{ calcularTotalAsientos(sala) }}</span>
                      <span class="text-sm text-muted-foreground font-display tracking-wider ml-1">ASIENTOS</span>
                    </td>
                    <td class="p-4 text-right">
                      <button (click)="eliminar(sala._id || sala.id)" class="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded transition-colors opacity-0 group-hover:opacity-100" title="Eliminar sala">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal para crear -->
      <app-sala-form
        [visible]="modalAbierto()"
        (closed)="cerrarModal()"
        (saved)="onSalaGuardada()"
      ></app-sala-form>
    </div>
  `
})
export class SalasComponent implements OnInit {
  private salasService = inject(SalasService);

  salas = signal<any[]>([]);
  loading = signal(false);
  modalAbierto = signal(false);

  ngOnInit() {
    this.cargarSalas();
  }

  cargarSalas() {
    this.loading.set(true);
    this.salasService.listar().subscribe({
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
    if (!sala.asientos || !Array.isArray(sala.asientos)) return 0;
    
    // Suponiendo que sala.asientos es un array de filas (matrices 2D o arrays de objetos)
    // Cuenta la cantidad total de asientos disponibles en la sala
    let total = 0;
    sala.asientos.forEach((fila: any) => {
      if (Array.isArray(fila.asientos)) {
        total += fila.asientos.length;
      }
    });
    return total;
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

  eliminar(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta sala?')) return;
    
    this.salasService.eliminar(id).subscribe({
      next: () => {
        this.cargarSalas();
      },
      error: (err) => {
        console.error('Error al eliminar la sala', err);
        alert('No se puede eliminar la sala si ya tiene funciones programadas o compras.');
      }
    });
  }
}
