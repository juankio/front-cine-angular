import { Component, input, output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthStore } from '../../state/auth.store';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon } from '@ng-icons/lucide';

@Component({
  selector: 'app-nav-menu-mobile',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LoginModalComponent, HlmButton, HlmIcon, NgIconComponent],
  providers: [provideIcons({ lucideSun, lucideMoon })],
  template: `
    <div class="flex flex-col gap-2 border-t border-border py-4 md:hidden px-4">
      @for (link of filteredLinks(); track link.to) {
          <a
            hlmBtn
            variant="ghost"
            [routerLink]="link.to"
            routerLinkActive="bg-accent text-accent-foreground font-semibold"
            [routerLinkActiveOptions]="{exact: link.exact}"
            class="w-full justify-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
            (click)="closeMenu.emit()"
          >
          {{ link.label }}
        </a>
      }

      <div class="flex flex-col items-center gap-2 pt-2 border-t border-border mt-2">
        <button hlmBtn variant="ghost" size="icon" (click)="toggleTheme.emit()" class="w-full flex justify-center mb-2">
          @if (isDarkMode()) {
            <ng-icon hlm name="lucideSun" size="sm"></ng-icon>
          } @else {
            <ng-icon hlm name="lucideMoon" size="sm"></ng-icon>
          }
        </button>
        @if (authStore.isAuthenticated()) {
          <span class="text-sm font-medium text-muted-foreground">{{ authStore.user()?.email || 'Usuario' }}</span>
          <button hlmBtn variant="destructive" class="w-full" (click)="handleLogout()">Salir</button>
        } @else {
          <app-login-modal />
        }
      </div>
    </div>
  `
})
export class NavMenuMobileComponent {
  authStore = inject(AuthStore);
  router = inject(Router);

  filteredLinks = input.required<{ label: string; to: string; exact: boolean; auth: boolean; admin: boolean }[]>();
  isDarkMode = input.required<boolean>();

  closeMenu = output<void>();
  toggleTheme = output<void>();

  handleLogout() {
    this.authStore.logout();
    this.router.navigate(['/']);
    this.closeMenu.emit();
  }
}
