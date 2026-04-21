import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, OnInit, inject, signal , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecetasService } from '../../../services/recetas.service';
import { RecetaFormComponent } from '../../../components/receta-form/receta-form.component';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, RecetaFormComponent],
  templateUrl: './recetas.component.html'})
export class RecetasComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private service = inject(RecetasService);

  recetas = signal<any[]>([]);
  loading = signal(false);
  modalAbierto = signal(false);
  itemEditar: any = null;

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.loading.set(true);
    this.service.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.recetas.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando recetas', err);
        this.loading.set(false);
      }
    });
  }

  abrirModal() {
    this.itemEditar = null;
    this.modalAbierto.set(true);
  }

  editar(item: any) {
    this.itemEditar = item;
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  onGuardado() {
    this.cerrarModal();
    this.cargar();
  }

  eliminar(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta receta? (El producto del menú seguirá existiendo)')) return;
    this.service.eliminar(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.cargar(),
      error: (err) => console.error('Error al eliminar', err)
    });
  }
}
