/* =================== REFERENCIAS =================== */
const VITALS=[['d','60–140 lpm (razas toy hasta 180)','10–30 rpm','37,5–39,2 °C','37–55 %'],['c','140–220 lpm','20–30 rpm','38,1–39,2 °C','30–45 %'],['r','180–300 lpm','30–60 rpm','38,5–40,0 °C','30–50 %'],['f','180–250 lpm','33–36 rpm','37,8–40,0 °C','44–61 %']];
const CONV={kg:['kg → lb',v=>v*2.20462,'lb'],lb:['lb → kg',v=>v/2.20462,'kg'],c:['°C → °F',v=>v*9/5+32,'°F'],f:['°F → °C',v=>(v-32)*5/9,'°C'],glu:['Glucosa mg/dL → mmol/L',v=>v/18,'mmol/L'],glu2:['Glucosa mmol/L → mg/dL',v=>v*18,'mg/dL'],cre:['Creatinina mg/dL → µmol/L',v=>v*88.4,'µmol/L'],cre2:['Creatinina µmol/L → mg/dL',v=>v/88.4,'mg/dL'],pct:['Solución % → mg/mL',v=>v*10,'mg/mL'],mgml:['mg/mL → %',v=>v/10,'%']};
function renderRef(){
  const w=kg(),sp=S.p.sp,R=S.ref;
  const bsa=sp==='c'?0.1*Math.pow(w,2/3):0.101*Math.pow(w,2/3);
  const [cn,cf,cu]=CONV[R.conv];const cres=cf(R.cv);
  let iris='';
  if(isDC()){
    const cr=R.creU==='mg'?R.cre:R.cre/88.4;
    const cst=sp==='d'?(cr<1.4?1:cr<=2.8?2:cr<=5?3:4):(cr<1.6?1:cr<=2.8?2:cr<=5?3:4);
    const sd=num(R.sdma);const sst=isNaN(sd)?null:(sp==='d'?(sd<18?1:sd<=35?2:sd<=54?3:4):(sd<18?1:sd<=25?2:sd<=38?3:4));
    const upc=num(R.upc);const up=isNaN(upc)?null:(upc<0.2?['No proteinúrico','ok']:upc<=(sp==='d'?0.5:0.4)?['Proteinuria límite','warn']:['Proteinúrico','danger']);
    const pas=num(R.pas);const pa=isNaN(pas)?null:(pas<140?['Normotenso','ok']:pas<160?['Prehipertenso','warn']:pas<180?['Hipertenso','danger']:['Hipertensión grave','danger']);
    iris=`<section class="panel pad stack"><div><h3 class="t">Estadiaje IRIS de la enfermedad renal crónica</h3><div class="sub">${spN()} · paciente estable e hidratado, dos determinaciones</div></div>
      <div class="grid4">
        <div class="field"><label for="rCre">Creatinina</label><input id="rCre" type="text" inputmode="decimal" value="${String(R.cre).replace('.',DEC())}"></div>
        <div class="field"><label for="rCreU">Unidad</label><select id="rCreU"><option value="mg" ${R.creU==='mg'?'selected':''}>mg/dL</option><option value="um" ${R.creU==='um'?'selected':''}>µmol/L</option></select></div>
        <div class="field"><label for="rSdma">SDMA (µg/dL, opcional)</label><input id="rSdma" type="text" inputmode="decimal" value="${esc(R.sdma)}"></div>
        <div class="field"><label for="rUpc">UPC (opcional)</label><input id="rUpc" type="text" inputmode="decimal" value="${esc(R.upc)}"></div>
      </div>
      <div class="grid4">
        <div class="kpi main"><span class="eyebrow">Estadio por creatinina</span><span class="v">IRIS ${cst}</span><span class="s">${fmt(cr,2)} mg/dL</span></div>
        <div class="kpi"><span class="eyebrow">Estadio por SDMA</span><span class="v">${sst?'IRIS '+sst:'—'}</span><span class="s">${sst&&sst>cst?'Valorar el estadio superior':'Sin dato o concordante'}</span></div>
        <div class="kpi"><span class="eyebrow">Proteinuria</span><span class="v" style="font-size:1.1rem">${up?`<span class="tag ${up[1]}">${up[0]}</span>`:'—'}</span><span class="s">UPC ${sp==='d'?'< 0,2 · 0,2–0,5 · > 0,5':'< 0,2 · 0,2–0,4 · > 0,4'}</span></div>
        <div class="field"><label for="rPas">Presión sistólica (mmHg)</label><input id="rPas" type="text" inputmode="decimal" value="${esc(R.pas)}">${pa?`<span class="tag ${pa[1]}">${pa[0]}</span>`:''}</div>
      </div>
      <div class="small">Creatinina ${sp==='d'?'perro: 1 < 1,4 · 2: 1,4–2,8 · 3: 2,9–5,0 · 4 > 5,0':'gato: 1 < 1,6 · 2: 1,6–2,8 · 3: 2,9–5,0 · 4 > 5,0'} mg/dL. SDMA ${sp==='d'?'perro: 1 < 18 · 2: 18–35 · 3: 36–54 · 4 > 54':'gato: 1 < 18 · 2: 18–25 · 3: 26–38 · 4 > 38'} µg/dL.</div>
    </section>`;
  }
  return`<section class="panel pad stack"><div><div class="eyebrow">Referencias</div><h2 class="t">Constantes fisiológicas</h2><div class="sub">Valores de referencia en reposo</div></div>
    <div class="tw"><table><thead><tr><th>Especie</th><th>Frecuencia cardiaca</th><th>Frecuencia respiratoria</th><th>Temperatura</th><th>Hematocrito</th></tr></thead><tbody>
    ${VITALS.filter(([k])=>SPECIES[k]).map(([k,...v])=>`<tr class="${k===sp?'hl':''}"><td><b>${SPECIES[k].n}</b></td>${v.map(x=>`<td class="tn">${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="small">TRC normal < 2 s · diuresis 1–2 mL/kg/h · PAS normal perro y gato 110–140 mmHg.</div></section>
  <div class="grid2">
    <section class="panel pad stack"><h3 class="t">Superficie corporal</h3>
      <div class="kpi main"><span class="eyebrow">${isDC()?spN()+' de '+fmt(w,3)+' kg':'Solo perro y gato'}</span><span class="v">${isDC()?fmt(bsa,3):'—'}<small>${isDC()?'m²':''}</small></span><span class="s">${sp==='c'?'0,100':'0,101'} × kg^(2/3)</span></div>
      ${banner('warn','Quimioterapia','Las dosis en m² requieren verificación doble e independiente. En perros < 10 kg algunos fármacos (doxorrubicina) se dosifican en mg/kg.')}
    </section>
    <section class="panel pad stack"><h3 class="t">Conversiones</h3>
      <div class="grid2"><div class="field"><label for="rConv">Conversión</label><select id="rConv">${Object.entries(CONV).map(([k,[n]])=>`<option value="${k}" ${R.conv===k?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="field"><label for="rCv">Valor</label><input id="rCv" type="text" inputmode="decimal" value="${String(R.cv).replace('.',DEC())}"></div></div>
      <div class="kpi main"><span class="eyebrow">Resultado</span><span class="v">${isNaN(cres)?'—':fmt(cres,2)}<small>${cu}</small></span><span class="s">${esc(cn)}</span></div>
    </section>
  </div>${iris}`;
}


