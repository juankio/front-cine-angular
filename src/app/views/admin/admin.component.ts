import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout.component';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, AdminLayoutComponent, HlmCardImports],
  template: `
    <app-admin-layout>
      @if (isDashboard) {
        <div class="p-6">
          <h1 class="text-2xl font-bold mb-6 text-foreground">Dashboard</h1>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <hlm-card class="bg-card">
              <div hlmCardHeader>
                <h3 hlmCardTitle>Películas</h3>
                <p hlmCardDescription>Total en cartelera</p>
              </div>
              <p hlmCardContent class="text-4xl font-bold text-foreground">12</p>
            </hlm-card>
            
            <hlm-card class="bg-card">
              <div hlmCardHeader>
                <h3 hlmCardTitle>Menús</h3>
                <p hlmCardDescription>Combos activos</p>
              </div>
              <p hlmCardContent class="text-4xl font-bold text-foreground">8</p>
            </hlm-card>

            <hlm-card class="bg-card">
              <div hlmCardHeader>
                <h3 hlmCardTitle>Ingredientes</h3>
                <p hlmCardDescription>Stock general</p>
              </div>
              <p hlmCardContent class="text-4xl font-bold text-foreground">45</p>
            </hlm-card>
          </div>
        </div>
      }
      <router-outlet></router-outlet>
    </app-admin-layout>
  `
})
export class AdminComponent {
  private router = inject(Router);
  
  get isDashboard() {
    return this.router.url === '/admin';
  }
}