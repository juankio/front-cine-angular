import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, EventEmitter, Input, Output, inject, OnInit, signal , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalasService } from '../../services/salas.service';
import { PeliculasService } from '../../services/peliculas.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-funcion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcion-form.component.html'})
export class FuncionFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  @Input() visible = false;
  @Input() sala: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private salasService = inject(SalasService);
  private peliculasService = inject(PeliculasService);
  private toastService = inject(ToastService);

  peliculas = signal<any[]>([]);
  guardando = signal(false);

  form = {
    peliculaId: '',
    inicio: '',
    idioma: 'doblada',
    formato: '2D',
    precio: 1500
  };

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.peliculasService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.peliculas.set(Array.isArray(data) ? data : []);
      }
    });
  }

  cerrar() {
    this.resetForm();
    this.closed.emit();
  }

  resetForm() {
    this.form = {
      peliculaId: '',
      inicio: '',
      idioma: 'doblada',
      formato: '2D',
      precio: 1500
    };
  }

  guardar() {
    if (!this.sala || !this.form.peliculaId || !this.form.inicio) return;
    this.guardando.set(true);

    const payload = {
      peliculaId: this.form.peliculaId,
      inicio: new Date(this.form.inicio).toISOString(),
      idioma: this.form.idioma,
      formato: this.form.formato,
      precio: Number(this.form.precio)
    };

    const salaId = this.sala._id || this.sala.id;

    this.salasService.crearFuncion(salaId, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.guardando.set(false);
        this.toastService.success('Función programada con éxito.');
        this.cerrar();
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error al guardar la función', err);
        this.guardando.set(false);
        const msg = err.error?.message || 'Error al programar. Verifica que no haya choque de horarios.';
        this.toastService.error(msg);
      }
    });
  }
}
