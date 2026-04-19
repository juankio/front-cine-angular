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

  // Replace <option ...> with <option class="bg-background" ...> if it doesn't already have a bg-class
  // Actually, let's just strip any existing bg-* class on option and add bg-background
  content = content.replace(/<option([^>]*)>/g, (match, attrs) => {
    // Remove existing class="bg-..."
    let newAttrs = attrs.replace(/class=["']([^"']*)["']/, (m, p1) => {
      let classes = p1.split(/\s+/).filter(c => !c.startsWith('bg-'));
      classes.push('bg-background');
      return `class="${classes.join(' ')}"`;
    });
    
    // If there was no class attribute, add it
    if (!newAttrs.includes('class=')) {
      newAttrs += ' class="bg-background"';
    }
    
    return `<option${newAttrs}>`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated options in: ${file}`);
}
