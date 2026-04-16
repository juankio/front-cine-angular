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
  template: `
    <div class="w-full h-full bg-card p-10 md:p-14 text-foreground flex flex-col justify-center">
      <div class="mb-10 text-center">
        <h3 class="mt-4 text-5xl font-display uppercase tracking-widest text-foreground">
          {{ motar ? 'Acceso a Sala' : 'Nuevo Registro' }}
        </h3>
        <p class="mt-2 text-lg text-muted-foreground font-body">
          {{ motar ? 'Ingresa tus credenciales para continuar.' : 'Completa tus datos para crear tu cuenta.' }}
        </p>
      </div>

      <form class="space-y-6" (ngSubmit)="onSubmit()">
        <div>
          <label for="email" class="mb-2 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">Correo Electrónico</label>
          <input
            hlmInput
            id="email"
            name="email"
            [(ngModel)]="email"
            type="email"
            placeholder="correo@ejemplo.com"
            class="rounded-none border-2 border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-0 h-14 px-4 w-full font-body text-lg shadow-sm transition-colors"
          />
        </div>

        @if (!motar) {
          <div>
            <label for="nombre" class="mb-2 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">Nombre Completo</label>
            <input
              hlmInput
              id="nombre"
              name="nombre"
              [(ngModel)]="nombre"
              type="text"
              placeholder="Ej: Ana López"
              class="rounded-none border-2 border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-0 h-14 px-4 w-full font-body text-lg shadow-sm transition-colors"
            />
          </div>
        }

        <div>
          <label for="password" class="mb-2 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contraseña</label>
          <input
            hlmInput
            id="password"
            name="password"
            [(ngModel)]="password"
            type="password"
            placeholder="******"
            class="rounded-none border-2 border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-0 h-14 px-4 w-full font-body text-lg shadow-sm transition-colors"
          />
        </div>

        @if (!motar) {
          <div>
            <label for="genero" class="mb-2 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">Género</label>
            <select
              id="genero"
              name="genero"
              [(ngModel)]="genero"
              class="flex w-full rounded-none border-2 border-border bg-background text-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0 h-14 px-4 font-body text-lg shadow-sm transition-colors"
            >
              <option value="" disabled selected>Selecciona tu género</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="No binario">No binario / Otro</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </select>
          </div>
        }

        <div class="flex items-center gap-3 mt-4">
          <input type="checkbox" id="recordarme" name="recordarme" [(ngModel)]="recordarme" class="h-5 w-5 rounded-sm border-2 border-border bg-background text-primary focus:ring-primary focus:ring-offset-background" />
          <label for="recordarme" class="text-sm font-medium text-foreground font-body">
            {{ motar ? 'Recordarme en este equipo' : 'Acepto términos y condiciones' }}
          </label>
        </div>

        <button
          hlmBtn
          type="submit"
          class="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-none border-2 border-primary font-display text-2xl tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.1)] transition-all hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,0.1)]"
          [disabled]="authStore.loading()"
        >
          {{ authStore.loading() ? 'CARGANDO...' : (motar ? 'ENTRAR AHORA' : 'CREAR CUENTA') }}
        </button>
        
        @if (authStore.error()) {
          <p class="text-destructive font-semibold text-sm mt-4 text-center font-body bg-destructive/10 py-3 border border-destructive/20">{{ authStore.error() }}</p>
        }
      </form>

      <div class="mt-10 flex flex-col items-center gap-4 text-center text-sm md:flex-row md:justify-between font-body">
        @if (motar) {
          <button hlmBtn variant="link" type="button" class="font-medium text-muted-foreground hover:text-foreground p-0 h-auto">
            ¿Olvidaste tu contraseña?
          </button>
        } @else {
          <span class="font-medium text-muted-foreground">¿Ya tienes cuenta?</span>
        }

        <button
          hlmBtn
          variant="link"
          type="button"
          class="font-bold text-primary hover:text-primary/80 p-0 h-auto uppercase tracking-wide"
          (click)="onToggleMode()"
        >
          {{ motar ? 'Crear cuenta nueva' : 'Volver a iniciar sesión' }}
        </button>
      </div>
    </div>
  `
})
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
