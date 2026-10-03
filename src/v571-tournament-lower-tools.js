/* V573 — complementos inferiores inspirados en navegación de torneos.
   SOLO agrega funciones al final de Competición. No reemplaza el diseño azul ni importa equipos/datos externos. */
(function(){
'use strict';
if(window.__LJR_V573_TOURNAMENT_LOWER__)return;
window.__LJR_V573_TOURNAMENT_LOWER__=true;

const CAT_ORDER=['3','5','4','2','1'];
const CAT_NAMES={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
const CAT_LOGOS={
  '3':'./assets/branding/primera-fuerza-hd.png',
  '5':'./assets/categories/intermedia.webp',
  '4':'./assets/categories/segunda-fuerza.webp',
  '2':'./assets/categories/veteranos-35-user.png',
  '1':'./assets/categories/veteranos-50.webp'
};
const FB='https://www.facebook.com/share/19SsGuzsRi/';
let raf=0;
let mode=localStorage.getItem('v571-agenda-mode')||'scheduled';
let filter=localStorage.getItem('v571-agenda-cat')||'all';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const db=()=>{try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}};
const catObj=id=>db()?.categories?.[String(id)]||null;
const currentCompetitionCat=()=>{
  const saved=String(localStorage.getItem('v12-fixture-cat')||localStorage.getItem('v62-category')||'3');
  return catObj(saved)?saved:(CAT_ORDER.find(id=>catObj(id))||'3');
};
const catName=id=>catObj(id)?.name||CAT_NAMES[String(id)]||('Categoría '+id);
const categoryLogo=id=>CAT_LOGOS[String(id)]||'./assets/liga-logo.webp';

const logo=name=>{
  try{
    const x=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name);
    if(x)return x;
  }catch(_){}
  const v=Object.entries(db()?.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
  const p=typeof v==='string'?v:(v?.local||v?.source||v?.app||'');
  if(p)return /^https?:/i.test(p)?p:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(p).replace(/^\.\//,'');
  return './assets/liga-logo.webp';
};
const score=r=>{
  const h=String(r?.[3]??'').trim(),a=String(r?.[5]??'').trim();
  return /^-?\d+$/.test(h)&&/^-?\d+$/.test(a)?h+' - '+a:'';
};
const parseDate=v=>{
  const s=String(v||'').trim();
  const m=s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return {key:'',date:s||'Por confirmar',time:'Por confirmar',stamp:NaN};
  const d=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0));
  const pad=n=>String(n).padStart(2,'0');
  return {key:d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),date:pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear(),time:m[4]?pad(+m[4])+':'+m[5]:'Por confirmar',stamp:d.getTime()};
};
const dayKey=d=>{
  const x=d instanceof Date?d:new Date(d),p=n=>String(n).padStart(2,'0');
  return x.getFullYear()+'-'+p(x.getMonth()+1)+'-'+p(x.getDate());
};

