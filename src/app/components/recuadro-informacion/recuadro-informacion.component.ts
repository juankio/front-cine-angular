import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recuadro-informacion',
  standalone: true,
  templateUrl: './recuadro-informacion.component.html'})
export class RecuadroInformacionComponent {
  @Input() label: string = '';
  @Input() valor: string | number = '';
}