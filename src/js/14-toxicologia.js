/* =================== TOXICOLOGÍA =================== */
const CHOC=[['Cacao en polvo',26],['Chocolate de repostería (sin azúcar)',15],['Chocolate negro ≥ 70 %',8],['Chocolate negro o semiamargo',5.5],['Chocolate con leche',2.3],['Chocolate blanco',0.04]];
function renderTox(){
  const w=kg(),T=S.tox,sp=S.p.sp;
  const tabs=[['choc','Chocolate'],['xil','Xilitol'],['ibu','Ibuprofeno'],['para','Paracetamol'],['uva','Uvas y pasas'],['rat','Raticidas anticoagulantes'],['perm','Permetrina (gato)']];
  let body='';
  if(T.t==='choc'){
    const [cn,cc]=CHOC[T.chocType];const mgkg=w>0?T.g*cc/w:0;
    const lvl=mgkg>=60?['danger','Riesgo de convulsiones','Potencialmente mortal. Hospitalizar.']:mgkg>=40?['danger','Signos cardiacos','Taquicardia, arritmias e hipertensión probables.']:mgkg>=20?['warn','Signos leves a moderados','Vómito, diarrea, poliuria, agitación.']:['ok','Riesgo bajo','Posibles molestias gastrointestinales leves.'];
    body=`<div class="grid2"><div class="field"><label for="chocType">Tipo de chocolate</label><select id="chocType">${CHOC.map(([n,c],i)=>`<option value="${i}" ${T.chocType==i?'selected':''}>${n} (${fmt(c,2)} mg/g)</option>`).join('')}</select></div>
      <div class="field"><label for="chocG">Cantidad ingerida (g)</label><input id="chocG" type="text" inputmode="decimal" value="${T.g}"></div></div>
      <div class="grid2"><div class="kpi main"><span class="eyebrow">Metilxantinas</span><span class="v">${fmt(mgkg,1)}<small>mg/kg</small></span><span class="s">${fmt(T.g*cc,0)} mg ingeridos</span></div>
      <div class="kpi"><span class="eyebrow">Umbrales</span><span class="s">20 mg/kg: leves · 40–50: cardiacos · ≥ 60: convulsiones · DL50 100–200</span></div></div>
      ${banner(lvl[0],lvl[1],lvl[2])}
      ${banner('info','Tratamiento','Inducir el vómito si han pasado menos de 2–4 h. Carbón activado 1–2 g/kg y repetir 0,5 g/kg cada 4–6 h (recirculación enterohepática). Fluidoterapia, sondaje urinario para evitar la reabsorción vesical, ECG y control de la temperatura.')}`;
  }else if(T.t==='xil'){
    const gkg=w>0?T.xg/w:0;
    const lvl=gkg>=0.5?['danger','Riesgo de fallo hepático agudo','Hospitalizar, glucemia seriada y función hepática a las 24, 48 y 72 h.']:gkg>=0.1?['danger','Riesgo de hipoglucemia','Hospitalizar y monitorizar glucemia cada 1–2 h durante 12 h.']:gkg>=0.075?['warn','Dosis límite','Monitorizar glucemia.']:['ok','Riesgo bajo','Vigilancia en casa con indicaciones al propietario.'];
    body=`<div class="grid2"><div class="field"><label for="xG">Xilitol ingerido (g)</label><input id="xG" type="text" inputmode="decimal" value="${T.xg}"></div>
      <div class="small" style="align-self:end">Un chicle sin azúcar contiene aproximadamente 0,2–1 g de xilitol según la marca. Comprueba la etiqueta.</div></div>
      <div class="kpi main"><span class="eyebrow">Dosis</span><span class="v">${fmt(gkg,3)}<small>g/kg</small></span><span class="s">hipoglucemia ≥ 0,1 g/kg · daño hepático ≥ 0,5 g/kg</span></div>
      ${banner(lvl[0],lvl[1],lvl[2])}
      ${banner('info','Tratamiento',`Emesis solo si el paciente está normoglucémico y asintomático. Hipoglucemia: dextrosa 50 % ${fmt(0.5*w,1)}–${fmt(w,1)} mL diluida y después infusión al 2,5–5 %. Hepatoprotectores (N-acetilcisteína, SAMe). El carbón activado no adsorbe bien el xilitol.`)}
      ${sp==='c'?banner('info','Gato','No hay evidencia de toxicidad relevante del xilitol en gatos.'):''}`;
  }else if(T.t==='ibu'||T.t==='para'){
    const mgkg=w>0?T.mg/w:0;let lvl;
    if(T.t==='ibu'){const m=sp==='c'?0.5:1;
      lvl=mgkg>=600*m?['danger','Potencialmente mortal','']:mgkg>=400*m?['danger','Signos neurológicos y fallo renal','Convulsiones, ataxia, coma.']:mgkg>=175*m?['danger','Fallo renal agudo','Fluidoterapia 48–72 h y creatinina seriada.']:mgkg>=25*m?['warn','Úlcera gastrointestinal','Protectores gástricos (omeprazol, sucralfato) 5–7 días.']:['ok','Riesgo bajo','Vigilancia.'];
    }else{
      lvl=sp==='c'?(mgkg>=10?['danger','Tóxico en gato','Metahemoglobinemia y anemia por cuerpos de Heinz. Cualquier dosis es peligrosa.']:['warn','Cualquier dosis es peligrosa en gato','Tratar como intoxicación.']):
        mgkg>=200?['danger','Metahemoglobinemia y hepatotoxicidad','']:mgkg>=100?['danger','Hepatotoxicidad','Enzimas hepáticas a las 24–72 h.']:['warn','Riesgo bajo a moderado','Vigilancia y descontaminación.'];
    }
    const nac=T.t==='para'?banner('info','Antídoto: N-acetilcisteína',`Carga ${fmt(140*w,0)} mg (140 mg/kg) IV o PO; después ${fmt(70*w,0)} mg (70 mg/kg) cada 6 h, 7 dosis. Añadir SAMe y vitamina C; oxigenoterapia si hay cianosis.`):banner('info','Tratamiento','Emesis y carbón activado (repetir por recirculación enterohepática). Omeprazol, sucralfato y misoprostol; fluidoterapia IV 48 h si la dosis supera el umbral renal. Valorar emulsión lipídica en dosis muy altas.');
    body=`<div class="grid2"><div class="field"><label for="tMg">Cantidad ingerida (mg)</label><input id="tMg" type="text" inputmode="decimal" value="${T.mg}"></div><div class="small" style="align-self:end">Comprimidos habituales: ${T.t==='ibu'?'200, 400, 600 mg':'500, 650, 1000 mg'}.</div></div>
      <div class="kpi main"><span class="eyebrow">Dosis</span><span class="v">${fmt(mgkg,1)}<small>mg/kg</small></span><span class="s">${T.t==='ibu'?(sp==='c'?'gato: umbrales a la mitad que el perro':'perro: 25 GI · 175 renal · 400 SNC · 600 mortal'):(sp==='c'?'gato: tóxico a > 10 mg/kg':'perro: 100 hepático · 200 metahemoglobina')}</span></div>
      ${banner(lvl[0],lvl[1],lvl[2])}${nac}`;
  }else if(T.t==='uva'){
    body=`${banner('danger','No existe dosis segura','La toxicidad es idiosincrásica (ácido tartárico): cualquier cantidad puede causar fallo renal agudo en el perro.')}
      ${banner('info','Tratamiento',`Emesis aunque hayan pasado varias horas, carbón activado ${fmt(w,0)}–${fmt(2*w,0)} g y fluidoterapia IV a 2 veces el mantenimiento durante 48–72 h. Creatinina basal, a las 24, 48 y 72 h, y control de la diuresis.`)}`;
  }else if(T.t==='rat'){
    body=`<div class="grid2"><div class="kpi main"><span class="eyebrow">Vitamina K1 diaria</span><span class="v">${fmt(2.5*w,0)}–${fmt(5*w,0)}<small>mg/día</small></span><span class="s">2,5–5 mg/kg PO con comida grasa</span></div>
      <div class="kpi"><span class="eyebrow">Duración</span><span class="v">4–6<small>semanas</small></span><span class="s">2.ª generación (bromadiolona, brodifacoum)</span></div></div>
      ${banner('info','Protocolo','Ingesta reciente (< 2 h): emesis y carbón activado. Si no se trata con vitamina K1, medir el tiempo de protrombina a las 48–72 h. Al acabar el tratamiento, repetir el tiempo de protrombina 48–72 h después.')}
      ${banner('danger','Sangrado activo','Plasma fresco congelado 10–20 mL/kg o sangre entera. La vitamina K1 tarda 6–12 h en actuar. Nunca vitamina K1 por vía IV.')}`;
  }else{
    body=`${sp!=='c'?banner('info','Este protocolo es para gato','La permetrina es bien tolerada por el perro en las concentraciones comerciales.'):''}
      ${banner('danger','Sin dosis segura en gato','Las pipetas de perro (45–65 % de permetrina) causan temblores, hiperestesia y convulsiones en gatos.')}
      ${banner('info','Tratamiento',`Baño con detergente lavavajillas y agua templada, secar bien y evitar la hipotermia. Metocarbamol ${fmt(55*w,0)}–${fmt(220*w,0)} mg (55–220 mg/kg) IV lento a efecto. Emulsión lipídica 20 %: ${fmt(1.5*w,1)} mL en bolo y después ${fmt(0.25*w,2)} mL/kg/min durante 30–60 min. Diazepam o midazolam si hay convulsiones.`)}`;
  }
  const decont=`<section class="panel pad stack"><h3 class="t">Descontaminación · ${spN()} de ${fmt(w,3)} kg</h3>
    <div class="grid3">
      <div class="kpi"><span class="eyebrow">${sp==='c'?'Emesis: dexmedetomidina':'Emesis: apomorfina'}</span><span class="v">${sp==='c'?vol(7*w/500):sp==='d'?vol(0.03*w/1):'—'}<small>${isDC()?'mL':''}</small></span><span class="s">${sp==='c'?'7 µg/kg IM · 0,5 mg/mL':sp==='d'?'0,03 mg/kg IV · 1 mg/mL':'Conejo y hurón no vomitan'}</span></div>
      <div class="kpi"><span class="eyebrow">Carbón activado</span><span class="v">${fmt(w,0)}–${fmt(2*w,0)}<small>g</small></span><span class="s">1–2 g/kg PO; sorbitol solo la 1.ª dosis</span></div>
      <div class="kpi"><span class="eyebrow">Emulsión lipídica 20 %</span><span class="v">${fmt(1.5*w,1)}<small>mL bolo</small></span><span class="s">luego ${fmt(0.25*w*30,0)}–${fmt(0.25*w*60,0)} mL en 30–60 min</span></div>
    </div>
    ${banner('warn','No inducir el vómito','Corrosivos, hidrocarburos, objetos cortantes, paciente deprimido o con convulsiones, braquicéfalos con compromiso respiratorio, o más de 2–4 h tras la ingesta.')}
    ${banner('info','Centro de información toxicológica','Ante tóxicos poco habituales, consulta un centro de toxicología veterinaria con el nombre comercial y la composición del producto.')}
  </section>`;
  return`<section class="panel pad stack"><div><div class="eyebrow">Toxicología</div><h2 class="t">Calculadora de intoxicaciones</h2><div class="sub">${patientLine()}</div></div>
    <div class="chips">${tabs.map(([k,n])=>`<button data-tox="${k}" aria-pressed="${T.t===k}">${n}</button>`).join('')}</div>${body}</section>${decont}`;
}

