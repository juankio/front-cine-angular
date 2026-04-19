import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-[320px] pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto overflow-hidden rounded-md border shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-8 fade-in duration-300 transform transition-all group"
             [ngClass]="{
               'bg-card border-destructive/50 shadow-lg shadow-destructive/20 text-foreground': toast.type === 'error',
               'bg-card border-green-500/50 shadow-lg shadow-green-500/20 text-foreground': toast.type === 'success',
               'bg-card border-yellow-500/50 shadow-lg shadow-yellow-500/20 text-foreground': toast.type === 'warning',
               'bg-card border-blue-500/50 shadow-lg shadow-blue-500/20 text-foreground': toast.type === 'info'
             }">
          <!-- Barrita superior de progreso visual (decorativa) -->
          <div class="absolute top-0 left-0 h-[2px] w-full bg-secondary/80 origin-left animate-progress" [ngStyle]="{'animation-duration': '4s', 'animation-fill-mode': 'forwards'}"></div>

          <div class="p-4 flex items-start gap-3 relative z-10">
            <!-- Iconos según tipo -->
            <div class="shrink-0 mt-0.5">
              @if (toast.type === 'success') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
              } @else if (toast.type === 'error') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-destructive"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              } @else if (toast.type === 'warning') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
              }
            </div>

            <!-- Contenido -->
            <div class="flex-1 min-w-0 pr-6">
              @if (toast.title) {
                <h4 class="font-display tracking-widest uppercase text-sm mb-0.5 opacity-90">{{ toast.title }}</h4>
              }
              <p class="text-sm font-body leading-tight text-neutral-300">{{ toast.message }}</p>
            </div>

            <!-- Boton Cerrar -->
            <button (click)="toastService.remove(toast.id)" class="absolute top-4 right-4 text-foreground/50 hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes progress {
      0% { transform: scaleX(1); }
      100% { transform: scaleX(0); }
    }
    .animate-progress {
      animation-name: progress;
      animation-timing-function: linear;
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
