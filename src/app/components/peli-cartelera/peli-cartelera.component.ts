import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-peli-cartelera',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './peli-cartelera.component.html'})
export class PeliCarteleraComponent {
  @Input() peliIdc: string = '';
  @Input() urlImgc: string = '';
  @Input() peliTituloc: string = '';
  @Input() peliDurationc: string = '';

  hasError = signal(false);
}