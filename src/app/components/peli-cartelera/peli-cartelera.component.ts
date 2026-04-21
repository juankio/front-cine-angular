import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadge } from '@spartan-ng/helm/badge';

@Component({
  selector: 'app-peli-cartelera',
  standalone: true,
  imports: [CommonModule, RouterLink, HlmCardImports, HlmBadge],
  templateUrl: './peli-cartelera.component.html'})
export class PeliCarteleraComponent {
  @Input() peliIdc: string = '';
  @Input() urlImgc: string = '';
  @Input() peliTituloc: string = '';
  @Input() peliDurationc: string = '';

  hasError = signal(false);
}