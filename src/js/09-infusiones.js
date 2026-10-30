/* =================== CRI =================== */
function criPerHour(c,dose){const w=kg();if(c.du.includes('/min'))return dose*w*60;if(c.du.includes('/día'))return dose*w/24;return dose*w;}
function renderCRI(){
  const c=CRI.find(x=>x.id===S.cri),sd=c.sp[S.p.sp],sp=spN();
  const list=CRI.map(x=>{const s=x.sp[S.p.sp];const b=!s?'<span class="dot n">sin datos</span>':s.x?'<span class="dot x">no recomendado</span>':'';return`<li><button class="item" data-cri="${x.id}" aria-current="${S.cri===x.id}"><span>${esc(x.n)}</span>${b}</button></li>`;}).join('');
  let body;
  const head=`<div class="head"><div><div class="eyebrow">Infusión continua</div><h2 class="t">${esc(c.n)}</h2><div class="sub">${patientLine()} · ${esc(c.cl||(fmt(c.c,2)+' '+c.cu+'/mL'))}</div></div>`;
  if(!sd||sd.x){ body=head+'</div>'+(sd&&sd.x?banner('danger',`No recomendado en ${sp.toLowerCase()}`,esc(sd.x)):banner('info',`Sin pauta para ${sp.toLowerCase()}`,'No hay una infusión de referencia para esta especie.')); }
  else{
    const [mn,mx,df]=sd; const key=c.id+'|'+S.p.sp; const dose=S.criDose[key]!=null?S.criDose[key]:df;
    const ph=criPerHour(c,dose); const undil=ph/c.c; const w=kg();
    const massU=c.cu; const conc=c.c;
    let res='';
    if(S.criMode==='jeringa'){
      const V=S.syr,R=S.syrRate>0?S.syrRate:0; const hrs=R?V/R:0; const amt=ph*hrs; const mL=amt/conc; const dil=V-mL; const over=mL>V;
      res=`<div class="grid3">
        <div class="kpi main"><span class="eyebrow">Fármaco a cargar</span><span class="v">${R?vol(mL):'—'}<small>mL</small></span><span class="s">${R?smart(amt)+' '+massU:''}</span></div>
        <div class="kpi"><span class="eyebrow">Diluyente (NaCl 0,9 %)</span><span class="v">${R&&!over?vol(dil):'—'}<small>mL</small></span><span class="s">hasta ${V} mL totales</span></div>
        <div class="kpi"><span class="eyebrow">Programar bomba</span><span class="v">${fmt(R,2)}<small>mL/h</small></span><span class="s">dura ${R?fmt(hrs,1):'—'} h</span></div></div>
        ${over?banner('danger','El fármaco no cabe en la jeringa','Aumenta la velocidad de infusión o usa una jeringa mayor.'):''}
        <div class="small">Concentración final: ${R&&!over?smart(amt/V)+' '+massU+'/mL':'—'}</div>`;
    }else if(S.criMode==='bolsa'){
      const B=S.bag; const R=S.bagRate!=null?S.bagRate:(S.p.sp==='d'?132*Math.pow(w,0.75):S.p.sp==='c'?80*Math.pow(w,0.75):100*w)/24;
      const hrs=R>0?B/R:0; const amt=ph*hrs; const mL=amt/conc;
      res=`<div class="grid3">
        <div class="kpi main"><span class="eyebrow">Añadir a la bolsa</span><span class="v">${R>0?vol(mL):'—'}<small>mL</small></span><span class="s">${R>0?smart(amt)+' '+massU:''}</span></div>
        <div class="kpi"><span class="eyebrow">Ritmo de la bolsa</span><span class="v">${fmt(R,1)}<small>mL/h</small></span><span class="s">dura ${R>0?fmt(hrs,1):'—'} h</span></div>
        <div class="kpi"><span class="eyebrow">Concentración</span><span class="v">${R>0?smart(amt/B):'—'}<small>${massU}/mL</small></span><span class="s">en ${B} mL</span></div></div>
        ${banner('info','Preparación',`Retira ${R>0?vol(mL):'—'} mL de la bolsa antes de añadir el fármaco y etiquétala con el nombre, la dosis y la hora. Si cambias el ritmo de fluidos, cambia también la dosis del fármaco.`)}`;
    }else{
      res=`<div class="grid3">
        <div class="kpi main"><span class="eyebrow">Sin diluir</span><span class="v">${vol(undil)}<small>mL/h</small></span><span class="s">${smart(ph)} ${massU}/h</span></div>
        <div class="kpi"><span class="eyebrow">En 24 h</span><span class="v">${vol(undil*24)}<small>mL</small></span><span class="s">${smart(ph*24)} ${massU}</span></div>
        <div class="kpi"><span class="eyebrow">Dosis</span><span class="v">${smart(dose)}<small>${c.du}</small></span><span class="s">${fmt(w,3)} kg</span></div></div>
        ${undil<0.5?banner('warn','Ritmo muy bajo','Por debajo de 0,5 mL/h la precisión de muchas bombas disminuye: diluye en jeringa.'):''}`;
    }
    const ld=c.load&&(c.load[S.p.sp]);
    body=head+`<button class="btn" data-act="addCri" ${w>0?'':'disabled'}>Añadir a la hoja</button></div>
      <div class="dose"><div class="ctl"><label class="eyebrow" for="criIn">Dosis</label>
        <div class="dose-in"><input id="criIn" type="text" inputmode="decimal" value="${String(+dose.toFixed(4)).replace('.',DEC())}"><span>${c.du}</span></div>
        <input type="range" id="criRange" min="${mn}" max="${mx}" step="${stepFor(mx)}" value="${Math.min(Math.max(dose,mn),mx)}" aria-label="Ajustar dosis de infusión">
        <div class="ends"><span>${smart(mn)}</span><span>rango ${c.du}</span><span>${smart(mx)}</span></div></div>
        <div class="total"><div class="eyebrow">Cantidad por hora</div><div class="big">${smart(ph)}<small>${massU}/h</small></div><div class="calc">${smart(dose)} ${c.du} × ${fmt(w,3)} kg</div></div></div>
      ${ld?banner('info','Dosis de carga',esc(ld)):''}
      <div class="chips">${[['jeringa','Bomba de jeringa'],['bolsa','En bolsa de fluidos'],['directo','Sin diluir']].map(([k,n])=>`<button data-crimode="${k}" aria-pressed="${S.criMode===k}">${n}</button>`).join('')}</div>
      ${S.criMode==='jeringa'?`<div class="grid2"><div class="field"><label for="syr">Volumen final de la jeringa</label><select id="syr">${[10,20,50,60].map(v=>`<option value="${v}" ${S.syr==v?'selected':''}>${v} mL</option>`).join('')}</select></div>
        <div class="field"><label for="syrRate">Velocidad de la bomba (mL/h)</label><input id="syrRate" type="text" inputmode="decimal" value="${String(S.syrRate).replace('.',DEC())}"></div></div>`:''}
      ${S.criMode==='bolsa'?`<div class="grid2"><div class="field"><label for="bag">Volumen de la bolsa</label><select id="bag">${[100,250,500,1000].map(v=>`<option value="${v}" ${S.bag==v?'selected':''}>${v} mL</option>`).join('')}</select></div>
        <div class="field"><label for="bagRate">Ritmo de fluidos (mL/h) · por defecto, mantenimiento</label><input id="bagRate" type="text" inputmode="decimal" value="${S.bagRate!=null?String(S.bagRate).replace('.',DEC()):''}" placeholder="${fmt((S.p.sp==='d'?132*Math.pow(kg(),0.75):S.p.sp==='c'?80*Math.pow(kg(),0.75):100*kg())/24,1)}"></div></div>`:''}
      ${res}
      ${banner('warn','Notas clínicas',esc(c.note))}`;
  }
  return`<div class="fx"><section class="panel list"><div class="search"><div class="eyebrow">Infusiones disponibles</div></div><ul>${list}</ul></section><article class="panel pad stack">${body}</article></div>`;
}

