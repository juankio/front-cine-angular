import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStore } from '../../state/auth.store';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX } from '@ng-icons/lucide';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-barra-navegacion',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LoginModalComponent, HlmButton, HlmIcon, NgIconComponent],
  providers: [provideIcons({ lucideMenu, lucideX })],
  template: `
    <nav class="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div class="font-bold text-xl">Cine POOR</div>

        <ul class="hidden items-center gap-4 md:flex">
          @for (link of filteredLinks(); track link.to) {
            <li>
              <a
                hlmBtn
                variant="ghost"
                [routerLink]="link.to"
                routerLinkActive="bg-neutral-100 dark:bg-neutral-800 font-medium"
                [routerLinkActiveOptions]="{exact: link.exact}"
                class="px-4 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-300"
              >
                {{ link.label }}
              </a>
            </li>
          }
        </ul>

        <div class="flex items-center gap-2">
          <button
            hlmBtn
            variant="ghost"
            size="icon"
            class="md:hidden text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
            @if (authStore.isAuthenticated()) {
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ authStore.user()?.email || 'Usuario' }}</span>
              <button hlmBtn variant="destructive" size="sm" (click)="handleLogout()">Salir</button>
            } @else {
              <app-login-modal />
            }
          </div>
        </div>
      </div>

      @if (menuAbierto()) {
        <div class="flex flex-col gap-2 border-t border-gray-200 py-4 dark:border-gray-800 md:hidden px-4">
          @for (link of filteredLinks(); track link.to) {
            <a
              hlmBtn
              variant="ghost"
              [routerLink]="link.to"
              routerLinkActive="bg-neutral-100 dark:bg-neutral-800 font-medium"
              [routerLinkActiveOptions]="{exact: link.exact}"
              class="w-full justify-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300"
              (click)="menuAbierto.set(false)"
            >
              {{ link.label }}
            </a>
          }

          <div class="flex flex-col items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
            @if (authStore.isAuthenticated()) {
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ authStore.user()?.email || 'Usuario' }}</span>
              <button hlmBtn variant="destructive" class="w-full" (click)="handleLogout()">Salir</button>
            } @else {
              <app-login-modal />
            }
          </div>
        </div>
      }
    </nav>
  `
})
export class BarraNavegacionComponent {
  authStore = inject(AuthStore);
  router = inject(Router);

  menuAbierto = signal(false);

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
}
