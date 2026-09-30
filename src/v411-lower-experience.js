/* V411 — opciones inferiores inspiradas en referencias deportivas.
   Sólo añade contenido DEBAJO de las pantallas existentes; no modifica cabeceras,
   barras superiores ni datos oficiales. */
(function(){
'use strict';
if(window.__LJR_V411_LOWER_EXPERIENCE__)return;
window.__LJR_V411_LOWER_EXPERIENCE__=true;

const ID='v411-lower-experience';
const FB='https://www.facebook.com/golazo.liga';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const SUPPORTED=new Set([
  'competition','v4-calendar','calendar','monthlyCalendar','calendarMonthly',
  'news','v38Weekly','teams','players','teamDetail','following','transfers','favorites',
  'search','more','profile','v4-matchcenter','matchCenter','match-center','match'
]);

let timer=0;

function icon(name){
  const p={
    calendar:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/><path d="m8.5 15 2 2 5-5"/>',
    match:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 5v14"/><circle cx="12" cy="12" r="3"/>',
    tv:'<rect x="3" y="5" width="18" height="13" rx="2"/><path d="m9 21 3-3 3 3M8 10l3 2-3 2z"/>',
    cast:'<rect x="7" y="4" width="14" height="11" rx="2"/><path d="M3 17a4 4 0 0 1 4 4M3 13a8 8 0 0 1 8 8M3 9a12 12 0 0 1 12 12"/>',
    players:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-4 2-7 6-7s6 3 6 7"/><circle cx="18" cy="9" r="2"/><path d="M16 14c3 0 5 2 5 6"/>',
    search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    star:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z"/>',
    transfer:'<path d="M4 8h13m0 0-4-4m4 4-4 4M20 16H7m0 0 4-4m-4 4 4 4"/>',
    news:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    bell:'<path d="M6 17h12l-2-3v-3a4 4 0 0 0-8 0v3z"/><path d="M10 20h4"/>',
    lineup:'<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M12 3v7M12 14v7M4 12h6M14 12h6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
    chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/>',
    comment:'<path d="M4 5h16v11H9l-5 4z"/>',
    facebook:'<path d="M14 8h4V3h-4c-4 0-6 2-6 6v3H4v5h4v7h5v-7h4l1-5h-5V9c0-1 .4-1 1-1z"/>',
    trophy:'<path d="M8 3h8v4c0 4-2 7-4 8-2-1-4-4-4-8z"/><path d="M8 5H4c0 4 2 6 5 7M16 5h4c0 4-2 6-5 7M12 15v4M8 21h8"/>'
  };
  return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.match)+'</svg>';
}
function go(r){
  if(!r)return;
  location.hash='#/'+r;
}
function button(c){
  const attrs=c.route?'data-v411-route="'+esc(c.route)+'"':c.action?'data-v411-action="'+esc(c.action)+'"':'';
  return '<button type="button" class="v411-card" '+attrs+'>'+
    '<span class="v411-card-icon">'+icon(c.icon)+'</span>'+
    '<span class="v411-card-copy"><b>'+esc(c.title)+'</b><small>'+esc(c.sub||'')+'</small></span>'+
    '<span class="v411-chevron">›</span>'+
  '</button>';
}
function sectionHead(kicker,title,desc){
  return '<header class="v411-head"><small>'+esc(kicker)+'</small><h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p></header>';
}
function cfg(r){
  if(['competition','v4-calendar','calendar','monthlyCalendar','calendarMonthly'].includes(r))return{
    kicker:'PARTIDOS Y RESULTADOS',title:'Más de la jornada',desc:'Accesos de calendario, resultados, TV y seguimiento sin mover la Competición.',
    cards:[
      {icon:'calendar',title:'Calendario',sub:'Jornadas y horarios',route:'v4-calendar'},
      {icon:'match',title:'Match Center',sub:'Marcador, minuto y cronología',route:'v4-matchcenter'},
      {icon:'tv',title:'Televisados',sub:'Fuentes vinculadas al partido',action:'stream'},
      {icon:'star',title:'Equipos favoritos',sub:'Seguir clubes y avisos',route:'following'},
      {icon:'transfer',title:'Fichajes',sub:'Movimientos oficiales publicados',route:'transfers'},
      {icon:'search',title:'Buscar jugador',sub:'Plantillas y equipos',route:'players'}
    ],logos:true
  };
  if(['news','v38Weekly'].includes(r))return{
    kicker:'ACTUALIDAD',title:'Sigue la Liga',desc:'Noticias, calendario, favoritos y movimientos en un solo bloque inferior.',
    cards:[
      {icon:'calendar',title:'Calendario',sub:'Próximas jornadas',route:'v4-calendar'},
      {icon:'match',title:'Resultados',sub:'Partidos de la competición',route:'competition'},
      {icon:'transfer',title:'Fichajes',sub:'Altas y movimientos publicados',route:'transfers'},
      {icon:'star',title:'Favoritos',sub:'Equipos que sigues',route:'following'},
      {icon:'search',title:'Buscar',sub:'Equipos, jugadores y partidos',route:'search'},
      {icon:'bell',title:'Notificaciones',sub:'Avisos de jornada',route:'notifications'}
    ],logos:true,social:true
  };
  if(['teams','players','teamDetail','following','transfers','favorites','search'].includes(r))return{
    kicker:'CLUBES Y JUGADORES',title:'Explora la Liga',desc:'Búsqueda, equipos, plantillas, alineaciones y mercado adaptados a la Liga Juventino Rosas.',
    cards:[
      {icon:'search',title:'Buscar jugadores',sub:'Nombre, equipo o categoría',route:'players'},
      {icon:'players',title:'Equipos',sub:'Clubes registrados',route:'teams'},
      {icon:'star',title:'Favoritos',sub:'Equipos y contenidos guardados',route:'following'},
      {icon:'transfer',title:'Fichajes',sub:'Movimientos oficiales',route:'transfers'},
      {icon:'lineup',title:'Alineaciones',sub:'Pizarra y formación',route:'tactics'},
      {icon:'match',title:'Match Center',sub:'Partidos y cronología',route:'v4-matchcenter'}
    ],logos:true
  };
  if(r==='more')return{
    kicker:'EXPLORAR',title:'Más opciones de la Liga',desc:'Accesos rápidos añadidos al final; la navegación superior queda intacta.',
    cards:[
      {icon:'search',title:'Buscar',sub:'Equipos, jugadores, partidos y campos',route:'search'},
      {icon:'calendar',title:'Calendario',sub:'Jornadas oficiales',route:'v4-calendar'},
      {icon:'match',title:'Match Center',sub:'Partido, minuto y datos',route:'v4-matchcenter'},
      {icon:'tv',title:'Modo TV',sub:'Vista para pantalla',action:'tv'},
      {icon:'transfer',title:'Fichajes',sub:'Movimientos publicados',route:'transfers'},
      {icon:'star',title:'Favoritos',sub:'Equipos que sigues',route:'following'},
      {icon:'news',title:'Noticias',sub:'Actualidad de la Liga',route:'news'},
      {icon:'bell',title:'Notificaciones',sub:'Preferencias y avisos',route:'notifications'}
    ],logos:true,social:true
  };
  if(r==='profile')return{
    kicker:'TU LIGA',title:'Preferencias y comunidad',desc:'Favoritos, avisos y acceso a las redes de la Liga.',
    cards:[
      {icon:'star',title:'Equipos favoritos',sub:'Gestionar equipos seguidos',route:'following'},
      {icon:'bell',title:'Notificaciones',sub:'Partidos, noticias y fichajes',route:'notifications'},
      {icon:'search',title:'Buscar',sub:'Equipos y jugadores',route:'search'},
      {icon:'calendar',title:'Calendario',sub:'Próximos partidos',route:'v4-calendar'}
    ],social:true
  };
  return null;
}
function matchContext(){
  const root=$('[data-v92-matchcenter]');
  if(!root)return null;
  const sides=$$('.v92-score-card .v92-side',root);
  if(sides.length<2)return null;
  const readSide=s=>{
    const name=$('b',s)?.textContent?.trim()||'Equipo';
    const img=$('img',s)?.getAttribute('src')||'';
    return {name,img};
  };
  return {home:readSide(sides[0]),away:readSide(sides[1]),meta:$('.v92-official-meta',root)?.textContent?.trim()||''};
}
function logoMarkup(team){
  let src=team?.img||'';
  try{if(!src&&team?.name)src=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(team.name)||''}catch(_){}
  return src?'<img src="'+esc(src)+'" alt="'+esc(team.name)+'" loading="lazy" decoding="async">':'<span>'+esc((team?.name||'⚽').split(/\s+/).map(x=>x[0]).join('').slice(0,3).toUpperCase())+'</span>';
}
function matchBlock(){
  const m=matchContext();
  const home=m?.home||{name:'Equipo local'},away=m?.away||{name:'Equipo visitante'};
  return '<section class="v411-match-panel">'+
    '<div class="v411-match-hero">'+
      '<div class="v411-side">'+logoMarkup(home)+'<b>'+esc(home.name)+'</b></div>'+
      '<div class="v411-vs"><small>MATCH CENTER</small><strong>VS</strong><em>'+esc(m?.meta||'Partido de la Liga')+'</em></div>'+
      '<div class="v411-side">'+logoMarkup(away)+'<b>'+esc(away.name)+'</b></div>'+
    '</div>'+
    '<div class="v411-match-tabs">'+
      '<button data-v411-native="Resumen">Previa</button>'+
      '<button data-v411-route="predictor">Predicciones</button>'+
      '<button data-v411-action="comments">Comentarios</button>'+
      '<button data-v411-native="Alineaciones">Alineaciones</button>'+
      '<button data-v411-native="Estadísticas">Estadísticas</button>'+
      '<button data-v411-native="Cronología">Cronología</button>'+
    '</div>'+
    '<div class="v411-grid">'+[
      {icon:'clock',title:'Cronómetro',sub:'45 + descanso + 45',route:'matchday'},
      {icon:'match',title:'Resultados',sub:'Jornada y marcadores',route:'competition'},
      {icon:'tv',title:'Televisados',sub:'YouTube, Facebook, TikTok o video',action:'stream'},
      {icon:'cast',title:'Conectar / transmitir',sub:'Modo TV o enlace para otro dispositivo',action:'cast'},
      {icon:'lineup',title:'Alineaciones',sub:'Formación y plantillas',route:'tactics'},
      {icon:'players',title:'Buscar jugador',sub:'Plantillas registradas',route:'players'},
      {icon:'transfer',title:'Fichajes',sub:'Movimientos oficiales',route:'transfers'},
      {icon:'star',title:'Favoritos',sub:'Seguir equipos',route:'following'}
    ].map(button).join('')+'</div>'+
  '</section>';
}
async function teamRail(){
  try{await window.V66_OFFICIAL_DIRECTORY?.load?.()}catch(_){}
  let list=[];
  try{list=window.V66_OFFICIAL_DIRECTORY?.teamList?.()||[]}catch(_){}
  list=list.slice(0,9);
  if(!list.length)return '';
  return '<div class="v411-team-rail" aria-label="Equipos de la Liga">'+list.map(t=>{
    let src='';try{src=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(t.name)||''}catch(_){}
    return '<button type="button" data-v411-route="teams" title="'+esc(t.name)+'">'+
      (src?'<img src="'+esc(src)+'" alt="'+esc(t.name)+'" loading="lazy" decoding="async">':'<span>'+esc(t.name.split(/\s+/).map(x=>x[0]).join('').slice(0,2))+'</span>')+
      '<small>'+esc(t.name)+'</small>'+
    '</button>';
  }).join('')+'</div>';
}
function social(){
  return '<div class="v411-social"><span class="v411-fb">'+icon('facebook')+'</span><span><small>SÍGUENOS</small><b>Facebook · Golazo Liga</b></span><button type="button" data-v411-action="facebook">Abrir</button></div>';
}
function modal(title,body){
  document.querySelector('.v411-modal')?.remove();
  const m=document.createElement('div');m.className='v411-modal';
  m.innerHTML='<section><button class="v411-modal-x" type="button" aria-label="Cerrar">×</button><h3>'+esc(title)+'</h3>'+body+'</section>';
  document.body.appendChild(m);
  $('.v411-modal-x',m).onclick=()=>m.remove();
  m.addEventListener('click',e=>{if(e.target===m)m.remove()});
  return m;
}
async function sharePage(){
  const data={title:'Liga Juventino Rosas',text:'Liga Municipal de Fútbol Juventino Rosas',url:location.href};
  try{if(navigator.share){await navigator.share(data);return}}catch(_){}
  try{await navigator.clipboard.writeText(location.href);toast('Enlace copiado')}catch(_){toast('No se pudo compartir desde este navegador')}
}
function toast(msg){
  document.querySelector('.v411-toast')?.remove();
  const t=document.createElement('div');t.className='v411-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);
}
function openCast(){
  const m=modal('Conectar o transmitir',
    '<p>Usa el Modo TV de la Liga o comparte el enlace con otro dispositivo. La transmisión directa depende de las funciones disponibles en tu navegador o TV.</p>'+
    '<div class="v411-modal-actions"><button data-v411-modal-tv>Modo TV</button><button data-v411-modal-share>Compartir enlace</button><button data-v411-modal-match>Match Center</button></div>'
  );
  $('[data-v411-modal-tv]',m).onclick=()=>{m.remove();window.LJR_V105?.openTv?.()||go('more')};
  $('[data-v411-modal-share]',m).onclick=()=>sharePage();
  $('[data-v411-modal-match]',m).onclick=()=>{m.remove();go('v4-matchcenter')};
}
function openComments(){
  const key='v411-match-comments';
  let val='';try{val=localStorage.getItem(key)||''}catch(_){}
  const m=modal('Comentarios del partido',
    '<p>Notas locales para seguimiento del encuentro. No se publican ni modifican datos oficiales.</p>'+
    '<textarea class="v411-notes" placeholder="Escribe una nota del partido...">'+esc(val)+'</textarea>'+
    '<div class="v411-modal-actions"><button data-v411-save-note>Guardar nota</button></div>'
  );
  $('[data-v411-save-note]',m).onclick=()=>{try{localStorage.setItem(key,$('.v411-notes',m).value||'')}catch(_){};m.remove();toast('Nota guardada')};
}
function openStream(){
  const hub=$('[data-v196-stream-hub]');
  if(hub){hub.scrollIntoView({behavior:'smooth',block:'start'});return}
  try{sessionStorage.setItem('v411-open-stream','1')}catch(_){}
  go('v4-matchcenter');
}
function nativeTab(label){
  const root=$('[data-v92-matchcenter]');
  if(!root)return;
  const btn=$$('.v92-tabs button,.v92-tab',root).find(b=>(b.textContent||'').trim().toLowerCase().includes(String(label).toLowerCase()));
  if(btn){btn.click();setTimeout(()=>btn.scrollIntoView({behavior:'smooth',block:'center'}),80)}
}
function bind(root){
  $$('[data-v411-route]',root).forEach(b=>b.onclick=()=>go(b.dataset.v411Route));
  $$('[data-v411-native]',root).forEach(b=>b.onclick=()=>nativeTab(b.dataset.v411Native));
  $$('[data-v411-action]',root).forEach(b=>b.onclick=()=>{
    const a=b.dataset.v411Action;
    if(a==='tv')window.LJR_V105?.openTv?.()||go('more');
    else if(a==='stream')openStream();
    else if(a==='cast')openCast();
    else if(a==='comments')openComments();
    else if(a==='facebook')window.open(FB,'_blank','noopener,noreferrer');
    else if(a==='share')sharePage();
  });
}
async function build(r){
  if(['v4-matchcenter','matchCenter','match-center','match'].includes(r)){
    return '<section class="v411-lower v411-match-lower" id="'+ID+'" data-v411-route="'+esc(r)+'">'+
      sectionHead('MÁS DEL PARTIDO','Centro del partido','Cronómetro, alineaciones, estadísticas, transmisión, favoritos y jugadores debajo del Match Center actual.')+
      matchBlock()+
    '</section>';
  }
  const c=cfg(r);if(!c)return '';
  const rail=c.logos?await teamRail():'';
  return '<section class="v411-lower" id="'+ID+'" data-v411-route="'+esc(r)+'">'+
    sectionHead(c.kicker,c.title,c.desc)+
    rail+
    '<div class="v411-grid">'+c.cards.map(button).join('')+'</div>'+
    (c.social?social():'')+
  '</section>';
}
async function mount(){
  const screen=$('#screen');if(!screen)return;
  const r=route();
  const old=$('#'+ID,screen);
  if(!SUPPORTED.has(r)){old?.remove();return}
  const host=$('#v105-bottom',screen)||screen;
  if(old&&old.dataset.v411Route===r){
    if(old.parentElement!==host)host.appendChild(old);
    return;
  }
  old?.remove();
  const html=await build(r);
  if(route()!==r||!html)return;
  host.insertAdjacentHTML('beforeend',html);
  const root=$('#'+ID,screen);if(root)bind(root);
  if(['v4-matchcenter','matchCenter','match-center'].includes(r)){
    let open=false;try{open=sessionStorage.getItem('v411-open-stream')==='1'}catch(_){}
    if(open){try{sessionStorage.removeItem('v411-open-stream')}catch(_){};setTimeout(openStream,700)}
  }
}
function schedule(ms=90){clearTimeout(timer);timer=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(120));
window.addEventListener('load',()=>schedule(220));
document.addEventListener('DOMContentLoaded',()=>schedule(120),{once:true});
const screen=$('#screen');
if(screen)new MutationObserver(()=>schedule(110)).observe(screen,{childList:true,subtree:false});
schedule(160);setTimeout(()=>schedule(0),1200);setTimeout(()=>schedule(0),3200);
})();