import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthApiService } from '../services/auth-api.service';
import { tap, catchError } from 'rxjs/operators';
import { throwError, lastValueFrom } from 'rxjs';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private authApi = inject(AuthApiService);

  // State
  private readonly _user = signal<any | null>(null);
  private readonly _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
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
    if (this._token()) {
      this.fetchUser();
    }
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
    localStorage.setItem(TOKEN_KEY, token);
    this._token.set(token);
  }

  private removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
  }
}