const fs = require('fs');
const path = 'node_modules/@spartan-ng/cli/src/generators/theme/generator.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const response = await (0, enquirer_1.prompt)({",
  "const response = { app: projectNames[0] }; //"
);

content = content.replace(
  "const themeOptions = await (0, enquirer_1.prompt)([",
  "const themeOptions = { theme: 'zinc', stylesEntryPoint: 'src/styles.css', prefix: '' }; //"
);

fs.writeFileSync(path, content);
console.log('Fixed prompt in generator.js');
