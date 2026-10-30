/* =================== ALTAS =================== */
const ORAL_DEF={meloxicam:{d:0.1,c:0.05},maropitant:{d:2,c:1},robenacoxib:{d:1,c:1},levetiracetam:{d:20,c:20}};
const HOME_NOTE={meloxicam:'Dar con comida.',carprofeno:'Dar con comida.',robenacoxib:'Dar fuera de las comidas.',omeprazol:'En ayunas, 30 minutos antes de la comida.',pimobendan:'Una hora antes de la comida.',doxiciclina:'Dar seguido de agua o comida.',clindamicina:'Dar seguido de agua o comida.',espironolactona:'Dar con comida.',vitk1:'Dar con comida que contenga grasa.',fenobarbital:'No suspender de forma brusca.',levetiracetam:'No suspender de forma brusca.',prednisolona:'Dar por la mañana con comida. No suspender de forma brusca.',insulinalenta:'Inyectar bajo la piel justo después de que coma. Usar jeringas U-40.',glargina:'Inyectar bajo la piel. Usar jeringas U-100.',metimazol:'Usar guantes al manipular los comprimidos.',maropitant:'Dar con un poco de comida.',gabapentina:'Puede producir somnolencia.',trazodona:'Dar 1–2 horas antes de la situación estresante.',metronidazol:'Sabor amargo: ocultar en comida.'};
const CHRONIC=['Cardio y renal','Endocrino','Neurología y conducta'];
function homePres(d){return d.pres.map((p,i)=>[p,i]).filter(([p])=>p.t!=='liq'||d.u==='UI'||/oral|gotas/i.test(p.label)).map(([,i])=>i);}
function homeOk(d){const sd=d.sp[S.p.sp];return sd&&!sd.x&&homePres(d).length>0;}
function parseFreq(f){if(/única/i.test(f)&&!/q\d/.test(f))return 0;const m=f.match(/q(\d+)(?:–(\d+))?h/);return m?+(m[2]||m[1]):24;}
function parseDays(d,f){const m=f.match(/(?:durante|hasta) (\d+)(?:–(\d+))? (días|semanas)/);if(m){const n=+(m[2]||m[1]);return m[3]==='semanas'?n*7:n;}if(/única/i.test(f))return 1;if(CHRONIC.includes(d.cat))return 0;if(d.cat==='Antibióticos')return 7;if(d.cat==='AINE y analgesia'||d.cat==='Opioides')return 5;return 7;}
function addAlta(id){
  const d=DRUGS.find(x=>x.id===id),sd=d.sp[S.p.sp];if(!homeOk(d))return;
  const od=ORAL_DEF[id]&&ORAL_DEF[id][S.p.sp];const dose=od!=null?od:sd.def;
  const hp=homePres(d),w=kg();
  let best=hp[0],bestErr=1e9;
  hp.forEach(i=>{const p=d.pres[i];if(p.t==='liq'){if(bestErr>0.05){best=i;bestErr=0.05;}return;}const st=p.t==='cap'?1:0.25,q=Math.round(dose*w/p.c/st)*st;if(q===0)return;const err=Math.abs(q*p.c/w-dose)/dose+(q>4?0.2:0)+q*0.01+(q%1?0.01:0);if(err<bestErr){best=i;bestErr=err;}});
  const h=parseFreq(sd.freq);
  S.alta.push({id,pres:best,dose,h,days:parseDays(d,sd.freq),note:HOME_NOTE[id]||''});save();render();toast('Añadido al alta');
}
const FREQ_TXT=h=>tr(h===0?'en dosis única':`cada ${h} horas`);
function altaCalc(it){
  const d=DRUGS.find(x=>x.id===it.id),sd=d.sp[S.p.sp],p=d.pres[it.pres],w=kg();
  if(!sd||sd.x||!p)return{d,sd,p,bad:true};
  const total=it.dose*w,perDay=it.h?24/it.h:1,doses=it.h===0?1:(it.days>0?Math.round(perDay*it.days):null);
  let amount,unitTotal,real=it.dose,status='ok',per;
  if(p.t==='liq'){
    const mL=total/p.c;
    if(d.u==='UI'){amount=`${smart(total)} UI (${vol(mL)} mL)`;}
    else amount=`${vol(mL)} mL`;
    per=mL;unitTotal=doses?tr(`${fmt(mL*doses,1)} mL en total`):'';
  }else{
    const st=p.t==='cap'?1:0.25,q=Math.round(total/p.c/st)*st;
    if(q===0)return{d,sd,p,tooLow:true};
    real=q*p.c/w;per=q;
    const t=1e-9;status=(real<sd.min*0.9-t||real>sd.max*1.1+t)?'danger':(real<sd.min-t||real>sd.max+t)?'warn':'ok';
    const noun=p.t==='cap'?(q>1?'cápsulas':'cápsula'):(q>1?'comprimidos':'comprimido');
    amount=`${p.t==='cap'?q:frac(q)} ${tr(noun)}`;
    if(doses){const tot=Math.ceil(q*doses);unitTotal=tr(`${tot} ${p.t==='cap'?(tot>1?'cápsulas':'cápsula'):(tot>1?'comprimidos':'comprimido')} en total`);}
  }
  const route=tr(d.u==='UI'?'por vía subcutánea':'por vía oral');
  const dur=it.h===0?'':' '+tr(it.days>0?`durante ${it.days} ${it.days===1?'día':'días'}`:'de forma continuada hasta nueva revisión');
  const name=`${tr(d.n)} ${presShort(p,d)}`;
  const line=`${name}: ${amount} ${route} ${FREQ_TXT(it.h)}${dur}.${it.note?' '+tr(it.note):''}`;
  return{d,sd,p,amount,unitTotal,real,status,line,name,route,dur};
}
function presShort(p,d){const m=p.label.match(/(\d+(?:,\d+)?\s*(?:mg|µg|UI)(?:\/mL)?)/);let kind=p.t==='tab'?'comprimidos':p.t==='cap'?'cápsulas':/suspensi/i.test(p.label)?'suspensión':/gotas/i.test(p.label)?'gotas':d.u==='UI'?'':'solución';kind=kind&&tr(kind);return(m?m[1]:'')+(kind?` (${kind})`:'');}
function altaText(){
  const p=S.p,lines=S.alta.map(altaCalc).filter(c=>c.line);
  let t=`${tr('PAUTA DE TRATAMIENTO EN CASA')}\n${p.name||tr('Paciente')}${p.hc?' · HC '+p.hc:''} · ${tr(spN())}${p.breed?' · '+p.breed:''} · ${fmt(kg(),3)} kg · ${new Date().toLocaleDateString(LOC())}\n\n`;
  t+=lines.map((c,i)=>`${i+1}. ${c.line}`).join('\n');
  if(S.altaNotes.trim())t+=`\n\n${tr('Recomendaciones:')}\n${S.altaNotes.trim()}`;
  if(S.altaRev.trim())t+=`\n\n${tr('Próxima revisión:')} ${S.altaRev.trim()}`;
  if(S.vet)t+=`\n\n${tr('Veterinario:')} ${S.vet}`;
  return t;
}
function renderAltas(){
  const q=norm((S.altaQ||'').trim());
  const list=DRUGS.filter(d=>!q||norm(d.n).includes(q)||norm(d.cat).includes(q)).filter(d=>homePres(d).length);
  let items='',last='';
  list.forEach(d=>{const sd=d.sp[S.p.sp];if(d.cat!==last){items+=`<li class="grp">${esc(d.cat)}</li>`;last=d.cat;}
    const b=!sd?'<span class="dot n">sin datos</span>':sd.x?'<span class="dot x">contraindicado</span>':'<span class="dot n">+ añadir</span>';
    items+=`<li><button class="item" data-altaadd="${d.id}" ${homeOk(d)?'':'disabled style="opacity:.55;cursor:not-allowed"'}><span>${esc(d.n)}</span>${b}</button></li>`;});
  const cards=S.alta.map((it,i)=>{const c=altaCalc(it),d=c.d,hp=homePres(d);
    if(c.bad)return`<div class="rx-item"><div class="top"><h4>${esc(d.n)}</h4><button class="x" data-altadel="${i}" aria-label="Quitar">×</button></div>${banner('danger','No indicado en '+spN().toLowerCase(),c.sd&&c.sd.x?esc(c.sd.x):'Sin pauta para esta especie.')}</div>`;
    return`<div class="rx-item">
      <div class="top"><div><h4>${esc(d.n)}</h4><div class="small"><span>Rango ${spN().toLowerCase()}</span>: ${smart(c.sd.min)}${c.sd.max!==c.sd.min?'–'+smart(c.sd.max):''} ${d.u}/kg · <span>${esc(c.sd.freq)}</span></div></div><button class="x" data-altadel="${i}" aria-label="Quitar">×</button></div>
      <div class="rx-ctl">
        <div class="field"><label for="alta-pres-${i}">Presentación</label><select id="alta-pres-${i}">${hp.map(pi=>`<option value="${pi}" ${pi===it.pres?'selected':''}>${esc(d.pres[pi].label)}</option>`).join('')}</select></div>
        <div class="field"><label for="alta-dose-${i}">Dosis (${d.u}/kg)</label><input id="alta-dose-${i}" type="text" inputmode="decimal" value="${String(+(+it.dose).toFixed(4)).replace('.',DEC())}"></div>
        <div class="field"><label for="alta-h-${i}">Frecuencia</label><select id="alta-h-${i}">${[[6,'Cada 6 h'],[8,'Cada 8 h'],[12,'Cada 12 h'],[24,'Cada 24 h'],[48,'Cada 48 h'],[0,'Dosis única']].map(([v,l])=>`<option value="${v}" ${it.h===v?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="field"><label for="alta-days-${i}">Días</label><input id="alta-days-${i}" type="text" inputmode="numeric" value="${it.days||''}" placeholder="Continuo" ${it.h===0?'disabled':''}></div>
      </div>
      <div class="field"><label for="alta-note-${i}">Indicaciones para el propietario</label><input id="alta-note-${i}" type="text" value="${esc(tr(it.note))}" placeholder="Ej.: dar con comida"></div>
      ${c.tooLow?banner('danger','Dosis demasiado baja para esta presentación','Elige una presentación más pequeña o líquida.'):`<div class="rx-line" data-notr><b>${esc(c.amount)}</b> ${esc(c.route)} ${esc(FREQ_TXT(it.h))}${esc(c.dur)}${c.unitTotal?` · <span class="small">${esc(c.unitTotal)}</span>`:''} ${d.u!=='UI'&&c.p.t!=='liq'?`<span class="tag ${c.status}">${smart(c.real)} ${d.u}/kg</span>`:''}</div>`}
    </div>`;}).join('');
  return`<div class="fx">
    <section class="panel list" aria-label="Fármacos para casa">
      <div class="search"><input id="altaQ" type="search" placeholder="Buscar fármaco para casa…" value="${esc(S.altaQ||'')}" aria-label="Buscar fármaco para el alta"></div>
      <div class="small" style="padding:0 16px 6px">Solo presentaciones de uso domiciliario: comprimidos, cápsulas, jarabes, gotas e insulinas.</div>
      <ul>${items||'<li class="grp">Sin resultados</li>'}</ul>
    </section>
    <article class="panel pad stack">
      <div class="head"><div><div class="eyebrow">Alta hospitalaria</div><h2 class="t">Tratamiento en casa</h2><div class="sub">${patientLine()}</div></div>
        <div class="btns"><button class="btn ghost" data-act="altaClear" ${S.alta.length?'':'disabled'}>Vaciar</button><button class="btn" data-act="altaCopy" ${S.alta.length?'':'disabled'}>Copiar pauta</button><button class="btn" data-act="altaShare" ${S.alta.length?'':'disabled'}>Compartir</button></div></div>
      ${noWeight()?banner('danger','Falta el peso','Introduce el peso del paciente en la barra superior.'):''}
      ${S.alta.length?`<div class="stack-s">${cards}</div>`:`<div class="empty">Busca un fármaco a la izquierda y tócalo para añadirlo.<br>Se calcula la cantidad por toma con el peso del paciente y la presentación más adecuada.</div>`}
      <div class="grid2">
        <div class="field"><label for="altaNotes">Recomendaciones generales</label><textarea id="altaNotes" placeholder="Ej.: reposo 10 días, collar isabelino, dieta blanda 3 días.">${esc(S.altaNotes)}</textarea></div>
        <div class="stack-s"><div class="field"><label for="altaRev">Próxima revisión</label><input id="altaRev" type="text" value="${esc(S.altaRev)}" placeholder="Ej.: en 7 días, retirada de puntos"></div>
          <div class="field"><label for="vet">Veterinario responsable</label><input id="vet" type="text" value="${esc(S.vet)}" placeholder="Nombre del veterinario"></div></div>
      </div>
      ${S.alta.length?`<div class="stack-s"><div class="eyebrow">Vista previa para el propietario</div><div class="preview" data-notr>${esc(altaText())}</div></div>`:''}
      ${banner('warn','Revisa antes de entregar','Comprueba que la presentación coincide con la que se dispensa y ajusta dosis, frecuencia y días a cada caso.')}
    </article></div>`;
}
