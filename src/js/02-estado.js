/* =================== STATE =================== */
const S={p:{name:'',hc:'',breed:'',age:'',sp:'d',kg:12,unit:'kg'},view:'inicio',
  drug:'meloxicam',doses:{},pres:{},cat:'Todos',q:'',
  cri:'fentanilo',criDose:{},criMode:'jeringa',syr:50,syrRate:2,bag:500,bagRate:null,
  fl:{dehyd:5,hours:24,losses:0,set:20,k:3.5,bagK:1000,dex:0,bagDex:500},
  tx:{prod:'se',rec:15,des:null,don:null},
  nut:{bcs:5,fac:0,kcal:370,meals:2},
  tox:{t:'choc',chocType:2,g:100,xg:5,mg:400},
  ref:{conv:'kg',cv:10,cre:1.8,creU:'mg',sdma:'',upc:'',pas:''},
  sheet:[],notes:'',vet:'',
  alta:[],altaNotes:'',altaRev:'',
  auth:{mode:'in'},
  ddx:{caso:'',lab:'',img:'',sex:'',busy:false,result:null,err:'',blocked:false}};
try{const s=JSON.parse(localStorage.getItem('xavi-vet')||'null'); if(s){S.sheet=s.sheet||[];S.notes=s.notes||'';S.vet=s.vet||'';S.alta=s.alta||[];S.altaNotes=s.altaNotes||'';S.altaRev=s.altaRev||'';if(s.p)Object.assign(S.p,s.p);}}catch(e){}
function snapshot(){return{sheet:S.sheet,notes:S.notes,p:S.p,vet:S.vet,alta:S.alta,altaNotes:S.altaNotes,altaRev:S.altaRev};}
function save(){try{localStorage.setItem('xavi-vet',JSON.stringify(snapshot()));}catch(e){}}

