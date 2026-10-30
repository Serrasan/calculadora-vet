/* =================== RCP =================== */
function renderRCP(){
  const w=kg(),sp=S.p.sp,cat=sp==='c';
  const R=(n,dose,du,conc,cu,note,only)=>({n,dose,du,conc,cu,note,only});
  const rows=[
   ['Parada cardiorrespiratoria'],
   R('Adrenalina (dosis baja)',sp==='f'?0.02:0.01,'mg/kg',1,'mg/mL','IV/IO cada 3–5 min'),
   R('Adrenalina (dosis alta)',0.1,'mg/kg',1,'mg/mL','Solo RCP prolongada'),
   R('Vasopresina',0.8,'UI/kg',20,'UI/mL','IV/IO cada 3–5 min, alternativa a adrenalina'),
   R('Atropina',0.04,'mg/kg',1,'mg/mL','Bradicardia vagal / asistolia'+(sp==='r'?' · poco eficaz en conejo':'')),
   R('Lidocaína',cat?0.25:2,'mg/kg',20,'mg/mL',cat?'IV muy lento, gato sensible':'FV/TV sin pulso refractaria'),
   R('Amiodarona',5,'mg/kg',50,'mg/mL','IV lento; FV refractaria a desfibrilación','d'),
   R('Bicarbonato sódico 8,4 %',1,'mEq/kg',1,'mEq/mL','Solo RCP > 10–15 min'),
   ['Reversores'],
   R('Naloxona',0.04,'mg/kg',0.4,'mg/mL','Opioides'),
   R('Flumazenil',0.01,'mg/kg',0.1,'mg/mL','Benzodiacepinas'),
   R('Atipamezol',0.1,'mg/kg',5,'mg/mL','Alfa-2 agonistas (IM)'),
   ['Metabólico y neurológico'],
   R('Gluconato cálcico 10 %',50,'mg/kg',100,'mg/mL','IV en 10–20 min con ECG (0,5–1,5 mL/kg)'),
   R('Dextrosa 50 %',0.5,'g/kg',0.5,'g/mL','Diluir 1:2–1:4 antes de administrar'),
   R('Manitol 20 %',0.5,'g/kg',0.2,'g/mL','En 15–20 min; edema cerebral'),
   R('Salino hipertónico 7,5 %',cat?2:4,'mL/kg',null,'','En 10–15 min; shock / hipertensión intracraneal'),
   R('Diazepam',0.5,'mg/kg',5,'mg/mL','IV o rectal (1–2 mg/kg)'),
   R('Midazolam',0.2,'mg/kg',5,'mg/mL','IV, IM o intranasal'),
   R('Levetiracetam',60,'mg/kg',100,'mg/mL','IV en bolo, estatus epiléptico','dc')
  ];
  const tbody=rows.map(r=>{
    if(Array.isArray(r))return`<tr class="sec"><td colspan="4">${r[0]}</td></tr>`;
    if(r.only&&!r.only.includes(sp))return'';
    const total=r.dose*w; const v=r.conc?total/r.conc:total;
    const unit=r.du.split('/')[0];
    return`<tr><td><b>${esc(r.n)}</b><div class="small">${esc(r.note)}</div></td><td class="tn">${smart(r.dose)} ${r.du}<div class="small">${r.conc?smart(r.conc)+' '+r.cu:''}</div></td><td class="tn">${r.conc?smart(total)+' '+unit:''}</td><td class="amt r">${vol(v)} mL</td></tr>`;
  }).join('');
  const et=w<2?'3,0–4,0':w<5?'4,5–5,5':w<10?'6,0–7,0':w<15?'7,5–8,0':w<20?'8,5–9,0':w<30?'9,5–10':w<40?'10–11':'11–14';
  return`<section class="panel pad stack">
        <div class="head"><div><div class="eyebrow" style="color:var(--danger)">Urgencias</div><h2 class="t">Hoja de parada</h2><div class="sub">${patientLine()}</div></div></div>
    ${noWeight()?banner('danger','Falta el peso','Introduce el peso del paciente en la barra superior.'):''}
    ${!isDC()?banner('warn',`${spN()}: dosis extrapoladas`,'Las pautas de RCP proceden de perro y gato. En exóticos, valorar acceso IO y dosis con cautela.'):''}
    <div class="grid4">
      <div class="kpi main"><span class="eyebrow">Desfibrilación externa</span><span class="v">${fmt(2*w,0)}–${fmt(4*w,0)}<small>J</small></span><span class="s">Bifásico 2–4 J/kg</span></div>
      <div class="kpi"><span class="eyebrow">Monofásico externo</span><span class="v">${fmt(4*w,0)}–${fmt(6*w,0)}<small>J</small></span><span class="s">4–6 J/kg</span></div>
      <div class="kpi"><span class="eyebrow">Interna (bifásico)</span><span class="v">${fmt(0.2*w,1)}–${fmt(0.4*w,1)}<small>J</small></span><span class="s">0,2–0,4 J/kg</span></div>
      <div class="kpi"><span class="eyebrow">Tubo endotraqueal</span><span class="v">${sp==='c'?'3,0–4,5':isDC()?et:'—'}<small>${isDC()?'mm DI':''}</small></span><span class="s">Orientativo: palpar tráquea</span></div>
    </div>
    <div class="tw"><table class="crash"><thead><tr><th>Fármaco</th><th>Dosis · concentración</th><th>Cantidad</th><th class="r">Volumen</th></tr></thead><tbody>${tbody}</tbody></table></div>
    <div class="grid2">
      ${banner('danger','Soporte vital básico','Compresiones 100–120/min, ⅓–½ del ancho torácico, ciclos de 2 min sin interrupciones y cambio de compresor en cada ciclo. Intubar y ventilar a 10 respiraciones/min con O₂ al 100 % y volumen tidal ≈ 10 mL/kg.')}
      ${banner('info','Monitorización','EtCO₂ > 18 mmHg indica compresiones eficaces; una subida brusca sugiere retorno de la circulación espontánea. Revisar el ECG solo en las pausas entre ciclos.')}
    </div>
    <div class="grid2">
      ${banner('info','Bolo de choque (cristaloide)',`${fmt((cat?5:10)*w,0)}–${fmt((cat?10:20)*w,0)} mL (${cat?'5–10':'10–20'} mL/kg) en 15 min y reevaluar. No en parada euvolémica.`)}
      ${banner('info','Coloide / sangre',`Volemia estimada: ${isDC()?fmt((cat?60:90)*w,0)+' mL':'—'}. Valorar transfusión si hay hemorragia.`)}
    </div>
  </section>`;
}

