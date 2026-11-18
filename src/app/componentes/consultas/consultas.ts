import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Festivo } from '../../core/entidades/festivo';
import { Pais } from '../../core/entidades/pais';
import { FestivoService } from '../../core/servicios/festivo.service';
import { PaisService } from '../../core/servicios/pais.service';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './consultas.html',
  styleUrl: './consultas.css'
})
export class Consultas implements OnInit {
  private festivoService = inject(FestivoService);
  private paisService = inject(PaisService);
  private snackBar = inject(MatSnackBar);

  paises: Pais[] = [];

  // Parámetros para verificar una fecha exacta
  idPaisVerificar = 0;
  fechaSeleccionada = '';
  resultadoVerificacion: boolean | null = null;
  textoFechaConsultada = '';

  // Parámetros para listar festivos por año
  idPaisAnio = 0;
  anioConsulta: number = new Date().getFullYear();
  festivosDelAnio: Festivo[] = [];
  consultaAnioRealizada = false;

  columnas: string[] = ['nombre', 'fecha', 'tipo'];

  ngOnInit(): void {
    this.paisService.obtenerTodos().subscribe({
      next: (datos) => {
        this.paises = datos;
        if (this.paises.length > 0) {
          this.idPaisVerificar = this.paises[0].id;
          this.idPaisAnio = this.paises[0].id;
        }
      },
      error: () => this.mostrarMensaje('Error al cargar los países')
    });
  }

  verificarFecha(): void {
    if (!this.idPaisVerificar || !this.fechaSeleccionada) {
      this.mostrarMensaje('Selecciona un país y una fecha');
      return;
    }

    // fechaSeleccionada viene en formato YYYY-MM-DD
    const [anioStr, mesStr, diaStr] = this.fechaSeleccionada.split('-');
    const anio = Number(anioStr);
    const mes = Number(mesStr);
    const dia = Number(diaStr);

    this.festivoService.esFestivo(this.idPaisVerificar, anio, mes, dia).subscribe({
      next: (esFestivo) => {
        this.resultadoVerificacion = esFestivo;
        this.textoFechaConsultada = `${dia}/${mes}/${anio}`;
      },
      error: () => this.mostrarMensaje('Error al verificar la fecha en el servidor')
    });
  }

  consultarPorAnio(): void {
    if (!this.idPaisAnio || !this.anioConsulta) {
      this.mostrarMensaje('Selecciona un país e ingresa un año válido');
      return;
    }

    this.festivoService.obtenerPorAnio(this.idPaisAnio, Number(this.anioConsulta)).subscribe({
      next: (datos) => {
        this.festivosDelAnio = datos;
        this.consultaAnioRealizada = true;
      },
      error: () => this.mostrarMensaje('Error al obtener los festivos del año')
    });
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}
