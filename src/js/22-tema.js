/* =================== TEMA DÍA / NOCHE =================== */
const SUN='M12 4V2M12 22v-2M4.9 4.9 3.5 3.5M20.5 20.5l-1.4-1.4M4 12H2M22 12h-2M4.9 19.1l-1.4 1.4M20.5 3.5l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z';
const MOON='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z';
function isDark(){const t=document.documentElement.getAttribute('data-theme');if(t)return t==='dark';return window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches;}
function paintTheme(){const d=isDark();$('#themeIcon').setAttribute('d',d?SUN:MOON);const tx=$('#themeTxt');tx.__es=d?'Día':'Noche';tx.textContent=tr(tx.__es);const b=$('#themeBtn');b.__esA={'aria-label':d?'Cambiar a modo día':'Cambiar a modo noche'};b.setAttribute('aria-label',tr(b.__esA['aria-label']));}
function setTheme(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem('cv-theme',t);}catch(e){}paintTheme();}
try{const t=localStorage.getItem('cv-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}
$('#themeBtn').addEventListener('click',()=>setTheme(isDark()?'light':'dark'));
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',paintTheme);}catch(e){}
paintTheme();
