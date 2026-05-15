import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { PeliculasService } from '../../services/peliculas.service';
import { SalasService } from '../../services/salas.service';
import { EntradasService } from '../../services/entradas.service';
import { ToastService } from '../../services/toast.service';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';

import { AuthStore } from '../../state/auth.store';
import { LoginModalComponent } from '../../components/login-modal/login-modal.component';

@Component({
  selector: 'app-pelicula-detalle',
  standalone: true,
  imports: [CommonModule, DefaultLayoutComponent, HlmCardImports, HlmBadge, HlmButtonImports, RouterLink, LoginModalComponent],
  templateUrl: './pelicula-detalle.component.html'
})
export class PeliculaDetalleComponent implements OnInit {
  authStore = inject(AuthStore);
  private r = inject(ActivatedRoute);
  private ps = inject(PeliculasService);
  private ss = inject(SalasService);
  private es = inject(EntradasService);
  private router = inject(Router);
  private ts = inject(ToastService);

  pelicula = signal<any>(null);
  funciones = signal<any[]>([]);
  loading = signal(true);
  funcionSeleccionada = signal<any>(null);
  matrizAsientos = signal<any[]>([]);
  asientosSeleccionados = signal<string[]>([]);
  procesando = signal(false);
  Math = Math;

  ngOnInit() {
    const id = this.r.snapshot.paramMap.get('id');
    id ? this.cargarDatos(id) : this.loading.set(false);
  }

  cargarDatos(id: string) {
    this.ps.obtenerPorId(id).subscribe({
      next: (res) => {
        this.pelicula.set(res?.data || res);
        this.ss.listar().subscribe(salasRes => {
          const ahora = new Date();
          this.funciones.set((salasRes?.data || salasRes || []).flatMap((s: any) =>
            (s.funciones || [])
              .filter((f: any) => String(f.pelicula?.id || f.pelicula?._id || f.peliculaId) === String(id))
              .filter((f: any) => new Date(f.fechaInicio || f.inicio) > ahora) // Filtrar funciones pasadas
              .map((f: any) => ({ ...f, sala: s }))
          ));
          this.loading.set(false);
        });
      },
      error: () => this.loading.set(false)
    });
  }

  seleccionarFuncion(f: any) {
    this.funcionSeleccionada.set(f);
    this.asientosSeleccionados.set([]);
    const { filas = 10, asientosPorFila = 12 } = f.sala || {};
    const l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.matrizAsientos.set(Array.from({ length: filas }, (_, i) => ({
      letra: l[i] || `F${i}`, asientos: Array.from({ length: asientosPorFila }, (_, j) => ({ id: `${l[i] || `F${i}`}${j + 1}`, numero: j + 1, estado: 'libre' }))
    })));
    this.es.disponibilidadFuncion(f._id || f.id).subscribe({
      next: (res) => this.matrizAsientos.update(m => m.map(fila => ({ ...fila, asientos: fila.asientos.map((a: any) => ({ ...a, estado: (res?.ocupados || []).includes(a.id) ? 'ocupado' : a.estado })) })))
    });
  }

  toggleAsiento(id: string) {
    const sel = this.asientosSeleccionados();
    const idx = sel.indexOf(id);
    if (idx === -1 && sel.length >= 8) return this.ts.warning("Máximo 8 asientos por compra");
    this.asientosSeleccionados.set(idx > -1 ? sel.filter(s => s !== id) : [...sel, id]);
    this.matrizAsientos.update(m => m.map(f => ({ ...f, asientos: f.asientos.map((a: any) => a.id === id ? { ...a, estado: idx > -1 ? 'libre' : 'seleccionado' } : a) })));
  }

  confirmarCompra() {
    this.procesando.set(true);
    const f = this.funcionSeleccionada();
    this.es.comprarFuncion(f._id || f.id, { asientos: this.asientosSeleccionados() }).subscribe({
      next: (res: any) => {
        // En lugar de "¡Compra exitosa!", redirigimos a la pasarela simulada
        if (res.checkoutUrl) {
          const urlParts = res.checkoutUrl.split('/');
          const ticketId = urlParts[urlParts.length - 1];
          this.router.navigate(['/pasarela-pagos'], { queryParams: { ticketId } });
        } else {
          // Fallback por si backend devuelve directo
          this.ts.success("¡Compra exitosa!");
          this.procesando.set(false);
          this.seleccionarFuncion(f);
        }
      },
      error: (err) => {
        if (err.status === 409 || err.status === 400 || err.error?.message?.includes('ocupado')) {
          this.ts.error("Alguien ya reservó estos asientos. Actualizando mapa...");
          this.seleccionarFuncion(f); // Recargar asientos
        } else {
          this.ts.error("Error al procesar reserva.");
        }
        this.procesando.set(false);
      }
    });
  }
}
