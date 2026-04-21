import { Component, EventEmitter, Input, Output, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { AuthStore } from '../../state/auth.store';
import { AuthApiService } from '../../services/auth-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login-form-content',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmButton, HlmInput],
  templateUrl: './login-form.component.html'
})
export class LoginFormContentComponent {
  authStore = inject(AuthStore);
  authApi = inject(AuthApiService);
  toast = inject(ToastService);
  cdr = inject(ChangeDetectorRef);
  
  @Input() motar = true;
  @Output() toggleMode = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<{email: string, password: string, recordarme: boolean, nombre?: string, genero?: string}>();

  email = '';
  password = '';
  nombre = '';
  genero = '';
  recordarme = false;
  enviandoLink = false;
  modoOlvidoPassword = false;

  onSubmit() {
    if (this.modoOlvidoPassword) {
      this.enviarRecuperacion();
      return;
    }
    
    this.loginSubmit.emit({
      email: this.email,
      password: this.password,
      recordarme: this.recordarme,
      ...(this.motar ? {} : { nombre: this.nombre, genero: this.genero })
    });
  }

  onToggleMode() {
    this.modoOlvidoPassword = false;
    this.toggleMode.emit();
  }

  loginWithGoogle() {
    window.location.href = `${this.authApi.apiUrl}/auth/google`;
  }

  forgotPassword() {
    this.modoOlvidoPassword = true;
  }
  
  volverAlLogin() {
    this.modoOlvidoPassword = false;
  }

  enviarRecuperacion() {
    if (!this.email) {
      this.toast.error("Por favor, ingresa tu correo electrónico.");
      return;
    }
    
    this.enviandoLink = true;
    this.cdr.detectChanges(); // Forzamos la vista antes de enviar
    
    this.authApi.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        this.enviandoLink = false;
        this.modoOlvidoPassword = false;
        this.cdr.detectChanges(); // Forzamos restaurar vista primero
        
        setTimeout(() => {
          const mensaje = res?.message || "¡Enlace enviado a tu correo!";
          this.toast.success(mensaje);
        }, 50); // Lanzamos el toast despues de renderizar la vista
      },
      error: (err: any) => {
        this.enviandoLink = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.toast.error(err.error?.message || "Error al enviar");
        }, 50);
      }
    });
  }
}
