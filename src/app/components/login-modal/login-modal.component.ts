import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '../../state/auth.store';
import { AuthApiService } from '../../services/auth-api.service';
import { lastValueFrom } from 'rxjs';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { NgIconComponent } from '@ng-icons/core';
import { BrnDialogImports, BrnDialogRef } from '@spartan-ng/brain/dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { LoginMarketingComponent } from './login-marketing.component';
import { LoginFormContentComponent } from './login-form.component';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule, 
    HlmButton, 
    HlmIcon, 
    NgIconComponent, 
    BrnDialogImports, 
    HlmDialogImports,
    LoginMarketingComponent,
    LoginFormContentComponent
  ],
  providers: [provideIcons({ lucideX })],
  templateUrl: './login-modal.component.html'})
export class LoginModalComponent {
  authStore = inject(AuthStore);
  authApi = inject(AuthApiService);
  router = inject(Router);
  private dialogRef = inject(BrnDialogRef, { optional: true });

  motar = signal(true);

  toggleMode() {
    this.motar.set(!this.motar());
  }

  cerrarModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      const closeBtn = document.querySelector('[hlmDialogClose]') as HTMLElement | null;
      if (closeBtn) closeBtn.click();
    }
  }

  async handleLogin(credentials: {email: string, password: string, nombre?: string, genero?: string}) {
    try {
      if (this.motar()) {
        await this.authStore.login({ email: credentials.email, password: credentials.password });
        this.cerrarModal();
        if (this.authStore.isAdmin()) {
          this.router.navigate(['/admin/peliculas']);
        } else {
          this.router.navigate(['/user']);
        }
      } else {
        this.authStore.setLoading(true);
        this.authStore.setError(null);
        await lastValueFrom(this.authApi.register({ 
          nombre: credentials.nombre,
          email: credentials.email, 
          password: credentials.password,
          genero: credentials.genero
        }));
        this.authStore.setLoading(false);
        this.motar.set(true); // Back to login
      }
    } catch (e: any) {
      console.error(e);
      this.authStore.setLoading(false);
      const errorMessage = e.error?.message || e.message || 'Error occurred';
      this.authStore.setError(errorMessage);
    }
  }
}
