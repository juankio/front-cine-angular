import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, OnInit, inject, signal , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../../services/menu.service';
import { ToastService } from '../../../services/toast.service';

import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { MenuFormComponent } from '../../../components/menu-form/menu-form.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmTableImports, HlmCardImports, HlmButtonImports, MenuFormComponent],
  templateUrl: './menu.component.html'})
export class MenuComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private menuService = inject(MenuService);
  private toastService = inject(ToastService);

  productos = signal<any[]>([]);
  loading = signal(false);
  modalAbierto = signal(false);
  itemEditar: any = null;

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading.set(true);
    this.menuService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = res?.data || res;
        this.productos.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando productos del menú', err);
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

  onProductoGuardado() {
    this.cerrarModal();
    this.cargarProductos();
  }

  eliminar(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    this.menuService.eliminar(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al eliminar producto', err);
        this.toastService.error('Hubo un error al eliminar el producto.');
      }
    });
  }
}
