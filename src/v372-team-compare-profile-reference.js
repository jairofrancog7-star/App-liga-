/* V372 — Team profile / Comparar equipos reference.
   Cabecera colapsable, tabs compactas y Partidos anteriores / Próximos partidos.
   Sólo usa datos oficiales disponibles. */
(function(){
'use strict';
if(window.__LJR_V372_TEAM_PROFILE_REFERENCE__)return;
window.__LJR_V372_TEAM_PROFILE_REFERENCE__=true;
const LOCAL='./data/official-live.json?v=20261001-v487-vet35-all-pages';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261001-v487-vet35-all-pages';
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
let db=window.LJR_OFFICIAL_DATA||null,loading=null,menuOpen=false,raf=0;
function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function num(v){const s=String(v??'').trim();return /^-?\d+$/.test(s)?Number(s):null}
function parseDate(v){const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);return m?new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)):null}
const DAYS=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],MONTHS=['ene','feb','mar','abr','may','jun','jul','ago','sept','oct','nov','dic'];
function dlabel(v){const d=parseDate(v);return d?DAYS[d.getDay()]+' '+d.getDate()+' '+MONTHS[d.getMonth()]:String(v||'Fecha por confirmar')}
function tlabel(v){const d=parseDate(v);return d?String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'):'Por confirmar'}
async function load(){if(db)return db;if(loading)return loading;loading=(async()=>{for(const u of [LOCAL,REMOTE]){try{const r=await fetch(u,{cache:'no-store'});if(r.ok){db=await r.json();window.LJR_OFFICIAL_DATA=window.LJR_OFFICIAL_DATA||db;break}}catch(e){}}return db})();return loading}
function ctx(){
 const wanted=localStorage.getItem('v62-team-name')||document.querySelector('.v42-title h1')?.textContent||'';
 const saved=String(localStorage.getItem('v62-category')||'');let fallback=null;
 for(const [id,c] of Object.entries(db?.categories||{})){
  const fixtures=c?.fixtures?.[0]?.rows||[],names=[...(c?.standings?.[0]?.rows||[]).map(r=>r?.[1]),...Object.keys(c?.rosters||{}),...fixtures.flatMap(r=>[r?.[2],r?.[6]])].filter(Boolean);
  if(!names.some(n=>norm(n)===norm(wanted)))continue;
  const name=names.find(n=>norm(n)===norm(wanted))||wanted;
  const x={id:String(id),c,name,fixtures:fixtures.filter(r=>Array.isArray(r)&&(norm(r[2])===norm(name)||norm(r[6])===norm(name)))};
  if(String(id)===saved)return x;if(!fallback)fallback=x;
 }
 return fallback;
}
function logo(name){
 const h=Object.entries(db?.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
 if(typeof h==='string')return h;if(h?.local)return SRC+String(h.local).replace(/^\.\//,'');if(h?.source)return h.source;
 return window.LJR_TEAM_LOGOS?.get?.(name)||SRC+'assets/liga-logo.webp';
}
function played(r){return (num(r?.[3])!==null&&num(r?.[5])!==null)||/jugado|final|gana/i.test(String(r?.[9]||''))}
function ts(r){return parseDate(r?.[8])?.getTime()||0}
function teamLine(name,score){return '<span class="v372-team-line"><img src="'+esc(logo(name))+'" alt="'+esc(name)+'"><b>'+esc(name)+'</b>'+(score!==undefined&&score!==null?'<strong>'+esc(score)+'</strong>':'')+'</span>'}
function matchCard(r,isPlayed){
 const a=num(r[3]),b=num(r[5]),head=dlabel(r[8])+' - Liga Municipal - Jornada '+String(r[1]||'—');
 const detail={
  id:'team-'+String(r[1]||'j')+'-'+norm(r[2]).replace(/\s+/g,'-')+'-'+norm(r[6]).replace(/\s+/g,'-'),
  home:String(r[2]||'Local'),
  away:String(r[6]||'Visitante'),
  time:tlabel(r[8]),
  date:dlabel(r[8]),
  venue:String(r[7]||'Campo por confirmar'),
  category:'Liga Municipal',
  jornada:String(r[1]||''),
  from:'#/teamDetail'
 };
 const encoded=encodeURIComponent(JSON.stringify(detail));
 return '<article class="v372-match-card '+(isPlayed?'played':'future')+'"><h3>'+esc(head)+'</h3><div class="v372-match-body">'+
  '<div class="v372-match-teams">'+teamLine(r[2],isPlayed?a:null)+teamLine(r[6],isPlayed?b:null)+'</div>'+
  (isPlayed?'<div class="v372-match-side final"><b>Final</b><small>'+esc(r[7]||'Campo por confirmar')+'</small></div>':'<div class="v372-match-side"><b>'+esc(tlabel(r[8]))+'</b><button type="button" data-v372-details="'+encoded+'">Ver detalles</button></div>')+
 '</div></article>';
}
function matchesMarkup(x){
 const past=x.fixtures.filter(played).sort((a,b)=>ts(b)-ts(a)),next=x.fixtures.filter(r=>!played(r)).sort((a,b)=>ts(a)-ts(b));
 return '<main class="v372-matches-page">'+
  '<section class="v372-match-section"><h2>Partidos anteriores</h2>'+(past.length?past.map(r=>matchCard(r,true)).join(''):'<div class="v372-empty">No hay partidos anteriores publicados.</div>')+'</section>'+
  '<section class="v372-match-section upcoming"><h2>Próximos partidos</h2>'+(next.length?next.map(r=>matchCard(r,false)).join(''):'<div class="v372-empty">No hay próximos partidos publicados.</div>')+'</section>'+
 '</main>';
}
function active(){return document.querySelector('.v42-tabs [data-v42-tab].active')?.dataset?.v42Tab||'summary'}
function label(id){return ({summary:'Resumen',matches:'Partidos',standings:'Clasificación',squad:'Plantilla',stats:'Estadísticas'})[id]||id}
function tabs(){const a=active();return ['summary','matches','standings','squad','stats'].map(id=>'<button type="button" class="'+(a===id?'active':'')+'" data-v372-tab="'+id+'">'+label(id)+'</button>').join('')}
function compactBellIcon(){
 return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 23h16l-2-3.5V13a6 6 0 0 0-12 0v6.5L8 23Z"/><path d="M13 26a3 3 0 0 0 6 0"/><path d="M9.5 8.5c1.1-2.3 3.4-4 6.5-4s5.4 1.7 6.5 4"/></svg>';
}
function compactDotsIcon(){
 return '<svg viewBox="0 0 24 32" aria-hidden="true"><circle cx="12" cy="7" r="2.4"/><circle cx="12" cy="16" r="2.4"/><circle cx="12" cy="25" r="2.4"/></svg>';
}
function compactMenuIcon(kind){
 if(kind==='follow')return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 16h16"/></svg>';
 if(kind==='compare')return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 11h17l-4-4M23 11l-4 4M26 21H9l4-4M9 21l4 4"/></svg>';
 return '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="24" cy="7" r="3"/><circle cx="8" cy="16" r="3"/><circle cx="24" cy="25" r="3"/><path d="m11 14 10-5M11 18l10 5"/></svg>';
}
function nativeFollowed(){
 return !!document.querySelector('#screen [data-v42-reference="teamDetail"] [data-v42-follow].active');
}
function miniMenuMarkup(){
 const followText=nativeFollowed()?'Dejar de seguir':'Seguir';
 return '<div class="v372-mini-menu" role="menu">'+
  '<button type="button" data-v372-follow role="menuitem"><i>'+compactMenuIcon('follow')+'</i><span>'+followText+'</span></button>'+
  '<button type="button" data-v372-share role="menuitem"><i>'+compactMenuIcon('share')+'</i><span>Compartir</span></button>'+
 '</div>';
}
function compactMarkup(x){
 return '<div class="v372-compact-head" data-v372-compact><div class="v372-compact-top">'+
  '<button type="button" data-v372-back aria-label="Volver"><span class="v372-back-icon"></span></button><h1>'+esc(x.name)+'</h1>'+
  '<div class="v372-compact-actions"><button type="button" data-v372-notify aria-label="Notificaciones">'+compactBellIcon()+'</button><button type="button" data-v372-menu aria-label="Más opciones">'+compactDotsIcon()+'</button></div></div>'+
  '<nav class="v372-compact-tabs">'+tabs()+'</nav>'+
  (menuOpen?miniMenuMarkup():'')+
 '</div>';
}
function ensureCompact(x,page){
 let n=page.querySelector('[data-v372-compact]');
 if(!n){page.insertAdjacentHTML('afterbegin',compactMarkup(x));n=page.querySelector('[data-v372-compact]')}
 else{
  const h=n.querySelector('h1');if(h)h.textContent=x.name;
  const t=n.querySelector('.v372-compact-tabs');if(t)t.innerHTML=tabs();
  n.querySelector('.v372-mini-menu')?.remove();
  if(menuOpen)n.insertAdjacentHTML('beforeend',miniMenuMarkup());
 }
 bindCompact(page);
}
function bindCompact(page){
 page.querySelectorAll('[data-v372-tab]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.onclick=e=>{e.preventDefault();e.stopPropagation();const tab=b.dataset.v372Tab||'';if(window.LJR_TEAM_DETAIL_API?.openTab)window.LJR_TEAM_DETAIL_API.openTab(tab);else document.querySelector('.v42-tabs [data-v42-tab="'+tab+'"]')?.click()}});
 const bind=(sel,fn)=>{const b=page.querySelector(sel);if(!b||b.dataset.bound)return;b.dataset.bound='1';b.onclick=fn};
 bind('[data-v372-back]',()=>document.querySelector('[data-v42-back]')?.click());
 bind('[data-v372-menu]',e=>{e?.preventDefault?.();e?.stopPropagation?.();menuOpen=!menuOpen;schedule()});
 bind('[data-v372-follow]',()=>{menuOpen=false;document.querySelector('[data-v42-follow]')?.click();setTimeout(schedule,0)});
 bind('[data-v372-compare]',()=>{menuOpen=false;(document.querySelector('[data-v369-open-compare]')||document.querySelector('[data-v42-compare]'))?.click()});
 bind('[data-v372-notify]',()=>{menuOpen=false;document.querySelector('[data-v42-bell]')?.click()});
 bind('[data-v372-share]',()=>{menuOpen=false;document.querySelector('[data-v42-share]')?.click()});
}
function sy(){const s=document.querySelector('#screen');return Math.max(window.scrollY||0,document.documentElement.scrollTop||0,s?.scrollTop||0)}
function collapse(){document.body.classList.toggle('v372-team-collapsed',route()==='teamDetail'&&sy()>165)}
function bindScroll(){
 const s=document.querySelector('#screen');
 if(s&&!s.dataset.v372Scroll){s.dataset.v372Scroll='1';s.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(collapse)},{passive:true})}
 if(!window.__v372Scroll){window.__v372Scroll=true;window.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(collapse)},{passive:true})}
}
async function apply(){
 if(route()!=='teamDetail')return;
 await load();if(!db)return;
 const page=document.querySelector('#screen [data-v42-reference="teamDetail"]'),x=ctx();if(!page||!x)return;
 document.body.classList.add('v372-team-reference');ensureCompact(x,page);bindScroll();
 if(active()==='matches'){
  const old=page.querySelector('.v42-tab-page');
  if(old)old.outerHTML=matchesMarkup(x);
 }
 page.querySelectorAll('[data-v372-details]').forEach(b=>{
  if(b.dataset.bound)return;b.dataset.bound='1';
  b.onclick=()=>{
   let detail=null;
   try{detail=JSON.parse(decodeURIComponent(b.dataset.v372Details||''))}catch(e){}
   if(detail){
    try{sessionStorage.setItem('lj-match-detail',JSON.stringify(detail))}catch(e){}
   }
   location.hash='#/match';
  };
 });
 collapse();
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(apply))}
window.addEventListener('hashchange',()=>{menuOpen=false;document.body.classList.remove('v372-team-collapsed');schedule()});
document.addEventListener('click',e=>{
 if(route()!=='teamDetail'||!(e.target instanceof Element))return;
 if(e.target.closest('[data-v42-tab]')){menuOpen=false;setTimeout(schedule,0);return}
 if(menuOpen&&!e.target.closest('[data-v372-menu],.v372-mini-menu')){menuOpen=false;setTimeout(schedule,0)}
},true);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='teamDetail')schedule()}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,500);setTimeout(schedule,1200);
})();