import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadge } from '@spartan-ng/helm/badge';

@Component({
  selector: 'app-peli-cartelera',
  standalone: true,
  imports: [CommonModule, HlmCardImports, HlmBadge],
  template: `
    <hlm-card class="group cursor-pointer rounded-none border-border bg-card shadow-md aspect-[2/3] relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <!-- Imagen de Fondo (Poster) -->
      @if (urlImgc && !hasError()) {
        <img 
          [src]="urlImgc" 
          [alt]="peliTituloc" 
          (error)="hasError.set(true)"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      } @else {
        <!-- Placeholder Fallback Profesional -->
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground transition-transform duration-700 group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mb-4 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
          <span class="font-display tracking-widest text-xl opacity-70">Cine POOR</span>
        </div>
      }

      <!-- Overlay Gradiente -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"></div>

      <!-- Contenido de la Tarjeta (Texto Superpuesto) -->
      <div class="absolute inset-0 p-5 md:p-6 flex flex-col justify-end text-white z-10 pointer-events-none">
        
        <!-- Accion Oculta en Hover -->
        <div class="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 mb-4 w-full flex justify-center pointer-events-auto">
          <button class="w-full font-display tracking-widest text-xl bg-primary hover:bg-primary/90 text-primary-foreground py-3 transition-colors shadow-lg">
            Ver Funciones
          </button>
        </div>

        <!-- Info Pelicula -->
        <div class="flex items-center gap-2 mb-2">
          <hlm-badge variant="outline" class="font-body text-xs font-semibold bg-black/50 text-white border-white/30 backdrop-blur-md px-2 py-0.5">
            {{ peliDurationc }} MIN
          </hlm-badge>
        </div>
        
        <h3 class="font-display text-4xl md:text-5xl leading-none drop-shadow-md line-clamp-2">
          {{ peliTituloc }}
        </h3>
      </div>
    </hlm-card>
  `
})
export class PeliCarteleraComponent {
  @Input() urlImgc: string = '';
  @Input() peliTituloc: string = '';
  @Input() peliDurationc: string = '';

  hasError = signal(false);
}