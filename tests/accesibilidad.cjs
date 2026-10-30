// Auditoría de accesibilidad con axe-core (reglas WCAG 2 A/AA) en todas las pantallas, claro y oscuro, escritorio y móvil.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const URL = 'file://' + path.resolve(__dirname, '..', 'www', 'index.html');
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const VIEWS = ['inicio', 'farmacos', 'altas', 'cri', 'rcp', 'fluidos', 'transf', 'nutri', 'tox', 'ref', 'hoja', 'info', 'login'];
let fails = 0;

(async () => {
  const b = await chromium.launch();
  for (const [dev, vp, mob] of [['escritorio', { width: 1280, height: 800 }, false], ['móvil', { width: 390, height: 844 }, true]]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage();
    await p.goto(URL); await p.click('[data-act=ackOk]');
    for (const theme of ['light', 'dark']) {
      await p.evaluate((t) => setTheme(t), theme);
      for (const v of VIEWS) {
        await p.goto(URL + '#' + v); await p.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
        await p.addScriptTag({ content: AXE });
        const r = await p.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
        const graves = r.violations.filter((x) => ['serious', 'critical'].includes(x.impact));
        const tag = `${dev} · ${theme} · #${v}`;
        if (graves.length) {
          fails++;
          console.log('FALLA ' + tag);
          for (const g of graves) console.log(`   [${g.impact}] ${g.id}: ${g.help} (${g.nodes.length}) ej.: ${g.nodes[0].target.join(' ')}`);
        } else console.log('OK   ' + tag + (r.violations.length ? ` (${r.violations.length} menores)` : ''));
      }
    }
    await ctx.close();
  }
  await b.close();
  console.log(fails ? `\n${fails} pantalla(s) con problemas graves` : '\nSin problemas graves de accesibilidad');
  process.exit(fails ? 1 : 0);
})();
