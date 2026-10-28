// Copia la web (index.html y recursos) a www/, que es lo que empaqueta Capacitor.
import { cpSync, rmSync, mkdirSync } from 'node:fs';

rmSync('www', { recursive: true, force: true });
mkdirSync('www', { recursive: true });
cpSync('index.html', 'www/index.html');
for (const dir of ['assets', 'legal']) {
  try { cpSync(dir, `www/${dir}`, { recursive: true }); } catch { /* opcional */ }
}
console.log('www/ listo');
