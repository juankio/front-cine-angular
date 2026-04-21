const fs = require('fs');
const path = require('path');
require('dotenv').config();

// En Vercel, process.env.API_URL vendrá del dashboard
// En local, vendrá del archivo .env
const apiUrl = process.env.API_URL || 'http://localhost:3000/api';
const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

const targetPath = path.join(__dirname, '../src/environments/environment.ts');

const envConfigFile = `// ARCHIVO AUTOGENERADO POR scripts/set-env.js
export const environment = {
  production: ${isProd ? 'true' : 'false'},
  apiUrl: '${apiUrl}'
};
`;

fs.writeFileSync(targetPath, envConfigFile, { encoding: 'utf8' });
console.log(`[Nami] 🍊 Archivo environment.ts generado con la API: ${apiUrl}`);
