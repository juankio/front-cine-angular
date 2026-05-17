import { Component, input, output, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStore } from '../../state/auth.store';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon } from '@ng-icons/lucide';

@Component({
  selector: 'app-nav-menu-mobile',
  standalone: true,
  imports: [RouterLink, LoginModalComponent, HlmButton, HlmIcon, NgIconComponent],
  providers: [provideIcons({ lucideSun, lucideMoon })],
  templateUrl: './nav-menu-mobile.component.html'})
export class NavMenuMobileComponent {
  authStore = inject(AuthStore);
  router = inject(Router);

  filteredLinks = input.required<{ label: string; to: string; fragment?: string; exact: boolean; auth: boolean; admin: boolean }[]>();
  isDarkMode = input.required<boolean>();

  closeMenu = output<void>();
  toggleTheme = output<void>();

  currentUrl = '/';

  constructor() {
    this.currentUrl = this.router.url;
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentUrl = e.urlAfterRedirects;
    });
  }

  adminNavItems = [
    { label: 'Dashboard', to: '/admin', exact: true },
    { label: 'Escanear QR', to: '/admin/escanear', exact: false },
    { label: 'Películas', to: '/admin/peliculas', exact: false },
    { label: 'Salas', to: '/admin/salas', exact: false },
    { label: 'Menú', to: '/admin/menu', exact: false },
    { label: 'Ingredientes', to: '/admin/ingredientes', exact: false },
    { label: 'Recetas', to: '/admin/recetas', exact: false },
    { label: 'Reservas', to: '/admin/reservas', exact: false },
    { label: 'Caja', to: '/admin/pos', exact: false },
  ];

  isActive(link: any): boolean {
    if (link.to === '/' && link.fragment) {
      return this.currentUrl.includes('#' + link.fragment);
    }
    if (link.to === '/' && !link.fragment) {
      return this.currentUrl === '/' || this.currentUrl.startsWith('/?');
    }
    if (link.exact) {
      return this.currentUrl === link.to;
    }
    return this.currentUrl.startsWith(link.to);
  }

  handleLogout() {
    this.authStore.logout();
    this.router.navigate(['/']);
    this.closeMenu.emit();
  }
}
