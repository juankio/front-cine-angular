import { Component, Input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmBadge } from '@spartan-ng/helm/badge';

@Component({
  selector: 'app-combos-comida',
  standalone: true,
  imports: [HlmCardImports, HlmButton, HlmBadge],
  template: `
    <hlm-card class="group cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/50 flex flex-col h-full overflow-hidden bg-background">
      <div class="h-40 w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
        <!-- Imagen placeholder moderna -->
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-300 dark:text-slate-600 transition-transform duration-500 group-hover:scale-110"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" x2="6" y1="1" y2="3"/><line x1="10" x2="10" y1="1" y2="3"/><line x1="14" x2="14" y1="1" y2="3"/></svg>
      </div>
      <hlm-card-header class="pt-4">
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center gap-2">
            <hlm-badge variant="destructive" class="text-[10px] uppercase tracking-wider font-bold">Recomendado</hlm-badge>
          </div>
          <span class="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Desde</span>
        </div>
        <h3 hlmCardTitle class="text-xl leading-tight">{{nomProducto}}</h3>
        <p hlmCardDescription class="text-primary text-2xl font-black mt-1">
          $ {{precioProducto}}
        </p>
      </hlm-card-header>

      <div hlmCardContent class="flex-grow">
        <p class="text-muted-foreground text-sm line-clamp-2">{{infoProducto}}</p>
      </div>

      <div hlmCardFooter class="flex justify-between items-center border-t border-border/50 pt-4 mt-auto bg-muted/20">
        <span class="text-muted-foreground text-xs font-medium flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Listo en min
        </span>
        <button hlmBtn variant="secondary" size="sm" class="rounded-full px-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Ver detalles
        </button>
      </div>
    </hlm-card>
  `
})
export class CombosComidaComponent {
  @Input() nomProducto: string = '';
  @Input() precioProducto: string = '';
  @Input() infoProducto: string = '';
}