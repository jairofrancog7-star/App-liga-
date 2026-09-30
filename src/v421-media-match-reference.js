/* V421 — Secciones faltantes de referencia: TV, Partidos y Dónde verlo. */
(function(){
'use strict';
if(window.__LJR_V421_MEDIA_MATCH_REFERENCE__)return;
window.__LJR_V421_MEDIA_MATCH_REFERENCE__=true;

const IDV='v421-video-reference', IDC='v421-calendar-matches', IDW='v421-watch-page';
const CAT_NAMES={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const pad=n=>String(n).padStart(2,'0');

function db(){try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}}
function parseDate(v){const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);if(!m)return null;const d=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));return {stamp:d.getTime(),iso:m[3]+'-'+pad(m[2])+'-'+pad(m[1]),time:(m[4]?pad(m[4])+':'+m[5]:'Por confirmar')}}
function fixtures(){
 const out=[];
 Object.entries(db().categories||{}).forEach(([cid,c])=>(c?.fixtures||[]).forEach((g,gi)=>(g?.rows||[]).forEach((r,ri)=>{
  if(!r?.[2]||!r?.[6])return;const d=parseDate(r?.[8]);const hs=String(r?.[3]??'').trim(),as=String(r?.[5]??'').trim(),score=/^\d+$/.test(hs)&&/^\d+$/.test(as);
  out.push({key:cid+':'+gi+':'+ri,cat:String(cid),category:c?.name||CAT_NAMES[cid]||'Categoría',round:String(r?.[1]||''),home:String(r[2]),away:String(r[6]),hs:score?hs:'',as:score?as:'',score,status:String(r?.[10]||r?.[9]||''),field:String(r?.[7]||'Campo por confirmar'),stamp:d?.stamp||NaN,iso:d?.iso||'',time:d?.time||'Por confirmar'});
 })));
 return out.sort((a,b)=>(Number.isFinite(a.stamp)?a.stamp:9e15)-(Number.isFinite(b.stamp)?b.stamp:9e15));
}
function logo(name){
 try{const u=window.LJR_TEAM_LOGOS?.get?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||'';if(u)return u}catch(_){}
 const logos=db()?.team_logos||{},key=Object.keys(logos).find(k=>norm(k)===norm(name)),v=key?logos[key]:null,path=typeof v==='string'?v:(v?.local||v?.source||v?.url||'');
 return path?( /^https?:/i.test(path)?path:ROOT+String(path).replace(/^\.?\//,'') ):'';
}
function img(name){const u=logo(name);return u?'<img src="'+esc(u)+'" alt="">':'<span style="width:22px;height:22px;display:grid;place-items:center;border-radius:50%;background:#20285b;color:#fff;font-size:6px;font-weight:900">'+esc(String(name).split(/\s+/).map(x=>x[0]).join('').slice(0,3))+'</span>'}
function streams(){
 const out=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||'';if(!k.startsWith('ljr-stream-list-v196:'))continue;const arr=JSON.parse(localStorage.getItem(k)||'[]'),key=k.slice('ljr-stream-list-v196:'.length);if(Array.isArray(arr))arr.forEach(x=>{if(x?.url)out.push({key,url:x.url,name:x.name||provider(x.url),provider:provider(x.url)})})}}catch(_){}return out
}
function provider(u){u=String(u||'').toLowerCase();if(u.includes('youtube'))return'YouTube';if(u.includes('facebook')||u.includes('fb.watch'))return'Facebook';if(u.includes('tiktok'))return'TikTok';return'Transmisión vinculada'}
function openUrl(u){try{window.open(u,'_blank','noopener,noreferrer')}catch(_){}}
function dayLabel(iso){if(!iso)return'Fecha';const d=new Date(iso+'T12:00:00'),today=new Date();const tk=today.getFullYear()+'-'+pad(today.getMonth()+1)+'-'+pad(today.getDate()),tm=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1),mk=tm.getFullYear()+'-'+pad(tm.getMonth()+1)+'-'+pad(tm.getDate());if(iso===tk)return'Hoy';if(iso===mk)return'Mañana';return new Intl.DateTimeFormat('es-MX',{weekday:'short',day:'2-digit',month:'short'}).format(d).replace('.','')}
function dateKeys(){const arr=[];fixtures().forEach(m=>{if(m.iso&&!arr.includes(m.iso))arr.push(m.iso)});return arr.slice(0,8)}
function matchText(m){if(m.score)return {main:m.hs+' - '+m.as,sub:'Final'};return {main:m.time,sub:m.field}}
function mediaCard(m,label){const result=m.score?m.hs+' - '+m.as:'VS';return '<button class="v421-media" type="button" data-v421-match><div class="v421-media-art">'+img(m.home)+img(m.away)+'<span class="v421-play">▶</span></div><div class="v421-media-copy"><b>'+esc(m.home)+' '+esc(result)+' '+esc(m.away)+'</b><small>'+esc(label)+' · '+esc(m.category)+'</small></div></button>'}
function mediaSection(title,sub,list,label){return '<section class="v421-section"><div class="v421-head"><div><p class="v421-kicker">'+esc(title)+'</p><h3 class="v421-title">'+esc(title)+'</h3><p class="v421-sub">'+esc(sub)+'</p></div></div><div class="v421-media-row">'+(list.length?list.map(m=>mediaCard(m,label)).join(''):'<div class="v421-empty">Esta sección se llenará con el contenido oficial de la Liga.</div>')+'</div></section>'}

