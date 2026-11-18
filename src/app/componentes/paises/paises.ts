import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Pais } from '../../core/entidades/pais';
import { PaisService } from '../../core/servicios/pais.service';

@Component({
  selector: 'app-paises',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './paises.html',
  styleUrl: './paises.css'
})
export class Paises implements OnInit {
  private paisService = inject(PaisService);
  private snackBar = inject(MatSnackBar);

  paises: Pais[] = [];
  columnas: string[] = ['id', 'nombre', 'acciones'];

  paisActual: Pais = { id: 0, nombre: '' };
  editando = false;

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.paisService.obtenerTodos().subscribe({
      next: (datos) => (this.paises = datos),
      error: () => this.mostrarMensaje('Error al cargar los países')
    });
  }

  guardar(): void {
    if (!this.paisActual.nombre.trim()) {
      this.mostrarMensaje('El nombre del país es obligatorio');
      return;
    }

    if (this.editando) {
      this.paisService.modificar(this.paisActual).subscribe({
        next: () => {
          this.mostrarMensaje('País actualizado correctamente');
          this.cancelar();
          this.listar();
        },
        error: () => this.mostrarMensaje('Error al actualizar el país')
      });
    } else {
      this.paisService.agregar(this.paisActual).subscribe({
        next: () => {
          this.mostrarMensaje('País agregado correctamente');
          this.cancelar();
          this.listar();
        },
        error: () => this.mostrarMensaje('Error al agregar el país')
      });
    }
  }

  editar(pais: Pais): void {
    this.paisActual = { ...pais };
    this.editando = true;
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este país?')) return;

    this.paisService.eliminar(id).subscribe({
      next: () => {
        this.mostrarMensaje('País eliminado');
        this.listar();
      },
      error: () => this.mostrarMensaje('No se pudo eliminar el país (puede tener festivos asociados)')
    });
  }

  cancelar(): void {
    this.paisActual = { id: 0, nombre: '' };
    this.editando = false;
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}
