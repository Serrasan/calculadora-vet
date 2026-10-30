// Pruebas de cálculo: cada valor esperado se obtiene aquí con la fórmula clínica, sin usar el código de la app.
// Si una modificación cambia un resultado, esta prueba falla antes de que llegue a un paciente.
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(__dirname, '..', 'www', 'index.html');
let fails = 0;
const ok = (c, m) => { console.log((c ? 'OK   ' : 'FALLA') + ' ' + m); if (!c) fails++; };
const n0 = (x) => String(Math.round(x));                       // 451
const nd = (x, d) => x.toFixed(d).replace('.', ',');           // 35,5

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(URL); await p.evaluate(() => localStorage.clear()); await p.goto(URL);
  await p.click('[data-act=ackOk]');

  const vista = async (v, sp, kg) => {
    await p.evaluate(([sp, kg]) => { S.p.sp = sp; S.p.kg = kg; S.p.unit = 'kg'; setWeightField(); }, [sp, kg]);
    await p.evaluate((v) => go(v), v);
    return p.locator('#view').innerText();
  };
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // los saltos de línea del texto esperado equivalen a espacios (o nada) entre elementos en pantalla
  const tiene = (txt, s, m) => ok(new RegExp(s.split('\n').map(esc).join('\\s*')).test(txt), `${m} (esperado «${s.replace('\n', ' ')}»)`);

  // Perro de 12 kg
  const kg = 12, w75 = Math.pow(kg, 0.75);
  let t = await vista('inicio', 'd', kg);
  tiene(t, n0(70 * w75) + '\nkcal/día', 'perro 12 kg · energía en reposo = 70 × kg^0,75');
  tiene(t, n0(132 * w75) + ' mL/día', 'perro 12 kg · fluidos de mantenimiento = 132 × kg^0,75');
  tiene(t, nd(132 * w75 / 24, 1), 'perro 12 kg · mantenimiento por hora');
  tiene(t, n0(90 * kg) + '\nmL', 'perro 12 kg · volemia = 90 mL/kg');
  tiene(t, nd(0.01 * kg, 2), 'perro 12 kg · adrenalina RCP = 0,01 mg/kg a 1 mg/mL');

  t = await vista('rcp', 'd', kg);
  tiene(t, `${n0(2 * kg)}–${n0(4 * kg)}`, 'perro 12 kg · desfibrilación externa bifásica 2–4 J/kg');
  tiene(t, nd(0.01 * kg, 2) + ' mL', 'perro 12 kg · adrenalina dosis baja en mL');
  tiene(t, nd(0.1 * kg, 1) + ' mL', 'perro 12 kg · adrenalina dosis alta en mL');

  t = await vista('farmacos', 'd', kg);
  tiene(t, nd(0.2 * kg, 1), 'perro 12 kg · meloxicam 0,2 mg/kg → dosis total en mg');
  tiene(t, nd(0.2 * kg / 5, 2) + ' mL', 'perro 12 kg · meloxicam inyectable 5 mg/mL → volumen');

  t = await vista('fluidos', 'd', kg);
  tiene(t, n0(132 * w75) + ' mL/día', 'perro 12 kg · fluidoterapia: mantenimiento');
  tiene(t, n0(0.05 * kg * 1000) + ' mL', 'perro 12 kg · déficit al 5 % = 5 % × kg × 1000');
  tiene(t, n0(132 * w75 + 0.05 * kg * 1000) + ' mL', 'perro 12 kg · total de las primeras 24 h');

  t = await vista('transf', 'd', kg);
  tiene(t, n0(kg * 90 * (25 - 15) / 40) + '\nmL', 'perro 12 kg · volumen a transfundir = kg × volemia × (Hto deseado − receptor) / donante');

  t = await vista('nutri', 'd', kg);
  tiene(t, n0(70 * w75 * 1.6), 'perro 12 kg · MER adulto castrado = RER × 1,6');
  tiene(t, n0(70 * w75 * 1.6 / 370 * 100), 'perro 12 kg · ración diaria a 370 kcal/100 g');

  t = await vista('cri', 'd', kg);
  tiene(t, n0(5 * kg) + '\nµg/h', 'perro 12 kg · fentanilo 5 µg/kg/h → µg por hora');

  t = await vista('tox', 'd', kg);
  tiene(t, nd(100 * 8 / kg, 1), 'perro 12 kg · chocolate negro 100 g × 8 mg/g ÷ kg → metilxantinas mg/kg');

  t = await vista('ref', 'd', kg);
  tiene(t, nd(0.101 * Math.pow(kg, 2 / 3), 3), 'perro 12 kg · superficie corporal = 0,101 × kg^(2/3)');
  tiene(t, nd(10 * 2.20462, 2), 'conversión 10 kg → lb');

  // Gato de 4 kg: otras constantes
  const c = 4, c75 = Math.pow(c, 0.75);
  t = await vista('inicio', 'c', c);
  tiene(t, n0(70 * c75) + '\nkcal/día', 'gato 4 kg · energía en reposo');
  tiene(t, n0(80 * c75) + ' mL/día', 'gato 4 kg · mantenimiento = 80 × kg^0,75');
  tiene(t, n0(60 * c), 'gato 4 kg · volemia = 60 mL/kg');
  tiene(t, nd(0.01 * c, 2), 'gato 4 kg · adrenalina RCP = 0,01 mg/kg (RECOVER: misma dosis que en el perro)');

  // Peso en gramos: 800 g = 0,8 kg
  await p.evaluate(() => { S.p.sp = 'c'; S.p.unit = 'g'; S.p.kg = 0.8; setWeightField(); });
  ok((await p.inputValue('#weight')) === '800', 'peso en gramos: 0,8 kg se muestra como 800 g');

  // Peso 0: la app avisa y no inventa resultados
  await p.evaluate(() => { S.p.sp = 'd'; S.p.unit = 'kg'; S.p.kg = 0; setWeightField(); renderPatientBar(); });
  ok(/peso/i.test(await p.locator('#wHint').innerText()), 'peso 0: la app pide introducir el peso');

  ok(errs.length === 0, 'sin errores de JavaScript durante los cálculos (' + errs.slice(0, 2).join(' | ') + ')');
  await b.close();
  console.log(fails ? `\n${fails} fallo(s)` : '\nTodos los cálculos coinciden');
  process.exit(fails ? 1 : 0);
})();
