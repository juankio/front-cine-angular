import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { PeliculasService } from '../../services/peliculas.service';
import { SalasService } from '../../services/salas.service';
import { EntradasService } from '../../services/entradas.service';
import { MenuService } from '../../services/menu.service';
import { ToastService } from '../../services/toast.service';
import { CartService } from '../../services/cart.service';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';

import { AuthStore } from '../../state/auth.store';
import { LoginModalComponent } from '../../components/login-modal/login-modal.component';

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  objRef?: any;
}

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
  private ms = inject(MenuService);
  private cart = inject(CartService);
  private router = inject(Router);
  private ts = inject(ToastService);

  pelicula = signal<any>(null);
  funciones = signal<any[]>([]);
  loading = signal(true);
  funcionSeleccionada = signal<any>(null);
  matrizAsientos = signal<any[]>([]);
  asientosSeleccionados = signal<string[]>([]);
  
  productosMenu = signal<any[]>([]);
  carritoComida = signal<CartItem[]>([]);
  
  totalComida = computed(() => this.carritoComida().reduce((acc, c) => acc + (c.precio * c.cantidad), 0));
  
  procesando = signal(false);
  Math = Math;

  ngOnInit() {
    const id = this.r.snapshot.paramMap.get('id');
    id ? this.cargarDatos(id) : this.loading.set(false);
    
    this.ms.listar().subscribe({
      next: (res) => {
        this.productosMenu.set(Array.isArray(res?.data || res) ? (res?.data || res) : []);
      }
    });
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
    if (idx === -1 && sel.length >= 10) return this.ts.warning("Máximo 10 asientos por compra");
    this.asientosSeleccionados.set(idx > -1 ? sel.filter(s => s !== id) : [...sel, id]);
    this.matrizAsientos.update(m => m.map(f => ({ ...f, asientos: f.asientos.map((a: any) => a.id === id ? { ...a, estado: idx > -1 ? 'libre' : 'seleccionado' } : a) })));
  }

  agregarProducto(item: any) {
    const id = item._id || item.id;
    this.carritoComida.update(items => {
      const ex = items.find(i => i.id === id);
      if (ex) {
        return items.map(i => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...items, { id, nombre: item.nombre, precio: item.precio, cantidad: 1, objRef: item }];
    });
    this.ts.success(`Añadido: ${item.nombre}`);
  }

  restarProducto(id: string) {
    this.carritoComida.update(items => 
      items.map(i => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i).filter(i => i.cantidad > 0)
    );
  }

  sumarProducto(id: string) {
    this.carritoComida.update(items => 
      items.map(i => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i)
    );
  }

  confirmarCompra() {
    this.procesando.set(true);
    const f = this.funcionSeleccionada();
    
    // Add tickets to global cart
    this.cart.addEntradas(f, this.asientosSeleccionados(), f.precio || 1500);
    
    // Add food to global cart
    this.carritoComida().forEach(prod => {
      this.cart.addProducto(prod.objRef, prod.cantidad);
    });
    
    this.ts.success("¡Añadido al carrito!");
    this.procesando.set(false);
    
    // Reset selection so they can keep browsing
    this.funcionSeleccionada.set(null);
    this.asientosSeleccionados.set([]);
    this.carritoComida.set([]);
    
    // Opcional: Redirigir al inicio para que siga comprando
    this.router.navigate(['/']);
  }
}
