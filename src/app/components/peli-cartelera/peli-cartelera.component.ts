import { Component, Input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadge } from '@spartan-ng/helm/badge';

@Component({
  selector: 'app-peli-cartelera',
  standalone: true,
  imports: [HlmCardImports, HlmBadge],
  template: `
    <hlm-card class="cursor-pointer transition-transform duration-300 hover:scale-105 hover:border hover:border-gray-700 shadow-sm h-full flex flex-col group/card-peli">
      <div class="relative w-full pb-[130%]">
        <img [src]="urlImgc" [alt]="peliTituloc" class="absolute inset-0 w-full h-full object-cover" />
      </div>
      <hlm-card-header class="flex-grow pt-4">
        <h3 hlmCardTitle class="line-clamp-2" title="{{ peliTituloc }}">{{ peliTituloc }}</h3>
        <p hlmCardDescription class="mt-2 flex items-center justify-between">
          <span>{{ peliDurationc }} min</span>
          <hlm-badge variant="outline" class="group-hover/card-peli:bg-primary group-hover/card-peli:text-primary-foreground transition-colors">
            Cartelera
          </hlm-badge>
        </p>
      </hlm-card-header>
    </hlm-card>
  `
})
export class PeliCarteleraComponent {
  @Input() urlImgc: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Spider-Man.jpg/1280px-Spider-Man.jpg';
  @Input() peliTituloc: string = '';
  @Input() peliDurationc: string = '';
}