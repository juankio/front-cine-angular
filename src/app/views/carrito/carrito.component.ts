import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';
import { CartService } from '../../services/cart.service';
import { EntradasService } from '../../services/entradas.service';
import { MenuService } from '../../services/menu.service';
import { ToastService } from '../../services/toast.service';
import { AuthStore } from '../../state/auth.store';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { LoginModalComponent } from '../../components/login-modal/login-modal.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, DefaultLayoutComponent, HlmButtonImports, LoginModalComponent, RouterLink],
  templateUrl: './carrito.component.html'
})
export class CarritoComponent implements OnInit {
  cart = inject(CartService);
  private es = inject(EntradasService);
  private ms = inject(MenuService);
  private router = inject(Router);
  private ts = inject(ToastService);
  authStore = inject(AuthStore);

  procesando = signal(false);
  productosMenu = signal<any[]>([]);

  ngOnInit() {
    this.ms.listar().subscribe({
      next: (res) => {
        this.productosMenu.set(Array.isArray(res?.data || res) ? (res?.data || res) : []);
      }
    });
  }

  agregarProducto(item: any) {
    this.cart.addProducto(item, 1);
    this.ts.success(`Añadido: ${item.nombre}`);
  }

  pagar() {
    if (!this.authStore.isAuthenticated()) {
      this.ts.error('Debes iniciar sesión para pagar');
      return;
    }

    const items = this.cart.items();
    if (items.length === 0) return;

    this.procesando.set(true);

    const entradas = items.filter(i => i.tipo === 'entrada');
    const productos = items.filter(i => i.tipo === 'producto').map(p => ({
      nombre: p.nombre,
      precio: p.precio,
      cantidad: p.cantidad
    }));

    if (entradas.length > 0) {
      // Como el backend espera que sea compra de funcion con asientos y productos, 
      // y si hay multiples funciones? Por simplicidad, tomaremos la primera funcion y pondremos todos los asientos
      // Lo ideal seria hacer multiples requests, pero el checkout simula uno solo por ahora.
      // Haremos Promise.all para cada funcion distinta
      const purchases = entradas.map((e, index) => {
        return new Promise<any>((resolve, reject) => {
          this.es.comprarFuncion(e.funcionId!, {
            asientos: e.asientos || [],
            productos: index === 0 ? productos : [] // Solo atachamos la comida a la primera reserva
          }).subscribe({ next: resolve, error: reject });
        });
      });

      Promise.all(purchases)
        .then((responses) => {
          this.cart.clear();
          const firstRes = responses[0];
          if (firstRes && firstRes.checkoutUrl) {
            const urlParts = firstRes.checkoutUrl.split('/');
            const ticketId = urlParts[urlParts.length - 1];
            this.router.navigate(['/pasarela-pagos'], { queryParams: { ticketId } });
          } else {
            this.ts.success('¡Compra exitosa!');
            this.router.navigate(['/user']);
          }
        })
        .catch(err => {
          this.procesando.set(false);
          this.ts.error('Hubo un problema procesando alguna de las reservas.');
        });
    } else if (productos.length > 0) {
      // Solo productos. Hacemos la peticion al nuevo backend.
      this.es.comprarDulceria(productos).subscribe({
        next: (res: any) => {
          this.cart.clear();
          if (res.checkoutUrl) {
            const urlParts = res.checkoutUrl.split('/');
            const ticketId = urlParts[urlParts.length - 1];
            this.router.navigate(['/pasarela-pagos'], { queryParams: { ticketId } });
          } else {
            this.ts.success('¡Compra de dulcería exitosa!');
            this.router.navigate(['/user']);
          }
        },
        error: (err) => {
          this.procesando.set(false);
          this.ts.error('Hubo un problema procesando tu compra de comida.');
        }
      });
    }
  }
}
