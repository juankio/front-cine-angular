import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IngredientesService } from '../../services/ingredientes.service';
import { ToastService } from '../../services/toast.service';

import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-ingrediente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmLabel, HlmInput, HlmButtonImports],
  templateUrl: './ingrediente-form.component.html'})
export class IngredienteFormComponent implements OnChanges {
  private destroyRef = inject(DestroyRef);
  @Input() visible = false;
  @Input() ingredienteEditar: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private ingredientesService = inject(IngredientesService);
  private toastService = inject(ToastService);

  guardando = false;

  formData = {
    nombre: '',
    unidad: 'unidades',
    stock: 0
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ingredienteEditar']) {
      if (this.ingredienteEditar) {
        this.formData = {
          nombre: this.ingredienteEditar.nombre || '',
          unidad: this.ingredienteEditar.unidad || 'unidades',
          stock: this.ingredienteEditar.stock || 0
        };
      } else {
        this.resetForm();
      }
    }
  }

  cerrar() {
    this.resetForm();
    this.closed.emit();
  }

  guardar() {
    this.guardando = true;
    
    const payload = {
      ...this.formData,
      stock: Number(this.formData.stock)
    };

    if (this.ingredienteEditar) {
      const id = this.ingredienteEditar._id || this.ingredienteEditar.id;
      this.ingredientesService.actualizar(id, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.guardando = false;
          this.toastService.success('Ingrediente actualizado correctamente.');
          this.resetForm();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error actualizando ingrediente:', err);
          this.guardando = false;
          this.toastService.error('Hubo un error al actualizar el ingrediente.');
        }
      });
    } else {
      this.ingredientesService.crear(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.guardando = false;
          this.toastService.success('Ingrediente creado correctamente.');
          this.resetForm();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error guardando ingrediente:', err);
          this.guardando = false;
          this.toastService.error('Hubo un error al guardar el ingrediente.');
        }
      });
    }
  }

  resetForm() {
    this.formData = {
      nombre: '',
      unidad: 'unidades',
      stock: 0
    };
  }
}