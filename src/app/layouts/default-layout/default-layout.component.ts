import { Component } from '@angular/core';
import { BarraNavegacionComponent } from '../../components/barra-navegacion/barra-navegacion.component';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [BarraNavegacionComponent],
  templateUrl: './default-layout.component.html'})
export class DefaultLayoutComponent {}