const fs = require('fs');
const path = require('path');

const files = [
  'menu-form/menu-form.component.ts',
  'pelicula-form/pelicula-form.component.ts',
  'ingrediente-form/ingrediente-form.component.ts',
  'receta-form/receta-form.component.ts',
  'funcion-form/funcion-form.component.ts',
  'sala-form/sala-form.component.ts'
];

const basePath = '/home/juankio/Documentos/programacion/front-cine-angular/src/app/components';

for (const file of files) {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Perform replacements
  // Backgrounds for modal containers and backdrops
  content = content.replace(/bg-black\/80/g, 'bg-background/80');
  content = content.replace(/bg-black\/90/g, 'bg-card');
  content = content.replace(/bg-black\/50/g, 'bg-background/80');
  
  // Specific backgrounds for inputs and other containers
  // Look for `bg-black` that is part of input/select/textarea classes
  content = content.replace(/bg-black(?=[\s'"])/g, 'bg-background');

  // General texts
  // Only text-white that are not inside primary buttons or similar might need changing to text-foreground.
  // Actually, wait, let's just replace all `text-white` to `text-foreground`, and we can fix primary buttons later.
  content = content.replace(/text-white/g, 'text-foreground');
  
  // Muted foregrounds
  content = content.replace(/text-neutral-400/g, 'text-muted-foreground');
  content = content.replace(/text-neutral-500/g, 'text-muted-foreground');
  content = content.replace(/text-neutral-600/g, 'text-muted-foreground');
  content = content.replace(/text-neutral-300/g, 'text-muted-foreground');
  
  // Borders
  content = content.replace(/border-white\/10/g, 'border-border');
  content = content.replace(/border-white\/20/g, 'border-border');
  content = content.replace(/border-neutral-800/g, 'border-border');
  
  // Hover backgrounds
  content = content.replace(/hover:bg-white\/5/g, 'hover:bg-secondary');
  content = content.replace(/hover:bg-white\/10/g, 'hover:bg-accent');
  content = content.replace(/bg-white\/5/g, 'bg-secondary');
  content = content.replace(/bg-white\/10/g, 'bg-muted');

  content = content.replace(/bg-neutral-900/g, 'bg-card');
  content = content.replace(/bg-neutral-800/g, 'bg-muted');

  // Focus rings and borders
  content = content.replace(/focus:border-red-500/g, 'focus:border-primary');
  content = content.replace(/focus:ring-red-500/g, 'focus:ring-primary');

  // Button red replacements to primary
  content = content.replace(/bg-red-600/g, 'bg-primary');
  content = content.replace(/hover:bg-red-700/g, 'hover:bg-primary/90');
  content = content.replace(/shadow-red-600\/40/g, 'shadow-primary/40');
  content = content.replace(/shadow-red-600\/60/g, 'shadow-primary/60');
  content = content.replace(/text-red-500/g, 'text-primary');
  
  // Wait, if I changed all `text-white` to `text-foreground`, primary buttons now have `text-foreground` which might look bad if primary is dark or light depending on theme, but usually `text-primary-foreground` is best. Let's fix primary buttons text.
  content = content.replace(/bg-primary text-foreground/g, 'bg-primary text-primary-foreground');

  // Input background fixing (the prompt said bg-background or bg-input). Since I replaced `bg-black` with `bg-background` it will be `bg-background`, which is fine.

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${file}`);
}
