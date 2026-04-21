import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthApiService } from '../services/auth-api.service';
import { tap, catchError } from 'rxjs/operators';
import { throwError, lastValueFrom } from 'rxjs';

// Almacenamiento seguro en memoria, aislado del ciclo de inyección DI
let memoryToken: string | null = null;
export const getMemoryToken = () => memoryToken;

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private authApi = inject(AuthApiService);

  // State
  private readonly _user = signal<any | null>(null);
  private readonly _token = signal<string | null>(memoryToken);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Selectors
  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed
  readonly isAuthenticated = computed(() => !!this._token());
  readonly isAdmin = computed(() => {
    const u = this._user();
    return u?.rol === 'admin' || u?.role === 'admin';
  });
  readonly isClient = computed(() => {
    const u = this._user();
    return u?.rol === 'cliente' || u?.role === 'cliente' || u?.rol === 'client';
  });

  constructor() {
    // Al no usar localStorage, intentamos recuperar la sesión al iniciar la app.
    // Esto es vital si el backend maneja la sesión con cookies HttpOnly.
    this.fetchUser().catch(() => {
      // Ignoramos el error si no hay sesión activa
    });
  }

  setLoading(value: boolean) {
    this._loading.set(value);
  }

  setError(error: string | null) {
    this._error.set(error);
  }

  // Actions
  async login(credentials: any): Promise<any> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const response = await lastValueFrom(this.authApi.login(credentials));
      const token = response?.data?.token || response?.token;

      if (token) {
        this.setToken(token);
      }

      const user = response?.data?.user || response?.user;
      if (user) {
        this._user.set(user);
      } else {
        await this.fetchUser();
      }
      return response;
    } catch (e: any) {
      const errorMessage = e.error?.message || e.message || 'Error occurred during login';
      this._error.set(errorMessage);
      throw e;
    } finally {
      this._loading.set(false);
    }
  }

  async fetchUser(): Promise<void> {
    try {
      const response = await lastValueFrom(this.authApi.me());
      const user = response?.data?.user || response?.data || response?.user || response;
      this._user.set(user);
    } catch (e) {
      console.error('Failed to fetch user', e);
      this.logout();
    }
  }

  logout(): void {
    this.removeToken();
    this._user.set(null);
    // In original it called authApi.logout() which just clears token, we do it here.
  }

  private setToken(token: string): void {
    memoryToken = token;
    this._token.set(token);
  }

  private removeToken(): void {
    memoryToken = null;
    this._token.set(null);
  }
}
