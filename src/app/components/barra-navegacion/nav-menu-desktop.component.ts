import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-nav-menu-desktop',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HlmButton],
  templateUrl: './nav-menu-desktop.component.html'})
export class NavMenuDesktopComponent {
  filteredLinks = input.required<{ label: string; to: string; fragment?: string; exact: boolean; auth: boolean; admin: boolean }[]>();
}
