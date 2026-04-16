import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '../../state/auth.store';
import { AuthApiService } from '../../services/auth-api.service';
import { lastValueFrom } from 'rxjs';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmButton, HlmInput, HlmIcon, NgIconComponent],
  providers: [provideIcons({ lucideX })],
  template: `
    <button hlmBtn variant="ghost" (click)="abrirModal()" class="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
      Entrar
    </button>

    @if (loginAbierto()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" (click)="cerrarModal()"></div>
        
        <div class="relative z-10 w-[95vw] max-w-6xl max-h-[90vh] rounded-[32px] border border-blue-900/70 bg-slate-900 shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col md:flex-row">
          
          <button hlmBtn variant="ghost" size="icon" (click)="cerrarModal()" class="absolute right-4 top-4 z-20 rounded-full border border-slate-300/30 bg-slate-900/70 text-slate-100 hover:border-blue-400 hover:bg-slate-800">
            <ng-icon hlm name="lucideX" size="sm"></ng-icon>
          </button>

          <!-- Left content -->
          <div class="w-full md:w-1/2 md:m-8 bg-slate-50 p-8 md:p-10 text-slate-900 md:rounded-r-[74px] md:rounded-l-[34px]">
            <div class="mb-6">
              <span class="inline-flex rounded-xl bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Cine al parque
              </span>
            </div>

            <h2 class="mb-5 text-4xl font-extrabold leading-tight text-slate-900">
              Gestiona funciones, combos y reservas sin fricción.
            </h2>

            <p class="mb-8 text-lg text-slate-500">
              Coordina la operación diaria, habilita funciones y monitorea métricas en un tablero único.
            </p>

            <ul class="space-y-3 text-lg text-slate-500">
              <li class="flex items-center gap-3">
                <span class="h-2.5 w-2.5 rounded-full bg-blue-400"></span>
                Reserva salas en tiempo real.
              </li>
              <li class="flex items-center gap-3">
                <span class="h-2.5 w-2.5 rounded-full bg-blue-400"></span>
                Sincroniza combos con cocina y POS.
              </li>
              <li class="flex items-center gap-3">
                <span class="h-2.5 w-2.5 rounded-full bg-blue-400"></span>
                Recibe métricas y alertas en vivo.
              </li>
            </ul>
          </div>

          <!-- Right content form -->
          <div class="w-full md:w-1/2 bg-blue-950 p-8 md:p-10 text-slate-50">
            <div class="mb-8 text-center">
              <span class="inline-flex rounded-xl bg-slate-800 px-5 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">
                Acceso
              </span>
              <h3 class="mt-4 text-4xl font-extrabold">{{ motar() ? 'Inicia sesión' : 'Crear cuenta' }}</h3>
              <p class="mt-2 text-lg text-slate-300">{{ motar() ? 'Ingresa tus credenciales corporativas' : 'Completa tus datos para crear tu cuenta' }}</p>
            </div>

            <form class="space-y-5" (ngSubmit)="handleLogin()">
              <div>
                <label for="email" class="mb-2 block text-lg font-semibold text-slate-100">Correo</label>
                <input
                  hlmInput
                  id="email"
                  name="email"
                  [(ngModel)]="email"
                  type="email"
                  placeholder="juanm1@example.com"
                  class="rounded-xl border-blue-800 bg-blue-900/50 text-slate-100 placeholder:text-slate-400 focus-visible:border-blue-400 h-12 px-4"
                />
              </div>

              <div>
                <label for="password" class="mb-2 block text-lg font-semibold text-slate-100">Contraseña</label>
                <input
                  hlmInput
                  id="password"
                  name="password"
                  [(ngModel)]="password"
                  type="password"
                  placeholder="******"
                  class="rounded-xl border-blue-800 bg-blue-900/50 text-slate-100 placeholder:text-slate-400 focus-visible:border-blue-400 h-12 px-4"
                />
              </div>

              <div class="flex items-center gap-2">
                <input type="checkbox" id="recordarme" name="recordarme" [(ngModel)]="recordarme" class="h-5 w-5 rounded border-blue-800 bg-blue-900/50 text-blue-500 focus:ring-blue-500 focus:ring-offset-blue-950" />
                <label for="recordarme" class="text-lg text-slate-200">
                  {{ motar() ? 'Recordarme' : 'Acepto términos y condiciones' }}
                </label>
              </div>

              <button
                hlmBtn
                type="submit"
                class="mt-1 w-full bg-green-500 text-xl font-semibold text-white hover:bg-green-400 h-12 rounded-xl"
                [disabled]="authStore.loading()"
              >
                {{ authStore.loading() ? 'Cargando...' : (motar() ? 'Continuar' : 'Crear cuenta') }}
              </button>
              
              @if (authStore.error()) {
                <p class="text-red-400 text-sm mt-2 text-center">{{ authStore.error() }}</p>
              }
            </form>

            <div class="mt-8 flex flex-col items-center gap-2 text-center text-lg md:flex-row md:justify-between md:text-base">
              @if (motar()) {
                <button hlmBtn variant="link" type="button" class="font-semibold text-slate-100 hover:text-blue-300">
                  ¿Olvidaste tu contraseña?
                </button>
              } @else {
                <span class="font-semibold text-slate-100">¿Ya tienes cuenta?</span>
              }

              <button
                hlmBtn
                variant="link"
                type="button"
                class="font-semibold text-blue-400 hover:text-blue-300"
                (click)="toggleMode()"
              >
                {{ motar() ? 'Regístrate ahora' : 'Volver a iniciar sesión' }}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    }
  `
})
export class LoginModalComponent {
  authStore = inject(AuthStore);
  authApi = inject(AuthApiService);
  router = inject(Router);

  loginAbierto = signal(false);
  motar = signal(true);

  email = '';
  password = '';
  recordarme = false;

  abrirModal() {
    this.loginAbierto.set(true);
  }

  cerrarModal() {
    this.loginAbierto.set(false);
  }

  toggleMode() {
    this.motar.set(!this.motar());
  }

  async handleLogin() {
    try {
      if (this.motar()) {
        await this.authStore.login({ email: this.email, password: this.password });
        this.cerrarModal();
        if (this.authStore.isAdmin()) {
          this.router.navigate(['/admin/peliculas']);
        } else {
          this.router.navigate(['/user']);
        }
      } else {
        await lastValueFrom(this.authApi.register({ email: this.email, password: this.password }));
        this.motar.set(true); // Back to login
      }
    } catch (e) {
      console.error(e);
    }
  }
}
