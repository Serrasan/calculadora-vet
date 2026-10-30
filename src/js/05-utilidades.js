/* =================== HELPERS =================== */
const $=s=>document.querySelector(s);
const kg=()=>S.p.kg>0?S.p.kg:0;
const num=v=>{const n=parseFloat(String(v).replace(',','.'));return isNaN(n)?NaN:n;};
let LANG='es';try{const l=localStorage.getItem('cv-lang');if(l==='ca'||l==='en')LANG=l;}catch(e){}
const LOC=()=>({es:'es-ES',ca:'ca-ES',en:'en-GB'}[LANG]);
const DEC=()=>LANG==='en'?'.':',';
const fmt=(n,d=2)=>Number(n).toLocaleString(LOC(),{maximumFractionDigits:d});
const smart=n=>{n=Math.abs(n)<1e-12?0:n;return n>=100?fmt(n,0):n>=10?fmt(n,1):n>=1?fmt(n,2):n>=0.1?fmt(n,3):fmt(n,4);};
const vol=v=>v>=10?fmt(v,1):v>=0.1?fmt(v,2):fmt(v,3);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const spN=()=>SPECIES[S.p.sp].n;
const isDC=()=>S.p.sp==='d'||S.p.sp==='c';
function frac(q){const w=Math.floor(q+1e-9),r=Math.round((q-w)*4);const f=['','¼','½','¾'][r]||'';return w?(w+(f?' '+f:'')):(f||'0');}
function syringe(v){if(v<=0.3)return'Jeringa de insulina 0,3 mL';if(v<=0.5)return'Jeringa de insulina 0,5 mL';if(v<=1)return'Jeringa de 1 mL';if(v<=2.5)return'Jeringa de 2,5 mL';if(v<=5)return'Jeringa de 5 mL';if(v<=10)return'Jeringa de 10 mL';if(v<=20)return'Jeringa de 20 mL';return'Jeringa de 50 mL';}
function stepFor(max){return max<=0.05?0.001:max<=1?0.005:max<=10?0.05:0.5;}
const ICON={
 warn:'<svg viewBox="0 0 24 24"><path d="M12 2 1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z"/></svg>',
 x:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 13.6L15.6 17 12 13.4 8.4 17 7 15.6 10.6 12 7 8.4 8.4 7 12 10.6 15.6 7 17 8.4 13.4 12 17 15.6z"/></svg>',
 i:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
 ok:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.5 14.5L6 12l1.4-1.4 3.1 3.1 6.1-6.1L18 9z"/></svg>'
};
const NI={
 inicio:'<path d="M3 11 12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
 farmacos:'<path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 7-7l7 7a4.95 4.95 0 0 1-7 7z"/><path d="m8.5 8.5 7 7"/>',
 cri:'<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3a2.4 2.4 0 0 1-3.4 0l-.6-.6a2.4 2.4 0 0 1 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>',
 rcp:'<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/><path d="M3.2 12h4.3l1.5-3 3 6 1.5-3h7.3"/>',
 fluidos:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5 12 2.5C11.5 5 10 7.9 8 9.5S5 13 5 15a7 7 0 0 0 7 7z"/>',
 transf:'<rect x="6" y="2" width="12" height="15" rx="3"/><path d="M12 17v5"/><path d="M9.5 9.5h5"/><path d="M12 7v5"/>',
 nutri:'<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7c0-1.5 1.5-1.5 1.5-3"/><path d="M13 7c0-1.5 1.5-1.5 1.5-3"/>',
 tox:'<path d="M9 2h6"/><path d="M10 2v7l-6 11a1.4 1.4 0 0 0 1.2 2h13.6a1.4 1.4 0 0 0 1.2-2L14 9V2"/><path d="M7 15h10"/>',
 ref:'<path d="M2 4h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
 ddx:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/><path d="M10.5 7.5v6"/><path d="M7.5 10.5h6"/>',
 altas:'<path d="M9 3h6v4H9z"/><path d="M7 5H5v16h14V5h-2"/><path d="m9 14 2 2 4-4"/>',
 hoja:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9z"/><path d="M9 11h6"/><path d="M9 15h6"/><path d="M9 19h3"/>'
};
NI.info='<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>';
const ic=k=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${NI[k]}</svg>`;
const FEATURES={ddx:false};
const MODS=[
 ['inicio','Inicio','Resumen del paciente'],
 ['ddx','Diagnóstico diferencial','Diferenciales por probabilidad a partir del caso'],
 ['farmacos','Formulario','Dosis por peso, presentaciones y precauciones'],
 ['altas','Altas','Tratamiento domiciliario y posología'],
 ['cri','Infusiones continuas','Jeringa, bolsa o sin diluir'],
 ['rcp','Urgencias y RCP','Hoja de parada con volúmenes'],
 ['fluidos','Fluidoterapia','Mantenimiento, déficit, potasio y dextrosa'],
 ['transf','Transfusión','Volumen, velocidad y controles'],
 ['nutri','Nutrición','RER, MER y ración diaria'],
 ['tox','Toxicología','Dosis tóxicas y descontaminación'],
 ['ref','Referencias','Constantes, IRIS y conversiones'],
 ['hoja','Hoja de tratamiento','Prescripción imprimible'],
 ['info','Información y datos','Aviso, fuentes y copia de seguridad']
].filter(m=>m[0]!=='ddx'||FEATURES.ddx);
function copyText(txt,msg){msg=tr(msg);const fb=()=>{const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast(msg);}catch(_){toast('Selecciona el texto y cópialo');}ta.remove();};try{navigator.clipboard.writeText(txt).then(()=>toast(msg),fb);}catch(_){fb();}}
function toast(m){const t=$('#toast');t.textContent=tr(m);t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1900);}
function banner(type,title,body){const icn=type==='danger'?ICON.x:type==='warn'?ICON.warn:type==='ok'?ICON.ok:ICON.i;return`<div class="banner ${type}">${icn}<div>${title?`<b>${title}</b>`:''}${body||''}</div></div>`;}
function addSheet(item){S.sheet.push(Object.assign({spn:spN(),kg:kg(),time:new Date().toLocaleTimeString(LOC(),{hour:'2-digit',minute:'2-digit'})},item));save();renderSide();toast('Añadido a la hoja de tratamiento');}
function patientLine(){return`<span>${esc(S.p.name)||'Paciente sin nombre'}</span> · <span>${spN()}</span> · <span class="tn">${fmt(kg(),3)} kg</span>`;}
function noWeight(){return !(S.p.kg>0);}

