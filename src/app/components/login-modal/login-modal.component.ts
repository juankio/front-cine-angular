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
  template: `
    <hlm-dialog>
      <button hlmBtn brnDialogTrigger variant="ghost" class="px-4 py-2 font-display tracking-widest text-lg text-muted-foreground hover:text-foreground transition-colors">
        Entrar
      </button>

      <hlm-dialog-content class="w-[95vw] sm:max-w-[900px] h-auto max-h-[90vh] rounded-none border-[3px] border-border bg-background shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,0.05)] p-0 overflow-y-auto overflow-x-hidden flex flex-col md:flex-row gap-0" *brnDialogContent="let ctx">
        <button hlmBtn variant="ghost" size="icon" hlmDialogClose class="absolute right-4 top-4 z-20 rounded-none bg-background border-2 border-border text-foreground hover:bg-muted transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,0.3)]">
          <ng-icon hlm name="lucideX" size="sm"></ng-icon>
        </button>

        <app-login-marketing class="w-full md:w-5/12 flex-shrink-0"></app-login-marketing>

        <app-login-form-content
          class="w-full md:w-7/12"
          [motar]="motar()"
          (toggleMode)="toggleMode()"
          (loginSubmit)="handleLogin($event)"
        ></app-login-form-content>
      </hlm-dialog-content>
    </hlm-dialog>
  `
})
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
