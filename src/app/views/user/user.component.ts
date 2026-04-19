import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserLayoutComponent } from '../../layouts/user-layout/user-layout.component';
import { RecuadroInformacionComponent } from '../../components/recuadro-informacion/recuadro-informacion.component';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { AuthStore } from '../../state/auth.store';
import { EntradasService } from '../../services/entradas.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    UserLayoutComponent,
    RecuadroInformacionComponent,
    HlmCardImports,
    HlmTableImports
  ],
  template: `
    <app-user-layout>
      <div class="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-border/50">
          <div>
            <h1 class="text-4xl md:text-5xl font-display tracking-widest uppercase text-foreground drop-shadow-sm mb-1">Mi Perfil</h1>
            <p class="text-muted-foreground text-sm md:text-base">Gestiona tus entradas y opciones de cuenta.</p>
          </div>
          <div class="flex items-start gap-3 mt-6 md:mt-0">
            <button class="px-4 py-2 border border-destructive hover:bg-destructive/10 text-destructive rounded-lg text-sm font-medium transition-colors" (click)="cerrarSesion()">
              Cerrar sesión
            </button>
          </div>
        </div>

        <hlm-card class="mb-8 bg-card/50 backdrop-blur-xl border border-border/50">
          <hlm-card-header>
            <h3 hlmCardTitle class="font-display tracking-widest uppercase">Información del Usuario</h3>
            <p hlmCardDescription>Tus datos personales de la cuenta.</p>
          </hlm-card-header>
          <div hlmCardContent class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-muted-foreground">Nombre completo</p>
              <p class="font-medium text-foreground">{{ authStore.user()?.nombre || 'Usuario' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Correo electrónico</p>
              <p class="font-medium text-foreground">{{ authStore.user()?.email }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Rol</p>
              <p class="font-medium text-foreground uppercase tracking-widest">{{ authStore.user()?.rol || authStore.user()?.role || 'Cliente' }}</p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">Miembro desde</p>
              <p class="font-medium text-foreground">2026</p>
            </div>
          </div>
        </hlm-card>

        <div class="flex flex-col md:flex-row items-center gap-6 mb-8">
          <app-recuadro-informacion label="Total de reservas" [valor]="reservas().length.toString()" />
        </div>

        <div class="mb-4">
          <h2 class="text-2xl font-display tracking-widest uppercase text-foreground">Mis Entradas</h2>
          <p class="text-sm text-muted-foreground">Historial de tus últimas compras en Cine POOR.</p>
        </div>

        <div hlmTableContainer class="rounded-xl border border-border bg-card/40 backdrop-blur-xl overflow-x-auto shadow-sm">
          <table hlmTable class="w-full min-w-[600px]">
            <thead hlmTHead class="bg-muted/20">
              <tr hlmTr>
                <th hlmTh class="font-display tracking-widest uppercase text-muted-foreground py-4">Fecha Compra</th>
                <th hlmTh class="font-display tracking-widest uppercase text-muted-foreground py-4">Película & Función</th>
                <th hlmTh class="font-display tracking-widest uppercase text-muted-foreground py-4">Asientos</th>
                <th hlmTh class="font-display tracking-widest uppercase text-muted-foreground py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @if (loading()) {
                <tr hlmTr>
                  <td hlmTd colspan="4" class="py-12 text-center text-muted-foreground animate-pulse">
                    Cargando historial de compras...
                  </td>
                </tr>
              } @else if (reservas().length === 0) {
                <tr hlmTr>
                  <td hlmTd colspan="4" class="text-center py-12 text-muted-foreground">
                    <div class="flex flex-col items-center gap-2 opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
                      <p class="font-display tracking-widest uppercase text-lg">Aún no hay reservas confirmadas.</p>
                    </div>
                  </td>
                </tr>
              } @else {
                @for (reserva of reservas(); track reserva._id || reserva.id) {
                  <tr hlmTr class="hover:bg-primary/5 transition-colors">
                    <td hlmTd class="text-sm font-body py-4">{{ reserva.createdAt | date:'short' }}</td>
                    <td hlmTd class="font-body py-4">
                      <div class="font-medium text-lg text-primary">{{ reserva.peliculaTitulo || 'Película Desconocida' }}</div>
                      <div class="text-xs text-muted-foreground">Sala {{ reserva.salaNombre || '-' }} | {{ reserva.inicioFuncion | date:'shortTime' }}</div>
                    </td>
                    <td hlmTd class="py-4">
                      <div class="flex flex-wrap gap-1">
                        @for (asiento of reserva.asientos; track asiento) {
                           <span class="inline-flex items-center rounded-sm bg-primary/10 border border-primary/20 px-2 py-0 text-xs font-display tracking-widest text-primary shadow-sm">{{ asiento }}</span>
                        }
                      </div>
                    </td>
                    <td hlmTd class="text-right font-display tracking-widest text-xl text-primary py-4">
                      \${{ reserva.totalPagado | number:'1.2-2' }}
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </app-user-layout>
  `
})
export class UserComponent implements OnInit {
  authStore = inject(AuthStore);
  private entradasService = inject(EntradasService);
  private router = inject(Router);

  reservas = signal<any[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    this.loading.set(true);
    this.entradasService.misEntradas().subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.reservas.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando historial de reservas', err);
        this.loading.set(false);
      }
    });
  }

  cerrarSesion() {
    this.authStore.logout();
    this.router.navigate(['/']);
  }
}
