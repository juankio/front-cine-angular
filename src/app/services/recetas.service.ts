import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/recetas`;

  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  obtenerPorId(id: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crear(payload: { menuId: string, ingredientes: Array<{ ingredienteId: string, cantidadNecesaria: number }> }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  actualizar(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  eliminar(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
