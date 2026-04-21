import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, inject, signal, OnInit , DestroyRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { PeliculasService } from '../../services/peliculas.service';
import { MenuService } from '../../services/menu.service';
import { SalasService } from '../../services/salas.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, AdminLayoutComponent, HlmCardImports],
  templateUrl: './admin.component.html'})
export class AdminComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  
  private peliculasService = inject(PeliculasService);
  private menuService = inject(MenuService);
  private salasService = inject(SalasService);

  totalPeliculas = signal(0);
  totalMenus = signal(0);
  totalSalas = signal(0);
  
  get isDashboard() {
    return this.router.url === '/admin';
  }

  ngOnInit() {
    this.peliculasService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      const data = res?.data || res;
      this.totalPeliculas.set(Array.isArray(data) ? data.length : 0);
    });

    this.menuService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      const data = res?.data || res;
      this.totalMenus.set(Array.isArray(data) ? data.length : 0);
    });

    this.salasService.listar().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      const data = res?.data || res;
      this.totalSalas.set(Array.isArray(data) ? data.length : 0);
    });
  }
}
