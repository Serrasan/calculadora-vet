/* =================== FLUIDOS =================== */
function fluidPlan(){
  const w=kg(),F=S.fl,sp=S.p.sp;
  let maint,method;
  if(sp==='d'){maint=132*Math.pow(w,0.75);method='132 × kg<sup>0,75</sup> mL/día';}
  else if(sp==='c'){maint=80*Math.pow(w,0.75);method='80 × kg<sup>0,75</sup> mL/día';}
  else if(sp==='r'){maint=100*w;method='100 mL/kg/día';}
  else{maint=75*w;method='75 mL/kg/día';}
  const deficit=F.dehyd/100*w*1000;const perH=maint/24+deficit/F.hours+F.losses/24;const after=maint/24+F.losses/24;
  return{w,maint,method,deficit,perH,after};
}
function kScale(k){if(k<=2)return[80,6];if(k<=2.5)return[60,8];if(k<=3)return[40,12];if(k<=3.5)return[28,18];return[20,25];}
function renderFluidos(){
  const F=S.fl,{w,maint,method,deficit,perH,after}=fluidPlan(),cat=S.p.sp==='c';
  const dpm=perH*F.set/60,spd=dpm>0?60/dpm:0;
  const [kc,kmax]=kScale(F.k);const kmEq=kc*F.bagK/1000;const kmL=kmEq/2;const kRate=w>0?kc*perH/1000/w:0;
  const dexmL=F.dex*F.bagDex/50;
  return`<section class="panel pad stack">
    <div class="head"><div><div class="eyebrow">Fluidoterapia</div><h2 class="t">Plan de fluidos</h2><div class="sub">${patientLine()}</div></div>
      <button class="btn" data-act="addFluid" ${w>0?'':'disabled'}>Añadir a la hoja</button></div>
    <div class="grid4">
      <div class="field"><label for="flDehyd">Deshidratación estimada</label><select id="flDehyd">${[[0,'< 5 % · no detectable'],[5,'5 % · mucosas secas'],[6,'6–8 % · pliegue cutáneo lento'],[8,'8 % · TRC aumentado'],[10,'10–12 % · ojos hundidos'],[12,'12 % · shock']].map(([v,l])=>`<option value="${v}" ${F.dehyd==v?'selected':''}>${l}</option>`).join('')}</select></div>
      <div class="field"><label for="flHours">Reponer el déficit en</label><select id="flHours">${[6,12,24].map(h=>`<option value="${h}" ${F.hours==h?'selected':''}>${h} horas</option>`).join('')}</select></div>
      <div class="field"><label for="flLoss">Pérdidas continuas (mL/día)</label><input id="flLoss" type="text" inputmode="decimal" value="${F.losses}"></div>
      <div class="field"><label for="flSet">Equipo de infusión</label><select id="flSet">${[[10,'Macrogotero 10 gotas/mL'],[15,'Macrogotero 15 gotas/mL'],[20,'Macrogotero 20 gotas/mL'],[60,'Microgotero 60 gotas/mL']].map(([v,l])=>`<option value="${v}" ${F.set==v?'selected':''}>${l}</option>`).join('')}</select></div>
    </div>
    <div class="grid3">
      <div class="kpi main"><span class="eyebrow">Ritmo inicial</span><span class="v">${fmt(perH,1)}<small>mL/h</small></span><span class="s">primeras ${F.hours} h</span></div>
      <div class="kpi"><span class="eyebrow">Goteo</span><span class="v">${fmt(dpm,1)}<small>gotas/min</small></span><span class="s">1 gota cada ${spd?fmt(spd,1):'—'} s</span></div>
      <div class="kpi"><span class="eyebrow">Después</span><span class="v">${fmt(after,1)}<small>mL/h</small></span><span class="s">mantenimiento + pérdidas</span></div>
    </div>
    <div class="tw"><table><thead><tr><th>Componente</th><th>Cálculo</th><th class="r">Volumen</th></tr></thead><tbody>
      <tr><td>Mantenimiento</td><td class="small">${method}</td><td class="amt r">${fmt(maint,0)} mL/día</td></tr>
      <tr><td>Déficit</td><td class="small">${F.dehyd} % × ${fmt(w,3)} kg × 1000</td><td class="amt r">${fmt(deficit,0)} mL</td></tr>
      <tr><td>Pérdidas continuas</td><td class="small">vómitos, diarrea, poliuria</td><td class="amt r">${fmt(F.losses,0)} mL/día</td></tr>
      <tr class="hl"><td><b>Total primeras 24 h</b></td><td class="small">mantenimiento + déficit + pérdidas</td><td class="amt r">${fmt(maint+deficit+F.losses,0)} mL</td></tr>
    </tbody></table></div>
    <div class="facts">
      <div><span class="eyebrow">Bolo de choque</span><b class="tn">${fmt((cat?5:10)*w,0)}–${fmt((cat?10:20)*w,0)} mL</b><span class="small">${cat?'5–10':'10–20'} mL/kg en 15 min; reevaluar</span></div>
      <div><span class="eyebrow">Ritmo quirúrgico</span><b class="tn">${fmt((cat?3:5)*w,1)} mL/h</b><span class="small">${cat?3:5} mL/kg/h (guías AAHA)</span></div>
      <div><span class="eyebrow">Diuresis esperada</span><b class="tn">${fmt(w,1)}–${fmt(2*w,1)} mL/h</b><span class="small">1–2 mL/kg/h</span></div>
    </div>
    ${cat?banner('warn','Gato','Más propenso a la sobrecarga de volumen: auscultar, vigilar frecuencia respiratoria y peso cada 4–6 h.'):''}
  </section>
  <div class="grid2">
  <section class="panel pad stack">
    <div><h3 class="t">Suplementación de potasio</h3><div class="sub">Escala de Scott para KCl 2 mEq/mL</div></div>
    <div class="grid2">
      <div class="field"><label for="flK">Potasio sérico (mmol/L)</label><input id="flK" type="text" inputmode="decimal" value="${String(F.k).replace('.',DEC())}"></div>
      <div class="field"><label for="flBagK">Volumen de la bolsa</label><select id="flBagK">${[250,500,1000].map(v=>`<option value="${v}" ${F.bagK==v?'selected':''}>${v} mL</option>`).join('')}</select></div>
    </div>
    <div class="grid2">
      <div class="kpi main"><span class="eyebrow">Añadir KCl 2 mEq/mL</span><span class="v">${fmt(kmL,1)}<small>mL</small></span><span class="s">${fmt(kmEq,1)} mEq · ${kc} mEq/L</span></div>
      <div class="kpi"><span class="eyebrow">Aporte al ritmo inicial</span><span class="v">${fmt(kRate,2)}<small>mEq/kg/h</small></span><span class="s">máx. 0,5 mEq/kg/h</span></div>
    </div>
    ${kRate>0.5?banner('danger','Supera 0,5 mEq/kg/h',`Reduce el ritmo de fluidos (máximo ${kmax} mL/kg/h con esta concentración) o la concentración de potasio.`):banner('ok','Velocidad de potasio segura',`Con ${kc} mEq/L no superar ${kmax} mL/kg/h (${fmt(kmax*w,0)} mL/h).`)}
    <div class="small">Escala: ≤ 2,0 → 80 · 2,1–2,5 → 60 · 2,6–3,0 → 40 · 3,1–3,5 → 28 · 3,6–5,0 → 20 mEq/L. Mezclar bien la bolsa.</div>
  </section>
  <section class="panel pad stack">
    <div><h3 class="t">Suplementación de dextrosa</h3><div class="sub">A partir de dextrosa al 50 %</div></div>
    <div class="grid2">
      <div class="field"><label for="flDex">Concentración final</label><select id="flDex">${[[0,'Sin dextrosa'],[1.25,'1,25 %'],[2.5,'2,5 %'],[5,'5 %']].map(([v,l])=>`<option value="${v}" ${F.dex==v?'selected':''}>${l}</option>`).join('')}</select></div>
      <div class="field"><label for="flBagDex">Volumen de la bolsa</label><select id="flBagDex">${[250,500,1000].map(v=>`<option value="${v}" ${F.bagDex==v?'selected':''}>${v} mL</option>`).join('')}</select></div>
    </div>
    <div class="kpi main"><span class="eyebrow">Añadir dextrosa 50 %</span><span class="v">${fmt(dexmL,1)}<small>mL</small></span><span class="s">retirar antes el mismo volumen de la bolsa</span></div>
    ${banner('info','Bolo en hipoglucemia',`Dextrosa 50 %: ${fmt(0.5*w,1)}–${fmt(1*w,1)} mL (0,5–1 mL/kg) diluida 1:2–1:4, IV lento. Después, infusión al 2,5–5 %.`)}
    ${banner('warn','Vía periférica','Por vía periférica no superar el 5 % de dextrosa (riesgo de flebitis).')}
  </section></div>`;
}

