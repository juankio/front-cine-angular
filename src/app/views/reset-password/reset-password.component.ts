import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { AuthApiService } from '../../services/auth-api.service';
import { ToastService } from '../../services/toast.service';
import { DefaultLayoutComponent } from '../../layouts/default-layout/default-layout.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HlmButton, 
    HlmInput, 
    HlmCardImports,
    DefaultLayoutComponent
  ],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authApi = inject(AuthApiService);
  private toast = inject(ToastService);

  token = '';
  password = '';
  confirmPassword = '';
  loading = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
      } else {
        this.toast.error("Token de recuperación inválido o faltante.");
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (this.password.length < 8) {
      this.toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (!this.token) {
      this.toast.error("Token de recuperación inválido.");
      return;
    }

    this.loading = true;

    this.authApi.resetPassword({ token: this.token, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success("¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.");
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err?.error?.message || "Error al actualizar la contraseña. El enlace podría haber expirado.");
      }
    });
  }
}