function allMatches(){
  const out=[];
  Object.entries(db()?.categories||{}).forEach(([cid,c])=>{
    (c?.fixtures||[]).forEach((b,bi)=>(b?.rows||[]).forEach((r,ri)=>{
      if(!Array.isArray(r)||!r[2]||!r[6])return;
      const dt=parseDate(r[8]);
      out.push({
        key:String(cid)+':'+String(r[0]??(bi+'-'+ri)),
        cid:String(cid),category:c?.name||catName(cid),home:String(r[2]||'').trim(),away:String(r[6]||'').trim(),
        date:dt.date,time:dt.time,dateKey:dt.key,stamp:dt.stamp,venue:String(r[7]||'').trim(),
        phase:String(r[1]||'').trim(),result:score(r)
      });
    }));
  });
  return out;
}
function leagueStats(){
  let teams=0,players=0,played=0,pending=0,cats=0;
  Object.values(db()?.categories||{}).forEach(c=>{
    cats++;
    const x=c?.counts||c?.dashboard?.counts||{};
    teams+=Number(x.Equipos||0);
    const rosterCount=Object.values(c?.rosters||{}).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0);
    players+=Math.max(Number(x.Jugadores||0),Number(c?.public_player_count_scraped||0),rosterCount);
    played+=Number(x['Partidos Jugados']||0);
    pending+=Number(x['Partidos Pendientes']||0);
  });
  return {teams,players,matches:played+pending,cats,played,pending};
}
function filteredRows(){
  const now=new Date(),tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
  let rows=allMatches().filter(m=>filter==='all'||m.cid===filter);
  if(mode==='today')rows=rows.filter(m=>m.dateKey===dayKey(now));
  else if(mode==='tomorrow')rows=rows.filter(m=>m.dateKey===dayKey(tomorrow));
  else rows=rows.filter(m=>!m.result);
  rows.sort((a,b)=>{
    const af=Number.isFinite(a.stamp),bf=Number.isFinite(b.stamp);
    if(af&&bf)return a.stamp-b.stamp;
    if(af)return -1;if(bf)return 1;
    return a.category.localeCompare(b.category,'es');
  });
  return rows.slice(0,6);
}
function standingsRows(cid){
  const blocks=catObj(cid)?.standings||[];
  const rows=blocks.flatMap(b=>Array.isArray(b?.rows)?b.rows:[]);
  const seen=new Set(),out=[];
  for(const r of rows){
    if(!Array.isArray(r)||!r[1])continue;
    const k=norm(r[1]);if(!k||seen.has(k))continue;seen.add(k);
    out.push({pos:String(r[0]||out.length+1),team:String(r[1]||''),pj:String(r[2]??'—'),dg:String(r[8]??'—'),pts:String(r[9]??'—')});
  }
  return out;
}
function rankingCategory(){
  return filter!=='all'&&catObj(filter)?filter:currentCompetitionCat();
}
function activeCompetitionLabel(){
  const active=[...document.querySelectorAll('#screen>.tabs .tab.active,#screen .tabs .tab.active')][0];
  const t=String(active?.textContent||'');
  if(/Cuadro|Liguilla/i.test(t))return 'Liguilla / Cuadro';
  if(/Clasificaci/i.test(t))return 'Clasificación';
  return 'Fase regular';
}
function hasKnockout(cid=currentCompetitionCat()){
  return allMatches().some(m=>m.cid===String(cid)&&/play.?off|octavos|cuartos|semifinal|^final\b|liguilla/i.test(m.phase));
}
function currentJourneyLabel(){
  const b=document.querySelector('[data-v12-fixtures] [data-v12-date].active')||document.querySelector('[data-v12-fixtures] [data-v12-date]');
  return (b?.querySelector('small')?.textContent||b?.querySelector('span')?.textContent||'Jornadas').trim();
}
function matchCard(m){
  return '<button type="button" class="v571-match" data-v571-match="'+esc(m.key)+'">'+
    '<span class="v571-team"><b>'+esc(m.home)+'</b><img src="'+esc(logo(m.home))+'" alt=""></span>'+
    '<span class="v571-score"><strong>'+esc(m.result||m.time)+'</strong><small>'+esc(m.date)+'</small></span>'+
    '<span class="v571-team right"><img src="'+esc(logo(m.away))+'" alt=""><b>'+esc(m.away)+'</b></span>'+
    '<em>'+esc(m.category)+(m.venue?' · '+esc(m.venue):'')+'</em>'+
  '</button>';
}
function rankingBlock(){
  const cid=rankingCategory(),rows=standingsRows(cid).slice(0,10);
  if(!rows.length)return '<section class="v573-ranking"><div class="v573-section-head"><span><small>TABLA RÁPIDA</small><b>'+esc(catName(cid))+'</b></span></div><div class="v571-empty">Todavía no hay clasificación oficial publicada para esta categoría.</div></section>';
  return '<section class="v573-ranking">'+
    '<div class="v573-section-head"><span><small>TABLA RÁPIDA</small><b>'+esc(catName(cid))+'</b></span><button type="button" data-v573-standings>Ver completa</button></div>'+
    '<div class="v573-rank-head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span></div>'+
    '<div class="v573-rank-list">'+rows.map((r,i)=>
      '<button type="button" class="v573-rank-row" data-v573-standings>'+
        '<span class="v573-pos p'+(i+1)+'">'+esc(r.pos)+'</span>'+
        '<span class="v573-club"><img src="'+esc(logo(r.team))+'" alt=""><b>'+esc(r.team)+'</b></span>'+
        '<span>'+esc(r.pj)+'</span><span>'+esc(r.dg)+'</span><strong>'+esc(r.pts)+'</strong>'+
      '</button>'
    ).join('')+'</div>'+
  '</section>';
}
function panel(){
  const s=leagueStats(),rows=filteredRows(),filterLabel=filter==='all'?'Todas las categorías':catName(filter);
  return '<section class="v571-lower" data-v571-lower>'+
    '<header><span><small>RESUMEN DE LA LIGA</small><h3>Competición y agenda</h3><p>Funciones adicionales al final, con datos oficiales de Juventino Rosas.</p></span></header>'+
    '<div class="v571-stats">'+
      '<button type="button" data-v571-route="teams"><small>EQUIPOS</small><b>'+s.teams+'</b></button>'+
      '<button type="button" data-v571-route="players"><small>REGISTROS</small><b>'+s.players+'</b></button>'+
      '<button type="button" data-v573-open="agenda"><small>PARTIDOS</small><b>'+s.matches+'</b></button>'+
      '<button type="button" data-v571-open-cats><small>CATEGORÍAS</small><b>'+s.cats+'</b></button>'+
    '</div>'+
    '<div class="v573-selectors">'+
      '<button type="button" data-v573-open="phase"><span><small>FASE</small><b>'+esc(activeCompetitionLabel())+'</b></span><i>⌄</i></button>'+
      '<button type="button" data-v573-open="journeys"><span><small>JORNADA</small><b>'+esc(currentJourneyLabel())+'</b></span><i>⌄</i></button>'+
      '<button type="button" data-v573-open="menu"><span><small>NAVEGACIÓN</small><b>Menú de Liga</b></span><i>☰</i></button>'+
    '</div>'+
    '<div class="v571-agenda">'+
      '<div class="v571-tabs"><button type="button" data-v571-mode="today" class="'+(mode==='today'?'active':'')+'">Hoy</button><button type="button" data-v571-mode="tomorrow" class="'+(mode==='tomorrow'?'active':'')+'">Mañana</button><button type="button" data-v571-mode="scheduled" class="'+(mode==='scheduled'?'active':'')+'">Programados</button></div>'+
      '<button type="button" class="v571-filter" data-v571-open-cats><span>'+esc(filterLabel)+'</span><i>⌄</i></button>'+
      '<div class="v571-list">'+(rows.length?rows.map(matchCard).join(''):'<div class="v571-empty">No hay partidos oficiales publicados para este filtro.</div>')+'</div>'+
      '<button type="button" class="v571-calendar" data-v571-route="v4-calendar"><span>Calendario completo</span><i>↗</i></button>'+
    '</div>'+
    rankingBlock()+
    '<div class="v571-tools">'+
      '<button type="button" data-v573-standings><span>▦</span><b>Posiciones</b></button>'+
      '<button type="button" data-v571-route="scorers"><span>◎</span><b>Goleadores</b></button>'+
      '<button type="button" data-v571-bracket><span>⌘</span><b>Cuadro / Liguilla</b></button>'+
      '<button type="button" data-v571-route="news"><span>◫</span><b>Noticias</b></button>'+
    '</div>'+
  '</section>';
}
function closeSheet(){
  document.querySelector('[data-v571-sheet]')?.remove();
  document.body.classList.remove('v571-sheet-open');
}
function sheet(kicker,title,body,extraClass=''){
  closeSheet();
  const layer=document.createElement('div');layer.className='v571-sheet-layer';layer.dataset.v571Sheet='';
  layer.innerHTML='<button type="button" class="v571-sheet-backdrop" data-v571-close aria-label="Cerrar"></button>'+
    '<section class="v571-sheet '+esc(extraClass)+'" role="dialog" aria-modal="true" aria-label="'+esc(title)+'">'+
      '<header><div><small>'+esc(kicker)+'</small><h3>'+esc(title)+'</h3></div><button type="button" data-v571-close aria-label="Cerrar">×</button></header>'+
      '<div class="v571-sheet-list">'+body+'</div>'+
    '</section>';
  document.body.appendChild(layer);document.body.classList.add('v571-sheet-open');
}
function openCategories(){
  const cats=CAT_ORDER.filter(id=>catObj(id));
  sheet('COMPETICIÓN','Selecciona categoría',
    '<button type="button" class="v571-cat '+(filter==='all'?'active':'')+'" data-v571-cat="all"><span class="v571-all">∞</span><span><b>Todas las categorías</b><small>Ver agenda completa de la Liga</small></span><i></i></button>'+
    cats.map(id=>{
      const c=catObj(id),x=c?.counts||c?.dashboard?.counts||{};
      return '<button type="button" class="v571-cat '+(filter===id?'active':'')+'" data-v571-cat="'+esc(id)+'"><img src="'+esc(categoryLogo(id))+'" alt=""><span><b>'+esc(catName(id))+'</b><small>'+Number(x.Equipos||0)+' equipos · '+Number(x.Jugadores||c?.public_player_count_scraped||0)+' registros'+(id==='1'?' · 50 y más':'')+'</small></span><i></i></button>';
    }).join('')
  );
}
function openPhase(){
  const ko=hasKnockout();
  sheet('COMPETICIÓN','Selecciona fase',
    '<button type="button" class="v573-sheet-option" data-v573-tab="fixtures"><span><b>Fase regular</b><small>Roles, jornadas y resultados</small></span><i>›</i></button>'+
    '<button type="button" class="v573-sheet-option" data-v573-tab="standings"><span><b>Tabla de posiciones</b><small>Clasificación oficial</small></span><i>›</i></button>'+
    '<button type="button" class="v573-sheet-option '+(ko?'':'disabled')+'" '+(ko?'data-v573-tab="bracket"':'disabled')+'><span><b>Cuadro / Liguilla</b><small>'+(ko?'Cruces oficiales publicados':'Todavía no hay cruces oficiales')+'</small></span><i>›</i></button>'
  );
}
function openJourneys(){
  const native=document.querySelector('[data-v566-open="journeys"]');
  if(native){closeSheet();native.click();return}
  const buttons=[...document.querySelectorAll('[data-v12-fixtures] [data-v12-date]')];
  const seen=new Set(),items=[];
  for(const b of buttons){
    const top=(b.querySelector('span')?.textContent||'').trim();
    const small=(b.querySelector('small')?.textContent||'').trim();
    const key=b.dataset.v12Date||'';
    const uniq=[key,top,small].join('|');
    if(seen.has(uniq))continue;seen.add(uniq);
    items.push('<button type="button" class="v573-sheet-option '+(b.classList.contains('active')?'active':'')+'" data-v573-journey="'+esc(key)+'"><span><b>'+esc(small||top||'Jornada')+'</b><small>'+esc(small&&top?top:'Liga Juventino Rosas')+'</small></span><i>›</i></button>');
  }
  sheet('CALENDARIO','Calendario completo',items.join('')||'<div class="v571-empty">No hay jornadas oficiales publicadas.</div>');
}
function openMenu(){
  sheet('LIGA JUVENTINO ROSAS','Menú de Liga',
    '<nav class="v573-menu-list">'+
      '<button type="button" data-v571-route="home"><span>⌂</span><b>Inicio</b><i>›</i></button>'+
      '<button type="button" data-v571-route="competition"><span>🏆</span><b>Competición</b><i>›</i></button>'+
      '<button type="button" data-v571-route="teams"><span>◈</span><b>Equipos</b><i>›</i></button>'+
      '<button type="button" data-v571-route="v4-calendar"><span>▣</span><b>Calendario</b><i>›</i></button>'+
      '<button type="button" data-v571-route="rulebook"><span>≣</span><b>Reglamento</b><i>›</i></button>'+
      '<button type="button" data-v571-route="profile"><span>○</span><b>Perfil / iniciar sesión</b><i>›</i></button>'+
    '</nav>'+
    '<div class="v573-social"><small>SÍGUENOS</small><button type="button" data-v573-facebook>f <span>Facebook oficial de la Liga</span></button></div>'+
    '<button type="button" class="v573-share" data-v573-share>Compartir aplicación <span>↗</span></button>'
  ,'v573-menu-sheet');
}
function saveMatch(m){
  if(!m)return;
  try{sessionStorage.setItem('lj-match-detail',JSON.stringify({
    id:m.key,from:'#/competition',home:m.home,away:m.away,time:m.time,date:m.date,
    venue:m.venue||'Campo por confirmar',category:m.category,jornada:m.phase||''
  }))}catch(_){}
}
function nativeTab(kind){
  const tabs=[...document.querySelectorAll('#screen>.tabs .tab,#screen .tabs .tab')];
  if(kind==='fixtures')return tabs.find(b=>/Partidos|Resultados/i.test(b.textContent||''))||tabs[0]||null;
  if(kind==='standings')return tabs.find(b=>/Clasificaci/i.test(b.textContent||''))||tabs[1]||null;
  if(kind==='bracket')return tabs.find(b=>/Cuadro|Liguilla/i.test(b.textContent||''))||tabs[2]||null;
  return null;
}
function render(){
  if(route()!=='competition')return;
  const anchor=document.querySelector('[data-v569-comp]')||document.querySelector('.v566-comp-lower')||document.querySelector('[data-v12-fixtures],[data-v40-standings],[data-v12-bracket]');
  if(!anchor)return;
  const old=document.querySelector('[data-v571-lower]');
  const w=document.createElement('div');w.innerHTML=panel();const fresh=w.firstElementChild;
  if(old)old.replaceWith(fresh);else anchor.insertAdjacentElement('afterend',fresh);
}
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(render))}

