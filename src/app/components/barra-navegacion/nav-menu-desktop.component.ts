import { Component, input, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-nav-menu-desktop',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-menu-desktop.component.html'})
export class NavMenuDesktopComponent {
  filteredLinks = input.required<{ label: string; to: string; fragment?: string; exact: boolean; auth: boolean; admin: boolean }[]>();
  
  private router = inject(Router);
  currentUrl = '/';

  constructor() {
    this.currentUrl = this.router.url;
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentUrl = e.urlAfterRedirects;
    });
  }

  isActive(link: any): boolean {
    if (link.to === '/' && link.fragment) {
      return this.currentUrl.includes('#' + link.fragment);
    }
    if (link.to === '/' && !link.fragment) {
      return this.currentUrl === '/' || this.currentUrl.startsWith('/?');
    }
    return this.currentUrl.startsWith(link.to);
  }
}
