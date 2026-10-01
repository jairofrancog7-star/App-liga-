/* V487 — Veteranos 35+ actual en TODA la app.
   Unifica equipos, Jornada 1 y logos oficiales para cualquier pantalla que lea LJR_OFFICIAL_DATA/API. */
(function(){
'use strict';
if(window.__LJR_V487_V35_GLOBAL__)return;
window.__LJR_V487_V35_GLOBAL__=true;
const BUILD='20261001-v490-v35-all-pages';
const DATA='./data/official-live.json?v='+BUILD;
const TEAMS=['BOAVISTA','FRANCO-TAVERA-JR','HURACAN','CUENDA','AMERICA','AGUILARES','JUVENTUS','LEYENDAS FC','PSV','LA TRINIDAD'];
const LOGOS={"BOAVISTA":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Boavista_wioj7b","FRANCO-TAVERA-JR":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoTaveraVeteranos_qwrqrc","HURACAN":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Huracan_pfndn5","CUENDA":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SantiagoCuenda_fvaq9e","AMERICA":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/America_wbi53g","AGUILARES":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/aguilares_ifdgll","JUVENTUS":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_fpshqs","LEYENDAS FC":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LEYENDAS_jwcnlu","PSV":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PSV_ru3tft","LA TRINIDAD":"https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/La_trinidad_a32pbk"};
const FIX=[
 ['1','1','BOAVISTA','-','vs','-','FRANCO-TAVERA-JR','Campo 1 (Empastado)','10/10/2026 00:00','---'],
 ['2','1','HURACAN','-','vs','-','CUENDA','Campo 4','10/10/2026 15:30','---'],
 ['3','1','AMERICA','-','vs','-','AGUILARES','Fraccionamiento','10/10/2026 15:30','---'],
 ['4','1','JUVENTUS','-','vs','-','LEYENDAS FC','Campo 3','10/10/2026 15:30','---'],
 ['5','1','PSV','-','vs','-','LA TRINIDAD','Campo 4','10/10/2026 17:00','---']
];
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,' ').trim();
const ALIAS={
 'FRANCO TAVERA':'FRANCO-TAVERA-JR','FRANCO TAVERA JR':'FRANCO-TAVERA-JR','F TAVERA':'FRANCO-TAVERA-JR',
 'HURACAN':'HURACAN','AMERICA':'AMERICA','LEYENDAS':'LEYENDAS FC','TRINIDAD':'LA TRINIDAD'
};
function canonical(name){
 const k=norm(name);if(ALIAS[k])return ALIAS[k];
 return TEAMS.find(t=>norm(t)===k)||'';
}
function logo(name){const c=canonical(name);return c?LOGOS[c]||'':''}
function patchDb(d){
 if(!d?.categories?.['2'])return d;
 const c=d.categories['2'];
 c.name='Veteranos 35+';
 c.counts={Equipos:10,'Partidos Jugados':0,'Partidos Pendientes':5,Jugadores:0};
 c.dashboard=c.dashboard||{};c.dashboard.counts={...c.counts};c.dashboard.current_cedulas=[];
 c.dashboard.logo_candidates=TEAMS.map(n=>({source:LOGOS[n],near_text:n}));
 c.standings=[{headers:['#','Equipo','PJ','PG','PE','PP','GF','GC','DIF','PTS'],rows:TEAMS.map((n,i)=>[String(i+1),n,'0','0','0','0','0','0','0','0'])}];
 c.fixtures=[{headers:['#','Jornada','Local','Goles','vs','Goles','Visitante','Campo','Fecha/Hora','Árbitro'],rows:FIX.map(r=>r.slice())}];
 c.rosters=Object.fromEntries(TEAMS.map(n=>[n,Array.isArray(c.rosters?.[n])?c.rosters[n]:[]]));
 c.scorers=Array.isArray(c.scorers)?c.scorers:[];c.cards=Array.isArray(c.cards)?c.cards:[];c.suspensions=Array.isArray(c.suspensions)?c.suspensions:[];
 d.team_logos=d.team_logos||{};
 for(const n of TEAMS)d.team_logos[n]={source:LOGOS[n]};
 for(const [a,t] of Object.entries({'FRANCO TAVERA':'FRANCO-TAVERA-JR','F. TAVERA':'FRANCO-TAVERA-JR','HURACÁN':'HURACAN','AMÉRICA':'AMERICA','LEYENDAS':'LEYENDAS FC','TRINIDAD':'LA TRINIDAD'}))d.team_logos[a]={source:LOGOS[t]};
 return d;
}
function patchApi(){
 const api=window.LJR_OFFICIAL_API;if(!api||api.__v487)return;
 const oldGetData=api.getData?.bind(api),oldGetCategory=api.getCategory?.bind(api),oldLogo=api.getLogo?.bind(api);
 api.getData=()=>patchDb(oldGetData?oldGetData():window.LJR_OFFICIAL_DATA||{});
 api.getCategory=id=>String(id)==='2'?api.getData()?.categories?.['2']:(oldGetCategory?oldGetCategory(id):api.getData()?.categories?.[String(id)]);
 api.getLogo=name=>logo(name)||(oldLogo?oldLogo(name):'');
 api.__v487=true;
}
function patchLogoRegistry(){
 const reg=window.LJR_TEAM_LOGOS;if(!reg||reg.__v487)return;
 const old=reg.get?.bind(reg);
 reg.get=name=>logo(name)||(old?old(name):'');
 reg.__v487=true;
}
function fixStored(){
 try{
  const cat=String(localStorage.getItem('v62-category')||localStorage.getItem('v12-fixture-cat')||'');
  if(cat!=='2')return;
  const raw=localStorage.getItem('v62-team-name')||'';
  const c=canonical(raw);
  if(c)localStorage.setItem('v62-team-name',c);
  else if(raw)localStorage.removeItem('v62-team-name');
 }catch(_){}
}
function patchImages(root=document){
 root.querySelectorAll?.('img[alt],img[title]').forEach(img=>{
  const name=img.getAttribute('alt')||img.getAttribute('title')||'';
  const src=logo(name);if(src&&img.src!==src){img.src=src;img.style.objectFit='contain';img.style.objectPosition='center'}
 });
}
function apply(data){
 if(data){patchDb(data);window.LJR_OFFICIAL_DATA=data}
 else if(window.LJR_OFFICIAL_DATA)patchDb(window.LJR_OFFICIAL_DATA);
 patchApi();patchLogoRegistry();fixStored();patchImages(document);
 try{window.LJR_TEAM_LOGOS?.refresh?.()}catch(_){}
 window.dispatchEvent(new CustomEvent('ljr:v35-global-sync',{detail:{build:BUILD,teams:TEAMS.slice()}}));
}
async function refresh(){
 let d=null;try{const r=await fetch(DATA,{cache:'no-store'});if(r.ok)d=await r.json()}catch(_){}
 apply(d||window.LJR_OFFICIAL_DATA||window.LJR_OFFICIAL_API?.getData?.());
}
let mo;
function start(){
 apply(window.LJR_OFFICIAL_DATA||window.LJR_OFFICIAL_API?.getData?.());
 refresh();
 if(document.body){
  mo=new MutationObserver(m=>{for(const x of m)for(const n of x.addedNodes)if(n.nodeType===1)patchImages(n)});
  mo.observe(document.body,{childList:true,subtree:true});
 }
 window.addEventListener('hashchange',()=>setTimeout(()=>{apply(window.LJR_OFFICIAL_DATA||window.LJR_OFFICIAL_API?.getData?.())},60));
 window.addEventListener('ljr:official-data',()=>setTimeout(()=>apply(window.LJR_OFFICIAL_DATA||window.LJR_OFFICIAL_API?.getData?.()),20));
}
window.LJR_V487_V35={teams:TEAMS.slice(),logos:{...LOGOS},refresh,apply,canonical};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();