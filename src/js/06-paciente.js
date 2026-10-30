/* =================== PATIENT BAR =================== */
function renderPatientBar(){
  $('#spSeg').innerHTML=Object.entries(SPECIES).map(([k,s])=>`<button data-sp="${k}" aria-pressed="${S.p.sp===k}">${s.n}</button>`).join('');
  const s=SPECIES[S.p.sp],h=$('#wHint');
  if(!(S.p.kg>0)){h.textContent='Introduce el peso del paciente';h.className='whint bad';}
  else if(S.p.kg<s.min||S.p.kg>s.max){h.textContent=`Fuera del rango habitual (${s.range}). Revisa el peso.`;h.className='whint bad';}
  else{h.textContent=S.p.unit==='kg'?`${fmt(S.p.kg*1000,0)} g`:`${fmt(S.p.kg,3)} kg`;h.className='whint';}
}
function setWeightField(){$('#weight').value=S.p.unit==='kg'?String(+S.p.kg.toFixed(3)).replace('.',DEC()):String(Math.round(S.p.kg*1000));$('#wUnit').value=S.p.unit;}
function renderSide(){
  $('#side').innerHTML=MODS.map(([k,n],i)=>(k==='farmacos'||k==='hoja'||k==='info'?'<div class="sep"></div>':'')+`<button data-nav="${k}" aria-current="${S.view===k}" class="${k==='rcp'?'urg':''}">${ic(k)}<span>${n}</span>${k==='hoja'?`<span class="count">${S.sheet.length}</span>`:''}</button>`).join('');
  renderTab();
}

