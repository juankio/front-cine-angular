import { Component } from '@angular/core';
import { BarraNavegacionComponent } from '../../components/barra-navegacion/barra-navegacion.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [BarraNavegacionComponent],
  template: `
    <app-barra-navegacion />
    <main class="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950">
      <ng-content></ng-content>
    </main>
  `
})
export class UserLayoutComponent {}