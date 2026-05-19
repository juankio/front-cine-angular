import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, inject, OnInit, signal , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserLayoutComponent } from '../../layouts/user-layout/user-layout.component';
import { RecuadroInformacionComponent } from '../../components/recuadro-informacion/recuadro-informacion.component';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { AuthStore } from '../../state/auth.store';
import { EntradasService } from '../../services/entradas.service';

import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    UserLayoutComponent,
    RecuadroInformacionComponent,
    HlmCardImports,
    HlmTableImports,
    QRCodeComponent
  ],
  templateUrl: './user.component.html'})
export class UserComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  authStore = inject(AuthStore);
  private entradasService = inject(EntradasService);
  private router = inject(Router);

  reservas = signal<any[]>([]);
  loading = signal(false);
  selectedQr = signal<any>(null);

  ngOnInit() {
    this.cargarReservas();
  }

  abrirQr(reserva: any) {
    this.selectedQr.set(reserva);
  }

  cerrarQr() {
    this.selectedQr.set(null);
  }

  cargarReservas() {
    this.loading.set(true);
    this.entradasService.misEntradas().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

  isExpirada(fecha: string): boolean {
    if (!fecha) return false;
    // Si la función fue hace más de 3 horas, consideramos el ticket expirado
    const limite = new Date(new Date(fecha).getTime() + (3 * 60 * 60 * 1000));
    return new Date() > limite;
  }

  cerrarSesion() {
    this.authStore.logout();
    this.router.navigate(['/']);
  }
}
