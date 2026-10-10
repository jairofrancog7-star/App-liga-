/* V411 — Centro inferior inspirado en apps deportivas, adaptado a App-liga.
   Regla principal: NO toca barras superiores ni reemplaza pantallas existentes.
   Solo agrega accesos y tarjetas debajo del contenido actual. */
(function(){
'use strict';
if(window.__LJR_V411_EXPLORE_HUB__)return;
window.__LJR_V411_EXPLORE_HUB__=true;

const FB='https://www.facebook.com/share/19SsGuzsRi/';
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
let timer=0;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function db(){
  try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}
  catch(_){return window.LJR_OFFICIAL_DATA||null}
}
function logoFor(name){
  const d=db();
  const hit=Object.entries(d?.team_logos||{}).find(([n])=>norm(n)===norm(name))?.[1];
  if(typeof hit==='string'){
    if(/^https?:/i.test(hit))return hit;
    return SRC+String(hit).replace(/^\.\//,'');
  }
  if(hit?.source)return hit.source;
  if(hit?.local)return SRC+String(hit.local).replace(/^\.\//,'');
  try{
    const x=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||'';
    if(x)return x;
  }catch(_){}
  return '';
}
function teamList(){
  const d=db(),out=[];
  const add=name=>{
    name=String(name||'').trim();
    if(!name||out.some(x=>norm(x)===norm(name)))return;
    out.push(name);
  };
  Object.values(d?.categories||{}).forEach(c=>{
    (c?.standings?.[0]?.rows||[]).forEach(r=>add(r?.[1]));
    Object.keys(c?.rosters||{}).forEach(add);
  });
  Object.keys(d?.team_logos||{}).forEach(add);
  return out.slice(0,12);
}
function icon(name){
  const p={
    search:'<circle cx="11" cy="11" r="6.6"/><path d="m16 16 4.6 4.6"/>',
    calendar:'<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M7 3v5m10-5v5M3.5 10h17"/><path d="m8.5 15 2 2 4.5-5"/>',
    match:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M3 9h4m10 0h4M3 15h4m10 0h4"/>',
    live:'<circle cx="12" cy="12" r="2.2"/><path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9"/><path d="M4.4 4.5a10.4 10.4 0 0 0 0 15M19.6 4.5a10.4 10.4 0 0 1 0 15"/>',
    news:'<rect x="4" y="4" width="16" height="16" rx="1.6"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    transfer:'<path d="M4 8h12m0 0-3-3m3 3-3 3M20 16H8m0 0 3-3m-3 3 3 3"/>',
    bell:'<path d="M6 17h12l-1.5-2.4V10a4.5 4.5 0 0 0-9 0v4.6L6 17Z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
    star:'<path d="m12 3 2.7 5.5 6 .9-4.4 4.3 1.1 6-5.4-2.8-5.4 2.8 1.1-6-4.4-4.3 6-.9L12 3Z"/>',
    follow:'<path d="M7 19v-1.5A4.5 4.5 0 0 1 11.5 13h1A4.5 4.5 0 0 1 17 17.5V19"/><circle cx="12" cy="7" r="3"/><path d="m17 8 1.5 1.5L21 7"/>',
    teams:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3.5 19v-1.2A5.5 5.5 0 0 1 9 12.3 5.5 5.5 0 0 1 14.5 17.8V19"/><path d="M15 14a4 4 0 0 1 5.5 3.7V19"/>',
    player:'<circle cx="12" cy="7" r="3.2"/><path d="M5.5 20v-2a6.5 6.5 0 0 1 13 0v2"/>',
    user:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    facebook:'<path d="M13.8 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.6 1.7-1.6H17V3.8c-.5-.1-1.4-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.5Z"/>'
  };
  return window.LJR_ICONS?.decorate('<span class="v411-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.news)+'</svg></span>',name) || '<span class="v411-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.news)+'</svg></span>';
}
function card(i,title,sub,r){
  return '<button type="button" class="v411-card" data-v411-route="'+esc(r)+'">'+icon(i)+'<span><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span><i>›</i></button>';
}
function sectionTitle(kicker,title){
  return '<header class="v411-section-head"><small>'+esc(kicker)+'</small><h2>'+esc(title)+'</h2></header>';
}
function teamStrip(){
  const teams=teamList().slice(0,8);
  if(!teams.length)return '';
  return '<section class="v411-team-section">'+sectionTitle('EQUIPOS','Acceso rápido')+
    '<div class="v411-team-strip">'+teams.map(name=>{
      const src=logoFor(name);
      const fallback=String(name).split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
      return '<button type="button" class="v411-team" data-v411-team="'+esc(name)+'" aria-label="Abrir '+esc(name)+'">'+
        (src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">':'<span>'+esc(fallback||'EQ')+'</span>')+
        '<b>'+esc(name)+'</b></button>';
    }).join('')+'</div>'+
    '<button type="button" class="v411-wide-link" data-v411-route="teams">Ver todos los equipos <span>›</span></button>'+
  '</section>';
}
function moreHub(){
  return '<section class="v411-hub" data-v411-owner="more">'+
    sectionTitle('CENTRO DE LA LIGA','Explorar')+
    '<button type="button" class="v411-search" data-v411-route="search">'+icon('search')+
      '<span>Equipos, jugadores, partidos, campos...</span><i>›</i></button>'+
    '<div class="v411-topic-rail">'+
      '<button data-v411-route="competition">Partidos</button>'+
      '<button data-v411-route="news">Noticias</button>'+
      '<button data-v411-route="transfers">Fichajes</button>'+
      '<button data-v411-route="following">Siguiendo</button>'+
    '</div>'+
    sectionTitle('PARTIDOS','Calendario y resultados')+
    '<div class="v411-grid">'+
      card('calendar','Calendario de la Liga','Jornadas por fecha y categoría','v4-calendar')+
      card('match','Resultados','Partidos jugados y próximos','competition')+
      card('live','Match Center','Seguimiento y transmisiones','matchCenter')+
      card('bell','Notificaciones','Goles, horarios y avisos','notifications')+
    '</div>'+
    sectionTitle('ACTUALIDAD','Noticias y movimientos')+
    '<div class="v411-grid">'+
      card('news','Noticias','Avisos y novedades de la Liga','news')+
      card('transfer','Transferencias','Movimientos oficiales de jugadores','transfers')+
    '</div>'+
    sectionTitle('MI LIGA','Favoritos y seguimiento')+
    '<div class="v411-grid">'+
      card('star','Favoritos','Equipos, partidos y noticias guardadas','favorites')+
      card('follow','Siguiendo','Tus equipos seguidos','following')+
      card('teams','Equipos','Directorio con escudos reales','teams')+
      card('player','Jugadores','Plantillas y jugadores registrados','players')+
    '</div>'+
    teamStrip()+
  '</section>';
}
function searchTeams(){
  return '<section class="v411-hub v411-search-extra" data-v411-owner="search">'+
    sectionTitle('BUSCAR','Equipos de la Liga')+
    '<p class="v411-copy">Acceso directo con los escudos reales de los equipos registrados.</p>'+
    teamStrip()+
    '<div class="v411-grid">'+
      card('player','Jugadores','Buscar por nombre o plantilla','players')+
      card('calendar','Calendario','Buscar partidos por fecha','v4-calendar')+
    '</div>'+
  '</section>';
}
function socialFooter(owner){
  const account=owner==='profile'
    ? sectionTitle('CUENTA Y COMUNIDAD','Tu perfil y redes')+
      '<div class="v411-grid">'+
        card('user','Crear cuenta / Perfil','Preferencias y avisos personalizados','profile')+
        '<button type="button" class="v411-card v411-facebook" data-v411-external="'+FB+'">'+icon('facebook')+
          '<span><b>Facebook oficial</b><small>Liga Municipal de Fútbol Juventino Rosas</small></span><i>↗</i></button>'+
      '</div>'
    : sectionTitle('SÍGUENOS','Liga Juventino Rosas')+
      '<div class="v411-grid">'+
        '<button type="button" class="v411-card v411-facebook" data-v411-external="'+FB+'">'+icon('facebook')+
          '<span><b>Facebook oficial</b><small>Tablas, calendarios, avisos y publicaciones</small></span><i>↗</i></button>'+
        card('search','Buscar equipos','Encuentra y sigue otro equipo','teams')+
      '</div>';
  return '<section class="v411-hub v411-social-footer" data-v411-owner="'+esc(owner)+'">'+account+'</section>';
}
function calendarFooter(){
  return '<section class="v411-hub v411-route-footer" data-v411-owner="v4-calendar">'+
    sectionTitle('MÁS DEL CALENDARIO','Sigue la jornada')+
    '<div class="v411-grid">'+
      card('match','Resultados','Ver partidos y marcadores','competition')+
      card('live','Match Center','Partidos en vivo y detalles','matchCenter')+
      card('transfer','Transferencias','Movimientos de jugadores','transfers')+
      card('bell','Notificaciones','Avisos de jornada y sedes','notifications')+
    '</div>'+
  '</section>';
}
function transfersFooter(){
  return '<section class="v411-hub v411-route-footer" data-v411-owner="transfers">'+
    sectionTitle('CENTRO DE FICHAJES','Transferencias de jugadores')+
    '<p class="v411-copy">Solo se muestran movimientos publicados o confirmados por la Liga; no se inventan rumores.</p>'+
    '<div class="v411-topic-rail">'+
      '<button class="active" data-v411-route="transfers">Todos</button>'+
      '<button data-v411-route="players">Jugadores</button>'+
      '<button data-v411-route="teams">Equipos</button>'+
      '<button data-v411-route="news">Noticias</button>'+
    '</div>'+
    '<div class="v411-grid">'+
      card('player','Directorio de jugadores','Consulta plantillas registradas','players')+
      card('teams','Directorio de equipos','Escudos y fichas de club','teams')+
    '</div>'+
  '</section>';
}
function newsFooter(){
  return '<section class="v411-hub v411-route-footer" data-v411-owner="news">'+
    sectionTitle('EXPLORAR','Más de la Liga')+
    '<div class="v411-grid">'+
      card('transfer','Fichajes','Movimientos oficiales','transfers')+
      card('star','Favoritos','Contenido que guardaste','favorites')+
      card('follow','Siguiendo','Equipos que sigues','following')+
      card('bell','Notificaciones','Configura tus avisos','notifications')+
    '</div>'+
  '</section>';
}

function desiredMarkup(r){
  if(r==='more')return '';
  if(r==='search')return searchTeams();
  if(r==='following')return socialFooter('following');
  if(r==='profile')return socialFooter('profile');
  if(r==='v4-calendar')return calendarFooter();
  if(r==='transfers')return transfersFooter();
  if(r==='news')return newsFooter();
  return '';
}
function mount(){
  const r=route(),screen=document.querySelector('#screen');
  if(!screen)return;
  if(r==='more'){
    screen.querySelectorAll('[data-v411-owner="more"]').forEach(el=>el.remove());
    return;
  }

  screen.querySelectorAll('[data-v411-owner]').forEach(el=>{
    if(el.dataset.v411Owner!==r)el.remove();
  });

  const html=desiredMarkup(r);
  if(!html)return;
  if(screen.querySelector('[data-v411-owner="'+CSS.escape(r)+'"]'))return;
  screen.insertAdjacentHTML('beforeend',html);
}
function openTeam(name){
  name=String(name||'').trim();if(!name)return;
  try{localStorage.setItem('v62-team-name',name);localStorage.setItem('v42-team-tab','summary')}catch(_){}
  location.hash='#/teamDetail?tab=summary';
}
function click(e){
  const routeBtn=e.target.closest?.('[data-v411-route]');
  if(routeBtn){
    e.preventDefault();
    const r=routeBtn.dataset.v411Route;
    if(r)location.hash='#/'+r;
    return;
  }
  const ext=e.target.closest?.('[data-v411-external]');
  if(ext){
    e.preventDefault();
    window.open(ext.dataset.v411External,'_blank','noopener,noreferrer');
    return;
  }
  const team=e.target.closest?.('[data-v411-team]');
  if(team){
    e.preventDefault();
    openTeam(team.dataset.v411Team);
  }
}
function schedule(ms=40){
  clearTimeout(timer);
  timer=setTimeout(mount,ms);
}

document.addEventListener('click',click,true);
window.addEventListener('hashchange',()=>schedule(30));
window.addEventListener('ljr:official-data',()=>schedule(20));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(20)});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>schedule(35)).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(20),{once:true});else schedule(20);
setTimeout(mount,300);
setTimeout(mount,900);
setTimeout(mount,1800);
})();