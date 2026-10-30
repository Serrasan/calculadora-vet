/* =================== HOJA =================== */
function renderHoja(){
  const rows=S.sheet,today=new Date().toLocaleDateString(LOC(),{day:'numeric',month:'long',year:'numeric'});
  return`<section class="panel pad stack">
        <div class="head"><div><div class="eyebrow"><span>Hoja de tratamiento</span> · <span data-notr>${today}</span></div><h2 class="t">${esc(S.p.name)||'Paciente sin nombre'}</h2>
      <div class="sub">${[S.p.hc?'HC '+esc(S.p.hc):'','<span>'+spN()+'</span>',esc(S.p.breed),esc(S.p.age),fmt(kg(),3)+' kg'].filter(Boolean).join(' · ')}</div></div>
      <div class="btns no-print"><button class="btn ghost" data-act="clearSheet" ${rows.length?'':'disabled'}>Vaciar</button><button class="btn ghost" data-act="copySheet" ${rows.length?'':'disabled'}>Copiar texto</button><button class="btn" data-act="shareSheet" ${rows.length?'':'disabled'}>Compartir</button></div></div>
    <div class="field" style="max-width:360px"><label for="vet">Veterinario responsable</label><input id="vet" type="text" value="${esc(S.vet)}" placeholder="Nombre del veterinario"></div>
    ${rows.length?`<div class="tw"><table><thead><tr><th>Hora</th><th>Tratamiento</th><th>Dosis</th><th>Administrar</th><th>Vía · frecuencia</th><th class="no-print"></th></tr></thead><tbody>
    ${rows.map((r,i)=>`<tr><td class="tn">${esc(r.time)}</td><td><b>${esc(r.n)}</b><div class="small">${esc(r.pres)}</div>${r.kg!==kg()||r.spn!==spN()?`<div class="small" style="color:var(--warn)">Calculado para ${esc(r.spn)} de ${fmt(r.kg,3)} kg</div>`:''}</td>
      <td class="tn">${esc(r.dose)}<div class="small">${esc(r.total)}</div></td><td class="amt">${esc(r.amount)}</td><td>${esc(r.route)}<div class="small">${esc(r.freq)}</div></td>
      <td class="no-print"><button class="x" data-del="${i}" aria-label="Quitar">×</button></td></tr>`).join('')}</tbody></table></div>`
    :`<div class="empty">La hoja está vacía.<br>Añade tratamientos desde el formulario, las infusiones, la fluidoterapia, la transfusión o la nutrición.</div>`}
    <div class="field"><label for="notes">Observaciones e indicaciones</label><textarea id="notes" placeholder="Ej.: control de glucemia cada 4 h; reevaluar dolor (Glasgow) a las 2 h; ayuno desde las 22:00.">${esc(S.notes)}</textarea></div>
    <div class="sig"><div><span>Firma del veterinario</span>${S.vet?' · <span data-notr>'+esc(S.vet)+'</span>':''}</div><div>Fecha y hora</div></div>
  </section>`;
}
function sheetText(){
  const p=S.p;const head=`CALCULADORA VET — ${tr('Hoja de tratamiento')}\n${p.name||tr('Paciente')}${p.hc?' · HC '+p.hc:''} · ${tr(spN())}${p.breed?' · '+p.breed:''} · ${fmt(kg(),3)} kg · ${new Date().toLocaleDateString(LOC())}\n${S.vet?tr('Veterinario:')+' '+S.vet+'\n':''}`;
  return head+S.sheet.map(r=>`• ${r.time} ${tr(r.n)}: ${tr(r.dose)} → ${tr(r.total)} = ${tr(r.amount)} (${tr(r.pres)}) · ${tr(r.route)} · ${tr(r.freq)}`).join('\n')+(S.notes?`\n\n${tr('Observaciones:')} ${S.notes}`:'');
}

