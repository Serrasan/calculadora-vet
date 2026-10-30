/* =================== FORMULARIO =================== */
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function getDose(drug){const sd=drug.sp[S.p.sp];if(!sd||sd.x)return null;const k=drug.id+'|'+S.p.sp;return S.doses[k]!=null?S.doses[k]:sd.def;}
function computeRows(drug,dose){
  const sd=drug.sp[S.p.sp],w=kg(),total=dose*w;
  return drug.pres.map((p,i)=>{
    if(p.t==='liq'){
      const v=total/p.c;let extra='',sub=v>0?syringe(v):'';
      if(drug.u==='UI') sub=`Jeringa de insulina U-${p.c}: ${smart(total)} UI`;
      else if(v<0.05&&v>0) extra=`Volumen muy pequeño: diluye 1:10 con suero salino (${smart(p.c/10)} ${drug.u}/mL) y administra ${vol(v*10)} mL.`;
      return{i,p,amount:`${vol(v)} mL`,sub,status:'ok',real:dose,extra};
    }
    const step=p.t==='cap'?1:0.25,exact=total/p.c,q=Math.round(exact/step)*step;
    if(q===0)return{i,p,amount:p.t==='cap'?'< 1 cápsula':'< ¼ comp.',sub:'Dosis demasiado baja para esta presentación',status:'danger',real:0,extra:'Usa una presentación líquida o fórmula magistral.'};
    const real=q*p.c/w,t=1e-9;
    const status=(real<sd.min*0.9-t||real>sd.max*1.1+t)?'danger':(real<sd.min-t||real>sd.max+t)?'warn':'ok';
    const amount=p.t==='cap'?`${q} ${q===1?'cápsula':'cápsulas'}`:`${frac(q)} comp.`;
    return{i,p,amount,sub:`Exacto: ${fmt(exact,2)} · ${smart(q*p.c)} ${drug.u}`,status,real,extra:''};
  });
}
function renderFarmacos(){
  const q=norm(S.q.trim());
  const list=DRUGS.filter(d=>(S.cat==='Todos'||d.cat===S.cat)&&(!q||norm(d.n).includes(q)||norm(d.cat).includes(q)));
  let items='',last='';
  list.forEach(d=>{if(d.cat!==last){items+=`<li class="grp">${esc(d.cat)}</li>`;last=d.cat;}
    const sd=d.sp[S.p.sp];const b=!sd?'<span class="dot n">sin datos</span>':sd.x?'<span class="dot x">contraindicado</span>':'';
    items+=`<li><button class="item" data-drug="${d.id}" aria-current="${S.drug===d.id}"><span>${esc(d.n)}</span>${b}</button></li>`;});
  return`<div class="fx">
    <section class="panel list" aria-label="Formulario">
      <div class="search"><input id="q" type="search" placeholder="Buscar entre ${DRUGS.length} fármacos…" value="${esc(S.q)}" aria-label="Buscar fármaco"></div>
      <div class="chips">${CATS.map(c=>`<button data-cat="${esc(c)}" aria-pressed="${S.cat===c}">${esc(c)}</button>`).join('')}</div>
      <ul>${items||'<li class="grp">Sin resultados</li>'}</ul>
    </section>
    <article class="panel pad stack">${drugDetail()}</article></div>`;
}
function drugDetail(){
  const drug=DRUGS.find(d=>d.id===S.drug),sd=drug.sp[S.p.sp],sp=spN(),u=drug.u,w=kg();
  const head=`<div class="head"><div><div class="eyebrow">${esc(drug.cat)}</div><h2 class="t">${esc(drug.n)}</h2><div class="sub">${patientLine()}</div></div>`;
  if(!sd)return head+`</div>`+banner('info',`Sin dosis de referencia para ${sp.toLowerCase()}`,'No hay una pauta establecida en esta especie en el formulario. Consulta bibliografía especializada antes de usarlo.');
  if(sd.x)return head+`</div>`+banner('danger',`Contraindicado en ${sp.toLowerCase()}`,esc(sd.x));
  const dose=getDose(drug),total=dose*w,fixed=sd.min===sd.max,stv=stepFor(sd.max),out=dose<sd.min-1e-9||dose>sd.max+1e-9;
  const rows=computeRows(drug,dose),sel=S.pres[drug.id]!=null&&S.pres[drug.id]<drug.pres.length?S.pres[drug.id]:0,ok=w>0;
  return head+`<button class="btn" data-act="addDrug" ${ok?'':'disabled'}>Añadir a la hoja</button></div>
   ${out?banner('warn','Dosis fuera del rango de referencia',`El rango habitual en ${sp.toLowerCase()} es ${smart(sd.min)}–${smart(sd.max)} ${u}/kg. Revisa la pauta.`):''}
   <div class="dose">
     <div class="ctl"><label class="eyebrow" for="doseIn">Dosis</label>
       <div class="dose-in"><input id="doseIn" type="text" inputmode="decimal" value="${String(+dose.toFixed(4)).replace('.',DEC())}"><span>${u}/kg</span></div>
       ${fixed?`<div class="small">Dosis fija de referencia: ${smart(sd.min)} ${u}/kg</div>`:
       `<input type="range" id="doseRange" min="${sd.min}" max="${sd.max}" step="${stv}" value="${Math.min(Math.max(dose,sd.min),sd.max)}" aria-label="Ajustar dosis">
        <div class="ends"><span>${smart(sd.min)}</span><span>rango ${u}/kg</span><span>${smart(sd.max)}</span></div>`}
     </div>
     <div class="total"><div class="eyebrow">Dosis total</div><div class="big">${ok?`${smart(total)}<small>${u}</small>`:'—'}</div>
       <div class="calc">${smart(dose)} ${u}/kg × ${fmt(w,3)} kg${u==='µg'?` = ${smart(total/1000)} mg`:''}</div></div>
   </div>
   <div><div class="eyebrow" style="margin-bottom:6px">Presentaciones · selecciona la que vas a usar</div>
    <div class="tw"><table><thead><tr><th>Presentación</th><th>Administrar</th><th>Dosis real</th></tr></thead><tbody>
    ${rows.map(r=>`<tr class="pres" data-pres="${r.i}" aria-selected="${r.i===sel}" tabindex="0">
      <td>${esc(r.p.label)}${r.extra?`<div class="small" style="color:var(--warn)">${esc(r.extra)}</div>`:''}</td>
      <td><div class="amt">${ok?r.amount:'—'}</div><div class="small">${ok?esc(r.sub):''}</div></td>
      <td>${r.p.t==='liq'||!ok?`<span class="tag ok">${smart(dose)} ${u}/kg</span>`:r.real?`<span class="tag ${r.status}">${smart(r.real)} ${u}/kg</span>`:'<span class="tag danger">—</span>'}</td></tr>`).join('')}
    </tbody></table></div></div>
   <div class="facts">
     <div><span class="eyebrow">Vía</span><b>${esc(sd.route)}</b></div>
     <div><span class="eyebrow">Frecuencia</span><b>${esc(sd.freq)}</b></div>
     <div><span class="eyebrow">Rango ${esc(sp.toLowerCase())}</span><b class="tn">${fixed?smart(sd.min):smart(sd.min)+'–'+smart(sd.max)} ${u}/kg</b></div>
   </div>
   ${sd.note?banner('info',`Nota para ${sp.toLowerCase()}`,esc(sd.note)):''}
   ${drug.warn?banner('warn','Precauciones',esc(drug.warn)):''}`;
}

