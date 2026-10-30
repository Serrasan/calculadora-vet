// Ensambla index.html a partir de src/ y lo copia, con sus recursos, a www/ (lo que empaqueta Capacitor).
//   node scripts/build-web.mjs           genera index.html y www/
//   node scripts/build-web.mjs --check   falla si index.html no coincide con src/ (alguien lo editó a mano)
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const read = (p) => readFileSync(p, 'utf8');
const order = JSON.parse(read('src/order.json'));
const css = order.css.map((f) => read(`src/${f}`)).join('');
const js = order.js.map((f) => read(`src/${f}`)).join('');
// Falla pronto, con archivo y línea, si el JavaScript ensamblado tiene un error de sintaxis.
try { new vm.Script(js, { filename: 'src/js/*' }); } catch (e) { console.error('Error de sintaxis en src/js:', e.message); process.exit(1); }

const out = read('src/index.html')
  .replace('<!-- @css -->\n', () => `<style>\n${css}</style>\n`)
  .replace('<!-- @js -->\n', () => `<script>\n${js}</script>\n`);

if (process.argv.includes('--check')) {
  if (read('index.html') !== out) {
    console.error('index.html no coincide con src/. Edita los archivos de src/ y ejecuta «npm run build».');
    process.exit(1);
  }
  console.log('index.html coincide con src/');
  process.exit(0);
}

writeFileSync('index.html', out);
rmSync('www', { recursive: true, force: true });
mkdirSync('www', { recursive: true });
cpSync('index.html', 'www/index.html');
for (const dir of ['assets', 'legal']) {
  try { cpSync(dir, `www/${dir}`, { recursive: true }); } catch { /* opcional */ }
}
console.log('index.html y www/ listos');
