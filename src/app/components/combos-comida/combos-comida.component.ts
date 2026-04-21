import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { AuthStore } from '../../state/auth.store';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-combos-comida',
  standalone: true,
  imports: [CommonModule, HlmCardImports, LoginModalComponent],
  templateUrl: './combos-comida.component.html'})
export class CombosComidaComponent {
  authStore = inject(AuthStore);

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
}