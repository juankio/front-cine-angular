import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/salas`;

  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  obtenerPorId(id: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crear(payload: { nombre: string, filas: number, asientosPorFila: number }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  eliminar(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  listarFunciones(salaId: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${salaId}/funciones`);
  }

  crearFuncion(salaId: string | number, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${salaId}/funciones`, payload);
  }
}