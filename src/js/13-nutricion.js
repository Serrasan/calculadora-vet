/* =================== NUTRICIÓN =================== */
const FAC={d:[['Adulto castrado',1.6],['Adulto entero',1.8],['Inactivo o tendencia a obesidad',1.4],['Pérdida de peso (sobre peso ideal)',1.0],['Cachorro < 4 meses',3.0],['Cachorro > 4 meses',2.0],['Gestación (últimas 3 semanas)',3.0],['Lactación',4.0],['Trabajo o deporte',2.5],['Hospitalizado (RER)',1.0]],
 c:[['Adulto castrado',1.2],['Adulto entero',1.4],['Tendencia a obesidad',1.0],['Pérdida de peso (sobre peso ideal)',0.8],['Gatito',2.5],['Gestación',1.6],['Lactación',3.0],['Hospitalizado (RER)',1.0]]};
function renderNutri(){
  const w=kg(),N=S.nut,sp=S.p.sp;
  if(sp==='r')return`<section class="panel pad stack"><div><div class="eyebrow">Nutrición</div><h2 class="t">Nutrición del conejo</h2><div class="sub">${patientLine()}</div></div>
    ${banner('info','Dieta de base','Heno ilimitado (80 % de la dieta), verdura de hoja 1 taza por cada 2 kg al día y pienso de heno comprimido como máximo 25 g/kg/día.')}
    <div class="grid2"><div class="kpi main"><span class="eyebrow">Alimentación asistida</span><span class="v">${fmt(50*w,0)}<small>mL/día</small></span><span class="s">≈ 50 mL/kg/día de papilla de recuperación</span></div>
    <div class="kpi"><span class="eyebrow">Por toma</span><span class="v">${fmt(50*w/5,0)}<small>mL</small></span><span class="s">repartido en 4–6 tomas</span></div></div>
    ${banner('warn','Anorexia','Más de 12–24 h sin comer es una urgencia (estasis gastrointestinal y lipidosis hepática). Iniciar alimentación asistida, analgesia y procinéticos tras descartar obstrucción.')}</section>`;
  const rer=70*Math.pow(w,0.75);
  const ideal=w/(1+0.1*(N.bcs-5));
  if(sp==='f')return`<section class="panel pad stack"><div><div class="eyebrow">Nutrición</div><h2 class="t">Nutrición del hurón</h2><div class="sub">${patientLine()}</div></div>
    <div class="grid2"><div class="kpi main"><span class="eyebrow">Energía en reposo</span><span class="v">${fmt(rer,0)}<small>kcal/día</small></span><span class="s">70 × kg^0,75</span></div>
    <div class="kpi"><span class="eyebrow">Hospitalizado</span><span class="v">${fmt(rer,0)}<small>kcal/día</small></span><span class="s">empezar con el 33 % y subir en 3 días</span></div></div>
    ${banner('info','Carnívoro estricto','Dieta alta en proteína animal (30–40 %) y grasa (15–30 %), baja en fibra. Tránsito intestinal de 3–4 h: comidas frecuentes.')}</section>`;
  const facs=FAC[sp];const fi=Math.min(N.fac,facs.length-1);const [fn,f]=facs[fi];
  const base=f<=1&&fi===3?ideal:w; const mer=70*Math.pow(base,0.75)*f; const grams=N.kcal>0?mer/N.kcal*100:0;
  return`<section class="panel pad stack">
    <div class="head"><div><div class="eyebrow">Nutrición</div><h2 class="t">Necesidades energéticas</h2><div class="sub">${patientLine()}</div></div>
      <button class="btn" data-act="addNut" ${w>0?'':'disabled'}>Añadir a la hoja</button></div>
    <div class="grid4">
      <div class="field"><label for="nFac">Estado</label><select id="nFac">${facs.map(([n,v],i)=>`<option value="${i}" ${i===fi?'selected':''}>${n} · ×${fmt(v,1)}</option>`).join('')}</select></div>
      <div class="field"><label for="nBcs">Condición corporal (1–9)</label><select id="nBcs">${[1,2,3,4,5,6,7,8,9].map(v=>`<option value="${v}" ${N.bcs==v?'selected':''}>${v}/9${v===5?' · ideal':v<5?' · delgado':' · sobrepeso'}</option>`).join('')}</select></div>
      <div class="field"><label for="nKcal">Densidad del alimento (kcal/100 g)</label><input id="nKcal" type="text" inputmode="decimal" value="${N.kcal}"></div>
      <div class="field"><label for="nMeals">Tomas al día</label><select id="nMeals">${[1,2,3,4,6].map(v=>`<option value="${v}" ${N.meals==v?'selected':''}>${v}</option>`).join('')}</select></div>
    </div>
    <div class="grid4">
      <div class="kpi"><span class="eyebrow">RER</span><span class="v">${fmt(rer,0)}<small>kcal/día</small></span><span class="s">70 × kg^0,75</span></div>
      <div class="kpi main"><span class="eyebrow">MER</span><span class="v">${fmt(mer,0)}<small>kcal/día</small></span><span class="s">${esc(fn)} · ×${fmt(f,1)}${base!==w?' sobre peso ideal':''}</span></div>
      <div class="kpi"><span class="eyebrow">Ración diaria</span><span class="v">${fmt(grams,0)}<small>g/día</small></span><span class="s">${fmt(grams/N.meals,0)} g por toma</span></div>
      <div class="kpi"><span class="eyebrow">Peso ideal estimado</span><span class="v">${fmt(ideal,1)}<small>kg</small></span><span class="s">10 % por punto sobre 5/9</span></div>
    </div>
    <div class="tw"><table><thead><tr><th>Realimentación del paciente hospitalizado</th><th class="r">kcal/día</th><th class="r">g/día de este alimento</th></tr></thead><tbody>
      ${[['Día 1 · 33 % RER',1/3],['Día 2 · 66 % RER',2/3],['Día 3 · 100 % RER',1]].map(([n,p])=>`<tr><td>${n}</td><td class="amt r">${fmt(rer*p,0)}</td><td class="amt r">${N.kcal>0?fmt(rer*p/N.kcal*100,0):'—'}</td></tr>`).join('')}
    </tbody></table></div>
    ${banner('info','Referencias de densidad','Pienso seco: 340–420 kcal/100 g. Comida húmeda: 70–130 kcal/100 g. Dietas de recuperación: ≈ 100–130 kcal/100 g. Consulta la etiqueta del producto.')}
    ${sp==='c'?banner('warn','Gato en anorexia','Más de 3 días sin comer: riesgo de lipidosis hepática. Valorar sonda de esofagostomía.'):''}
  </section>`;
}

