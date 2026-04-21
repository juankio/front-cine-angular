import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, EventEmitter, Input, Output, inject, signal, OnChanges, SimpleChanges , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PeliculasService } from '../../services/peliculas.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-pelicula-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pelicula-form.component.html'})
export class PeliculaFormComponent implements OnChanges {
  private destroyRef = inject(DestroyRef);
  @Input() visible = false;
  @Input() peliculaEditar: any = null; // Nueva prop para recibir datos a editar
  
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private peliculasService = inject(PeliculasService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  
  guardando = signal(false);
  imageError = false;

  peliculaForm: FormGroup = this.fb.group({
    titulo: ['', Validators.required],
    duracionMinutos: ['', [Validators.required, Validators.min(1)]],
    imagenUrl: ['', Validators.required],
    anio: [new Date().getFullYear(), [Validators.required, Validators.min(1800)]],
    genero: ['Acción', Validators.required],
    descripcion: ['Sin sinopsis', Validators.required],
  });

  ngOnChanges(changes: SimpleChanges) {
    // Si pasamos una película para editar, llenamos el formulario
    if (changes['peliculaEditar']) {
      if (this.peliculaEditar) {
        this.peliculaForm.patchValue({
          titulo: this.peliculaEditar.titulo || '',
          duracionMinutos: this.peliculaEditar.duracionMinutos?.toString() || '',
          imagenUrl: this.peliculaEditar.imagenUrl || '',
          anio: this.peliculaEditar.anio || new Date().getFullYear(),
          genero: this.peliculaEditar.genero || 'Acción',
          descripcion: this.peliculaEditar.descripcion || 'Sin sinopsis',
        });
        this.imageError = false;
      } else {
        this.resetForm();
      }
    }
  }

  cerrar() {
    this.resetForm();
    this.imageError = false;
    this.closed.emit();
  }

  resetForm() {
    this.peliculaForm.reset({
      titulo: '',
      duracionMinutos: '',
      imagenUrl: '',
      anio: new Date().getFullYear(),
      genero: 'Acción',
      descripcion: 'Sin sinopsis',
    });
  }

  guardar() {
    if (this.peliculaForm.invalid) return;

    this.guardando.set(true);
    const formValues = this.peliculaForm.value;
    const payload = {
      titulo: formValues.titulo,
      duracionMinutos: Number(formValues.duracionMinutos),
      imagenUrl: formValues.imagenUrl,
      anio: Number(formValues.anio) || new Date().getFullYear(),
      genero: formValues.genero || 'Acción',
      descripcion: formValues.descripcion || 'Sin descripción proporcionada.',
    };

    if (this.peliculaEditar && (this.peliculaEditar._id || this.peliculaEditar.id)) {
      // Editar
      const id = this.peliculaEditar._id || this.peliculaEditar.id;
      this.peliculasService.actualizar(id, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.guardando.set(false);
          this.cerrar();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          this.guardando.set(false);
          this.toastService.error('Error al actualizar la película.');
        }
      });
    } else {
      // Crear nueva
      this.peliculasService.crear(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.guardando.set(false);
          this.cerrar();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error al guardar', err);
          this.guardando.set(false);
          this.toastService.error('Error al crear la película.');
        }
      });
    }
  }
}
