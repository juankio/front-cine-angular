const { spawn } = require('child_process');
const child = spawn('npx', ['ng', 'g', '@spartan-ng/cli:ui', 'button'], { stdio: ['pipe', 'inherit', 'inherit'] });
setTimeout(() => { child.stdin.write('\r'); }, 2000);
setTimeout(() => { child.stdin.write('\r'); }, 4000);
