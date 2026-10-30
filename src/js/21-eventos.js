/* =================== EVENTS =================== */
document.addEventListener('click',e=>{
  if(e.target.id==='more'){closeMore();return;}
  const t=e.target.closest('button,tr.pres');if(!t)return;const ds=t.dataset;
  if(ds.lang){setLang(ds.lang);return;}
  if(ds.nav){go(ds.nav);return;}
  if(ds.sp){S.p.sp=ds.sp;S.p.kg=SPECIES[ds.sp].def;S.p.unit=(ds.sp==='r'||ds.sp==='f')?'g':'kg';setWeightField();save();all();return;}
  if(ds.cat){S.cat=ds.cat;render();return;}
  if(ds.drug){S.drug=ds.drug;render();const ar=$('#view article');if(innerWidth<1100&&ar&&ar.scrollIntoView)ar.scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(ds.pres!=null&&t.matches('tr.pres')){S.pres[S.drug]=+ds.pres;render();return;}
  if(ds.cri){S.cri=ds.cri;render();return;}
  if(ds.crimode){S.criMode=ds.crimode;render();return;}
  if(ds.prod){S.tx.prod=ds.prod;S.tx.don=null;render();return;}
  if(ds.tox){S.tox.t=ds.tox;render();return;}
  if(ds.altaadd){addAlta(ds.altaadd);return;}
  if(ds.altadel!=null){S.alta.splice(+ds.altadel,1);save();render();return;}
  if(ds.del!=null){S.sheet.splice(+ds.del,1);save();renderSide();render();return;}
  if(t.id==='wPlus'||t.id==='wMinus'){const st=S.p.unit==='g'?0.05:(S.p.kg<5?0.1:0.5);S.p.kg=Math.max(0,+(S.p.kg+(t.id==='wPlus'?st:-st)).toFixed(3));setWeightField();save();renderPatientBar();render();return;}
  const act=ds.act;if(!act)return;
  if(act==='addDrug'){const d=DRUGS.find(x=>x.id===S.drug),dose=getDose(d),rows=computeRows(d,dose),r=rows[S.pres[d.id]||0],sd=d.sp[S.p.sp];
    addSheet({n:d.n,pres:r.p.label,dose:`${smart(dose)} ${d.u}/kg`,total:`${smart(dose*kg())} ${d.u}`,amount:r.amount,route:sd.route,freq:sd.freq});render();return;}
  if(act==='addCri'){const c=CRI.find(x=>x.id===S.cri),sd=c.sp[S.p.sp],key=c.id+'|'+S.p.sp,dose=S.criDose[key]!=null?S.criDose[key]:sd[2],ph=criPerHour(c,dose);
    let amount,pres;
    if(S.criMode==='jeringa'){const hrs=S.syrRate>0?S.syr/S.syrRate:0,mL=ph*hrs/c.c;amount=`${vol(mL)} mL + ${vol(S.syr-mL)} mL NaCl a ${fmt(S.syrRate,2)} mL/h`;pres=`Jeringa de ${S.syr} mL`;}
    else if(S.criMode==='bolsa'){const w=kg(),R=S.bagRate!=null?S.bagRate:(S.p.sp==='d'?132*Math.pow(w,0.75):S.p.sp==='c'?80*Math.pow(w,0.75):100*w)/24,mL=ph*(S.bag/R)/c.c;amount=`${vol(mL)} mL en bolsa de ${S.bag} mL a ${fmt(R,1)} mL/h`;pres=`Bolsa de ${S.bag} mL`;}
    else{amount=`${vol(ph/c.c)} mL/h sin diluir`;pres=c.cl||`${fmt(c.c,2)} ${c.cu}/mL`;}
    addSheet({n:c.n+' (infusión)',pres,dose:`${smart(dose)} ${c.du}`,total:`${smart(ph)} ${c.cu}/h`,amount,route:'IV, infusión continua',freq:'Continua'});render();return;}
  if(act==='addFluid'){const p=fluidPlan();addSheet({n:'Fluidoterapia (cristaloide)',pres:`Deshidratación ${S.fl.dehyd} % · reposición en ${S.fl.hours} h`,dose:`${fmt(p.maint,0)} mL/día mant.`,total:`${fmt(p.maint+p.deficit+S.fl.losses,0)} mL/24 h`,amount:`${fmt(p.perH,1)} mL/h, después ${fmt(p.after,1)} mL/h`,route:'IV',freq:'Continua'});render();return;}
  if(act==='addTx'){const T=S.tx,w=kg(),bv=S.p.sp==='d'?90:60;let amount,n;
    if(T.prod==='pfc'){n='Plasma fresco congelado';amount=`${fmt(10*w,0)}–${fmt(20*w,0)} mL`;}
    else{const don=T.don!=null?T.don:(T.prod==='se'?40:65),des=T.des!=null?T.des:(S.p.sp==='d'?25:20);n=T.prod==='se'?'Sangre entera':'Concentrado de hematíes';amount=`${fmt(Math.max(0,w*bv*(des-T.rec)/don),0)} mL`;}
    addSheet({n:'Transfusión: '+n,pres:'Filtro 170–260 µm',dose:T.prod==='pfc'?'10–20 mL/kg':`Hto ${T.rec} → ${T.des!=null?T.des:(S.p.sp==='d'?25:20)} %`,total:'',amount,route:'IV',freq:'0,25 mL/kg/h 30 min; resto en < 4 h'});render();return;}
  if(act==='addNut'){const w=kg(),N=S.nut,facs=FAC[S.p.sp],fi=Math.min(N.fac,facs.length-1),[fn,f]=facs[fi],ideal=w/(1+0.1*(N.bcs-5)),base=f<=1&&fi===3?ideal:w,mer=70*Math.pow(base,0.75)*f,g=mer/N.kcal*100;
    addSheet({n:'Plan nutricional',pres:`${N.kcal} kcal/100 g`,dose:`${fmt(mer,0)} kcal/día`,total:fn,amount:`${fmt(g,0)} g/día`,route:'PO',freq:`${N.meals} tomas al día`});render();return;}
  if(act==='altaCopy'){copyText(altaText(),'Pauta copiada');return;}
  if(act==='altaClear'){S.alta=[];S.altaNotes='';S.altaRev='';save();render();toast('Alta vaciada');return;}
  if(act==='ddxRun'){runDdx();return;}
  if(act==='ddxStop'){ddxCtl&&ddxCtl.abort();return;}
  if(act==='ddxExample'){Object.assign(S.ddx,EXAMPLE,{result:null,err:''});if(!S.p.breed)S.p.breed='Caniche';if(!S.p.age)S.p.age='9 años';if(S.p.sp!=='d'){S.p.sp='d';S.p.kg=8;S.p.unit='kg';setWeightField();}renderPatientBar();render();toast('Ejemplo cargado');return;}
  if(act==='ddxClear'){Object.assign(S.ddx,{caso:'',lab:'',img:'',sex:'',result:null,err:''});render();return;}
  if(act==='ddxCopy'||act==='ddxCopyPrompt'){const txt=act==='ddxCopy'?ddxText():ddxPrompt();copyText(txt,act==='ddxCopy'?'Resultado copiado':'Caso copiado: pégalo en Claude');return;}
  if(act==='clearSheet'){S.sheet=[];save();renderSide();render();toast('Hoja vaciada');return;}
  if(act==='copySheet'){copyText(sheetText(),'Hoja copiada');return;}
  if(act==='shareSheet'){shareText(sheetText(),'Hoja copiada');return;}
  if(act==='altaShare'){shareText(altaText(),'Pauta copiada');return;}
  if(act==='authMode'){S.auth.mode=ds.m;render();return;}
  if(act==='authShow'){const i=$('#authPass');if(i){const s=i.type==='password';i.type=s?'text':'password';t.textContent=s?'Ocultar':'Mostrar';i18nDom(t);}return;}
  if(act==='authSubmit'){toast('Vista previa: el acceso con cuenta aún no está conectado.');return;}
  if(act==='more'){openMore();return;}
  if(act==='moreClose'){closeMore();return;}
  if(act==='ackOk'){try{localStorage.setItem(ACK_KEY,'1');}catch(e){}const m=$('#ack');if(m)m.remove();return;}
  if(act==='exportBackup'){exportBackup();return;}
  if(act==='importPick'){const f=$('#importFile');if(f)f.click();return;}
  if(act==='wipeData'){if(confirm(tr('¿Borrar todos los datos de este dispositivo? Esta acción no se puede deshacer.'))){try{localStorage.removeItem('xavi-vet');}catch(e){}location.reload();}return;}
});
document.addEventListener('change',e=>{if(e.target.id==='importFile'){const f=e.target.files&&e.target.files[0];e.target.value='';if(f)importBackup(f);}});
document.addEventListener('keydown',e=>{const p=e.target.closest&&e.target.closest('tr.pres');if(p&&(e.key==='Enter'||e.key===' ')){e.preventDefault();p.click();}});
document.addEventListener('input',e=>{
  const id=e.target.id,v=e.target.value,n=num(v);
  const am=id&&id.match(/^alta-(dose|days|note)-(\d+)$/);
  if(am){const it=S.alta[+am[2]];if(!it)return;
    if(am[1]==='dose'){if(isNaN(n))return;it.dose=n;}
    else if(am[1]==='days'){it.days=v.trim()===''||isNaN(n)?0:Math.max(0,Math.round(n));}
    else it.note=v;
    save();render();return;}
  switch(id){
    case'weight':S.p.kg=isNaN(n)?0:(S.p.unit==='g'?n/1000:n);save();renderPatientBar();i18nDom($('.pbar'));render();return;
    case'pName':S.p.name=v;save();if(S.view==='hoja'||S.view==='inicio')render();return;
    case'pName2':S.p.name=v;$('#pName').value=v;save();return;
    case'pHc':S.p.hc=v;save();return;
    case'pBreed':S.p.breed=v;save();render();return;
    case'pAge':S.p.age=v;save();return;
    case'q':S.q=v;render();return;
    case'altaQ':S.altaQ=v;render();return;
    case'altaNotes':S.altaNotes=v;save();render();return;
    case'altaRev':S.altaRev=v;save();render();return;
    case'doseIn':case'doseRange':if(!isNaN(n)){S.doses[S.drug+'|'+S.p.sp]=n;render();}return;
    case'criIn':case'criRange':if(!isNaN(n)){S.criDose[S.cri+'|'+S.p.sp]=n;render();}return;
    case'syrRate':if(!isNaN(n)){S.syrRate=n;render();}return;
    case'bagRate':S.bagRate=v.trim()===''||isNaN(n)?null:n;render();return;
    case'flLoss':S.fl.losses=isNaN(n)?0:Math.max(0,n);render();return;
    case'flK':if(!isNaN(n)){S.fl.k=n;render();}return;
    case'txRec':if(!isNaN(n)){S.tx.rec=n;render();}return;
    case'txDes':if(!isNaN(n)){S.tx.des=n;render();}return;
    case'txDon':if(!isNaN(n)&&n>0){S.tx.don=n;render();}return;
    case'nKcal':if(!isNaN(n)){S.nut.kcal=n;render();}return;
    case'chocG':S.tox.g=isNaN(n)?0:n;render();return;
    case'xG':S.tox.xg=isNaN(n)?0:n;render();return;
    case'tMg':S.tox.mg=isNaN(n)?0:n;render();return;
    case'rCv':if(!isNaN(n)){S.ref.cv=n;render();}return;
    case'rCre':if(!isNaN(n)){S.ref.cre=n;render();}return;
    case'rSdma':S.ref.sdma=v;render();return;
    case'rUpc':S.ref.upc=v;render();return;
    case'rPas':S.ref.pas=v;render();return;
    case'notes':S.notes=v;save();return;
    case'vet':S.vet=v;save();if(S.view==='altas')render();return;
    case'ddxCaso':S.ddx.caso=v;return;
    case'ddxLab':S.ddx.lab=v;return;
    case'ddxImg':S.ddx.img=v;return;
  }
});
document.addEventListener('change',e=>{
  const id=e.target.id,v=e.target.value;
  const map={syr:()=>S.syr=+v,bag:()=>S.bag=+v,flDehyd:()=>S.fl.dehyd=+v,flHours:()=>S.fl.hours=+v,flSet:()=>S.fl.set=+v,flBagK:()=>S.fl.bagK=+v,flDex:()=>S.fl.dex=+v,flBagDex:()=>S.fl.bagDex=+v,
    nFac:()=>S.nut.fac=+v,nBcs:()=>S.nut.bcs=+v,nMeals:()=>S.nut.meals=+v,chocType:()=>S.tox.chocType=+v,ddxSex:()=>S.ddx.sex=v,rConv:()=>S.ref.conv=v,rCreU:()=>S.ref.creU=v};
  const ac=id&&id.match(/^alta-(pres|h)-(\d+)$/);
  if(ac){const it=S.alta[+ac[2]];if(it){it[ac[1]]=+v;save();render();}return;}
  if(id==='wUnit'){S.p.unit=v;setWeightField();save();renderPatientBar();return;}
  if(map[id]){map[id]();render();}
});


