import { Component, inject, computed, signal, effect } from '@angular/core';
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
  template: `
    <nav class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div class="font-display text-3xl tracking-widest uppercase text-primary drop-shadow-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
          Cine POOR
        </div>

        <app-nav-menu-desktop [filteredLinks]="filteredLinks()" />

        <div class="flex items-center gap-2">
            <button
              hlmBtn
              variant="ghost"
              size="icon"
              class="md:hidden text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              [attr.aria-expanded]="menuAbierto()"
            aria-label="Abrir menu de navegacion"
            (click)="toggleMenu()"
          >
            @if (menuAbierto()) {
              <ng-icon hlm name="lucideX" size="sm"></ng-icon>
            } @else {
              <ng-icon hlm name="lucideMenu" size="sm"></ng-icon>
            }
          </button>

          <div class="hidden md:flex items-center gap-2">
            <button hlmBtn variant="ghost" size="icon" (click)="toggleTheme()">
              @if (isDarkMode()) {
                <ng-icon hlm name="lucideSun" size="sm"></ng-icon>
              } @else {
                <ng-icon hlm name="lucideMoon" size="sm"></ng-icon>
              }
            </button>
            @if (authStore.isAuthenticated()) {
              <span class="text-sm font-medium text-muted-foreground mr-2">{{ authStore.user()?.email || 'Usuario' }}</span>
              <button hlmBtn variant="destructive" size="sm" (click)="handleLogout()">Salir</button>
            } @else {
              <app-login-modal />
            }
          </div>
        </div>
      </div>

      @if (menuAbierto()) {
        <app-nav-menu-mobile
          [filteredLinks]="filteredLinks()"
          [isDarkMode]="isDarkMode()"
          (closeMenu)="menuAbierto.set(false)"
          (toggleTheme)="toggleTheme()"
        />
      }
    </nav>
  `
})
export class BarraNavegacionComponent {
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
    ).subscribe(() => {
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
