/* =================== TRANSFUSIÓN =================== */
function renderTransf(){
  const w=kg(),sp=S.p.sp,T=S.tx;
  if(!isDC())return`<section class="panel pad stack"><div><div class="eyebrow">Transfusión</div><h2 class="t">Transfusión</h2><div class="sub">${patientLine()}</div></div>${banner('info',`Sin cálculo para ${spN().toLowerCase()}`,'En conejo y hurón, la transfusión se realiza con donante de la misma especie; volumen orientativo 10–20 mL/kg de sangre entera. Los hurones no tienen grupos sanguíneos detectables.')}</section>`;
  const bv=sp==='d'?90:60;
  const prods={se:['Sangre entera',40],ch:['Concentrado de hematíes',65],pfc:['Plasma fresco congelado',null]};
  const don=T.don!=null?T.don:prods[T.prod][1];const des=T.des!=null?T.des:(sp==='d'?25:20);
  let main='';
  if(T.prod==='pfc'){
    main=`<div class="grid3"><div class="kpi main"><span class="eyebrow">Volumen de plasma</span><span class="v">${fmt(10*w,0)}–${fmt(20*w,0)}<small>mL</small></span><span class="s">10–20 mL/kg</span></div>
      <div class="kpi"><span class="eyebrow">Velocidad máxima</span><span class="v">${fmt(4*w,0)}–${fmt(6*w,0)}<small>mL/h</small></span><span class="s">4–6 mL/kg/h</span></div>
      <div class="kpi"><span class="eyebrow">Indicación</span><span class="v" style="font-size:1.1rem">Coagulopatía</span><span class="s">reevaluar TP/TTPa tras la transfusión</span></div></div>`;
  }else{
    const v=Math.max(0,w*bv*(des-T.rec)/don);const rule=w*(sp==='d'?2:1)*(des-T.rec)*(T.prod==='ch'?0.6:1);
    const r1=0.25*w;const rest=Math.max(0,v-r1*0.5);const rate=rest/3.5;const maxR=10*w;
    main=`<div class="grid3"><div class="kpi main"><span class="eyebrow">Volumen a transfundir</span><span class="v">${fmt(v,0)}<small>mL</small></span><span class="s">${fmt(w,3)} kg × ${bv} × (${des} − ${T.rec}) / ${don}</span></div>
      <div class="kpi"><span class="eyebrow">Primeros 30 min</span><span class="v">${fmt(r1,1)}<small>mL/h</small></span><span class="s">0,25 mL/kg/h · vigilar reacciones</span></div>
      <div class="kpi"><span class="eyebrow">Resto (≈ 3,5 h)</span><span class="v">${fmt(Math.min(rate,maxR),1)}<small>mL/h</small></span><span class="s">máx. ${fmt(maxR,0)} mL/h · terminar en < 4 h</span></div></div>
      <div class="small">Regla rápida: ${sp==='d'?'2 mL/kg':'1 mL/kg'} de sangre entera sube el hematocrito ≈ 1 %. Estimación: ${fmt(rule,0)} mL. En cardiópatas limitar a 2–4 mL/kg/h (${fmt(2*w,0)}–${fmt(4*w,0)} mL/h).</div>`;
  }
  return`<section class="panel pad stack">
    <div class="head"><div><div class="eyebrow">Transfusión</div><h2 class="t">Cálculo de transfusión</h2><div class="sub">${patientLine()}</div></div>
      <button class="btn" data-act="addTx" ${w>0?'':'disabled'}>Añadir a la hoja</button></div>
    <div class="chips">${Object.entries(prods).map(([k,[n]])=>`<button data-prod="${k}" aria-pressed="${T.prod===k}">${n}</button>`).join('')}</div>
    ${T.prod!=='pfc'?`<div class="grid3">
      <div class="field"><label for="txRec">Hematocrito del receptor (%)</label><input id="txRec" type="text" inputmode="decimal" value="${T.rec}"></div>
      <div class="field"><label for="txDes">Hematocrito deseado (%)</label><input id="txDes" type="text" inputmode="decimal" value="${des}"></div>
      <div class="field"><label for="txDon">Hematocrito del donante / unidad (%)</label><input id="txDon" type="text" inputmode="decimal" value="${don}"></div></div>`:''}
    ${main}
  </section>
  <div class="grid2">
    <section class="panel pad stack"><h3 class="t">Antes de transfundir</h3>
      ${sp==='c'?banner('danger','Tipaje obligatorio en gato','Los gatos tienen aloanticuerpos naturales: una transfusión incompatible (A/B) puede ser mortal desde la primera vez. Tipar siempre y hacer prueba cruzada.'):banner('warn','Perro','Tipar DEA 1 si es posible. Prueba cruzada obligatoria si ha recibido transfusiones hace más de 4 días.')}
      ${banner('info','Administración','Filtro de 170–260 µm. No mezclar con soluciones con calcio (Ringer lactato) ni con dextrosa. Calentar a temperatura ambiente, no por encima de 37 °C.')}
    </section>
    <section class="panel pad stack"><h3 class="t">Monitorización</h3>
      ${banner('info','Constantes','Temperatura, FC, FR y mucosas basales; después cada 15 min la primera hora y cada 30–60 min hasta finalizar. Hematocrito a las 1–2 h y a las 24 h.')}
      ${banner('danger','Detener si aparece','Fiebre (> 1 °C sobre la basal), urticaria, vómito, taquicardia, disnea, hemoglobinuria o hipotensión. Valorar difenhidramina o corticoide según la reacción.')}
    </section>
  </div>`;
}

