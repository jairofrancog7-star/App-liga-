import {defaultDefeatedTeam} from './competition-data.js';
/* V422 — Resultados lower reference.
   Añade SOLO la experiencia inferior de Resultados dentro de Competición.
   No modifica la cabecera, tabs ni contenido existente de la página. */
(function(){
'use strict';
if(window.__LJR_V422_RESULTS_REFERENCE__)return;
window.__LJR_V422_RESULTS_REFERENCE__=true;
const COMPETITION_RESULTS_ENABLED=true;
const ID='v422-results-reference',FAV_KEY='ljr-v414-favorites',MODE_KEY='v422-results-mode',CAT_KEY='v422-results-category',LIVE_KEY='v422-results-live';
let timer=0;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(_){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const api=()=>window.V66_OFFICIAL_DIRECTORY||null;
async function ensureData(){try{await api()?.load?.()}catch(_){}}
function db(){try{return api()?.data?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}}
function logoFor(name){try{return api()?.logoFor?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||''}catch(_){return ''}}
function fallback(name){return String(name||'EQ').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()}
function logo(name){
 const src=logoFor(name);
 return '<span class="v422-logo">'+(src?'<img src="'+esc(src)+'" alt="" loading="lazy" decoding="async">':esc(fallback(name)))+'</span>';
}
function num(v){const s=String(v??'').trim();return /^-?\d+$/.test(s)?Number(s):null}
function timeFrom(v){const m=String(v||'').match(/(?:\s|T)(\d{1,2}:\d{2})/);return m?m[1]:'—'}
function dateOnly(v){
 const s=String(v||'').trim(),m=s.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
 if(m)return m[1].padStart(2,'0')+'/'+m[2].padStart(2,'0')+'/'+m[3];
 const iso=s.match(/(\d{4})-(\d{2})-(\d{2})/);if(iso)return iso[3]+'/'+iso[2]+'/'+iso[1];
 return /fecha por confirmar/i.test(s)?'Fecha por confirmar':s?String(s).slice(0,10):'Fecha por confirmar';
}
function rawStatus(r,complete){
 const s=String(r?.status||r?.estado||'').toUpperCase();
 if(/LIVE|EN VIVO/.test(s))return 'LIVE';if(/FINAL|TERMINADO/.test(s))return 'FINAL';
 if(/SUSP/.test(s))return 'SUSPENDED';if(/POST|APLAZ/.test(s))return 'POSTPONED';
 return complete?'FINAL':'UPCOMING';
}
function matches(){
 const out=[],d=db();
 Object.entries(d?.categories||{}).forEach(([cid,c])=>{
   (c?.fixtures||[]).forEach((g,gi)=>(g?.rows||[]).forEach((r,i)=>{
     if(!Array.isArray(r)||!r[2]||!r[6])return;
     const hs=num(r[3]),as=num(r[5]),complete=hs!==null&&as!==null;
     const decision=c?.fixture_decisions?.[String(r[0])]||null;
     const statusSource=String(r?.[10]||r?.[9]||'').trim();
     const minuteMatch=/\b(\d{1,3})\s*['’]?\b/.exec(statusSource);
     out.push({id:cid+'|'+gi+'|'+i,streamKey:cid+':'+gi+':'+i,cat:String(cid),category:String(c?.name||cid),round:String(r[1]||''),home:String(r[2]||''),away:String(r[6]||''),homeScore:hs,awayScore:as,complete,field:String(r[7]||'Campo por confirmar'),date:String(r[8]||''),statusSource,minute:minuteMatch?Number(minuteMatch[1]):null,status:decision?'AWARDED':rawStatus({status:statusSource},complete),decision});
   }));
 });
 return out;
}
function categories(){
 const d=db(),preferred=['3','5','4','2','1'],seen=new Set(),out=[['all','Todos']];
 preferred.forEach(id=>{const c=d?.categories?.[id];if(c){out.push([id,String(c.name||id)]);seen.add(id)}});
 Object.entries(d?.categories||{}).forEach(([id,c])=>{if(!seen.has(id))out.push([String(id),String(c?.name||id)])});
 return out;
}
function favStore(){return Object.assign({teams:[],players:[],competitions:[],matches:[]},read(FAV_KEY,{}))}
function isFavMatch(m){const s=favStore();return (s.matches||[]).includes(m.id)||(s.teams||[]).some(t=>norm(t)===norm(m.home)||norm(t)===norm(m.away))}
function toggleMatch(id){const s=favStore(),a=new Set(s.matches||[]);a.has(id)?a.delete(id):a.add(id);s.matches=Array.from(a);write(FAV_KEY,s)}
function currentMode(){return localStorage.getItem(MODE_KEY)==='favorites'?'favorites':'results'}
function currentCat(){return localStorage.getItem(CAT_KEY)||'all'}
function liveOnly(){return localStorage.getItem(LIVE_KEY)==='1'}
function resultsTabActive(){
 const fixture=document.querySelector('[data-comp-tab="fixtures"]');
 if(fixture)return fixture.classList.contains('active');
 const active=[...document.querySelectorAll('#screen .tabs .active,#screen [role="tablist"] .active')].map(x=>norm(x.textContent));
 return !active.some(x=>/clasificacion|cuadro|bracket/.test(x));
}
function icon(name){
 const p={search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17"/>',star:'<path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1.1 6.1-5.6-2.9L6.4 20l1.1-6.1L3 9.5l6.2-.9z"/>'};
 return window.LJR_ICONS?.decorate('<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.star)+'</svg>',name) || '<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.star)+'</svg>';
}
function statusText(m){
 if(m.status==='LIVE')return '<span class="v422-live-status"><i></i>'+(Number.isFinite(m.minute)?esc(m.minute)+"'":'EN VIVO')+'</span>';
 if(m.status==='FINAL')return '<span class="v422-final">Final</span>';
 if(m.status==='AWARDED'){
  const loser=defaultDefeatedTeam(m.decision,m.home,m.away);
  return loser?'<span class="v422-final" title="El perdedor por DEFAULT recibe −3 puntos; la tabla oficial ya incluye la sanción.">DEFAULT · −3 pts ('+esc(loser)+')</span>':'<span class="v422-final">Decisión administrativa oficial</span>';
 }
 if(m.status==='SUSPENDED')return '<span class="v422-special">Suspendido</span>';
 if(m.status==='POSTPONED')return '<span class="v422-special">Aplazado</span>';
 return '<span class="v422-time">'+esc(timeFrom(m.date))+'</span>';
}
function scoreText(m){return m.decision?'<strong>'+esc(m.decision.label)+'</strong>':m.complete?'<b>'+m.homeScore+'</b><span>–</span><b>'+m.awayScore+'</b>':'<strong>'+esc(timeFrom(m.date))+'</strong>'}
function provider(url){const u=String(url||'').toLowerCase();if(u.includes('youtube'))return 'YouTube';if(u.includes('facebook')||u.includes('fb.watch'))return 'Facebook';if(u.includes('tiktok'))return 'TikTok';return 'Liga TV'}
function streamFor(key){try{const a=JSON.parse(localStorage.getItem('ljr-stream-list-v196:'+key)||'[]');const x=Array.isArray(a)?a.find(v=>v?.url):null;return x?{url:String(x.url),name:String(x.name||provider(x.url))}:null}catch(_){return null}}
function categoryIcon(id,label){if(id==='all')return '⚽';if(/veteranos/i.test(label))return '🛡';if(id==='3')return '🏆';if(id==='5')return '⚽';if(id==='4')return '🥈';return '⚽'}
// Icono de cancha: reemplaza el antiguo símbolo cuadrado en la sede.
function fieldIcon(){
 return '<svg class="v422-field-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="2.5" y="4" width="19" height="16" rx="1.2"/><path d="M12 4v16"/><circle cx="12" cy="12" r="3.3"/><path d="M2.5 8h3v8h-3M21.5 8h-3v8h3"/></svg>';
}
function openStandings(event){
 event?.preventDefault?.();
 event?.stopPropagation?.();
 // Acceso directo a la tabla de Competición, nunca a Comparar equipos.
 try{
  localStorage.setItem('competitionTab','standings');
  localStorage.setItem('v40-competition-tab','standings');
 }catch(_){}
 const router=window.LJR_MAIN_ROUTE;
 if(router?.state)router.state.competitionTab='standings';
 if(typeof router?.go==='function')router.go('competition');
 else {
  location.hash='#/competition';
  document.querySelector('#screen > .tabs [data-comp-tab="standings"],#screen .tabs [data-comp-tab="standings"]')?.click();
 }
 setTimeout(()=>{
  if(String(location.hash||'').split('?')[0]!=='#/competition')return;
  const tab=document.querySelector('#screen > .tabs [data-comp-tab="standings"],#screen .tabs [data-comp-tab="standings"]');
  if(tab&&!tab.classList.contains('active'))tab.click();
  if(tab?.classList.contains('active')){
   const target=document.querySelector('#screen [data-v40-standings],#screen [data-v12-standings],#screen .v40-standings')||tab;
   target.scrollIntoView?.({behavior:'smooth',block:'start'});
  }
 },130);
}
function matchRow(m){
 const fav=(favStore().matches||[]).includes(m.id),stream=streamFor(m.streamKey);
 return '<article class="v422-match" data-v422-open="'+esc(m.id)+'" data-v422-cat-open="'+esc(m.cat)+'"><button class="v422-star '+(fav?'active':'')+'" type="button" data-v422-star="'+esc(m.id)+'" aria-label="'+(fav?'Quitar de favoritos':'Guardar en favoritos')+'">'+icon('star')+'</button>'+
 '<div class="v422-match-status">'+statusText(m)+'</div><div class="v422-team home"><span>'+esc(m.home)+'</span>'+logo(m.home)+'</div>'+
 '<div class="v422-score">'+scoreText(m)+'<small>'+esc(dateOnly(m.date))+'</small></div><div class="v422-team away">'+logo(m.away)+'<span>'+esc(m.away)+'</span></div>'+
 (stream?'<button type="button" class="v422-venue v422-stream" data-v422-stream="'+esc(stream.url)+'">'+fieldIcon()+'<span>'+esc(stream.name)+' · '+esc(m.field||'Campo por confirmar')+'</span></button>':'<div class="v422-venue">'+fieldIcon()+'<span>'+esc(m.field||'Campo por confirmar')+'</span></div>')+'</article>';
}
function groupCard(cat,rows){
 const first=rows[0];
 return '<section class="v422-card"><header class="v422-card-head"><span><b>'+esc(cat)+'</b><small>Jornada '+esc(first?.round||'—')+'</small></span><span>'+rows.length+' partido'+(rows.length===1?'':'s')+'</span></header>'+
 rows.map(matchRow).join('')+'<button class="v422-standings" type="button" data-v422-standings>Mostrar clasificación</button></section>';
}
function filtered(){
 let list=matches();const cat=currentCat(),mode=currentMode();
 if(cat!=='all')list=list.filter(m=>m.cat===cat);
 if(mode==='favorites')list=list.filter(isFavMatch);
 if(liveOnly())list=list.filter(m=>m.status==='LIVE');
 return list;
}
function listMarkup(){
 const list=filtered();
 if(!list.length){
   const msg=liveOnly()?'No hay partidos publicados como EN VIVO en este momento.':currentMode()==='favorites'?'Todavía no tienes partidos o equipos favoritos en este filtro.':'No hay partidos oficiales disponibles para este filtro.';
   return '<div class="v422-empty">'+esc(msg)+'</div>';
 }
 const groups=[];
 list.forEach(m=>{const key=m.category+'|'+(m.round||'');let g=groups.find(x=>x.key===key);if(!g){g={key,cat:m.category,rows:[]};groups.push(g)}if(g.rows.length<7)g.rows.push(m)});
 return groups.slice(0,12).map(g=>groupCard(g.cat,g.rows)).join('');
}
function categoryStrip(){
 const active=currentCat();
 return '<div class="v422-sports">'+categories().map(([id,label])=>'<button type="button" class="'+(active===id?'active':'')+'" data-v422-cat="'+esc(id)+'"><span>'+categoryIcon(id,label)+'</span><small>'+esc(label)+'</small></button>').join('')+'</div>';
}
function markup(){
 const mode=currentMode(),liveCount=matches().filter(m=>m.status==='LIVE').length;
 return '<section class="v422-results" id="'+ID+'"><div class="v422-topline"><small>RESULTADOS · LIGA JUVENTINO ROSAS</small><div class="v422-actions"><button type="button" data-v422-search aria-label="Buscar">'+icon('search')+'</button><button type="button" data-v422-calendar aria-label="Calendario">'+icon('calendar')+'</button></div></div>'+
 '<div class="v422-tabs"><button type="button" data-v422-mode="favorites" class="'+(mode==='favorites'?'active':'')+'">FAVORITOS</button><button type="button" data-v422-mode="results" class="'+(mode==='results'?'active':'')+'">RESULTADOS</button></div>'+
 '<div class="v422-livebar"><button type="button" class="'+(liveOnly()?'active':'')+'" data-v422-live><i></i> En vivo <b>'+liveCount+'</b></button><span>Partidos oficiales de la Liga</span></div>'+
 categoryStrip()+'<div class="v422-list" data-v422-list>'+listMarkup()+'</div></section>';
}
function refresh(root){
 const list=root.querySelector('[data-v422-list]');if(list)list.innerHTML=listMarkup();
 root.querySelectorAll('[data-v422-mode]').forEach(b=>b.classList.toggle('active',b.dataset.v422Mode===currentMode()));
 root.querySelectorAll('[data-v422-cat]').forEach(b=>b.classList.toggle('active',b.dataset.v422Cat===currentCat()));
 root.querySelector('[data-v422-live]')?.classList.toggle('active',liveOnly());bindDynamic(root);
}
function bindDynamic(root){
 root.querySelectorAll('[data-v422-star]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();toggleMatch(b.dataset.v422Star);refresh(root)});
 root.querySelectorAll('[data-v422-stream]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();try{window.open(b.dataset.v422Stream,'_blank','noopener,noreferrer')}catch(_){}});
 root.querySelectorAll('[data-v422-open]').forEach(a=>a.onclick=e=>{if(e.target?.closest?.('button'))return;try{localStorage.setItem('v62-category',a.dataset.v422CatOpen||'3')}catch(_){};location.hash='#/matchCenter'});
 root.querySelectorAll('[data-v422-standings]').forEach(b=>b.onclick=openStandings);
}
function bind(root){
 root.querySelectorAll('[data-v422-mode]').forEach(b=>b.onclick=()=>{localStorage.setItem(MODE_KEY,b.dataset.v422Mode);refresh(root)});
 root.querySelectorAll('[data-v422-cat]').forEach(b=>b.onclick=()=>{localStorage.setItem(CAT_KEY,b.dataset.v422Cat);refresh(root)});
 root.querySelector('[data-v422-live]')?.addEventListener('click',()=>{localStorage.setItem(LIVE_KEY,liveOnly()?'0':'1');refresh(root)});
 root.querySelector('[data-v422-search]')?.addEventListener('click',()=>location.hash='#/search');
 root.querySelector('[data-v422-calendar]')?.addEventListener('click',()=>location.hash='#/v4-calendar');
 bindDynamic(root);
}
async function mount(force=false){
 const screen=document.querySelector('#screen');if(!screen)return;
 const existing=screen.querySelector('#'+ID);
 if(!COMPETITION_RESULTS_ENABLED||route()!=='competition'||!resultsTabActive()){existing?.remove();return}
 if(existing&&!force){const v105=screen.querySelector('#v105-bottom');if(v105&&existing.nextElementSibling!==v105)screen.insertBefore(existing,v105);return}
 await ensureData();if(route()!=='competition'||!resultsTabActive())return;
 existing?.remove();const host=document.createElement('div');host.innerHTML=markup();const node=host.firstElementChild;if(!node)return;
 const v105=screen.querySelector('#v105-bottom');if(v105)screen.insertBefore(node,v105);else screen.appendChild(node);bind(node);
}
function schedule(ms=80,force=false){clearTimeout(timer);timer=setTimeout(()=>mount(force),ms)}
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-comp-tab]'))setTimeout(()=>schedule(90,true),60)},true);
window.addEventListener('hashchange',()=>schedule(90,true));window.addEventListener('load',()=>schedule(220,true));
// Actualiza Resultados en la pantalla actual cuando llegan datos oficiales nuevos.
window.addEventListener('ljr:official-data',()=>schedule(110,true));
document.addEventListener('DOMContentLoaded',()=>schedule(130,true),{once:true});
const screen=document.querySelector('#screen');if(screen)new MutationObserver(()=>schedule(110,false)).observe(screen,{childList:true,subtree:false});
schedule(150,true);setTimeout(()=>schedule(0,true),900);setTimeout(()=>schedule(0,true),2200);
})();