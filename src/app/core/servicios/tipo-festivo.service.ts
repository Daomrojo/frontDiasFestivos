import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoFestivo } from '../entidades/tipo-festivo';

@Injectable({
  providedIn: 'root'
})
export class TipoFestivoService {
  private http = inject(HttpClient);
  private url = `${environment.urlBase}/tiposfestivos`;

  obtenerTodos(): Observable<TipoFestivo[]> {
    return this.http.get<TipoFestivo[]>(this.url);
  }

  obtener(id: number): Observable<TipoFestivo> {
    return this.http.get<TipoFestivo>(`${this.url}/${id}`);
  }

  agregar(tipoFestivo: TipoFestivo): Observable<TipoFestivo> {
    return this.http.post<TipoFestivo>(this.url, tipoFestivo);
  }

  modificar(tipoFestivo: TipoFestivo): Observable<TipoFestivo> {
    return this.http.put<TipoFestivo>(this.url, tipoFestivo);
  }

  eliminar(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`);
  }
}