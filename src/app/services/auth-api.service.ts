import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  login(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload);
  }

  me(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }
}