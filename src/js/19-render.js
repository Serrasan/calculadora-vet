/* =================== RENDER =================== */
const VIEWS={inicio:renderInicio,ddx:renderDdx,altas:renderAltas,farmacos:renderFarmacos,cri:renderCRI,rcp:renderRCP,fluidos:renderFluidos,transf:renderTransf,nutri:renderNutri,tox:renderTox,ref:renderRef,hoja:renderHoja,info:renderInfo,login:renderLogin};
function render(){
  const a=document.activeElement,id=a&&a.id,inView=a&&$('#view').contains(a);let raw=null,ss,se;
  if(inView&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA')&&a.type!=='range'){raw=a.value;try{ss=a.selectionStart;se=a.selectionEnd;}catch(e){}}
  $('#view').innerHTML=VIEWS[S.view]();i18nDom($('#view'));
  if(inView&&id){const el=document.getElementById(id);if(el){el.focus({preventScroll:true});if(raw!=null){el.value=raw;try{el.setSelectionRange(ss,se);}catch(e){}}}}
}
function all(){document.body.classList.toggle('auth',S.view==='login');renderPatientBar();renderSide();render();i18nDom($('.pbar'));i18nDom($('#side'));}
function go(v){closeMore();S.view=v;all();{const m=$('#view');m.classList.remove('enter');void m.offsetWidth;m.classList.add('enter');}try{if(location.hash.slice(1)!==v)history.pushState(null,'','#'+v);}catch(e){}window.scrollTo({top:0,behavior:'smooth'});}

{const _rpb=renderPatientBar,_rs=renderSide;renderPatientBar=function(){_rpb();i18nDom($('.pbar'));};renderSide=function(){_rs();i18nDom($('#side'));};}
