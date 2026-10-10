/* V569 — Diseños y funciones inspiradas en navegación de liga, SOLO en partes inferiores.
   Conserva intacto el diseño azul principal. Usa exclusivamente datos de Liga Juventino Rosas. */
(function(){
'use strict';
if(window.__LJR_V569_BROWSER_LOWER__)return;
window.__LJR_V569_BROWSER_LOWER__=true;

const CAT_NAMES={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
const CAT_ORDER=['3','5','4','2','1'];
let raf=0;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const db=()=>{try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}};
const currentCat=()=>String(localStorage.getItem('v12-fixture-cat')||localStorage.getItem('v62-category')||'3');
const logo=name=>{
  try{
    const x=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name);
    if(x)return x;
  }catch(_){}
  const entries=Object.entries(db()?.team_logos||{});
  const v=entries.find(([k])=>norm(k)===norm(name))?.[1];
  const p=typeof v==='string'?v:(v?.local||v?.source||'');
  if(p)return /^https?:/i.test(p)?p:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(p).replace(/^\.\//,'');
  return './assets/liga-logo.webp';
};
const fixtureStamp=v=>{
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  return m?new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime():NaN;
};
const score=r=>{
  const h=String(r?.[3]??'').trim(),a=String(r?.[5]??'').trim();
  return /^-?\d+$/.test(h)&&/^-?\d+$/.test(a)?{h:+h,a:+a,text:h+' - '+a}:null;
};
function allRows(){
  const out=[];
  Object.entries(db()?.categories||{}).forEach(([cid,c])=>{
    (c?.fixtures||[]).forEach((block,bi)=>(block?.rows||[]).forEach((r,ri)=>{
      if(!Array.isArray(r)||!r[2]||!r[6])return;
      out.push({
        key:String(cid)+':'+String(r[0]??(bi+'-'+ri)),
        cid:String(cid),
        category:c?.name||CAT_NAMES[cid]||('Categoría '+cid),
        r,
        home:String(r[2]||'').trim(),
        away:String(r[6]||'').trim(),
        date:String(r[8]||'').trim(),
        stamp:fixtureStamp(r[8]),
        venue:String(r[7]||'').trim(),
        referee:String(r[9]||'').trim(),
        phase:String(r[1]||'').trim(),
        result:score(r)
      });
    }));
  });
  return out;
}
function rowsForCat(cid=currentCat()){return allRows().filter(x=>x.cid===String(cid))}
function isKnockout(v){return /play.?off|octavos|cuartos|semifinal|^final\b|liguilla/i.test(String(v||''))}
function splitDate(v){
  const s=String(v||'').trim();
  const m=s.match(/^(\d{1,2}\/\d{1,2}\/\d{4})(?:\s+(\d{1,2}:\d{2}))?/);
  return {date:m?.[1]||s||'Por confirmar',time:m?.[2]||'Por confirmar'};
}
function catStats(cid=currentCat()){
  const rows=rowsForCat(cid),played=rows.filter(x=>x.result).length,pending=rows.filter(x=>!x.result).length;
  const journeys=[...new Set(rows.map(x=>x.phase).filter(Boolean))];
  return {rows,played,pending,journeys};
}
function nextMatch(cid=currentCat()){
  const now=Date.now();
  const rows=rowsForCat(cid).filter(x=>!x.result);
  const future=rows.filter(x=>Number.isFinite(x.stamp)&&x.stamp>=now-2*3600000).sort((a,b)=>a.stamp-b.stamp);
  return future[0]||rows.find(x=>Number.isFinite(x.stamp))||rows[0]||null;
}
function selectedMatch(){
  let s=null;try{s=JSON.parse(sessionStorage.getItem('lj-match-detail')||'null')}catch(_){}
  if(!s?.home||!s?.away)return null;
  const rows=allRows();
  const same=rows.filter(x=>norm(x.home)===norm(s.home)&&norm(x.away)===norm(s.away));
  if(same.length===1)return {...same[0],saved:s};
  const date=String(s.date||'').match(/\d{1,2}\/\d{1,2}\/\d{4}/)?.[0]||'';
  const byDate=same.find(x=>!date||x.date.includes(date));
  return {...(byDate||same[0]||{}),saved:s};
}
function saveForMatch(m){
  if(!m)return;
  try{
    sessionStorage.setItem('lj-match-detail',JSON.stringify({
      id:m.key,from:'#/competition',home:m.home,away:m.away,
      time:splitDate(m.date).time,date:splitDate(m.date).date,
      venue:m.venue||'Campo por confirmar',category:m.category||'Liga Municipal',
      jornada:m.phase||''
    }));
  }catch(_){}
}
function openMatchCenter(m,tab='Resumen'){
  try{sessionStorage.setItem('v92-open-tab',tab)}catch(_){}
  if(m?.key&&window.LJR_MATCH_CENTER?.open){
    window.LJR_MATCH_CENTER.open(m.key);
  }else{
    location.hash='#/matchCenter';
  }
}
function icon(name){
  const map={
    calendar:'<path d="M5 4v3M19 4v3M4 9h16M5 6h14a2 2 0 0 1 2 2v11H3V8a2 2 0 0 1 2-2Zm2 6h3v3H7zm7 0h3v3h-3z"/>',
    phase:'<path d="M5 5h6v6H5zM13 13h6v6h-6zM11 8h5a3 3 0 0 1 3 3v2M8 11v5a3 3 0 0 0 3 3h2"/>',
    match:'<path d="M4 6h16v12H4zM12 6v12M4 12h16"/><circle cx="12" cy="12" r="2"/>',
    lineup:'<path d="M5 4h14v16H5zM9 4v4m6-4v4M8 12h8M8 16h8"/>',
    events:'<path d="M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"/>',
    referee:'<circle cx="12" cy="8" r="3"/><path d="M6 20c1-4 3-6 6-6s5 2 6 6"/>',
    stats:'<path d="M5 19V9m5 10V5m5 14v-7m4 7V7"/>'
  };
  return window.LJR_ICONS?.decorate('<svg viewBox="0 0 24 24" aria-hidden="true">'+(map[name]||map.match)+'</svg>',name) || '<svg viewBox="0 0 24 24" aria-hidden="true">'+(map[name]||map.match)+'</svg>';
}
function teamLogo(name){return '<img src="'+esc(logo(name))+'" alt="'+esc(name)+'">';}

function competitionPanel(){
  const cid=currentCat(),name=db()?.categories?.[cid]?.name||CAT_NAMES[cid]||'Categoría';
  const s=catStats(cid),next=nextMatch(cid),hasKO=s.rows.some(x=>isKnockout(x.phase));
  const nextHtml=next?(()=>{
    const d=splitDate(next.date);
    return '<article class="v569-next-match">'+
      '<div class="v569-team">'+teamLogo(next.home)+'<b>'+esc(next.home)+'</b></div>'+
      '<div class="v569-center"><strong>'+esc(next.result?.text||d.time)+'</strong><small>'+esc(d.date)+'</small></div>'+
      '<div class="v569-team right">'+teamLogo(next.away)+'<b>'+esc(next.away)+'</b></div>'+
      '<footer><span>'+esc(next.venue||'Campo por confirmar')+'</span><button type="button" data-v569-match="'+esc(next.key)+'">Ver detalles</button></footer>'+
    '</article>';
  })():'<div class="v569-empty">No hay un próximo partido oficial publicado para esta categoría.</div>';
  return '<section class="v569-lower v569-comp" data-v569-comp>'+
    '<header><span><small>EXPLORAR TORNEO</small><h3>'+esc(name)+'</h3><p>Funciones extra agregadas abajo sin modificar Competición.</p></span><b>'+esc(cid==='1'?'50+':cid)+'</b></header>'+
    '<div class="v569-summary"><span><small>JUGADOS</small><b>'+s.played+'</b></span><span><small>PENDIENTES</small><b>'+s.pending+'</b></span><span><small>JORNADAS</small><b>'+s.journeys.length+'</b></span></div>'+
    '<div class="v569-actions">'+
      '<button type="button" data-v569-comp-action="journeys">'+icon('calendar')+'<span><b>Jornadas</b><small>Calendario completo</small></span></button>'+
      '<button type="button" data-v569-comp-action="phase">'+icon('phase')+'<span><b>Fase</b><small>'+(hasKO?'Regular / Liguilla':'Fase regular')+'</small></span></button>'+
      '<button type="button" data-v569-comp-action="matchcenter">'+icon('match')+'<span><b>Match Center</b><small>Partido y cronología</small></span></button>'+
    '</div>'+
    '<div class="v569-subhead"><b>Próximo partido</b><small>Datos oficiales de tu Liga</small></div>'+
    nextHtml+
  '</section>';
}
function matchLiveState(key){
  if(!key)return {};
  try{return JSON.parse(localStorage.getItem('ljr-match-live-v144:'+key)||'null')||{}}catch(_){return {}}
}
function liveOfficials(m,state){
  const src=state?.officials||state?.jueces||state?.referees||{};
  const get=(...ks)=>{for(const k of ks){const v=src?.[k]??state?.[k];if(v)return String(v)}return ''};
  const main=get('referee','arbitro','árbitro','central')||m?.referee||'Por asignar';
  return [
    ['Árbitro',main],
    ['Asistente',get('assistant_referee','arbitro_asistente','asistente')||'Por asignar'],
    ['Cuarto árbitro',get('fourth_official','cuarto_arbitro','cuarto')||'Por asignar']
  ];
}
function eventList(state){
  const raw=state?.events||state?.eventos||state?.timeline||state?.cronologia||[];
  if(!Array.isArray(raw))return [];
  return raw.slice(-6).reverse().map((e,i)=>{
    if(typeof e==='string')return {minute:'',text:e};
    return {
      minute:String(e?.minute??e?.minuto??e?.time??''),
      text:String(e?.text||e?.event||e?.evento||e?.type||e?.tipo||'Evento')
    };
  }).filter(x=>x.text);
}
function lineupNames(state,side){
  const src=state?.lineups||state?.alineaciones||{};
  const raw=src?.[side]||src?.[side==='home'?'local':'visitante']||[];
  if(!Array.isArray(raw))return [];
  return raw.map(x=>typeof x==='string'?x:(x?.name||x?.player||x?.nombre||'')).filter(Boolean);
}
function matchPanel(){
  const m=selectedMatch(); if(!m?.saved)return '';
  const s=m.saved,state=matchLiveState(m.key),d=splitDate(m.date||s.date);
  const home=m.home||s.home,away=m.away||s.away,category=m.category||s.category||'Liga Municipal';
  const venue=m.venue||s.venue||'Por confirmar',phase=m.phase||s.jornada||'Por confirmar';
  const officials=liveOfficials(m,state),events=eventList(state),hl=lineupNames(state,'home'),al=lineupNames(state,'away');
  const phaseLabel=isKnockout(phase)?phase:'Regular';
  return '<section class="v569-lower v569-match-lower" data-v569-match-lower>'+
    '<header><span><small>DETALLES DEL PARTIDO</small><h3>'+esc(home)+' vs '+esc(away)+'</h3><p>Se agrega debajo del diseño actual.</p></span>'+icon('match')+'</header>'+
    '<div class="v569-detail-grid">'+
      '<div><small>Liga</small><b>'+esc(category)+'</b></div>'+
      '<div><small>Fase</small><b>'+esc(phaseLabel)+'</b></div>'+
      '<div><small>Jornada</small><b>'+esc(phase||'Por confirmar')+'</b></div>'+
      '<div><small>Fecha</small><b>'+esc(d.date)+'</b></div>'+
      '<div><small>Hora</small><b>'+esc(d.time||s.time||'Por confirmar')+'</b></div>'+
      '<div><small>Localización</small><b>'+esc(venue)+'</b></div>'+
    '</div>'+
    '<div class="v569-subhead"><b>Jueces</b><small>Solo información publicada</small></div>'+
    '<div class="v569-officials">'+officials.map((x,i)=>'<div>'+icon('referee')+'<span><small>'+esc(x[0])+'</small><b>'+esc(x[1])+'</b></span></div>').join('')+'</div>'+
    '<div class="v569-subhead"><b>Alineaciones</b><small>'+(hl.length||al.length?'Disponible en Match Center':'Pendientes de publicación')+'</small></div>'+
    '<div class="v569-lineup-preview">'+
      '<button type="button" data-v569-mc-tab="Alineaciones"><span>'+teamLogo(home)+'<b>'+esc(home)+'</b><small>'+(hl.length?hl.length+' jugadores publicados':'Abrir alineación')+'</small></span>'+icon('lineup')+'</button>'+
      '<div class="v569-mini-pitch"><i></i><i></i><i></i></div>'+
      '<button type="button" data-v569-mc-tab="Alineaciones"><span>'+teamLogo(away)+'<b>'+esc(away)+'</b><small>'+(al.length?al.length+' jugadores publicados':'Abrir alineación')+'</small></span>'+icon('lineup')+'</button>'+
    '</div>'+
    '<div class="v569-subhead"><b>Eventos</b><small>Goles, tarjetas, cambios y cronología</small></div>'+
    (events.length?'<div class="v569-events">'+events.map(e=>'<div><strong>'+esc(e.minute||'•')+'</strong><span>'+esc(e.text)+'</span></div>').join('')+'</div>':'<div class="v569-empty">Aún no hay eventos oficiales publicados para este partido.</div>')+
    '<div class="v569-match-actions">'+
      '<button type="button" data-v569-mc-tab="Alineaciones">'+icon('lineup')+'<span><b>Alineaciones</b><small>Plantillas y cancha</small></span></button>'+
      '<button type="button" data-v569-mc-tab="Estadísticas">'+icon('stats')+'<span><b>Estadísticas</b><small>Datos oficiales</small></span></button>'+
      '<button type="button" data-v569-mc-tab="Cronología">'+icon('events')+'<span><b>Cronología</b><small>Eventos del partido</small></span></button>'+
    '</div>'+
  '</section>';
}
function placeCompetition(){
  if(route()!=='competition')return;
  const old=document.querySelector('[data-v569-comp]');
  const anchor=document.querySelector('.v566-comp-lower')||document.querySelector('[data-v12-fixtures],[data-v40-standings],[data-v12-bracket]');
  if(!anchor)return;
  const wrap=document.createElement('div');wrap.innerHTML=competitionPanel();
  const fresh=wrap.firstElementChild;
  if(old){old.replaceWith(fresh);return}
  anchor.insertAdjacentElement('afterend',fresh);
}
function placeMatch(){
  if(route()!=='match')return;
  const host=document.querySelector('[data-v28-match]');if(!host)return;
  const html=matchPanel();if(!html)return;
  const old=host.querySelector('[data-v569-match-lower]');
  const wrap=document.createElement('div');wrap.innerHTML=html;
  const fresh=wrap.firstElementChild;
  if(old)old.replaceWith(fresh);else host.appendChild(fresh);
}
function mount(){
  const r=route();
  if(r==='competition')placeCompetition();
  else if(r==='match')placeMatch();
}
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(mount))}

