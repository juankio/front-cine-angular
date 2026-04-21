import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, EventEmitter, Input, Output, inject, OnInit, OnChanges, SimpleChanges , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RecetasService } from '../../services/recetas.service';
import { MenuService } from '../../services/menu.service';
import { IngredientesService } from '../../services/ingredientes.service';
import { ToastService } from '../../services/toast.service';

import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-receta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HlmLabel, HlmButtonImports],
  templateUrl: './receta-form.component.html'})
export class RecetaFormComponent implements OnInit, OnChanges {
  private destroyRef = inject(DestroyRef);
  @Input() visible = false;
  @Input() recetaEditar: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private recetasService = inject(RecetasService);
  private menuService = inject(MenuService);
  private ingredientesService = inject(IngredientesService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  menus: any[] = [];
  ingredientesDb: any[] = [];

  guardando = false;

  recetaForm: FormGroup = this.fb.group({
    menuId: ['', Validators.required],
    ingredientes: this.fb.array([])
  });

  get ingredientesFormArray() {
    return this.recetaForm.get('ingredientes') as FormArray;
  }

  ngOnInit() {
    this.cargarSelects();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recetaEditar']) {
      if (this.recetaEditar) {
        this.recetaForm.patchValue({
          menuId: this.recetaEditar.menu?._id || this.recetaEditar.menu?.id || this.recetaEditar.menu || ''
        });
        
        this.ingredientesFormArray.clear();
        const ingredientesEdit = this.recetaEditar.ingredientes || [];
        ingredientesEdit.forEach((i: any) => {
          this.ingredientesFormArray.push(this.fb.group({
            ingredienteId: [i.ingrediente?._id || i.ingrediente?.id || i.ingrediente || '', Validators.required],
            cantidadNecesaria: [i.cantidadNecesaria, [Validators.required, Validators.min(0.01)]]
          }));
        });
      } else {
        this.resetForm();
      }
    }
  }

  cargarSelects() {
    this.menuService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.menus = res?.data || res || [];
    });
    this.ingredientesService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.ingredientesDb = res?.data || res || [];
    });
  }

  agregarIngredienteFila() {
    this.ingredientesFormArray.push(this.fb.group({
      ingredienteId: ['', Validators.required],
      cantidadNecesaria: [1, [Validators.required, Validators.min(0.01)]]
    }));
  }

  removerIngredienteFila(index: number) {
    this.ingredientesFormArray.removeAt(index);
  }

  cerrar() {
    this.resetForm();
    this.closed.emit();
  }

  guardar() {
    if (this.recetaForm.invalid || this.ingredientesFormArray.length === 0) return;

    this.guardando = true;
    
    const formValues = this.recetaForm.value;
    const payload = {
      menuId: formValues.menuId,
      ingredientes: formValues.ingredientes.map((i: any) => ({
        ingredienteId: i.ingredienteId,
        cantidadNecesaria: Number(i.cantidadNecesaria)
      }))
    };

    if (this.recetaEditar) {
      this.recetasService.actualizar(this.recetaEditar._id, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.guardando = false;
          this.toastService.success('Receta actualizada correctamente');
          this.resetForm();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error actualizando receta:', err);
          this.guardando = false;
          this.toastService.error('Hubo un error al actualizar la receta.');
        }
      });
    } else {
      this.recetasService.crear(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.guardando = false;
          this.toastService.success('Receta creada correctamente');
          this.resetForm();
          this.saved.emit();
        },
        error: (err) => {
          console.error('Error guardando receta:', err);
          this.guardando = false;
          this.toastService.error('Hubo un error al guardar la receta. Puede que este producto ya tenga una receta.');
        }
      });
    }
  }

  resetForm() {
    this.recetaForm.reset({
      menuId: ''
    });
    this.ingredientesFormArray.clear();
  }
}
