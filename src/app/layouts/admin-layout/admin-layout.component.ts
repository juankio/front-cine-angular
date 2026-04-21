import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BarraNavegacionComponent } from '../../components/barra-navegacion/barra-navegacion.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BarraNavegacionComponent],
  templateUrl: './admin-layout.component.html'})
export class AdminLayoutComponent {
  navItems = [
    { label: 'Dashboard', to: '/admin', icon: 'home', exact: true },
    { label: 'Películas', to: '/admin/peliculas', icon: 'movie', exact: false },
    { label: 'Salas', to: '/admin/salas', icon: 'salas', exact: false },
    { label: 'Menú', to: '/admin/menu', icon: 'menu', exact: false },
    { label: 'Ingredientes', to: '/admin/ingredientes', icon: 'ingredients', exact: false },
    { label: 'Recetas', to: '/admin/recetas', icon: 'book', exact: false },
    { label: 'Reservas', to: '/admin/reservas', icon: 'reservas', exact: false },
    { label: 'POS (Caja)', to: '/admin/pos', icon: 'pos', exact: false },
  ];
}