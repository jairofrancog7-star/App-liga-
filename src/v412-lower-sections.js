/* V412 — opciones deportivas SOLO en la parte inferior de cada sección.
   No modifica cabeceras, barras superiores ni sustituye contenido existente. */
(function(){
'use strict';
if(window.__LJR_V412_LOWER_SECTIONS__)return;
window.__LJR_V412_LOWER_SECTIONS__=true;

const ID='v412-lower-sections';
const FB='https://www.facebook.com/share/19SsGuzsRi/';
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const SUPPORTED=new Set([
  'competition','v4-calendar','calendar','monthlyCalendar','calendarMonthly',
  'news','v38Weekly','following','favorites','transfers','notifications',
  'search','more','profile','teams','players','teamDetail','video',
  'v4-matchcenter','matchCenter','match-center','match'
]);

let timer=0;
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function go(r){if(r)location.hash='#/'+r}
function officialDb(){
  try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}
  catch(_){return window.LJR_OFFICIAL_DATA||null}
}
function teamLogo(name){
  const d=officialDb();
  const hit=Object.entries(d?.team_logos||{}).find(([n])=>norm(n)===norm(name))?.[1];
  if(typeof hit==='string')return /^https?:/i.test(hit)?hit:SRC+hit.replace(/^\.\//,'');
  if(hit?.source)return hit.source;
  if(hit?.local)return SRC+String(hit.local).replace(/^\.\//,'');
  try{return window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||''}catch(_){return ''}
}
function teams(){
  const out=[];
  const add=n=>{n=String(n||'').trim();if(n&&!out.some(x=>norm(x)===norm(n)))out.push(n)};
  const d=officialDb();
  Object.values(d?.categories||{}).forEach(c=>{
    (c?.standings?.[0]?.rows||[]).forEach(r=>add(r?.[1]));
    Object.keys(c?.rosters||{}).forEach(add);
  });
  return out.slice(0,10);
}
function icon(n){
  const p={
    calendar:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/><path d="m8.5 15 2 2 5-5"/>',
    result:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M3 9h4m10 0h4M3 15h4m10 0h4"/>',
    live:'<circle cx="12" cy="12" r="2.2"/><path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9"/><path d="M4.4 4.5a10.4 10.4 0 0 0 0 15M19.6 4.5a10.4 10.4 0 0 1 0 15"/>',
    news:'<rect x="4" y="4" width="16" height="16" rx="1.6"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    transfer:'<path d="M4 8h12m0 0-3-3m3 3-3 3M20 16H8m0 0 3-3m-3 3 3 3"/>',
    bell:'<path d="M6 17h12l-1.5-2.4V10a4.5 4.5 0 0 0-9 0v4.6L6 17Z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
    star:'<path d="m12 3 2.7 5.5 6 .9-4.4 4.3 1.1 6-5.4-2.8-5.4 2.8 1.1-6-4.4-4.3 6-.9L12 3Z"/>',
    follow:'<path d="M7 19v-1.5A4.5 4.5 0 0 1 11.5 13h1A4.5 4.5 0 0 1 17 17.5V19"/><circle cx="12" cy="7" r="3"/><path d="m17 8 1.5 1.5L21 7"/>',
    teams:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3.5 19v-1.2A5.5 5.5 0 0 1 9 12.3 5.5 5.5 0 0 1 14.5 17.8V19"/><path d="M15 14a4 4 0 0 1 5.5 3.7V19"/>',
    player:'<circle cx="12" cy="7.5" r="3.3"/><path d="M5.5 20v-2a6.5 6.5 0 0 1 13 0v2"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.7 15.7 5 5"/>',
    facebook:'<path d="M13.8 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.6 1.7-1.6H17V3.8c-.5-.1-1.4-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.5Z"/>'
  };
  return '<span class="v412-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+(p[n]||p.news)+'</svg></span>';
}
function card(i,t,s,r){
  return '<button type="button" class="v412-card" data-v412-route="'+esc(r)+'">'+icon(i)+
    '<span class="v412-copy"><b>'+esc(t)+'</b><small>'+esc(s)+'</small></span><i>›</i></button>';
}
function head(k,t,d){
  return '<header class="v412-head"><small>'+esc(k)+'</small><h2>'+esc(t)+'</h2><p>'+esc(d)+'</p></header>';
}
function logoRail(){
  const list=teams();
  if(!list.length)return '';
  return '<div class="v412-team-rail">'+list.map(name=>{
    const src=teamLogo(name);
    const initials=name.split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
    return '<button type="button" data-v412-team="'+esc(name)+'">'+
      (src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">':'<span>'+esc(initials||'EQ')+'</span>')+
      '<small>'+esc(name)+'</small></button>';
  }).join('')+'</div>';
}
function social(){
  return '<button type="button" class="v412-social" data-v412-facebook>'+
    '<span class="v412-fb">'+icon('facebook')+'</span>'+
    '<span><small>SÍGUENOS</small><b>Facebook oficial de la Liga</b><em>Publicaciones, calendarios y avisos</em></span><i>↗</i></button>';
}

function config(r){
  if(['competition','v4-calendar','calendar','monthlyCalendar','calendarMonthly'].includes(r))return{
    k:'PARTE INFERIOR · JORNADA',t:'Más de partidos y calendario',d:'Accesos añadidos debajo del contenido actual.',
    cards:[
      ['calendar','Calendario','Jornadas por fecha','v4-calendar'],
      ['result','Resultados','Marcadores y próximos partidos','competition'],
      ['live','Partidos en vivo','Match Center y seguimiento','matchCenter'],
      ['bell','Notificaciones','Cambios de horario y avisos','notifications'],
      ['star','Favoritos','Equipos y encuentros guardados','favorites'],
      ['transfer','Transferencias','Movimientos oficiales','transfers']
    ],logos:true
  };
  if(['news','v38Weekly'].includes(r))return{
    k:'PARTE INFERIOR · ACTUALIDAD',t:'Más noticias de la Liga',d:'Opciones relacionadas sin mover la sección de Noticias.',
    cards:[
      ['calendar','Calendario','Próximas jornadas','v4-calendar'],
      ['result','Resultados','Partidos de la Liga','competition'],
      ['transfer','Transferencias','Movimientos oficiales','transfers'],
      ['star','Favoritos','Contenido que sigues','favorites'],
      ['follow','Siguiendo','Tus equipos','following'],
      ['bell','Notificaciones','Configura tus avisos','notifications']
    ],logos:true,social:true
  };
  if(['following','favorites'].includes(r))return{
    k:'PARTE INFERIOR · MI LIGA',t:'Equipos y favoritos',d:'Opciones añadidas al final de esta sección.',
    cards:[
      ['search','Buscar equipos','Encuentra otro club','teams'],
      ['player','Buscar jugadores','Plantillas registradas','players'],
      ['calendar','Calendario','Partidos de tus equipos','v4-calendar'],
      ['bell','Notificaciones','Avisos personalizados','notifications'],
      ['result','Resultados','Jornadas y marcadores','competition'],
      ['transfer','Transferencias','Movimientos oficiales','transfers']
    ],logos:true,social:true
  };
  if(r==='transfers')return{
    k:'PARTE INFERIOR · FICHAJES',t:'Centro de transferencias',d:'Solo accesos y datos de la Liga; no se inventan rumores.',
    cards:[
      ['player','Jugadores','Plantillas registradas','players'],
      ['teams','Equipos','Directorio de clubes','teams'],
      ['news','Noticias','Publicaciones de movimientos','news'],
      ['calendar','Calendario','Próximos partidos','v4-calendar'],
      ['star','Favoritos','Equipos guardados','favorites'],
      ['result','Resultados','Marcadores oficiales','competition']
    ],logos:true
  };
  if(r==='notifications')return{
    k:'PARTE INFERIOR · AVISOS',t:'Más opciones de notificaciones',d:'Resultados, partidos en vivo y equipos favoritos al final.',
    cards:[
      ['result','Resultados','Marcadores y finales','competition'],
      ['live','Partidos en vivo','Seguimiento del Match Center','matchCenter'],
      ['calendar','Calendario','Jornadas y horarios','v4-calendar'],
      ['star','Favoritos','Equipos y partidos guardados','favorites'],
      ['news','Noticias','Avisos y novedades','news'],
      ['transfer','Transferencias','Movimientos publicados','transfers']
    ]
  };
  if(['teams','players','teamDetail'].includes(r))return{
    k:'PARTE INFERIOR · CLUBES',t:'Más de equipos y jugadores',d:'Accesos complementarios debajo del contenido existente.',
    cards:[
      ['follow','Siguiendo','Equipos que sigues','following'],
      ['star','Favoritos','Guarda equipos y contenido','favorites'],
      ['transfer','Transferencias','Movimientos oficiales','transfers'],
      ['calendar','Calendario','Próximos encuentros','v4-calendar'],
      ['result','Resultados','Últimos marcadores','competition'],
      ['live','Match Center','Partidos y cronología','matchCenter']
    ],logos:true
  };
  if(r==='search')return{
    k:'PARTE INFERIOR · BUSCAR',t:'Explora la Liga',d:'Equipos reales, jugadores, calendario y favoritos.',
    cards:[
      ['teams','Equipos','Directorio de clubes','teams'],
      ['player','Jugadores','Plantillas registradas','players'],
      ['calendar','Calendario','Partidos por fecha','v4-calendar'],
      ['star','Favoritos','Contenido guardado','favorites']
    ],logos:true
  };
  if(r==='profile')return{
    k:'PARTE INFERIOR · CUENTA',t:'Tu Liga',d:'Preferencias, favoritos y red oficial al final de tu perfil.',
    cards:[
      ['follow','Siguiendo','Equipos que sigues','following'],
      ['bell','Notificaciones','Configura tus avisos','notifications'],
      ['star','Favoritos','Contenido guardado','favorites'],
      ['calendar','Calendario','Próximos partidos','v4-calendar']
    ],social:true
  };
  if(r==='more')return{
    k:'PARTE INFERIOR · MÁS',t:'Explorar la Liga',d:'Estas opciones van al final; no reemplazan las que ya existen arriba.',
    cards:[
      ['search','Buscar','Equipos, jugadores y partidos','search'],
      ['calendar','Calendario','Jornadas oficiales','v4-calendar'],
      ['result','Resultados','Partidos y marcadores','competition'],
      ['live','Partidos en vivo','Match Center','matchCenter'],
      ['news','Noticias','Actualidad de la Liga','news'],
      ['transfer','Transferencias','Movimientos oficiales','transfers'],
      ['star','Favoritos','Equipos y contenido guardado','favorites'],
      ['bell','Notificaciones','Preferencias y avisos','notifications']
    ],logos:true,social:true
  };
  if(r==='video')return{
    k:'PARTE INFERIOR · VIDEO',t:'Más contenido de la Liga',d:'Accesos relacionados colocados debajo de Video.',
    cards:[
      ['live','Partidos en vivo','Match Center y transmisión','matchCenter'],
      ['news','Noticias','Actualidad y avisos','news'],
      ['calendar','Calendario','Próximos partidos','v4-calendar'],
      ['star','Favoritos','Contenido guardado','favorites']
    ]
  };
  if(['v4-matchcenter','matchCenter','match-center','match'].includes(r))return{
    k:'PARTE INFERIOR · PARTIDO',t:'Más del partido',d:'Cronología, resultados, jugadores y favoritos debajo del Match Center.',
    cards:[
      ['result','Resultados','Jornada y marcadores','competition'],
      ['calendar','Calendario','Fechas y horarios','v4-calendar'],
      ['player','Jugadores','Plantillas registradas','players'],
      ['transfer','Transferencias','Movimientos oficiales','transfers'],
      ['star','Favoritos','Seguir equipos','favorites'],
      ['bell','Notificaciones','Goles y final del partido','notifications']
    ],logos:true
  };
  return null;
}
function markup(r){
  const c=config(r);if(!c)return '';
  return '<section class="v412-lower" id="'+ID+'" data-v412-route="'+esc(r)+'">'+
    head(c.k,c.t,c.d)+(c.logos?logoRail():'')+
    '<div class="v412-grid">'+c.cards.map(x=>card(...x)).join('')+'</div>'+
    (c.social?social():'')+'</section>';
}
function openTeam(name){
  if(!name)return;
  try{localStorage.setItem('v62-team-name',name);localStorage.setItem('v42-team-tab','summary')}catch(_){}
  location.hash='#/teamDetail?tab=summary';
}
function bind(root){
  root.querySelectorAll('[data-v412-route]').forEach(b=>{if(b!==root)b.onclick=()=>go(b.dataset.v412Route)});
  root.querySelectorAll('[data-v412-team]').forEach(b=>b.onclick=()=>openTeam(b.dataset.v412Team));
  root.querySelectorAll('[data-v412-facebook]').forEach(b=>b.onclick=()=>window.open(FB,'_blank','noopener,noreferrer'));
}
function mount(){
  const screen=document.querySelector('#screen');if(!screen)return;
  const r=route(),old=screen.querySelector('#'+ID);
  if(!SUPPORTED.has(r)){old?.remove();return}
  if(old&&old.dataset.v412Route===r&&old.parentElement===screen){
    if(screen.lastElementChild!==old)screen.appendChild(old);
    return;
  }
  old?.remove();
  const html=markup(r);if(!html)return;
  const tmp=document.createElement('div');tmp.innerHTML=html;
  const node=tmp.firstElementChild;if(!node)return;
  /* SIEMPRE hijo directo de #screen y SIEMPRE al final. */
  screen.appendChild(node);
  bind(node);
}
function schedule(ms=80){clearTimeout(timer);timer=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(80));
window.addEventListener('load',()=>schedule(180));
document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>schedule(80)).observe(screen,{childList:true,subtree:false});
schedule(120);setTimeout(()=>schedule(0),700);setTimeout(()=>schedule(0),1600);setTimeout(()=>schedule(0),3200);
})();