document.addEventListener('click',e=>{
  const md=e.target.closest('[data-v571-mode]');
  if(md){e.preventDefault();mode=md.dataset.v571Mode||'scheduled';localStorage.setItem('v571-agenda-mode',mode);render();return}
  if(e.target.closest('[data-v571-open-cats]')){e.preventDefault();openCategories();return}
  if(e.target.closest('[data-v571-close]')){e.preventDefault();closeSheet();return}
  const cat=e.target.closest('[data-v571-cat]');
  if(cat){e.preventDefault();filter=cat.dataset.v571Cat||'all';localStorage.setItem('v571-agenda-cat',filter);closeSheet();render();return}
  const match=e.target.closest('[data-v571-match]');
  if(match){e.preventDefault();const m=allMatches().find(x=>x.key===match.dataset.v571Match);if(m){saveMatch(m);location.hash='#/match'}return}
  const open=e.target.closest('[data-v573-open]');
  if(open){
    e.preventDefault();
    const a=open.dataset.v573Open;
    if(a==='phase')openPhase();
    else if(a==='journeys')openJourneys();
    else if(a==='menu')openMenu();
    else if(a==='agenda')document.querySelector('.v571-agenda')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  const tab=e.target.closest('[data-v573-tab]');
  if(tab){e.preventDefault();closeSheet();nativeTab(tab.dataset.v573Tab)?.click();schedule();return}
  const journey=e.target.closest('[data-v573-journey]');
  if(journey){
    e.preventDefault();
    const key=journey.dataset.v573Journey||'';
    const b=[...document.querySelectorAll('[data-v12-fixtures] [data-v12-date]')].find(x=>(x.dataset.v12Date||'')===key);
    closeSheet();b?.click();schedule();return;
  }
  if(e.target.closest('[data-v573-standings]')){e.preventDefault();closeSheet();nativeTab('standings')?.click();schedule();return}
  const r=e.target.closest('[data-v571-route]');
  if(r){e.preventDefault();closeSheet();location.hash='#/'+r.dataset.v571Route;return}
  if(e.target.closest('[data-v571-bracket]')){
    e.preventDefault();
    const b=nativeTab('bracket');
    if(b){b.click();b.scrollIntoView({behavior:'smooth',block:'center'})}
    else location.hash='#/bracketBuilder';
    return;
  }
  if(e.target.closest('[data-v573-facebook]')){e.preventDefault();window.open(FB,'_blank','noopener,noreferrer');return}
  if(e.target.closest('[data-v573-share]')){
    e.preventDefault();
    const data={title:'Liga Juventino Rosas',text:'Liga Municipal de Fútbol Juventino Rosas',url:location.origin+location.pathname};
    if(navigator.share)navigator.share(data).catch(()=>{});
    else navigator.clipboard?.writeText(data.url).catch(()=>{});
  }
},true);

window.addEventListener('hashchange',()=>{closeSheet();schedule()});
window.addEventListener('ljr:official-data',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();

/* V606 loader — mantiene el hub de Control/Registro como módulo aditivo. */
(function(){
  if(window.__LJR_V606_CONTROL_REGISTRO_LOADER__)return;
  window.__LJR_V606_CONTROL_REGISTRO_LOADER__=true;
  if(!document.querySelector('link[data-v606-control-registro]')){
    const l=document.createElement('link');l.rel='stylesheet';l.href='./src/v606-control-registro-tools.css?v=20261003-v623-admin-tools';l.dataset.v606ControlRegistro='1';document.head.appendChild(l);
  }
  if(!document.querySelector('script[data-v606-control-registro]')){
    const s=document.createElement('script');s.src='./src/v606-control-registro-tools.js?v=20261003-v623-admin-tools';s.dataset.v606ControlRegistro='1';document.body.appendChild(s);
  }
})();