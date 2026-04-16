import { Component } from '@angular/core';
import { BarraNavegacionComponent } from '../../components/barra-navegacion/barra-navegacion.component';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [BarraNavegacionComponent],
  template: `
    <app-barra-navegacion />
    <main>
      <ng-content></ng-content>
    </main>
  `
})
export class DefaultLayoutComponent {}