import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Index',
    loadComponent: () => import('./views/index/index.component').then(m => m.IndexComponent)
  },
  {
    path: 'user',
    title: 'User',
    canActivate: [authGuard],
    loadComponent: () => import('./views/user/user.component').then(m => m.UserComponent)
  },
  {
    path: 'admin',
    title: 'Admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./views/admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: 'peliculas',
        title: 'Admin - Películas',
        loadComponent: () => import('./views/admin/peliculas/peliculas.component').then(m => m.PeliculasComponent)
      },
      {
        path: 'menu',
        title: 'Admin - Menú',
        loadComponent: () => import('./views/admin/menu/menu.component').then(m => m.MenuComponent)
      },
      {
        path: 'ingredientes',
        title: 'Admin - Ingredientes',
        loadComponent: () => import('./views/admin/ingredientes/ingredientes.component').then(m => m.IngredientesComponent)
      },
      {
        path: 'recetas',
        title: 'Admin - Recetas',
        loadComponent: () => import('./views/admin/recetas/recetas.component').then(m => m.RecetasComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];