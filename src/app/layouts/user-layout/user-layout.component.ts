import { Component } from '@angular/core';
import { BarraNavegacionComponent } from '../../components/barra-navegacion/barra-navegacion.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [BarraNavegacionComponent],
  templateUrl: './user-layout.component.html'})
export class UserLayoutComponent {}