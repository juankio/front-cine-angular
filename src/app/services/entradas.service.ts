import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  disponibilidadFuncion(funcionId: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/funciones/${funcionId}/disponibilidad`);
  }

  comprarFuncion(funcionId: string | number, payload: any = { cantidad: 1 }): Observable<any> {
    return this.http.post(`${this.apiUrl}/funciones/${funcionId}/entradas`, payload);
  }

  comprarDulceria(productos: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/dulceria/comprar`, { productos });
  }

  misEntradas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mis-entradas`);
  }

  todasLasReservas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/entradas/todas`);
  }
}