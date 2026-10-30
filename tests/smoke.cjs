// Pruebas de humo en un navegador real. Uso: npm run build && npm test
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '..', 'www', 'index.html');
const VIEWS = ['inicio', 'farmacos', 'altas', 'cri', 'rcp', 'fluidos', 'transf', 'nutri', 'tox', 'ref', 'hoja', 'info'];
let fails = 0;
const ok = (c, m) => { console.log((c ? 'OK   ' : 'FALLA') + ' ' + m); if (!c) fails++; };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const errs = [], ext = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('request', r => { if (!r.url().startsWith('file:')) ext.push(r.url()); });

  await p.goto(URL);
  ok(await p.locator('#ack').count() === 1, 'aviso clínico visible en el primer arranque');
  await p.click('[data-act=ackOk]');
  ok(await p.locator('#ack').count() === 0, 'aviso se cierra al aceptar');
  await p.reload();
  ok(await p.locator('#ack').count() === 0, 'aviso no vuelve a salir');

  for (const v of VIEWS) {
    await p.goto(URL + '#' + v);
    const n = await p.locator('#view').innerText();
    ok(n.trim().length > 20, 'vista #' + v + ' carga');
  }
  await p.goto(URL + '#ddx');
  ok(await p.locator('[data-nav=ddx]').count() === 0 && /Resumen|Paciente|Inicio/i.test(await p.locator('body').innerText()), '#ddx no accesible');

  for (const l of ['ca', 'en']) {
    await p.goto(URL + '#info');
    await p.click(`[data-lang=${l}]`);
    const t = await p.locator('#view').innerText();
    ok(!/Aviso clínico|Copia de seguridad|Tus datos/.test(t), 'vista info traducida a ' + l);
    await p.click('[data-lang=es]');
  }

  // copia de seguridad
  const r = await p.evaluate(() => {
    S.sheet.push({ time: '10:00', spn: 'Perro', n: 'X', pres: 'p', dose: '1', total: 't', amount: 'a', route: 'IV', freq: 'q8h', kg: 12 });
    const snap = { app: 'calculadora-vet', version: 1, data: JSON.parse(JSON.stringify(snapshot())) };
    const good = cleanBackup(snap), bad = cleanBackup({ app: 'otra', data: {} }), evil = cleanBackup({ app: 'calculadora-vet', data: { sheet: [{ n: { a: 1 } }], alta: [{ id: 'noexiste' }], p: { sp: 'zzz' } } });
    return { good: good && good.sheet.length, bad, evil: evil && [evil.sheet[0].n, evil.alta.length, evil.p] };
  });
  ok(r.good === 1 && r.bad === null, 'copia válida se acepta y la ajena se rechaza');
  ok(r.evil && r.evil[0] === '[object Object]' && r.evil[1] === 0 && r.evil[2] === undefined, 'copia manipulada se sanea');

  // compartir
  await p.goto(URL + '#hoja');
  await p.evaluate(() => { window.__shared = null; navigator.share = async d => { window.__shared = d.text; }; S.sheet = [{ time: '10:00', spn: 'Perro', n: 'Meloxicam', pres: 'p', dose: '1', total: 't', amount: 'a', route: 'IV', freq: 'q8h', kg: 12 }]; render(); });
  await p.click('[data-act=shareSheet]');
  ok(/Meloxicam/.test(await p.evaluate(() => window.__shared) || ''), 'compartir hoja usa el menú nativo');

  // botón atrás
  await p.goto(URL);
  await p.evaluate(() => go('farmacos')); await p.evaluate(() => go('rcp'));
  await p.goBack();
  ok(await p.evaluate(() => S.view) === 'farmacos', 'botón atrás vuelve a la vista anterior');

  // pantalla de acceso (vista previa)
  await p.goto(URL + '#login');
  ok(await p.locator('.auth-card').count() === 1 && !(await p.locator('.pbar').isVisible()), 'login: se ve y oculta la barra del paciente');
  await p.fill('#authEmail', 'prueba@ejemplo.com'); await p.fill('#authPass', 'secreto123');
  ok(await p.inputValue('#authEmail') === 'prueba@ejemplo.com', 'login: escribir no borra el campo');
  await p.click('[data-act=authShow]');
  ok(await p.getAttribute('#authPass', 'type') === 'text', 'login: mostrar contraseña');
  await p.click('[data-act=authMode][data-m=up]');
  ok(await p.locator('#authLic').count() === 1, 'login: modo crear cuenta pide colegiado');
  await p.click('.auth-card .btn:not(.ghost)');
  ok(/Vista previa/.test(await p.locator('#toast').innerText()), 'login: el botón avisa de que es vista previa');
  const stored = await p.evaluate(() => JSON.stringify(Object.assign({}, localStorage)));
  ok(!/secreto123|prueba@ejemplo/.test(stored), 'login: no guarda lo que se escribe');
  await p.click('[data-lang=en]');
  ok(/Create your account/.test(await p.locator('.auth-card h1').innerText()), 'login: traducido');
  await p.click('[data-lang=es]').catch(() => {});
  await p.evaluate(() => setLang('es'));
  await p.click('.auth-card .btn.ghost');
  ok(await p.evaluate(() => S.view) === 'inicio' && await p.locator('.pbar').isVisible(), 'login: "Continuar sin cuenta" entra en la app');

  // diseño: tipografía propia cargada y franja del paciente compacta en móvil, sin desbordes en ninguna pantalla
  await p.goto(URL); await p.evaluate(() => document.fonts.ready);
  ok(await p.evaluate(() => document.fonts.check('16px "IBM Plex Sans"')), 'diseño: IBM Plex Sans cargada desde el propio paquete');
  const dm = await b.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  const dq = await dm.newPage();
  await dq.goto(URL); await dq.click('[data-act=ackOk]');
  const ph = await dq.evaluate(() => document.querySelector('.pbar').getBoundingClientRect().height);
  ok(ph <= 125, 'diseño: franja del paciente compacta en móvil (' + Math.round(ph) + ' px)');
  for (const v of VIEWS) {
    await dq.goto(URL + '#' + v);
    const over = await dq.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    ok(over <= 1, 'diseño: #' + v + ' sin desborde horizontal a 360 px');
  }
  await dm.close();

  // móvil
  const m = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const q = await m.newPage();
  q.on('pageerror', e => errs.push(e.message));
  await q.goto(URL); await q.click('[data-act=ackOk]');
  ok(await q.locator('#tabbar').isVisible() && !(await q.locator('#side').isVisible()), 'móvil: barra inferior visible y menú lateral oculto');
  ok(await q.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'móvil: sin scroll horizontal');
  await q.click('#tabbar [data-act=more]');
  ok(await q.locator('#more').isVisible(), 'móvil: menú "Más" abre');
  await q.click('#more [data-nav=tox]');
  ok(await q.locator('#more').count() === 0 && await q.evaluate(() => S.view) === 'tox', 'móvil: elegir módulo cierra el menú y navega');
  const small = await q.evaluate(() => [...document.querySelectorAll('#tabbar button')].every(x => x.getBoundingClientRect().height >= 44));
  ok(small, 'móvil: botones de la barra ≥ 44 px');
  await q.goto(URL + '#login');
  ok(await q.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) && !(await q.locator('#tabbar').isVisible()), 'móvil: login sin scroll horizontal y sin barra inferior');

  ok(errs.length === 0, 'sin errores de consola (' + errs.slice(0, 3).join(' | ') + ')');
  ok(ext.length === 0, 'sin peticiones externas (' + ext.slice(0, 2).join(' | ') + ')');
  await b.close();
  console.log(fails ? `\n${fails} fallo(s)` : '\nTodo correcto');
  process.exit(fails ? 1 : 0);
})();
