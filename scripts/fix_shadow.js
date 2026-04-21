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
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix hover:shadow-primary/60 missing hover:
  content = content.replace(/hover:shadow-xl shadow-primary\/60/g, 'hover:shadow-xl hover:shadow-primary/60');
  
  // Actually, I did `content = content.replace(/shadow-red-600\/60/g, 'shadow-primary/60');` 
  // It replaced just the string. If it was `hover:shadow-red-600/60` it became `hover:shadow-primary/60`.
  // Wait, if it became `hover:shadow-primary/60`, then `hover:shadow-xl shadow-primary/60` means it was originally `hover:shadow-xl shadow-red-600/60` without hover on the color shadow?
  // Let me check that. If it's already fine, this replace will do nothing or fix it if I messed up.

  fs.writeFileSync(filePath, content, 'utf8');
}
