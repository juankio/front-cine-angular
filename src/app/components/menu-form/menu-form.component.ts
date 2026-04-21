import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-form.component.html'})
export class MenuFormComponent implements OnChanges {
  private destroyRef = inject(DestroyRef);
  @Input() visible = false;
  @Input() menuEditar: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private menuService = inject(MenuService);
  private toastService = inject(ToastService);

  guardando = false;

  formData = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenUrl: '',
    recomendado: false
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['menuEditar'] && this.menuEditar) {
      this.formData = {
        nombre: this.menuEditar.nombre || '',
        descripcion: this.menuEditar.descripcion || '',
        precio: this.menuEditar.precio || 0,
        imagenUrl: this.menuEditar.imagenUrl || '',
        recomendado: this.menuEditar.recomendado || false
      };
    }
  }

  cerrar() {
    this.resetForm();
    this.closed.emit();
  }

  guardar() {
    this.guardando = true;
    
    // Convert string to number for price
    const payload = {
      ...this.formData,
      precio: Number(this.formData.precio)
    };

    if (this.menuEditar && (this.menuEditar._id || this.menuEditar.id)) {
      const id = this.menuEditar._id || this.menuEditar.id;
      this.menuService.actualizar(id, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.guardando = false;
          this.resetForm();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error actualizando ítem del menú:', err);
          this.guardando = false;
          this.toastService.error('Hubo un error al actualizar el producto.');
        }
      });
    } else {
      this.menuService.crear(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.guardando = false;
          this.resetForm();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error guardando ítem del menú:', err);
          this.guardando = false;
          this.toastService.error('Hubo un error al guardar el producto.');
        }
      });
    }
  }

  resetForm() {
    this.formData = {
      nombre: '',
      descripcion: '',
      precio: 0,
      imagenUrl: '',
      recomendado: false
    };
  }
}