document.addEventListener('click',e=>{
  const detail=e.target.closest('[data-v569-match]');
  if(detail){
    e.preventDefault();
    const m=allRows().find(x=>x.key===detail.dataset.v569Match);
    if(m){saveForMatch(m);location.hash='#/match'}
    return;
  }
  const act=e.target.closest('[data-v569-comp-action]');
  if(act){
    e.preventDefault();
    const a=act.dataset.v569CompAction;
    if(a==='journeys'){
      const native=document.querySelector('[data-v566-open="journeys"]');
      if(native)native.click(); else document.querySelector('[data-v12-date]')?.scrollIntoView({behavior:'smooth',block:'center'});
    }
    if(a==='phase'){
      const bracket=[...(document.querySelectorAll('#screen>.tabs .tab')||[])].find(b=>/Cuadro|Liguilla/i.test(b.textContent||''));
      const regular=[...(document.querySelectorAll('#screen>.tabs .tab')||[])].find(b=>/Partidos|Resultados/i.test(b.textContent||''));
      if(rowsForCat().some(x=>isKnockout(x.phase))&&bracket)bracket.click();else regular?.click();
    }
    if(a==='matchcenter')openMatchCenter(nextMatch(),'Resumen');
    return;
  }
  const mc=e.target.closest('[data-v569-mc-tab]');
  if(mc){
    e.preventDefault();
    const m=selectedMatch();
    openMatchCenter(m,mc.dataset.v569McTab||'Resumen');
  }
},true);

window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',schedule);
window.addEventListener('ljr:match-live-feed',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();