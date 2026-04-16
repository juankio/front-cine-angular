import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recuadro-informacion',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm w-full md:w-64 flex flex-col justify-center items-center text-center">
      <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">{{ label }}</h3>
      <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ valor }}</p>
    </div>
  `
})
export class RecuadroInformacionComponent {
  @Input() label: string = '';
  @Input() valor: string | number = '';
}