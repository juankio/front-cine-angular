import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recuadro-informacion',
  standalone: true,
  template: `
    <div class="bg-card border border-border rounded-xl p-6 shadow-sm w-full md:w-64 flex flex-col justify-center items-center text-center transition-all hover:shadow-md hover:border-primary/50">
      <h3 class="text-muted-foreground text-sm font-medium mb-2 uppercase tracking-wide">{{ label }}</h3>
      <p class="text-3xl font-bold text-primary">{{ valor }}</p>
    </div>
  `
})
export class RecuadroInformacionComponent {
  @Input() label: string = '';
  @Input() valor: string | number = '';
}