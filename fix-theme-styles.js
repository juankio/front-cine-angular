const fs = require('fs');
let css = fs.readFileSync('src/styles.css', 'utf-8');

// We only want to replace lines that start with --
let lines = css.split('\n');
let fixedLines = lines.map(line => {
  if (line.trim().startsWith('--') && !line.includes('--font-sans')) {
    // remove 'deg'
    line = line.replace(/deg/g, '');
    // replace commas with space
    line = line.replace(/,/g, ' ');
    // collapse multiple spaces
    line = line.replace(/\s+/g, ' ');
    // ensure there's a semicolon at the end
    if (!line.endsWith(';')) line += ';';
  }
  return line;
});

fs.writeFileSync('src/styles.css', fixedLines.join('\n'));
