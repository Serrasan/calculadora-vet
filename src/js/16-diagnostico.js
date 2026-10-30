/* =================== DIAGNÓSTICO DIFERENCIAL =================== */
let SAMPLE=undefined, ddxCtl=null;
(window.claude&&window.claude.use?window.claude.use('sample').catch(()=>null):Promise.resolve(null)).then(f=>{SAMPLE=f||null;if(S.view==='ddx')render();});
const EXAMPLE={sex:'Hembra esterilizada',caso:'Perra de 9 años con poliuria y polidipsia de 3 semanas, apetito aumentado, abdomen péndulo y alopecia simétrica en flancos. Jadea mucho en reposo. Sin vómitos ni diarrea.',lab:'ALP 1250 U/L (↑↑), ALT 180 U/L (↑), colesterol 380 mg/dL (↑), glucosa 125 mg/dL, densidad urinaria 1,008, hemograma con leucograma de estrés (neutrofilia, linfopenia, eosinopenia).',img:'Ecografía: hepatomegalia hiperecoica difusa; glándulas adrenales ambas aumentadas de tamaño (izquierda 9 mm de grosor), simétricas.'};
function ddxPrompt(){
  const p=S.p,d=S.ddx;
  return `Eres un veterinario internista con experiencia en medicina de pequeños animales. Elabora un diagnóstico diferencial para este caso clínico, ordenado de mayor a menor probabilidad, usando solo la información aportada y la epidemiología de la especie, raza, edad y sexo. 

PACIENTE
- Especie: ${spN()}
- Raza: ${p.breed||'no indicada'}
- Edad: ${p.age||'no indicada'}
- Sexo y estado reproductivo: ${d.sex||'no indicado'}
- Peso: ${fmt(kg(),3)} kg

DESCRIPCIÓN DEL CASO
${d.caso.trim()||'(sin descripción)'}

ALTERACIONES ANALÍTICAS
${d.lab.trim()||'(no aportadas)'}

PRUEBAS DE IMAGEN
${d.img.trim()||'(no aportadas)'}

Devuelve SOLO un objeto JSON con esta forma exacta:
{"problemas":["lista breve de los problemas clínicos clave identificados"],
 "diferenciales":[{"nombre":"diagnóstico","probabilidad":"alta|media|baja","puntuacion":0-100,"a_favor":["hallazgos del caso que lo apoyan"],"en_contra":["hallazgos que no encajan o faltan"],"pruebas":["pruebas para confirmarlo o descartarlo"]}],
 "urgencias":["signos o diagnósticos que requieren actuación inmediata, si los hay"],
 "siguientes_pasos":["pruebas diagnósticas recomendadas por orden de prioridad"]}
Incluye entre 5 y 8 diferenciales, ordenados por puntuacion descendente. La puntuacion es tu estimación relativa de probabilidad. Sé concreto y clínico; frases cortas; no inventes datos que no estén en el caso.
IDIOMA DE LA RESPUESTA: escribe todos los textos del JSON en ${({es:'castellano',ca:'catalán',en:'inglés'})[LANG]}, pero el campo "probabilidad" siempre con una de estas palabras exactas: alta, media o baja.`;
}
function ddxText(){
  const r=S.ddx.result;if(!r)return'';
  let t=`${tr('DIAGNÓSTICO DIFERENCIAL')} — ${S.p.name||tr('Paciente')} · ${tr(spN())}${S.p.breed?' · '+S.p.breed:''}${S.p.age?' · '+S.p.age:''} · ${fmt(kg(),3)} kg\n\n`;
  if(r.problemas?.length)t+=tr('Problemas:')+' '+r.problemas.join('; ')+'\n\n';
  (r.diferenciales||[]).forEach((x,i)=>{t+=`${i+1}. ${x.nombre} (${tr(x.probabilidad||'')}${x.puntuacion!=null?', '+x.puntuacion+'/100':''})\n   ${tr('A favor:')} ${(x.a_favor||[]).join('; ')}\n   ${tr('En contra:')} ${(x.en_contra||[]).join('; ')}\n   ${tr('Pruebas:')} ${(x.pruebas||[]).join('; ')}\n`;});
  if(r.urgencias?.length)t+='\n'+tr('Urgencias:')+' '+r.urgencias.join('; ')+'\n';
  if(r.siguientes_pasos?.length)t+='\n'+tr('Siguientes pasos:')+' '+r.siguientes_pasos.join('; ')+'\n';
  return t;
}
const asList=v=>Array.isArray(v)?v.map(String).filter(Boolean):(v?[String(v)]:[]);
function normDdx(r){
  if(!r||typeof r!=='object')return null;
  const list=(Array.isArray(r.diferenciales)?r.diferenciales:[]).filter(x=>x&&x.nombre).map(x=>({nombre:String(x.nombre),probabilidad:String(x.probabilidad||'').toLowerCase(),puntuacion:Math.max(0,Math.min(100,Number(x.puntuacion)||0)),a_favor:asList(x.a_favor),en_contra:asList(x.en_contra),pruebas:asList(x.pruebas)}));
  list.sort((a,b)=>b.puntuacion-a.puntuacion);
  if(!list.length)return null;
  return{problemas:asList(r.problemas),diferenciales:list,urgencias:asList(r.urgencias),siguientes_pasos:asList(r.siguientes_pasos)};
}
async function runDdx(){
  const d=S.ddx;
  if(!d.caso.trim()&&!d.lab.trim()&&!d.img.trim()){d.err='Escribe al menos una breve descripción del caso.';render();return;}
  if(!SAMPLE)return;
  ddxCtl=new AbortController();d.busy=true;d.err='';d.result=null;render();
  try{
    const r=await SAMPLE.json(ddxPrompt(),{modelTier:'complex',signal:ddxCtl.signal});
    const n=normDdx(r);
    if(n)d.result=n;else d.err='La respuesta no tenía un formato válido. Pulsa de nuevo para reintentarlo.';
  }catch(e){
    const c=e&&e.code;
    if(c==='cancelled'){}
    else if(['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'].includes(c)){d.blocked=true;}
    else if(c==='rate_limited')d.err='Se ha alcanzado el límite de uso de Claude. Inténtalo de nuevo en unos minutos.';
    else if(c==='session_expired')d.err='La sesión de Claude ha caducado. Vuelve a iniciar sesión y repite la consulta.';
    else if(c==='refused')d.err='Claude no ha podido responder a esta consulta. Reformula la descripción del caso.';
    else if(c==='invalid_json'||c==='empty_completion')d.err='La respuesta no tenía un formato válido. Pulsa de nuevo para reintentarlo.';
    else if(c==='prompt_too_large')d.err='El texto es demasiado largo. Resume la descripción o las analíticas.';
    else d.err='No se ha podido completar la consulta. Comprueba la conexión e inténtalo de nuevo.';
  }finally{d.busy=false;ddxCtl=null;if(S.view==='ddx')render();}
}

