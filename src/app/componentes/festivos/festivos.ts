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
import { TipoFestivo } from '../../core/entidades/tipo-festivo';
import { FestivoService } from '../../core/servicios/festivo.service';
import { PaisService } from '../../core/servicios/pais.service';
import { TipoFestivoService } from '../../core/servicios/tipo-festivo.service';

@Component({
  selector: 'app-festivos',
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
  templateUrl: './festivos.html',
  styleUrl: './festivos.css'
})
export class Festivos implements OnInit {
  private festivoService = inject(FestivoService);
  private paisService = inject(PaisService);
  private tipoFestivoService = inject(TipoFestivoService);
  private snackBar = inject(MatSnackBar);

  festivos: Festivo[] = [];
  paises: Pais[] = [];
  tiposFestivo: TipoFestivo[] = [];

  columnas: string[] = ['id', 'nombre', 'fecha', 'diasPascua', 'pais', 'tipo', 'acciones'];

  festivoActual: Festivo = this.crearModeloVacio();
  editando = false;

  ngOnInit(): void {
    this.cargarCatalogos();
    this.listar();
  }

  private crearModeloVacio(): Festivo {
    return {
      id: 0,
      nombre: '',
      dia: 1,
      mes: 1,
      diasPascua: 0,
      idPais: 0,
      idTipo: 0
    };
  }

  cargarCatalogos(): void {
    this.paisService.obtenerTodos().subscribe({
      next: (datos) => (this.paises = datos),
      error: () => this.mostrarMensaje('Error al cargar la lista de países')
    });

    this.tipoFestivoService.obtenerTodos().subscribe({
      next: (datos) => (this.tiposFestivo = datos),
      error: () => this.mostrarMensaje('Error al cargar los tipos de festivo')
    });
  }

  listar(): void {
    this.festivoService.obtenerTodos().subscribe({
      next: (datos) => (this.festivos = datos),
      error: () => this.mostrarMensaje('Error al cargar los festivos')
    });
  }

  guardar(): void {
    if (!this.festivoActual.nombre.trim()) {
      this.mostrarMensaje('El nombre del festivo es obligatorio');
      return;
    }
    if (!this.festivoActual.idPais || !this.festivoActual.idTipo) {
      this.mostrarMensaje('Debes seleccionar un país y un tipo de festivo');
      return;
    }

    // Limpiar propiedades de navegación antes de enviar al backend .NET
    const payload: Festivo = {
      id: this.festivoActual.id,
      nombre: this.festivoActual.nombre.trim(),
      dia: Number(this.festivoActual.dia),
      mes: Number(this.festivoActual.mes),
      diasPascua: Number(this.festivoActual.diasPascua),
      idPais: Number(this.festivoActual.idPais),
      idTipo: Number(this.festivoActual.idTipo)
    };

    if (this.editando) {
      this.festivoService.modificar(payload).subscribe({
        next: () => {
          this.mostrarMensaje('Festivo actualizado correctamente');
          this.cancelar();
          this.listar();
        },
        error: () => this.mostrarMensaje('Error al actualizar el festivo')
      });
    } else {
      this.festivoService.agregar(payload).subscribe({
        next: () => {
          this.mostrarMensaje('Festivo agregado correctamente');
          this.cancelar();
          this.listar();
        },
        error: () => this.mostrarMensaje('Error al agregar el festivo')
      });
    }
  }

  editar(festivo: Festivo): void {
    this.festivoActual = { ...festivo };
    this.editando = true;
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este festivo?')) return;

    this.festivoService.eliminar(id).subscribe({
      next: () => {
        this.mostrarMensaje('Festivo eliminado');
        this.listar();
      },
      error: () => this.mostrarMensaje('Error al eliminar el festivo')
    });
  }

  cancelar(): void {
    this.festivoActual = this.crearModeloVacio();
    this.editando = false;
  }

  obtenerNombrePais(festivo: Festivo): string {
    return festivo.pais?.nombre || this.paises.find((p) => p.id === festivo.idPais)?.nombre || `ID: ${festivo.idPais}`;
  }

  obtenerNombreTipo(festivo: Festivo): string {
    return festivo.tipoFestivo?.tipo || this.tiposFestivo.find((t) => t.id === festivo.idTipo)?.tipo || `ID: ${festivo.idTipo}`;
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}
