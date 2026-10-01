/* V371 — Team Detail completo según referencias móviles.
   Añade al perfil real: marca de Liga, carrusel de rivales, próximo partido,
   plantilla compacta, estado de forma, datos clave y goleador.
   Sólo usa datos oficiales disponibles; no inventa jugadores ni métricas. */
(function(){
'use strict';
if(window.__LJR_V371_TEAM_DETAIL_COMPLETE__)return;
window.__LJR_V371_TEAM_DETAIL_COMPLETE__=true;

const LOCAL='./data/official-live.json?v=20261001-v490-vet35-all-pages';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261001-v490-vet35-all-pages';
const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LEAGUE='./assets/reference/predictor-v36/liga-crest-white.webp';
let db=window.LJR_OFFICIAL_DATA||null,loading=null,busy=false;

function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function same(a,b){return norm(a)===norm(b)}
function n(v){const s=String(v??'').trim();return /^-?\d+$/.test(s)?Number(s):null}
function parseDate(v){
 const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
 if(!m)return null;
 return new Date(Number(m[3]),Number(m[2])-1,Number(m[1]),Number(m[4]||0),Number(m[5]||0),0,0);
}
function initials(v){return String(v||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'JG'}
async function load(){
 if(db)return db;
 if(loading)return loading;
 loading=(async()=>{
  for(const u of [LOCAL,REMOTE]){
   try{const r=await fetch(u,{cache:'no-store'});if(r.ok){db=await r.json();window.LJR_OFFICIAL_DATA=window.LJR_OFFICIAL_DATA||db;break}}catch(e){}
  }
  return db;
 })();
 return loading;
}
function logo(name){
 const hit=Object.entries(db?.team_logos||{}).find(([k])=>same(k,name))?.[1];
 if(typeof hit==='string')return hit;
 if(hit?.local)return ROOT+String(hit.local).replace(/^\.\//,'');
 if(hit?.source)return hit.source;
 return window.LJR_TEAM_LOGOS?.get?.(name)||'./assets/liga-logo.webp';
}
function selected(){
 const name=localStorage.getItem('v62-team-name')||document.querySelector('.v42-title h1')?.textContent||'';
 const wantedCat=String(localStorage.getItem('v62-category')||'');
 let fallback=null;
 for(const [id,c] of Object.entries(db?.categories||{})){
  const names=[
   ...Object.keys(c.rosters||{}),
   ...((c.standings||[])[0]?.rows||[]).map(r=>r?.[1]),
   ...((c.fixtures||[])[0]?.rows||[]).flatMap(r=>[r?.[2],r?.[6]])
  ].filter(Boolean);
  if(!names.some(x=>same(x,name)))continue;
  const ctx={id:String(id),c,name:names.find(x=>same(x,name))||name};
  if(String(id)===wantedCat)return ctx;
  if(!fallback)fallback=ctx;
 }
 return fallback;
}
function standing(ctx){return (ctx?.c?.standings?.[0]?.rows||[]).find(r=>same(r?.[1],ctx.name))||null}
function roster(ctx){
 const hit=Object.entries(ctx?.c?.rosters||{}).find(([k])=>same(k,ctx.name));
 return Array.isArray(hit?.[1])?hit[1].map(String).filter(Boolean):[];
}
function fixtures(ctx){
 return (ctx?.c?.fixtures?.[0]?.rows||[]).filter(r=>Array.isArray(r)&&(same(r[2],ctx.name)||same(r[6],ctx.name)));
}
function opponent(ctx,r){return same(r[2],ctx.name)?r[6]:r[2]}
function resultFor(ctx,r){
 const a=n(r[3]),b=n(r[5]),home=same(r[2],ctx.name);
 if(a!==null&&b!==null){
  const mine=home?a:b,other=home?b:a;
  return mine===other?'E':mine>other?'V':'D';
 }
 const status=norm(r[9]||r.status||'');
 if(status.includes('gana')){
  const winner=status.replace(/^.*gana\s+/,'').trim();
  if(winner)return same(winner,ctx.name)?'V':'D';
 }
 return '';
}
function played(ctx){
 const now=Date.now();
 return fixtures(ctx).filter(r=>{
  const d=parseDate(r[8]); if(d&&d.getTime()>now)return false;
  return !!resultFor(ctx,r);
 }).sort((a,b)=>(parseDate(a[8])?.getTime()||0)-(parseDate(b[8])?.getTime()||0));
}
function future(ctx){
 const now=Date.now();
 return fixtures(ctx).filter(r=>{
  const d=parseDate(r[8]);return d&&d.getTime()>now&&!resultFor(ctx,r);
 }).sort((a,b)=>(parseDate(a[8])?.getTime()||0)-(parseDate(b[8])?.getTime()||0));
}
function scorers(ctx){
 return (ctx?.c?.scorers?.[0]?.rows||[]).filter(r=>Array.isArray(r)&&r.length>=4&&same(r[2],ctx.name)&&n(r[3])!==null)
  .sort((a,b)=>n(b[3])-n(a[3])||String(a[1]).localeCompare(String(b[1]),'es'));
}
function mini(name){
 return '<span class="v371-mini"><img src="'+esc(logo(name))+'" alt="'+esc(name)+'"><b>'+esc(name)+'</b></span>';
}
function recentStrip(ctx){
 const games=fixtures(ctx).slice().sort((a,b)=>(parseDate(b[8])?.getTime()||0)-(parseDate(a[8])?.getTime()||0)).slice(0,7);
 if(!games.length)return '';
 return '<div class="v371-round-strip" aria-label="Partidos del equipo">'+games.map(r=>{
  const opp=opponent(ctx,r)||'Rival',res=resultFor(ctx,r),day=String(r[1]||'');
  return '<button type="button" data-v42-tab="matches"><span class="v371-round-logo '+(res?res.toLowerCase():'')+'"><img src="'+esc(logo(opp))+'" alt="'+esc(opp)+'"></span><small>J'+esc(day)+' · '+esc(String(opp).split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase())+'</small></button>';
 }).join('')+'</div>';
}
function nextMarkup(ctx){
 const r=future(ctx)[0];
 return '<section class="v371-section"><div class="v371-head"><h2>Próximo partido</h2><button type="button" data-v42-tab="matches">Ver todo</button></div>'+
  (r?'<article class="v371-next"><h3>'+esc(r[8]||'Fecha por confirmar')+' · '+esc(ctx.c.name)+' · Jornada '+esc(r[1])+'</h3><div class="v371-next-body"><div>'+mini(r[2])+mini(r[6])+'</div><div class="v371-next-meta"><b>'+esc((String(r[8]||'').split(' ')[1]||'Por confirmar'))+'</b><small>'+esc(r[7]||'Campo por confirmar')+'</small></div></div></article>':
  '<div class="v371-empty">No hay próximo partido con fecha futura publicado.</div>')+
 '</section>';
}
function rosterPreview(ctx){
 const ps=roster(ctx);
 return '<section class="v371-section"><div class="v371-head"><h2>Plantilla</h2><button type="button" data-v42-tab="squad">Ver todo</button></div>'+
  (ps.length?'<div class="v371-preview">'+ps.slice(0,3).map(p=>'<button type="button" data-v42-tab="squad"><span>'+esc(initials(p))+'</span><b>'+esc(p)+'</b><small>Jugador registrado</small></button>').join('')+'</div>':
  '<div class="v371-empty compact">La Liga todavía no publica nombres de jugadores para este equipo.</div>')+
 '</section>';
}
function formMarkup(ctx){
 const f=played(ctx).slice(-5).map(r=>resultFor(ctx,r)).filter(Boolean);
 return '<section class="v371-section v371-form-section"><div class="v371-head"><h2>Estado de forma</h2><span></span></div>'+
  (f.length?'<div class="v371-form">'+f.map(x=>'<b class="'+x.toLowerCase()+'">'+x+'</b>').join('')+'</div>':'<div class="v371-empty compact">Sin suficientes resultados oficiales para mostrar la forma.</div>')+
 '</section>';
}
function dataMarkup(ctx){
 const r=standing(ctx);
 if(!r)return '<section class="v371-section"><div class="v371-head"><h2>Datos clave</h2></div><div class="v371-empty">Sin clasificación oficial publicada.</div></section>';
 const vals={pj:r[2],g:r[3],e:r[4],p:r[5],gf:r[6],gc:r[7],dg:r[8],pts:r[9]};
 return '<section class="v371-section"><div class="v371-head"><h2>Datos clave</h2><button type="button" data-v42-tab="stats">Ver todo</button></div>'+
  '<div class="v371-key-card"><div class="v371-key-top"><div class="v371-ring"><b>'+esc(vals.pj)+'</b><small>Partidos<br>disputados</small></div><div class="v371-wdl"><p><i></i>Ganados <b>'+esc(vals.g)+'</b></p><p><i></i>Empates <b>'+esc(vals.e)+'</b></p><p><i></i>Perdidos <b>'+esc(vals.p)+'</b></p></div></div>'+
  '<div class="v371-key-grid"><div><b>'+esc(vals.gf)+'</b><small>Goles</small></div><div><b>'+esc(vals.gc)+'</b><small>Goles encajados</small></div><div><b>'+esc(vals.dg)+'</b><small>Diferencia</small></div><div><b>'+esc(vals.pts)+'</b><small>Puntos</small></div></div>'+
  '<p class="v371-source">Sólo datos oficiales publicados por la Liga.</p></div></section>';
}
function scorerMarkup(ctx){
 const top=scorers(ctx)[0];
 return '<section class="v371-scorer"><div class="v371-scorer-head"><h2>Goleador</h2><span>⌃</span></div>'+
  (top?'<div class="v371-scorer-row"><span class="v371-scorer-avatar">'+esc(initials(top[1]))+'</span><span><b>'+esc(top[1])+'</b><small>'+esc(ctx.name)+'</small></span><strong>'+esc(top[3])+'</strong></div>':
  '<div class="v371-empty compact">Sin goleador publicado para este equipo.</div>')+
 '</section>';
}
function rebuildSummary(page,ctx){
 const host=page.querySelector('.v42-summary');
 if(!host)return;
 const sig=[ctx.id,norm(ctx.name),db?.captured_at_utc||'',roster(ctx).length,fixtures(ctx).length].join('|');
 if(host.dataset.v371Sig===sig)return;
 host.dataset.v371Sig=sig;
 host.innerHTML=recentStrip(ctx)+nextMarkup(ctx)+rosterPreview(ctx)+formMarkup(ctx)+dataMarkup(ctx)+scorerMarkup(ctx);
}
function rebuildSquad(page,ctx){
 const host=page.querySelector('.v42-squad');
 if(!host)return;
 const ps=roster(ctx),sig=[ctx.id,norm(ctx.name),db?.captured_at_utc||'',ps.length].join('|');
 if(host.dataset.v371Sig===sig)return;
 host.dataset.v371Sig=sig;
 host.innerHTML='<section class="v371-roster-card"><h2>Jugadores registrados</h2><small class="v371-roster-sub">'+esc(ctx.c.name)+'</small>'+
  (ps.length?'<div class="v371-roster-list">'+ps.map((p,i)=>'<button type="button" class="v371-player" data-v42-player="'+esc(p)+'" data-v66-player-team="'+esc(ctx.name)+'" data-v66-cat-id="'+esc(ctx.id)+'"><span class="v371-player-avatar">'+esc(initials(p))+'</span><span><b>'+esc(p)+'</b><small>'+esc(ctx.name)+' · Jugador registrado</small></span><strong>›</strong></button>').join('')+'</div>':
  '<div class="v371-roster-empty"><div class="v371-empty-ball">⚽</div><b>Plantilla pendiente</b><p>La fuente oficial todavía no publica nombres de jugadores para '+esc(ctx.name)+'. En cuanto se sincronicen aparecerán aquí automáticamente.</p></div>')+
 '</section>';
}
function leagueMark(page){
 const hero=page.querySelector('.v42-hero');if(!hero)return;
 const existing=hero.querySelector('.v371-league-mark');
 if(existing){
  existing.style.cssText='position:absolute;z-index:4;top:calc(70px + env(safe-area-inset-top));right:20px;width:74px;height:74px;display:grid;place-items:center;pointer-events:none;overflow:hidden';
  const img=existing.querySelector('img');if(img)img.style.cssText='display:block;width:74px;height:74px;max-width:74px;max-height:74px;object-fit:contain';
  return;
 }
 const mark=document.createElement('div');
 mark.className='v371-league-mark';
 mark.style.cssText='position:absolute;z-index:4;top:calc(70px + env(safe-area-inset-top));right:20px;width:74px;height:74px;display:grid;place-items:center;pointer-events:none;overflow:hidden';
 mark.innerHTML='<img style="display:block;width:74px;height:74px;max-width:74px;max-height:74px;object-fit:contain" src="'+LEAGUE+'" alt="Liga Municipal de Fútbol Juventino Rosas">';
 hero.appendChild(mark);
}
async function apply(){
 if(busy||route()!=='teamDetail')return;
 busy=true;
 try{
  await load();if(!db)return;
  const page=document.querySelector('#screen [data-v42-reference="teamDetail"]');if(!page)return;
  const ctx=selected();if(!ctx)return;
  leagueMark(page);
  const active=(page.querySelector('.v42-tabs .active')?.textContent||'Resumen').trim();
  if(/Plantilla/i.test(active))rebuildSquad(page,ctx);
  else if(/Resumen/i.test(active))rebuildSummary(page,ctx);
 }finally{busy=false}
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(apply))}
window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{if(e.target.closest?.('[data-v42-tab]'))setTimeout(schedule,0)},true);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='teamDetail')schedule()}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,500);setTimeout(schedule,1400);
})();