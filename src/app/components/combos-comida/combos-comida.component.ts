import { Component, Input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';

@Component({
  selector: 'app-combos-comida',
  standalone: true,
  imports: [HlmCardImports, HlmButton, HlmBadge],
  template: `
    <hlm-card class="cursor-pointer transition-transform duration-300 hover:scale-105 hover:border hover:border-gray-700 shadow-sm flex flex-col h-full bg-white/30 dark:bg-gray-800/30">
      <hlm-card-header>
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center gap-2">
            <span class="text-blue-600 dark:text-blue-400 text-xs font-medium">🌶️ RECOMENDADO</span>
          </div>
          <span class="text-muted-foreground text-sm">Desde</span>
        </div>
        <h3 hlmCardTitle class="text-xl mb-1">{{nomProducto}}</h3>
        <p hlmCardDescription class="text-blue-600 dark:text-blue-400 text-xl font-bold">
          $ {{precioProducto}}
        </p>
      </hlm-card-header>

      <div hlmCardContent class="flex-grow">
        <p class="text-muted-foreground mb-4">{{infoProducto}}</p>
        <div class="flex gap-2 flex-wrap items-center">
          <hlm-badge variant="default">Combo</hlm-badge>
          <hlm-badge variant="secondary"># NUEVO</hlm-badge>
        </div>
      </div>

      <div hlmCardFooter class="flex justify-between items-center border-t border-border pt-4 mt-auto">
        <span class="text-muted-foreground text-sm">Listo en minutos</span>
        <button hlmBtn variant="default" size="sm">Ver →</button>
      </div>
    </hlm-card>
  `
})
export class CombosComidaComponent {
  @Input() nomProducto: string = '';
  @Input() precioProducto: string = '';
  @Input() infoProducto: string = '';
}