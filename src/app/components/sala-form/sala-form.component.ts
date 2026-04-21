import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, EventEmitter, Input, Output, inject , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalasService } from '../../services/salas.service';
import { ToastService } from '../../services/toast.service';

import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-sala-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmLabel, HlmInput, HlmButtonImports],
  templateUrl: './sala-form.component.html'})
export class SalaFormComponent {
  private destroyRef = inject(DestroyRef);
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private salasService = inject(SalasService);
  private toastService = inject(ToastService);

  guardando = false;

  formData = {
    nombre: '',
    filas: 10,
    asientosPorFila: 12
  };

  get totalAsientos(): number {
    return (this.formData.filas || 0) * (this.formData.asientosPorFila || 0);
  }

  cerrar() {
    this.resetForm();
    this.closed.emit();
  }

  guardar() {
    this.guardando = true;
    
    const payload = {
      nombre: this.formData.nombre,
      filas: Number(this.formData.filas),
      asientosPorFila: Number(this.formData.asientosPorFila)
    };

    this.salasService.crear(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.guardando = false;
        this.resetForm();
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error creando sala:', err);
        this.guardando = false;
        this.toastService.error('Hubo un error al crear la sala.');
      }
    });
  }

  resetForm() {
    this.formData = {
      nombre: '',
      filas: 10,
      asientosPorFila: 12
    };
  }
}
