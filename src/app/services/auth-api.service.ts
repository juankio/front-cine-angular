import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Método que conectará con Sanji para procesar el token de Google
  loginGoogle(idToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/google`, { token: idToken });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  me(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/me`);
  }
}