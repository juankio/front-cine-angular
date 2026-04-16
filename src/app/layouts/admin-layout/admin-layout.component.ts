import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BarraNavegacionComponent } from '../../components/barra-navegacion/barra-navegacion.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BarraNavegacionComponent],
  template: `
    <app-barra-navegacion />
    <div class="flex w-full h-[calc(100vh-64px)]">
      <!-- Sidebar -->
      <aside class="w-64 shrink-0 border-r border-border px-4 py-3 bg-card overflow-y-auto">
        <ul class="flex flex-col gap-2">
          @for (item of navItems; track item.to) {
            <li>
              <a
                [routerLink]="item.to"
                routerLinkActive="border-l-primary text-primary bg-muted"
                [routerLinkActiveOptions]="{exact: item.exact}"
                class="flex items-center gap-2 px-4 py-2 w-full justify-start border-l-4 border-l-transparent rounded-r-sm rounded-l-none text-base font-bold text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <!-- SVG Icon fallback since we aren't using UIcon directly -->
                @if (item.icon === 'home') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                } @else if (item.icon === 'movie') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
                } @else if (item.icon === 'menu') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                } @else if (item.icon === 'ingredients') {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                }
                {{ item.label }}
              </a>
            </li>
          }
        </ul>
      </aside>

      <!-- Contenido -->
      <main class="flex-1 min-w-0 overflow-y-auto bg-background">
        <ng-content></ng-content>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  navItems = [
    { label: 'Dashboard', to: '/admin', icon: 'home', exact: true },
    { label: 'Películas', to: '/admin/peliculas', icon: 'movie', exact: false },
    { label: 'Menú', to: '/admin/menu', icon: 'menu', exact: false },
    { label: 'Ingredientes', to: '/admin/ingredientes', icon: 'ingredients', exact: false },
    { label: 'Recetas', to: '/admin/recetas', icon: 'book', exact: false },
  ];
}