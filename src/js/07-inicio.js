/* =================== INICIO =================== */
function renderInicio(){
  const h=new Date().getHours(); const g=h<6?'Buenas noches':h<14?'Buenos días':h<21?'Buenas tardes':'Buenas noches';
  const date=new Date().toLocaleDateString(LOC(),{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const w=kg(),sp=S.p.sp;
  const rer=70*Math.pow(w,0.75);
  const maint=sp==='d'?132*Math.pow(w,0.75):sp==='c'?80*Math.pow(w,0.75):sp==='r'?100*w:75*w;
  const bv=sp==='d'?90:sp==='c'?60:sp==='r'?60:null;
  return`
  <section class="hello"><div class="hello-main"><div><div class="eyebrow" data-notr>${date}</div><h2>${g}</h2><p>Introduce los datos del paciente una sola vez: todos los módulos calculan con la especie y el peso de la barra superior.</p></div></div>
    <button class="btn danger" data-nav="rcp">Abrir hoja de parada</button></section>
  <section class="panel pad stack">
    <div class="head"><div><h3 class="t">Ficha del paciente</h3><div class="sub">Se guarda en este dispositivo y aparece en la hoja de tratamiento.</div></div></div>
    <div class="grid4">
      <div class="field"><label for="pName2">Nombre</label><input id="pName2" type="text" value="${esc(S.p.name)}" placeholder="Ej.: Luna"></div>
      <div class="field"><label for="pHc">N.º de historia</label><input id="pHc" type="text" value="${esc(S.p.hc)}" placeholder="Ej.: 20417"></div>
      <div class="field"><label for="pBreed">Raza</label><input id="pBreed" type="text" value="${esc(S.p.breed)}" placeholder="Ej.: Border Collie"></div>
      <div class="field"><label for="pAge">Edad</label><input id="pAge" type="text" value="${esc(S.p.age)}" placeholder="Ej.: 7 años"></div>
    </div>
    ${S.p.sp==='d'&&/collie|pastor australiano|shetland|pastor ingl|bobtail|whippet|pastor alem|border/i.test(S.p.breed)?banner('warn','Posible raza con mutación MDR1 (ABCB1)','Precaución con ivermectina, loperamida, acepromacina, butorfanol y algunos citostáticos. Valorar el test genético.'):''}
    ${S.p.sp==='d'&&/bulldog|carlino|pug|bóxer|boxer|shih|pequin|bostón|boston|cavalier/i.test(S.p.breed)?banner('warn','Raza braquicéfala','Riesgo de obstrucción de vías altas: preoxigenar, intubación rápida, extubación tardía y vigilancia estrecha en la recuperación.'):''}
  </section>
  <section class="stack-s">
    <div class="eyebrow">Datos rápidos · ${spN()} de ${fmt(w,3)} kg</div>
    <div class="grid4">
      <div class="kpi main"><span class="eyebrow">Fluidos de mantenimiento</span><span class="v">${fmt(maint/24,1)}<small>mL/h</small></span><span class="s">${fmt(maint,0)} mL/día</span></div>
      <div class="kpi"><span class="eyebrow">Energía en reposo</span><span class="v">${isDC()||sp==='f'?fmt(rer,0):'—'}<small>${isDC()||sp==='f'?'kcal/día':''}</small></span><span class="s">${isDC()||sp==='f'?'RER = 70 × kg^0,75':'Conejo: heno a demanda'}</span></div>
      <div class="kpi"><span class="eyebrow">Volemia estimada</span><span class="v">${bv?fmt(bv*w,0):'—'}<small>${bv?'mL':''}</small></span><span class="s">${bv?bv+' mL/kg':'Sin referencia fiable'}</span></div>
      <div class="kpi"><span class="eyebrow">Adrenalina RCP</span><span class="v">${vol(0.01*w*(sp==='f'?2:1))}<small>mL</small></span><span class="s">${sp==='f'?'0,02':'0,01'} mg/kg · 1 mg/mL</span></div>
    </div>
  </section>
  <section class="stack-s">
    <div class="eyebrow">Módulos</div>
    <div class="tiles">${MODS.slice(1).map(([k,n,d])=>`<button class="tile ${k==='rcp'?'urg':''}" data-nav="${k}"><span class="ic">${ic(k)}</span><b>${n}</b><span>${d}</span></button>`).join('')}</div>
  </section>`;
}

