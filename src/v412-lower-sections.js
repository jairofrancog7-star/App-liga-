/* V412 — referencias deportivas distribuidas por sección.
   No toca las barras superiores existentes.
   Cada referencia vive sólo donde corresponde:
   Resultados -> Competición
   Conectar/Transmitir + Televisados -> Video
   Buscar jugadores -> Buscar
   Fichajes -> Fichajes
   Previa/Alineaciones/Estadísticas/Cronología -> Match Center
*/
(function(){
'use strict';
if(window.__LJR_V412_SECTION_EXPERIENCE__)return;
window.__LJR_V412_SECTION_EXPERIENCE__=true;

const ID='v412-lower-sections';
const TV_KEY='ljr-tv-sources-v412';
const NOTE_KEY='v412-match-comments';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const SUPPORTED=new Set([
  'competition','v4-calendar','calendar','monthlyCalendar','calendarMonthly',
  'video','search','players','transfers',
  'v4-matchcenter','matchCenter','match-center','match',
  'news','profile'
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
    bell:'<path d="M6 17h12l-2-3v-3a4 4 0 0 0-8 0v3z"/><path d="M10 20h4"/>',
    lineup:'<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M12 3v7M12 14v7M4 12h6M14 12h6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
    chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/>',
    comment:'<path d="M4 5h16v11H9l-5 4z"/>',
    news:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>'
  };
  return window.LJR_ICONS?.decorate('<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.match)+'</svg>',name) || '<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.match)+'</svg>';
}
function go(r){if(r)location.hash='#/'+r}
function toast(msg){
  document.querySelector('.v412-toast')?.remove();
  const t=document.createElement('div');t.className='v412-toast';t.textContent=msg;
  document.body.appendChild(t);setTimeout(()=>t.remove(),2200);
}
async function official(){
  try{await window.V66_OFFICIAL_DIRECTORY?.load?.()}catch(_){}
  return window.V66_OFFICIAL_DIRECTORY||null;
}
function logoFor(name){
  try{return window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||''}catch(_){return ''}
}
function logo(name,cls=''){
  const src=logoFor(name);
  const ab=String(name||'⚽').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return '<span class="v412-logo '+cls+'">'+(src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">':'<b>'+esc(ab)+'</b>')+'</span>';
}
function head(k,t,d){
  return '<header class="v412-head"><small>'+esc(k)+'</small><h2>'+esc(t)+'</h2><p>'+esc(d)+'</p></header>';
}
function dateText(v){
  const s=String(v||'Por confirmar').trim();
  if(!s)return 'Por confirmar';
  return s.replace('T',' · ').replace(/:00(?:Z|$)/,'').slice(0,28);
}
function fixtureRows(){
  try{return window.V66_OFFICIAL_DIRECTORY?.fixtureRows?.()||[]}catch(_){return []}
}
function playerRows(){
  try{return window.V66_OFFICIAL_DIRECTORY?.playerList?.()||[]}catch(_){return []}
}
function teamRows(){
  try{return window.V66_OFFICIAL_DIRECTORY?.teamList?.()||[]}catch(_){return []}
}

/* ===== COMPETICIÓN / RESULTADOS — referencia ESPN ===== */
async function resultsBlock(){
  await official();
  const rows=fixtureRows();
  const groups=[];
  rows.forEach(r=>{
    let g=groups.find(x=>x.name===r.category);
    if(!g){g={name:r.category,rows:[]};groups.push(g)}
    if(g.rows.length<5)g.rows.push(r);
  });
  const chips=[...new Set(rows.map(r=>r.round).filter(Boolean))].slice(0,5);
  const body=groups.length?groups.slice(0,5).map(g=>
    '<section class="v412-score-group"><header><b>'+esc(g.name)+'</b><button type="button" data-v412-route="competition">Ver todo</button></header>'+
      g.rows.map(r=>
        '<button type="button" class="v412-score-row" data-v412-route="competition">'+
          '<span class="v412-tv-mini">TV</span>'+
          '<span class="v412-score-teams"><span>'+logo(r.home,'tiny')+'<b>'+esc(r.home)+'</b></span><span>'+logo(r.away,'tiny')+'<b>'+esc(r.away)+'</b></span></span>'+
          '<span class="v412-score-meta"><b>J'+esc(r.round||'—')+'</b><small>'+esc(dateText(r.date))+'</small><em>'+esc(r.field||'Campo por confirmar')+'</em></span>'+
        '</button>'
      ).join('')+
    '</section>'
  ).join(''):'<div class="v412-empty">No hay jornadas oficiales disponibles en este momento.</div>';
  return '<section class="v412-module v412-results">'+
    head('RESULTADOS','Partidos y resultados','Vista compacta por categoría inspirada en tu referencia, usando únicamente partidos de la Liga.')+
    '<div class="v412-result-toolbar"><b>Resultados</b><span>'+icon('cast')+'</span><span>'+icon('search')+'</span><span>'+icon('bell')+'</span></div>'+
    '<div class="v412-day-chips">'+
      '<button class="active" type="button">Todos</button>'+
      chips.map(x=>'<button type="button">Jornada '+esc(x)+'</button>').join('')+
    '</div>'+
    body+
  '</section>';
}

/* ===== VIDEO / TV — referencias Televisados + Conectar o transmitir ===== */
function readTvSources(){
  let out=[];
  try{out=JSON.parse(localStorage.getItem(TV_KEY)||'[]')||[]}catch(_){}
  if(!Array.isArray(out))out=[];
  try{
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i)||'';
      if(!k.startsWith('ljr-stream-list-v196:'))continue;
      const a=JSON.parse(localStorage.getItem(k)||'[]');
      if(Array.isArray(a))a.forEach(x=>{if(x?.url)out.push({name:x.name||'Transmisión',url:x.url,from:'Match Center'})});
    }
  }catch(_){}
  const seen=new Set();
  return out.filter(x=>{
    const u=String(x?.url||'').trim();if(!u||seen.has(u))return false;seen.add(u);return true;
  }).slice(0,12);
}
function provider(url){
  const u=String(url||'').toLowerCase();
  if(u.includes('youtube')||u.includes('youtu.be'))return 'YouTube';
  if(u.includes('facebook')||u.includes('fb.watch'))return 'Facebook';
  if(u.includes('tiktok'))return 'TikTok';
  return 'Video / enlace';
}
function saveTvSource(url){
  try{
    const u=new URL(String(url||'').trim());
    if(!/^https?:$/.test(u.protocol))throw 0;
    const list=readTvSources().filter(x=>x.from!=='Match Center');
    list.unshift({name:provider(u.toString()),url:u.toString(),at:Date.now()});
    localStorage.setItem(TV_KEY,JSON.stringify(list.slice(0,10)));
    return true;
  }catch(_){return false}
}
async function videoBlock(){
  await official();
  const sources=readTvSources();
  const fixtures=fixtureRows().slice(0,6);
  const televised=sources.length?
    '<div class="v412-tv-list">'+sources.map((x,i)=>
      '<button type="button" class="v412-tv-source" data-v412-url="'+esc(x.url)+'"><span class="v412-tv-badge">TV</span><span><b>'+esc(x.name||provider(x.url))+'</b><small>'+esc(provider(x.url))+' · fuente vinculada</small></span><i>›</i></button>'
    ).join('')+'</div>':
    '<div class="v412-tv-empty"><b>No hay transmisiones vinculadas todavía</b><span>Cuando guardes YouTube, Facebook, TikTok o un video, aparecerá aquí.</span></div>';

  const schedule=fixtures.length?'<div class="v412-televised-schedule">'+fixtures.map(r=>
    '<div class="v412-televised-row"><span class="v412-tv-badge">TV</span><span>'+logo(r.home,'tiny')+'<b>'+esc(r.home)+'</b></span><strong>'+esc(dateText(r.date))+'</strong><span>'+logo(r.away,'tiny')+'<b>'+esc(r.away)+'</b></span></div>'
  ).join('')+'</div>':'';

  return '<section class="v412-module v412-video-tools">'+
    head('LIGA TV','Televisados y conexión','Estas funciones quedan en Video, separadas del Match Center como pediste.')+
    '<section class="v412-connect-card">'+
      '<h3>Conectar o transmitir</h3>'+
      '<div class="v412-connect-sub"><b>Ver con Liga TV</b><p>Abre el modo TV de la Liga o comparte esta pantalla a otro dispositivo.</p><button type="button" data-v412-action="tv">Entrar</button></div>'+
      '<div class="v412-connect-row"><span>'+icon('cast')+'</span><span><b>Transmitir a otro dispositivo</b><small>Compartir enlace o usar funciones disponibles del navegador</small></span><button type="button" data-v412-action="share">›</button></div>'+
      '<div class="v412-stream-add"><label><span>Añadir transmisión</span><input type="url" data-v412-tv-url placeholder="YouTube, Facebook, TikTok o video..."></label><button type="button" data-v412-action="save-stream">Guardar</button></div>'+
    '</section>'+
    '<section class="v412-televised"><div class="v412-subtitle"><span><small>TELEVISADOS</small><b>Transmisiones vinculadas</b></span><em>'+sources.length+'</em></div>'+televised+'</section>'+
    (schedule?'<section class="v412-tv-schedule"><div class="v412-subtitle"><span><small>PROGRAMACIÓN</small><b>Próximos partidos</b></span></div>'+schedule+'</section>':'')+
  '</section>';
}

/* ===== BUSCAR JUGADORES — referencia BeSoccer ===== */
async function searchBlock(){
  await official();
  const players=playerRows();
  return '<section class="v412-module v412-player-search">'+
    head('BUSCAR','Buscar jugadores','Lista de jugadores registrados con equipo y categoría. No se inventan edad, valor o media.')+
    '<div class="v412-player-searchbar">'+icon('search')+'<input type="search" data-v412-player-search placeholder="Buscar jugador o equipo..."><span>'+players.length+'</span></div>'+
    '<div class="v412-player-list" data-v412-player-list></div>'+
  '</section>';
}
function renderPlayers(root,q=''){
  const list=$('[data-v412-player-list]',root);if(!list)return;
  const needle=norm(q);
  const rows=playerRows().filter(p=>!needle||norm(p.name+' '+p.team+' '+p.category).includes(needle)).slice(0,18);
  list.innerHTML=rows.length?rows.map((p,i)=>
    '<button type="button" class="v412-player-row" data-v412-route="players">'+
      '<span class="v412-player-avatar">'+esc(p.name.split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase())+'</span>'+
      '<span class="v412-player-copy"><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.category)+'</small></span>'+
      '<span class="v412-player-team">'+logo(p.team,'small')+'<em>›</em></span>'+
    '</button>'
  ).join(''):'<div class="v412-empty">No se encontraron jugadores registrados.</div>';
  bindRoutes(list);
}

/* ===== FICHAJES — referencias BeSoccer Fichajes ===== */
async function transfersBlock(){
  await official();
  const teams=teamRows();
  const cats=[];
  teams.forEach(t=>{
    let c=cats.find(x=>x.name===t.category);
    if(!c){c={name:t.category,teams:[]};cats.push(c)}
    if(c.teams.length<4)c.teams.push(t);
  });
  return '<section class="v412-module v412-transfers">'+
    head('MERCADO MUNICIPAL','Fichajes','Diseño separado para movimientos y categorías; no se mezcla con Match Center.')+
    '<div class="v412-transfer-top"><b>Fichajes</b><div><button type="button" class="active" data-v412-transfer-tab="latest">ÚLTIMOS</button><button type="button" data-v412-transfer-tab="competitions">COMPETICIONES</button></div></div>'+
    '<div class="v412-transfer-filters"><button type="button">MIS CATEGORÍAS⌄</button><button type="button">FILTROS⌄</button></div>'+
    '<div class="v412-transfer-body" data-v412-transfer-body data-mode="latest">'+transferLatest()+'</div>'+
    '<template data-v412-transfer-competitions>'+esc(JSON.stringify(cats))+'</template>'+
  '</section>';
}
function transferLatest(){
  return '<div class="v412-transfer-empty"><span>'+icon('transfer')+'</span><b>Sin movimientos oficiales publicados</b><p>No mostramos rumores ni cambios de equipo hasta que la Liga publique el movimiento.</p></div>';
}
function transferCompetitions(root){
  let cats=[];
  try{cats=JSON.parse($('[data-v412-transfer-competitions]',root)?.textContent||'[]')}catch(_){}
  return '<div class="v412-competition-transfer-list">'+cats.map(c=>
    '<section class="v412-transfer-league"><header><span><b>'+esc(c.name)+'</b><small>Liga Juventino Rosas</small></span><button type="button" data-v412-route="teams">Ver más</button></header>'+
      '<div>'+c.teams.map(t=>
        '<button type="button" data-v412-route="teams">'+logo(t.name,'small')+'<span><b>'+esc(t.name)+'</b><small>Equipo registrado</small></span></button>'
      ).join('')+'</div>'+
    '</section>'
  ).join('')+'</div>';
}

/* ===== MATCH CENTER — sólo funciones propias del partido ===== */
function matchContext(){
  const root=$('[data-v92-matchcenter]');
  if(!root)return null;
  const sides=$$('.v92-score-card .v92-side',root);
  if(sides.length<2)return null;
  const side=s=>({name:$('b',s)?.textContent?.trim()||'Equipo',img:$('img',s)?.getAttribute('src')||''});
  return {
    root,home:side(sides[0]),away:side(sides[1]),
    status:$('.v92-center strong',root)?.textContent?.trim()||'VS',
    sub:$('.v92-center small',root)?.textContent?.trim()||'',
    meta:$$('.v92-official-meta span',root).map(x=>x.textContent.trim()),
    category:($('.v92-match-head p',root)?.textContent||'').split('·')[1]?.trim()||''
  };
}
function matchLogo(t){
  const src=t?.img||logoFor(t?.name||'');
  return '<span class="v412-match-logo">'+(src?'<img src="'+esc(src)+'" alt="'+esc(t.name)+'">':'<b>'+esc((t?.name||'⚽').split(/\s+/).map(x=>x[0]).join('').slice(0,3))+'</b>')+'</span>';
}
function findStanding(name,category){
  const db=window.V66_OFFICIAL_DIRECTORY?.data?.()||window.LJR_OFFICIAL_DATA||{};
  const cats=Object.values(db.categories||{});
  const cat=cats.find(c=>!category||norm(c.name)===norm(category))||cats.find(c=>{
    const rows=(c.standings||[])[0]?.rows||[];return rows.some(r=>norm(r?.[1])===norm(name));
  });
  const rows=(cat?.standings||[])[0]?.rows||[];
  return rows.find(r=>norm(r?.[1])===norm(name))||null;
}
function metricCard(label,h,a){
  return '<div class="v412-metric"><b>'+esc(h??'—')+'</b><span>'+esc(label)+'</span><b>'+esc(a??'—')+'</b></div>';
}
function formDots(r){
  if(!r)return '<div class="v412-form-dots"><i></i><i></i><i></i><i></i><i></i></div>';
  const pj=Number(r[2])||0,w=Number(r[3])||0,d=Number(r[4])||0,l=Number(r[5])||Math.max(0,pj-w-d);
  const seq=[...Array(Math.min(w,5)).fill('w'),...Array(Math.min(d,5)).fill('d'),...Array(Math.min(l,5)).fill('l')].slice(0,5);
  while(seq.length<5)seq.push('');
  return '<div class="v412-form-dots">'+seq.map(x=>'<i class="'+x+'"></i>').join('')+'</div>';
}
async function matchBlock(){
  await official();
  const m=matchContext();
  if(!m)return '<section class="v412-module">'+head('MATCH CENTER','Información del partido','Selecciona un partido oficial para mostrar sus datos.')+'</section>';
  const h=findStanding(m.home.name,m.category),a=findStanding(m.away.name,m.category);
  const active=window.LJR_MATCH_CENTER?.currentTab?.()||'BuildUp';
  const tabClass=t=>active===t?' class="active"':'';
  return '<section class="v412-module v412-match">'+
    head('MATCH CENTER','Build Up del partido','Aquí quedan únicamente funciones del encuentro: previa, predicciones, comentarios, alineaciones, estadísticas y cronología.')+
    '<section class="v412-match-hero">'+
      '<div class="v412-match-shade"></div>'+
      '<div class="v412-match-title"><small>'+esc(m.category||'Liga Juventino Rosas')+'</small><b>'+esc(m.meta[0]||'Partido oficial')+'</b></div>'+
      '<div class="v412-match-score"><span>'+matchLogo(m.home)+'<b>'+esc(m.home.name)+'</b></span><strong>'+esc(m.status)+'</strong><span>'+matchLogo(m.away)+'<b>'+esc(m.away.name)+'</b></span></div>'+
      '<em>'+esc(m.sub||m.meta[1]||'')+'</em>'+
    '</section>'+
    '<nav class="v412-match-tabs">'+
      '<button'+tabClass('BuildUp')+' type="button" data-v412-native="BuildUp">Build Up</button>'+
      '<button'+tabClass('Predicciones')+' type="button" data-v412-native="Predicciones">Predicciones</button>'+
      '<button'+tabClass('Comentarios')+' type="button" data-v412-native="Comentarios">Comentarios</button>'+
      '<button'+tabClass('Alineaciones')+' type="button" data-v412-native="Alineaciones">Alineaciones</button>'+
      '<button'+tabClass('Estadísticas')+' type="button" data-v412-native="Estadísticas">Estadísticas</button>'+
      '<button'+tabClass('Cronología')+' type="button" data-v412-native="Cronología">Cronología</button>'+
    '</nav>'+
    '<section class="v412-match-card"><h3>Comparación de temporada</h3><div class="v412-team-pair"><span>'+matchLogo(m.home)+'<b>'+esc(m.home.name)+'</b></span><span>'+matchLogo(m.away)+'<b>'+esc(m.away.name)+'</b></span></div>'+
      metricCard('Partidos',h?.[2],a?.[2])+metricCard('Ganados',h?.[3],a?.[3])+metricCard('Diferencia',h?.[8],a?.[8])+metricCard('Puntos',h?.[9],a?.[9])+
    '</section>'+
    '<section class="v412-match-card"><h3>Forma de temporada</h3><div class="v412-form-pair"><div>'+matchLogo(m.home)+formDots(h)+'</div><div>'+matchLogo(m.away)+formDots(a)+'</div></div></section>'+
    '<div class="v412-match-actions">'+
      '<button type="button" data-v412-route="matchday">'+icon('clock')+'<span><b>Cronómetro</b><small>Operación 45 + descanso + 45</small></span></button>'+
      '<button type="button" data-v412-native="Alineaciones">'+icon('lineup')+'<span><b>Alineaciones</b><small>Plantillas y formación</small></span></button>'+
      '<button type="button" data-v412-native="Estadísticas">'+icon('chart')+'<span><b>Estadísticas</b><small>Datos oficiales disponibles</small></span></button>'+
      '<button type="button" data-v412-native="Cronología">'+icon('comment')+'<span><b>Cronología</b><small>Eventos verificables</small></span></button>'+
    '</div>'+
  '</section>';
}

/* ===== otras páginas: sólo accesos relacionados ===== */
function miscBlock(r){
  if(r==='news')return '<section class="v412-module">'+head('ACTUALIDAD','Más noticias','Accesos relacionados con información de la Liga.')+'<div class="v412-simple-grid"><button data-v412-route="competition">Resultados</button><button data-v412-route="transfers">Fichajes</button><button data-v412-route="v4-calendar">Calendario</button><button data-v412-route="notifications">Avisos</button></div></section>';
  if(r==='profile')return '<section class="v412-module">'+head('EXPLORAR','Secciones de la Liga','Cada herramienta abre su pantalla propia.')+'<div class="v412-simple-grid"><button data-v412-route="video">Liga TV</button><button data-v412-route="transfers">Fichajes</button><button data-v412-route="search">Buscar</button><button data-v412-route="competition">Resultados</button></div></section>';
  return '';
}

function bindRoutes(root){
  $$('[data-v412-route]',root).forEach(b=>b.onclick=()=>go(b.dataset.v412Route));
}
function nativeTab(label){
  const wanted=String(label||'').trim();
  if(!wanted)return;
  if(window.LJR_MATCH_CENTER?.openTab){
    window.LJR_MATCH_CENTER.openTab(wanted);
    return;
  }
  const root=$('[data-v92-matchcenter]');if(!root)return;
  const b=$$('[data-v92-tab]',root).find(x=>norm(x.dataset.v92Tab||'')===norm(wanted));
  if(b){b.click();setTimeout(()=>b.scrollIntoView({behavior:'smooth',block:'center'}),90)}
}
async function shareCurrent(){
  const d={title:'Liga Juventino Rosas',text:'Liga Municipal de Fútbol Juventino Rosas',url:location.href};
  try{if(navigator.share){await navigator.share(d);return}}catch(_){}
  try{await navigator.clipboard.writeText(location.href);toast('Enlace copiado')}catch(_){toast('No se pudo compartir')}
}
function comments(){
  let val='';try{val=localStorage.getItem(NOTE_KEY)||''}catch(_){}
  document.querySelector('.v412-modal')?.remove();
  const m=document.createElement('div');m.className='v412-modal';
  m.innerHTML='<section><button class="v412-modal-x" type="button">×</button><h3>Comentarios del partido</h3><p>Notas locales del encuentro. No modifican datos oficiales.</p><textarea>'+esc(val)+'</textarea><button class="v412-save-note" type="button">Guardar nota</button></section>';
  document.body.appendChild(m);
  $('.v412-modal-x',m).onclick=()=>m.remove();
  $('.v412-save-note',m).onclick=()=>{try{localStorage.setItem(NOTE_KEY,$('textarea',m).value||'')}catch(_){};m.remove();toast('Nota guardada')};
}
function bind(root){
  bindRoutes(root);
  $$('[data-v412-native]',root).forEach(b=>b.onclick=()=>nativeTab(b.dataset.v412Native));
  $$('[data-v412-url]',root).forEach(b=>b.onclick=()=>window.open(b.dataset.v412Url,'_blank','noopener,noreferrer'));
  $$('[data-v412-action]',root).forEach(b=>b.onclick=async()=>{
    const a=b.dataset.v412Action;
    if(a==='tv'){window.LJR_V105?.openTv?.()||go('more')}
    else if(a==='share')await shareCurrent();
    else if(a==='comments')comments();
    else if(a==='save-stream'){
      const input=$('[data-v412-tv-url]',root);
      if(saveTvSource(input?.value||'')){toast('Transmisión guardada');schedule(0)}else toast('Enlace no válido');
    }
  });
  const p=$('[data-v412-player-search]',root);
  if(p){renderPlayers(root,'');p.addEventListener('input',()=>renderPlayers(root,p.value))}
  $$('[data-v412-transfer-tab]',root).forEach(b=>b.onclick=()=>{
    $$('[data-v412-transfer-tab]',root).forEach(x=>x.classList.toggle('active',x===b));
    const body=$('[data-v412-transfer-body]',root);if(!body)return;
    const mode=b.dataset.v412TransferTab;body.dataset.mode=mode;
    body.innerHTML=mode==='competitions'?transferCompetitions(root):transferLatest();
    bindRoutes(body);
  });
}
async function build(r){
  if(['competition','v4-calendar','calendar','monthlyCalendar','calendarMonthly'].includes(r))return resultsBlock();
  if(r==='video')return videoBlock();
  if(r==='search'||r==='players')return searchBlock();
  if(r==='transfers')return transfersBlock();
  if(['v4-matchcenter','matchCenter','match-center','match'].includes(r))return matchBlock();
  return miscBlock(r);
}
async function mount(){
  const screen=$('#screen');if(!screen)return;
  const r=route();
  const old=$('#'+ID,screen);
  if(!SUPPORTED.has(r)){old?.remove();return}
  const host=$('#v105-bottom',screen)||screen;
  if(old&&old.dataset.v412Route===r){
    if(old.parentElement!==host)host.appendChild(old);
    return;
  }
  old?.remove();
  const html=await build(r);
  if(route()!==r||!html)return;
  host.insertAdjacentHTML('beforeend','<div id="'+ID+'" data-v412-route="'+esc(r)+'">'+html+'</div>');
  const root=$('#'+ID,screen);if(root)bind(root);
}
function schedule(ms=100){clearTimeout(timer);timer=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(130));
window.addEventListener('load',()=>schedule(240));
document.addEventListener('DOMContentLoaded',()=>schedule(130),{once:true});
const screen=$('#screen');
if(screen)new MutationObserver(()=>schedule(120)).observe(screen,{childList:true,subtree:false});
schedule(160);setTimeout(()=>schedule(0),1300);setTimeout(()=>schedule(0),3400);
})();