function videoMarkup(){
 const all=fixtures(),played=all.filter(m=>m.score).slice(-12).reverse(),upcoming=all.filter(m=>!m.score).slice(0,12),featured=(played.length?played:upcoming);
 return '<section class="v421-block" id="'+IDV+'"><div class="v421-actions"><button class="v421-action" data-v421-live><i>▶</i><span><b>En directo</b><small>Partido y transmisión en vivo</small></span></button><button class="v421-action" data-v421-favs><i>☆</i><span><b>Mis partidos</b><small>Favoritos y seguimiento</small></span></button></div>'+
  mediaSection('Ver en vivo en Liga Juventino','Partidos próximos y transmisiones vinculadas',upcoming.slice(0,6),'Próximo')+
  mediaSection('Mejores momentos','Resultados recientes de la Liga',played.slice(0,6),'Resultado')+
  mediaSection('Vídeos oficiales de clubes','Contenido de partidos y equipos registrados',featured.slice(0,6),'Clubes')+
  mediaSection('Liga Juventino Videos','Más contenido oficial de la competición',featured.slice().reverse().slice(0,6),'Liga TV')+
  mediaSection('Lo más visto','Contenido destacado dentro de la sección de vídeo',featured.slice(0,6),'Destacado')+
  mediaSection('Resúmenes más recientes','Partidos finalizados con marcador oficial',played.slice(0,6),'Resumen')+
 '</section>';
}
function bindVideo(root){root.querySelector('[data-v421-live]')?.addEventListener('click',()=>{location.hash='#/matchCenter'});root.querySelector('[data-v421-favs]')?.addEventListener('click',()=>{location.hash='#/favorites'});root.querySelectorAll('[data-v421-match]').forEach(b=>b.onclick=()=>{location.hash='#/matchCenter'})}
function mountVideo(){
 if(route()!=='video')return;const screen=document.querySelector('#screen');if(!screen||screen.querySelector('#'+IDV))return;
 screen.querySelectorAll('[data-v412-screen="tv"],.v411-zone[data-v411-zone="video"]').forEach(x=>x.style.display='none');
 screen.insertAdjacentHTML('beforeend',videoMarkup());bindVideo(screen.querySelector('#'+IDV));
}

