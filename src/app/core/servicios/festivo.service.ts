import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Festivo } from '../entidades/festivo';

@Injectable({
  providedIn: 'root'
})
export class FestivoService {
  private http = inject(HttpClient);
  private url = `${environment.urlBase}/festivos`;

  obtenerTodos(): Observable<Festivo[]> {
    return this.http.get<Festivo[]>(this.url);
  }

  obtener(id: number): Observable<Festivo> {
    return this.http.get<Festivo>(`${this.url}/${id}`);
  }

  obtenerPorAnio(idPais: number, anio: number): Observable<Festivo[]> {
    return this.http.get<Festivo[]>(`${this.url}/obtener/${idPais}/${anio}`);
  }

  esFestivo(idPais: number, anio: number, mes: number, dia: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/verificar/${idPais}/${anio}/${mes}/${dia}`);
  }

  agregar(festivo: Festivo): Observable<Festivo> {
    return this.http.post<Festivo>(this.url, festivo);
  }

  modificar(festivo: Festivo): Observable<Festivo> {
    return this.http.put<Festivo>(this.url, festivo);
  }

  eliminar(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.url}/${id}`);
  }
}