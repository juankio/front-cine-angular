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
  templateUrl: './nav-menu-mobile.component.html'})
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