function groupMatches(list){const map=new Map();list.forEach(m=>{const k=m.cat+'|'+m.category;if(!map.has(k))map.set(k,[]);map.get(k).push(m)});return Array.from(map.values())}
function matchRow(m){const t=matchText(m);return '<div class="v421-match"><div><div class="v421-team">'+img(m.home)+'<span>'+esc(m.home)+'</span></div><div class="v421-team">'+img(m.away)+'<span>'+esc(m.away)+'</span></div></div><div class="v421-score"><b>'+esc(t.main)+'</b><small>'+esc(t.sub)+'</small></div><button class="v421-star" type="button">☆</button></div>'}
function compCard(rows){return '<article class="v421-comp"><div class="v421-comp-head"><i>◉</i><span><b>'+esc(rows[0].category)+'</b><small>Jornada '+esc(rows[0].round||'—')+'</small></span></div>'+rows.map(matchRow).join('')+'<div class="v421-comp-foot"><button type="button" data-v421-comp="'+esc(rows[0].cat)+'">Ver jornada ›</button></div></article>'}
function calendarMarkup(){
 const keys=dateKeys(),sel=localStorage.getItem('v421-match-day')||'all',all=fixtures(),list=(sel==='all'?all:all.filter(m=>m.iso===sel)).slice(0,40),prob=localStorage.getItem('v421-prob')==='1';
 return '<section class="v421-block v421-matches" id="'+IDC+'"><div class="v421-match-top"><div><h2>Partidos</h2><small>Resultados, próximos juegos y favoritos</small></div></div><button class="v421-prob '+(prob?'on':'')+'" type="button" data-v421-prob>ACTIVAR/DESACTIVAR LAS PROBABILIDADES DE PARTIDO</button><div class="v421-days"><button class="v421-day '+(sel==='all'?'active':'')+'" data-v421-day="all">Todos</button>'+keys.map(k=>'<button class="v421-day '+(sel===k?'active':'')+'" data-v421-day="'+k+'">'+esc(dayLabel(k))+'</button>').join('')+'</div><div class="v421-follow-note">Tus partidos favoritos y los de tus equipos seguidos aparecerán primero aquí.</div><div class="v421-all-title"><b>Todos los partidos</b><small>Competiciones de la Liga Juventino Rosas</small></div><div data-v421-match-list>'+(list.length?groupMatches(list).map(compCard).join(''):'<div class="v421-empty">No hay partidos oficiales para este filtro.</div>')+'</div><button class="v421-watch-open" type="button" data-v421-watch><span><b>Dónde verlo</b><small>Consulta las transmisiones vinculadas por la Liga</small></span><span>›</span></button></section>';
}
function bindCalendar(root){
 root.querySelector('[data-v421-prob]')?.addEventListener('click',()=>{localStorage.setItem('v421-prob',localStorage.getItem('v421-prob')==='1'?'0':'1');rerenderCalendar()});
 root.querySelectorAll('[data-v421-day]').forEach(b=>b.onclick=()=>{localStorage.setItem('v421-match-day',b.dataset.v421Day);rerenderCalendar()});
 root.querySelectorAll('[data-v421-comp]').forEach(b=>b.onclick=()=>{try{localStorage.setItem('v62-category',b.dataset.v421Comp)}catch(_){};location.hash='#/competition'});
 root.querySelector('[data-v421-watch]')?.addEventListener('click',()=>{location.hash='#/whereToWatch'});
}
function rerenderCalendar(){const old=document.getElementById(IDC);if(!old)return;old.outerHTML=calendarMarkup();bindCalendar(document.getElementById(IDC))}
function mountCalendar(){
 const r=route();if(!['v4-calendar','calendar','monthlyCalendar','calendarMonthly'].includes(r))return;const host=document.querySelector('[data-v415-calendar]');if(!host||host.querySelector('#'+IDC))return;host.insertAdjacentHTML('beforeend',calendarMarkup());bindCalendar(host.querySelector('#'+IDC));
}

function whereMarkup(){
 const keys=dateKeys(),sel=localStorage.getItem('v421-watch-day')||'all',all=fixtures(),list=(sel==='all'?all:all.filter(m=>m.iso===sel)).slice(0,30),src=streams();
 const rows=list.map(m=>{const s=src.find(x=>x.key===m.key)||null;return '<div class="v421-watch-row"><div class="v421-watch-time">'+esc(m.time)+'</div><div class="v421-watch-game"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(m.category)+' · '+esc(m.field)+'</small>'+(s?'<button class="v421-provider" data-v421-url="'+esc(s.url)+'">'+esc(s.provider)+' · VER</button>':'<span class="v421-provider">Sin transmisión vinculada</span>')+'</div></div>'}).join('');
 return '<section class="v421-watch-page" id="'+IDW+'"><div class="v421-watch-head"><button class="v421-watch-back" data-v421-back>←</button><h1>Dónde verlo</h1></div><div class="v421-days"><button class="v421-day '+(sel==='all'?'active':'')+'" data-v421-watch-day="all">Todos</button>'+keys.map(k=>'<button class="v421-day '+(sel===k?'active':'')+'" data-v421-watch-day="'+k+'">'+esc(dayLabel(k))+'</button>').join('')+'</div><div class="v421-watch-card">'+(rows||'<div class="v421-empty">No hay programación oficial para este filtro.</div>')+'</div></section>';
}
function bindWhere(root){root.querySelector('[data-v421-back]')?.addEventListener('click',()=>{history.length>1?history.back():location.hash='#/v4-calendar'});root.querySelectorAll('[data-v421-watch-day]').forEach(b=>b.onclick=()=>{localStorage.setItem('v421-watch-day',b.dataset.v421WatchDay);mountWhere(true)});root.querySelectorAll('[data-v421-url]').forEach(b=>b.onclick=()=>openUrl(b.dataset.v421Url))}
function mountWhere(force=false){
 if(route()!=='whereToWatch'){document.body.classList.remove('v421-watch-active');return}
 document.body.classList.add('v421-watch-active');const screen=document.querySelector('#screen');if(!screen)return;if(!force&&screen.querySelector('#'+IDW))return;screen.innerHTML=whereMarkup();bindWhere(screen.querySelector('#'+IDW));
}
function mount(){mountVideo();mountCalendar();mountWhere(false)}
let timer=0;function schedule(ms=90){clearTimeout(timer);timer=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(70));window.addEventListener('load',()=>schedule(180));document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});
const screen=document.querySelector('#screen');if(screen)new MutationObserver(()=>schedule(100)).observe(screen,{childList:true,subtree:true});
schedule(120);setTimeout(mount,800);setTimeout(mount,1800);
})();