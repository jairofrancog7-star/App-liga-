/* V374 — Estadísticas de equipo extendidas según referencia.
   Sólo rellena métricas oficiales disponibles; las no publicadas se muestran como —. */
(function(){
'use strict';
if(window.__LJR_V374_TEAM_STATS_REFERENCE__)return;
window.__LJR_V374_TEAM_STATS_REFERENCE__=true;

const LOCAL='./data/official-live.json?v=20261001-v491-v35-all-pages';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261001-v491-v35-all-pages';
let db=window.LJR_OFFICIAL_DATA||null,loading=null,applying=false;

function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function num(v){const n=Number(v);return Number.isFinite(n)?n:0}
async function load(){if(db)return db;if(loading)return loading;loading=(async()=>{for(const u of [LOCAL,REMOTE]){try{const r=await fetch(u,{cache:'no-store'});if(r.ok){db=await r.json();window.LJR_OFFICIAL_DATA=window.LJR_OFFICIAL_DATA||db;break}}catch(e){}}return db})();return loading}
function ctx(){
 const wanted=localStorage.getItem('v62-team-name')||document.querySelector('.v42-title h1')?.textContent||'';
 const saved=String(localStorage.getItem('v62-category')||'');let fallback=null;
 for(const [id,c] of Object.entries(db?.categories||{})){
  const names=[...(c?.standings?.[0]?.rows||[]).map(r=>r?.[1]),...Object.keys(c?.rosters||{}),...(c?.fixtures?.[0]?.rows||[]).flatMap(r=>[r?.[2],r?.[6]]),...(c?.scorers?.[0]?.rows||[]).map(r=>r?.[2])].filter(Boolean);
  if(!names.some(n=>norm(n)===norm(wanted)))continue;
  const x={id:String(id),c,name:names.find(n=>norm(n)===norm(wanted))||wanted};
  if(String(id)===saved)return x;if(!fallback)fallback=x;
 }
 return fallback;
}
function standing(x){return (x?.c?.standings?.[0]?.rows||[]).find(r=>norm(r?.[1])===norm(x.name))||['','',0,0,0,0,0,0,0,0]}
function scorers(x){return (x?.c?.scorers?.[0]?.rows||[]).filter(r=>Array.isArray(r)&&r.length>=4&&norm(r[2])===norm(x.name)&&/^\d+$/.test(String(r[3]||''))).sort((a,b)=>num(b[3])-num(a[3]))}
function cards(x){return (x?.c?.cards?.[0]?.rows||[]).filter(r=>Array.isArray(r)&&r.length>=4&&norm(r[2])===norm(x.name))}
function suspensions(x){return (x?.c?.suspensions?.[0]?.rows||[]).filter(r=>Array.isArray(r)&&r.length>=2&&norm(r[1])===norm(x.name))}
function cardTotal(rows,type){return rows.filter(r=>norm(r[0]).includes(type)).reduce((a,r)=>a+num(r[3]),0)}
function metric(value,label){return '<div class="v374-metric"><b>'+esc(value)+'</b><span>'+esc(label)+'</span></div>'}
function unavailable(label){return '<div class="v374-line unavailable"><span>'+esc(label)+'</span><b>—</b></div>'}
function line(label,value){return '<div class="v374-line"><span>'+esc(label)+'</span><b>'+esc(value)+'</b></div>'}
function section(title,body){return '<section class="v374-panel open"><button type="button" class="v374-panel-head" data-v374-toggle><span>'+esc(title)+'</span><i></i></button><div class="v374-panel-body">'+body+'</div></section>'}
function circle(value,label){return '<div class="v374-circle"><strong>'+esc(value)+'</strong><small>'+esc(label)+'</small></div>'}

function html(x){
 const st=standing(x),sc=scorers(x),ca=cards(x),su=suspensions(x);
 const yell=cardTotal(ca,'amar'),red=cardTotal(ca,'roj'),top=sc[0]||null;
 const goals=num(st[6]),against=num(st[7]),played=num(st[2]),wins=num(st[3]),draws=num(st[4]),losses=num(st[5]),diff=num(st[8]),pts=num(st[9]);
 const key='<div class="v374-possession">'+circle('—','Posesión de balón (%)')+'<div><p><i></i><span>'+esc(x.name)+'</span><b>—</b></p><p><i></i><span>Rivales</span><b>—</b></p><p><i></i><span>Empates</span><b>'+draws+'</b></p></div></div>'+
  '<div class="v374-grid">'+metric(goals,'Goles')+metric(against,'Goles en contra')+metric('—','Disparos totales')+metric('—','Disparos a puerta')+metric('—','Grandes ocasiones')+metric('—','Ocasiones falladas')+metric('—','Distancia recorrida (km)')+metric(yell,'Tarjetas amarillas')+metric(red,'Tarjetas rojas')+metric(played,'Partidos disputados')+metric(wins,'Ganados')+metric(losses,'Perdidos')+metric(diff,'Diferencia de goles')+metric(pts,'Puntos')+metric(su.length,'Jugadores castigados')+metric(sc.reduce((a,r)=>a+num(r[3]),0),'Goles en tabla de goleo')+'</div>'+
  '<div class="v374-unavailable-note">Posesión, disparos, distancia y ocasiones no están publicados en la fuente oficial actual.</div>';

 const attack='<div class="v374-grid compact">'+metric(goals,'Goles')+metric('—','Goles de penalti')+metric('—','Goles desde fuera del área')+metric('—','Grandes ocasiones')+'</div>'+
  unavailable('Disparos a puerta')+unavailable('Disparos totales')+unavailable('Asistencias')+unavailable('Fueras de juego')+unavailable('Tiros de esquina')+
  '<div class="v374-duels">'+circle('—','Duelos totales')+'<div>'+line('Duelos aéreos ganados','—')+line('Duelos en el suelo ganados','—')+line('Duelos perdidos','—')+'</div></div>'+
  '<div class="v374-dribbles">'+circle('—','Regates')+'<div>'+line('Completados','—')+line('Fallidos','—')+'</div></div>'+
  unavailable('Intercepciones')+unavailable('Entradas')+unavailable('Despejes')+
  '<div class="v374-grid compact">'+metric('—','Bloqueos de disparo')+metric('—','Paradas del portero')+metric('—','Distribuciones del portero')+metric('—','Balones recuperados')+metric('—','Faltas cometidas')+metric('—','Faltas recibidas')+'</div>'+unavailable('Alineación · Duelos ganados')+unavailable('Alineación · Duelos perdidos')+unavailable('Pases en el último tercio');

 const scorer=top?'<div class="v374-scorer"><span class="v374-ball">⚽</span><div><b>'+esc(top[1])+'</b><small>'+esc(x.name)+'</small></div><strong>'+esc(top[3])+'</strong></div>':'<div class="v374-empty">Sin goleador oficial publicado para este equipo.</div>';

 const distribution='<div class="v374-pass-total"><b>—</b><span>Pases totales</span></div>'+
  '<div class="v374-circles">'+circle('—','Precisión de pase')+circle('—','Pases completados')+'</div>'+
  unavailable('Pases completados')+unavailable('Pases en el último tercio')+unavailable('Pases al área')+unavailable('Pases largos completados')+unavailable('Pases cortos completados')+unavailable('Pases progresivos')+unavailable('Pases hacia atrás')+
  '<div class="v374-one-circle">'+circle('—','Centros con éxito')+'</div>'+unavailable('Centros completados')+
  '<div class="v374-grid compact">'+metric('—','Pases clave')+metric('—','Pases en campo propio')+'</div>'+unavailable('Pases en campo rival')+unavailable('Pases en largo')+unavailable('Pases laterales');

 const defense='<div class="v374-grid compact">'+metric(against,'Goles encajados')+metric('—','Entradas')+metric('—','Intercepciones')+metric('—','Despejes')+metric('—','Bloqueos de disparo')+metric('—','Paradas del portero')+metric(red,'Tarjetas rojas')+metric(yell,'Tarjetas amarillas')+'</div>'+
  unavailable('Bloqueos')+unavailable('Paradas')+unavailable('Duelos defensivos ganados');

 return '<div class="v374-stats-shell"><label class="v374-filter"><span>Todos (temporada)</span><i>⌄</i></label>'+
  section('Datos clave',key)+section('Ataque',attack)+section('Goleador',scorer)+section('Distribución',distribution)+section('Defensa',defense)+
  '<p class="v374-source">Datos oficiales publicados por la Liga. Los campos con “—” no están disponibles en el origen actual.</p></div>';
}
function bind(host){host.querySelectorAll('[data-v374-toggle]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>b.closest('.v374-panel')?.classList.toggle('open'))})}
async function apply(){
 if(applying||route()!=='teamDetail')return;
 applying=true;
 try{
  await load();if(!db)return;
  const page=document.querySelector('#screen [data-v42-reference="teamDetail"]');if(!page)return;
  const active=(page.querySelector('.v42-tabs .active')?.textContent||'').trim();if(!/Estad/i.test(active))return;
  const host=page.querySelector('.v42-stats'),x=ctx();if(!host||!x)return;
  const sig=[x.id,norm(x.name),db?.captured_at_utc||''].join('|');
  if(host.dataset.v374Sig===sig&&host.querySelector('.v374-stats-shell'))return;
  host.dataset.v374Sig=sig;host.innerHTML=html(x);bind(host);
 }finally{applying=false}
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(apply))}
window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{
 if(route()!=='teamDetail'||!(e.target instanceof Element))return;
 const stats=e.target.closest('[data-v42-tab="stats"],[data-v372-tab="stats"]');
 if(stats){
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  localStorage.setItem('v42-team-tab','stats');
  document.body.classList.remove('v372-team-collapsed');
  setTimeout(()=>{
   if(window.LJR_TEAM_DETAIL_API?.openTab)window.LJR_TEAM_DETAIL_API.openTab('stats');
   else document.querySelector('.v42-tabs [data-v42-tab="stats"]')?.click();
   setTimeout(schedule,0);
  },0);
  return;
 }
 if(e.target.closest('[data-v42-tab],[data-v372-tab]'))setTimeout(schedule,0);
},true);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='teamDetail')schedule()}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,500);setTimeout(schedule,1300);
})();