function renderDdx(){
  const d=S.ddx,avail=SAMPLE&&!d.blocked,pending=SAMPLE===undefined;
  const sexOpts=['','Macho entero','Macho castrado','Hembra entera','Hembra esterilizada'];
  let out='';
  if(d.busy)out=`<div class="thinking"><span class="spin" aria-hidden="true"></span><div><b style="color:var(--ink)">Analizando el caso…</b><div class="small">El razonamiento clínico tarda entre 20 y 60 segundos.</div></div><button class="btn ghost" data-act="ddxStop" style="margin-left:auto">Detener</button></div>`;
  else if(d.result){const r=d.result;
    out=`${r.urgencias.length?banner('danger','Requiere atención inmediata','<ul data-notr style="margin:4px 0 0;padding-left:18px">'+r.urgencias.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>'):''}
    ${r.problemas.length?`<div class="stack-s"><div class="eyebrow">Lista de problemas</div><div class="chips" data-notr>${r.problemas.map(x=>`<span class="tag info" style="font-size:.84rem;padding:4px 12px">${esc(x)}</span>`).join('')}</div></div>`:''}
    <div class="stack-s"><div class="eyebrow">Diferenciales por orden de probabilidad</div>
    <ol class="ddx-list">${r.diferenciales.map((x,i)=>{const cls=x.probabilidad.startsWith('alta')?'danger':x.probabilidad.startsWith('media')?'warn':'info';
      return`<li class="ddx ${i===0?'top':''}"><span class="rk">${i+1}</span><h4><span data-notr>${esc(x.nombre)}</span> <span class="tag ${cls}">Probabilidad ${esc(x.probabilidad||'—')}</span></h4>
      <div class="bar" role="img" aria-label="Probabilidad relativa ${x.puntuacion} sobre 100"><span style="width:${x.puntuacion}%"></span></div>
      <div class="pc"><div><b>A favor</b><ul data-notr>${x.a_favor.map(v=>`<li>${esc(v)}</li>`).join('')||'<li>—</li>'}</ul></div><div><b>En contra o falta</b><ul data-notr>${x.en_contra.map(v=>`<li>${esc(v)}</li>`).join('')||'<li>—</li>'}</ul></div><div><b>Para confirmar o descartar</b><ul data-notr>${x.pruebas.map(v=>`<li>${esc(v)}</li>`).join('')||'<li>—</li>'}</ul></div></div></li>`;}).join('')}</ol></div>
    ${r.siguientes_pasos.length?`<div class="stack-s"><div class="eyebrow">Siguientes pasos recomendados</div><ol data-notr style="margin:0;padding-left:22px">${r.siguientes_pasos.map(x=>`<li style="margin:3px 0">${esc(x)}</li>`).join('')}</ol></div>`:''}
    <div class="btns"><button class="btn ghost" data-act="ddxCopy">Copiar resultado</button><button class="btn ghost" data-act="ddxRun">Volver a generar</button></div>`;
  }else out=`<div class="empty">Describe el caso y pulsa <b>Generar diferenciales</b>.<br>Cuantos más datos aportes (analíticas e imagen), más afinada será la lista.</div>`;
  return`<section class="panel pad stack">
    <div class="head"><div><div class="eyebrow">Apoyo diagnóstico</div><h2 class="t">Diagnóstico diferencial</h2><div class="sub">${patientLine()}${S.p.breed?' · '+esc(S.p.breed):''}${S.p.age?' · '+esc(S.p.age):''}</div></div>
      <div class="btns"><button class="btn ghost" data-act="ddxExample">Cargar ejemplo</button><button class="btn ghost" data-act="ddxClear">Limpiar</button></div></div>
    <div class="grid2">
      <div class="field"><label for="ddxSex">Sexo y estado reproductivo</label><select id="ddxSex">${sexOpts.map(o=>`<option value="${o}" ${d.sex===o?'selected':''}>${o||'No indicado'}</option>`).join('')}</select></div>
      <div class="small" style="align-self:end">Especie, peso, raza y edad se toman de la ficha del paciente.</div>
    </div>
    <div class="field"><label for="ddxCaso">Descripción del caso</label><textarea id="ddxCaso" style="min-height:120px" placeholder="Motivo de consulta, anamnesis, evolución y hallazgos de la exploración física.">${esc(d.caso)}</textarea></div>
    <div class="grid2">
      <div class="field"><label for="ddxLab">Alteraciones analíticas</label><textarea id="ddxLab" style="min-height:120px" placeholder="Hemograma, bioquímica, urianálisis, electrolitos, gasometría, serologías…">${esc(d.lab)}</textarea></div>
      <div class="field"><label for="ddxImg">Pruebas de imagen</label><textarea id="ddxImg" style="min-height:120px" placeholder="Radiografía, ecografía, TC, RM, ecocardiografía…">${esc(d.img)}</textarea></div>
    </div>
    ${d.err?banner('warn','',esc(d.err)):''}
    ${pending?banner('info','Conectando con Claude…','Un momento.'):avail?`<div class="btns"><button class="btn" data-act="ddxRun" ${d.busy?'disabled':''}>Generar diferenciales</button></div>`:
      banner('info',d.blocked?'Claude no está disponible en esta vista':'Esta copia de la app no puede consultar a Claude','Abre la versión publicada en Claude para generar la lista aquí, o copia el caso ya preparado y pégalo en un chat con Claude.')+`<div class="btns"><button class="btn" data-act="ddxCopyPrompt">Copiar caso para Claude</button></div>`}
  </section>
  ${d.busy||d.result?`<section class="panel pad stack">${out}</section>`:`<section class="panel pad stack">${out}</section>`}
  ${banner('warn','Herramienta de apoyo','La lista es orientativa y depende de los datos introducidos. No sustituye la exploración ni el criterio clínico. No incluyas datos personales del propietario.')}`;
}

