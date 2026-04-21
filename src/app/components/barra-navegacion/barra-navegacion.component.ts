import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  Component, inject, computed, signal, effect , DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStore } from '../../state/auth.store';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX, lucideSun, lucideMoon } from '@ng-icons/lucide';
import { NgIconComponent } from '@ng-icons/core';

import { NavMenuDesktopComponent } from './nav-menu-desktop.component';
import { NavMenuMobileComponent } from './nav-menu-mobile.component';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule, LoginModalComponent, HlmButton, HlmIcon, NgIconComponent, NavMenuDesktopComponent, NavMenuMobileComponent],
  providers: [provideIcons({ lucideMenu, lucideX, lucideSun, lucideMoon })],
  templateUrl: './barra-navegacion.component.html'})
export class BarraNavegacionComponent {
  private destroyRef = inject(DestroyRef);
  authStore = inject(AuthStore);
  router = inject(Router);

  menuAbierto = signal(false);
  isDarkMode = signal(false);

  navLinks = [
    { label: 'Inicio', to: '/', exact: true, auth: false, admin: false },
    { label: 'Usuario', to: '/user', exact: false, auth: true, admin: false },
    { label: 'Admin', to: '/admin', exact: false, auth: false, admin: true },
  ];

  filteredLinks = computed(() => {
    return this.navLinks.filter(link => {
      if (link.admin && !this.authStore.isAdmin()) return false;
      if (link.auth && !this.authStore.isAuthenticated()) return false;
      return true;
    });
  });

  constructor() {
    this.checkTheme();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.menuAbierto.set(false);
    });
  }

  toggleMenu() {
    this.menuAbierto.set(!this.menuAbierto());
  }

  handleLogout() {
    this.authStore.logout();
    this.router.navigate(['/']);
  }

  checkTheme() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const isDark = localStorage.getItem('theme') === 'dark' || 
                     (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
        this.isDarkMode.set(true);
      } else {
        document.documentElement.classList.remove('dark');
        this.isDarkMode.set(false);
      }
    }
  }

  toggleTheme() {
    const isDark = !this.isDarkMode();
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
    this.isDarkMode.set(isDark);
  }
}
