import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TipoFestivo } from '../../core/entidades/tipo-festivo';
import { TipoFestivoService } from '../../core/servicios/tipo-festivo.service';

@Component({
  selector: 'app-tipos-festivos',
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
  templateUrl: './tipos-festivos.html',
  styleUrl: './tipos-festivos.css'
})
export class TiposFestivos implements OnInit {
  private tipoFestivoService = inject(TipoFestivoService);
  private snackBar = inject(MatSnackBar);

  tipos: TipoFestivo[] = [];
  columnas: string[] = ['id', 'tipo', 'acciones'];

  tipoActual: TipoFestivo = { id: 0, tipo: '' };
  editando = false;

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.tipoFestivoService.obtenerTodos().subscribe({
      next: (datos) => (this.tipos = datos),
      error: () => this.mostrarMensaje('Error al cargar los tipos de festivo')
    });
  }

  guardar(): void {
    if (!this.tipoActual.tipo.trim()) {
      this.mostrarMensaje('La descripción del tipo de festivo es obligatoria');
      return;
    }

    if (this.editando) {
      this.tipoFestivoService.modificar(this.tipoActual).subscribe({
        next: () => {
          this.mostrarMensaje('Tipo de festivo actualizado correctamente');
          this.cancelar();
          this.listar();
        },
        error: () => this.mostrarMensaje('Error al actualizar el tipo de festivo')
      });
    } else {
      this.tipoFestivoService.agregar(this.tipoActual).subscribe({
        next: () => {
          this.mostrarMensaje('Tipo de festivo agregado correctamente');
          this.cancelar();
          this.listar();
        },
        error: () => this.mostrarMensaje('Error al agregar el tipo de festivo')
      });
    }
  }

  editar(tipoFestivo: TipoFestivo): void {
    this.tipoActual = { ...tipoFestivo };
    this.editando = true;
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este tipo de festivo?')) return;

    this.tipoFestivoService.eliminar(id).subscribe({
      next: () => {
        this.mostrarMensaje('Tipo de festivo eliminado');
        this.listar();
      },
      error: () => this.mostrarMensaje('No se pudo eliminar el tipo (puede tener festivos asociados)')
    });
  }

  cancelar(): void {
    this.tipoActual = { id: 0, tipo: '' };
    this.editando = false;
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}
