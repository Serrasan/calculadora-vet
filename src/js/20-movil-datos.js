/* =================== MÓVIL, AVISO, COPIA DE SEGURIDAD =================== */
const APP_VERSION='0.1.0',ACK_KEY='cv-ack';
const AV1='Calculadora Vet es una herramienta de apoyo para profesionales veterinarios.';
const AV2='Los rangos de dosis y los cálculos son orientativos y pueden contener errores. No sustituyen la exploración ni el criterio clínico.';
const AV3='Comprueba siempre la ficha técnica, la concentración del producto y el estado del paciente antes de administrar un medicamento. La responsabilidad de la prescripción es del veterinario.';
const AV4='No introduzcas datos personales de los propietarios. Todo lo que escribes se guarda solo en este dispositivo.';
const TABS=[['inicio','Inicio'],['farmacos','Formulario'],['altas','Altas'],['rcp','Urgencias'],['mas','Más']];
const DOTS='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/></svg>';
function renderTab(){
  const el=$('#tabbar');if(!el)return;
  const inTabs=TABS.some(t=>t[0]===S.view);
  el.innerHTML=TABS.map(([k,n])=>k==='mas'
    ?`<button type="button" data-act="more" aria-current="${!inTabs}">${DOTS}<span>${n}</span></button>`
    :`<button type="button" data-nav="${k}" aria-current="${S.view===k}" class="${k==='rcp'?'urg':''}">${ic(k)}<span>${n}</span></button>`).join('');
  i18nDom(el);
}
function closeMore(){const m=$('#more');if(m)m.remove();}
function openMore(){
  closeMore();
  const m=document.createElement('div');m.className='more no-print';m.id='more';
  m.innerHTML=`<div role="dialog" aria-modal="true" aria-label="Más módulos"><div class="mgrid">${MODS.map(([k,n])=>`<button type="button" data-nav="${k}" aria-current="${S.view===k}">${ic(k)}<span>${n}</span></button>`).join('')}</div><button type="button" class="btn ghost" data-act="moreClose" style="width:100%;margin-top:12px;justify-content:center">Cerrar</button></div>`;
  document.body.appendChild(m);i18nDom(m);
}
function acked(){try{return localStorage.getItem(ACK_KEY)==='1';}catch(e){return false;}}
function showAck(){
  if(acked()||$('#ack'))return;
  const m=document.createElement('div');m.className='modal no-print';m.id='ack';
  m.innerHTML=`<div role="dialog" aria-modal="true" aria-labelledby="ackT"><div class="mlangs" data-notr><button type="button" data-lang="ca" aria-pressed="${LANG==='ca'}">CA</button><button type="button" data-lang="es" aria-pressed="${LANG==='es'}">ES</button><button type="button" data-lang="en" aria-pressed="${LANG==='en'}">EN</button></div><h2 id="ackT">Antes de empezar</h2><p>${AV1}</p><p>${AV2}</p><p>${AV3}</p><p>${AV4}</p><button type="button" class="btn" data-act="ackOk">Entiendo y acepto</button></div>`;
  document.body.appendChild(m);i18nDom(m);const b=m.querySelector('[data-act="ackOk"]');if(b)b.focus();
}
function renderLogin(){
  const up=S.auth.mode==='up';
  return`<section class="panel auth-card">
    <span class="pill">Vista previa</span>
    <div class="mark" aria-hidden="true">${document.querySelector('.brand .mark').innerHTML}</div>
    <h1>${up?'Crea tu cuenta':'Accede a tu cuenta'}</h1>
    <p class="lead">Guarda tus hojas y pautas y sincronízalas entre tus dispositivos.</p>
    <div class="seg" role="group" aria-label="Acceso"><button type="button" data-act="authMode" data-m="in" aria-pressed="${!up}">Entrar</button><button type="button" data-act="authMode" data-m="up" aria-pressed="${up}">Crear cuenta</button></div>
    ${up?`<div class="field"><label for="authName">Nombre y apellidos</label><input id="authName" type="text" autocomplete="off"></div>
    <div class="field"><label for="authLic">Número de colegiado</label><input id="authLic" type="text" autocomplete="off"></div>`:''}
    <div class="field"><label for="authEmail">Correo electrónico</label><input id="authEmail" type="email" inputmode="email" autocomplete="off"></div>
    <div class="field"><label for="authPass">Contraseña</label><div class="pw"><input id="authPass" type="password" autocomplete="off"><button type="button" data-act="authShow">Mostrar</button></div></div>
    ${up?`<label class="chk"><input type="checkbox" id="authTerms"><span>Acepto las condiciones de uso y la política de privacidad.</span></label>`:`<button type="button" class="link" data-act="authSubmit">¿Has olvidado la contraseña?</button>`}
    <button type="button" class="btn" data-act="authSubmit">${up?'Crear cuenta':'Entrar'}</button>
    <div class="or"><span>o</span></div>
    <button type="button" class="btn ghost" data-nav="inicio">Continuar sin cuenta</button>
    <p class="note">Solo para profesionales veterinarios.</p>
  </section>`;
}
function renderInfo(){
  return`<div class="stack">
  <section class="panel pad stack"><div><div class="eyebrow">Información y datos</div><h2 class="t">Aviso clínico</h2></div><p>${AV1}</p><p>${AV2}</p><p>${AV3}</p></section>
  <section class="panel pad stack"><h3 class="t">Fuentes</h3><p>Los rangos proceden de formularios veterinarios de referencia y de fichas técnicas de medicamentos veterinarios (CIMAVet). El veterinario responsable del proyecto está revisando y documentando la fuente de cada dato.</p><p class="small">Pendiente: lista detallada de fuentes por fármaco.</p></section>
  <section class="panel pad stack"><h3 class="t">Tus datos</h3><p>Todo lo que escribes se guarda solo en este dispositivo. No hay cuentas y no se envía nada a ningún servidor. Si desinstalas la app o borras sus datos, se pierden.</p></section>
  <section class="panel pad stack"><h3 class="t">Copia de seguridad</h3><p>Guarda tus datos en un archivo para recuperarlos si cambias de móvil o reinstalas la app.</p>
    <div class="btns"><button class="btn" type="button" data-act="exportBackup">Exportar copia</button><button class="btn ghost" type="button" data-act="importPick">Importar copia</button><button class="btn ghost" type="button" data-act="wipeData" style="color:var(--danger)">Borrar todos los datos</button></div>
    <input type="file" id="importFile" accept="application/json,.json" hidden></section>
  <p class="small"><span>Versión</span> <span data-notr>${APP_VERSION}</span></p></div>`;
}
async function shareText(txt,msg){
  if(navigator.share){try{await navigator.share({title:'Calculadora Vet',text:txt});return;}catch(e){if(e&&e.name==='AbortError')return;}}
  copyText(txt,msg);
}
async function exportBackup(){
  const txt=JSON.stringify({app:'calculadora-vet',version:1,date:new Date().toISOString(),data:snapshot()},null,1),name='calculadora-vet-copia-'+new Date().toISOString().slice(0,10)+'.json';
  try{const f=new File([txt],name,{type:'application/json'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Calculadora Vet'});toast('Copia lista');return;}}catch(e){if(e&&e.name==='AbortError')return;}
  try{const url=URL.createObjectURL(new Blob([txt],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);toast('Copia lista');}
  catch(e){copyText(txt,'Copia lista');}
}
const SF=['time','spn','n','pres','dose','total','amount','route','freq'];
function cleanBackup(o){
  if(!o||o.app!=='calculadora-vet'||!o.data||typeof o.data!=='object'||Array.isArray(o.data))return null;
  const d=o.data,r={};
  r.sheet=(Array.isArray(d.sheet)?d.sheet:[]).filter(x=>x&&typeof x==='object').map(x=>{const y={kg:Number(x.kg)>0?Number(x.kg):0};SF.forEach(k=>{y[k]=x[k]==null?'':String(x[k]);});return y;});
  r.alta=(Array.isArray(d.alta)?d.alta:[]).filter(x=>x&&typeof x==='object'&&DRUGS.some(g=>g.id===x.id)).map(x=>{const g=DRUGS.find(q=>q.id===x.id);return{id:x.id,pres:g.pres[x.pres]?+x.pres:0,dose:Number(x.dose)>0?Number(x.dose):0,h:Number(x.h)>=0?Number(x.h):24,days:Number(x.days)>=0?Math.round(Number(x.days)):0,note:typeof x.note==='string'?x.note:''};});
  for(const k of['notes','vet','altaNotes','altaRev'])r[k]=typeof d[k]==='string'?d[k]:'';
  if(d.p&&typeof d.p==='object'&&SPECIES[d.p.sp]){const q=d.p;r.p={name:String(q.name||''),hc:String(q.hc||''),breed:String(q.breed||''),age:String(q.age||''),sp:q.sp,kg:Number(q.kg)>=0?Number(q.kg):SPECIES[q.sp].def,unit:q.unit==='g'?'g':'kg'};}
  return r;
}
async function importBackup(file){
  let r=null;try{r=cleanBackup(JSON.parse(await file.text()));}catch(e){}
  if(!r){toast('El archivo no es una copia válida de Calculadora Vet');return;}
  if(!confirm(tr('¿Sustituir los datos actuales por los de la copia?')))return;
  S.sheet=r.sheet;S.alta=r.alta;S.notes=r.notes;S.vet=r.vet;S.altaNotes=r.altaNotes;S.altaRev=r.altaRev;if(r.p)Object.assign(S.p,r.p);
  $('#pName').value=S.p.name;setWeightField();save();all();toast('Copia importada');
}
window.addEventListener('popstate',()=>{const v=location.hash.slice(1);S.view=VIEWS[v]&&(v!=='ddx'||FEATURES.ddx)?v:'inicio';closeMore();all();});

