import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { AuthStore } from '../../state/auth.store';

@Component({
  selector: 'app-login-form-content',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmButton, HlmInput],
  templateUrl: './login-form.component.html'})
export class LoginFormContentComponent {
  authStore = inject(AuthStore);
  
  @Input() motar = true;
  @Output() toggleMode = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<{email: string, password: string, recordarme: boolean, nombre?: string, genero?: string}>();

  email = '';
  password = '';
  nombre = '';
  genero = '';
  recordarme = false;

  onSubmit() {
    this.loginSubmit.emit({
      email: this.email,
      password: this.password,
      recordarme: this.recordarme,
      nombre: this.nombre,
      genero: this.genero
    });
  }

  onToggleMode() {
    this.toggleMode.emit();
  }
}
