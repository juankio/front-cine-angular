import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http = inject(HttpClient);
  public apiUrl = environment.apiUrl; // Hecho publico para leerlo desde los componentes

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  me(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/me`);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(payload: { token: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, payload);
  }
}