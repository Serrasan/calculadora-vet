/* =================== INIT =================== */
(function init(){
  const h=(location.hash||'').slice(1);if(VIEWS[h]&&(h!=='ddx'||FEATURES.ddx))S.view=h;
  if(!SPECIES[S.p.sp]){S.p.sp='d';S.p.kg=12;S.p.unit='kg';}
  $('#pName').value=S.p.name;document.documentElement.lang=LANG;document.title=tr('Calculadora Vet');document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===LANG)));setWeightField();i18nDom(document.body);all();
  showAck();
})();
