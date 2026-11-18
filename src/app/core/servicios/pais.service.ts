import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pais } from '../entidades/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private http = inject(HttpClient);
  private url = `${environment.urlBase}/paises`;

  obtenerTodos(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.url);
  }

  obtener(id: number): Observable<Pais> {
    return this.http.get<Pais>(`${this.url}/${id}`);
  }

  agregar(pais: Pais): Observable<Pais> {
    return this.http.post<Pais>(this.url, pais);
  }

  modificar(pais: Pais): Observable<Pais> {
    return this.http.put<Pais>(this.url, pais);
  }

  eliminar(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`);
  }
}