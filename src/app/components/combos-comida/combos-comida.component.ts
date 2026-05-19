import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { AuthStore } from '../../state/auth.store';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-combos-comida',
  standalone: true,
  imports: [CommonModule, HlmCardImports, LoginModalComponent],
  templateUrl: './combos-comida.component.html'})
export class CombosComidaComponent {
  authStore = inject(AuthStore);
  private cart = inject(CartService);
  private ts = inject(ToastService);

  @Input() itemData: any; // El objeto completo del producto
  @Input() nomProducto: string = '';
  @Input() precioProducto: string = '';
  @Input() infoProducto: string = '';
  @Input() imagenUrl?: string;
  @Input() recomendado: boolean = false;

  modalAbierto = signal(false);

  abrirModal() {
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  agregarAlCarrito(event: Event) {
    event.stopPropagation(); // Prevenir que se cierre o abra otro modal si hay bubbling
    if (this.itemData) {
      this.cart.addProducto(this.itemData, 1);
      this.ts.success(`Añadido: ${this.itemData.nombre}`);
      this.cerrarModal();
    } else {
      // Fallback si no nos pasaron el item completo (aunque lo pasaremos)
      this.ts.error('Error: No se pudo agregar al carrito');
    }
  }
}