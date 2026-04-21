const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') && !fullPath.endsWith('.spec.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Match template: `...`
      // We need to be careful with nested backticks if any, but regex can handle simple ones if we use a lazy match
      const templateRegex = /template\s*:\s*`([\s\S]*?)`\s*(,?)/;
      const match = content.match(templateRegex);
      
      if (match) {
        const htmlContent = match[1];
        const comma = match[2];
        const htmlFileName = file.replace('.ts', '.html');
        const htmlFullPath = path.join(dir, htmlFileName);
        
        fs.writeFileSync(htmlFullPath, htmlContent.trim() + '\n', 'utf8');
        
        // Replace with templateUrl
        content = content.replace(templateRegex, `templateUrl: './${htmlFileName}'${comma}`);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Extracted template from ${file} to ${htmlFileName}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'app'));
console.log('Done!');
