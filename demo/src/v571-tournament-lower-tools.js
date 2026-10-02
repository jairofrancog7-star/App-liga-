/* V571 — herramientas inferiores inspiradas en navegación de torneos.
   SOLO agrega funciones al final de Competición. No reemplaza el diseño azul ni importa equipos/datos externos. */
(function(){
'use strict';
if(window.__LJR_V571_TOURNAMENT_LOWER__)return;
window.__LJR_V571_TOURNAMENT_LOWER__=true;

const CAT_ORDER=['3','5','4','2','1'];
const CAT_NAMES={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
let raf=0;
let mode=localStorage.getItem('v571-agenda-mode')||'scheduled';
let filter=localStorage.getItem('v571-agenda-cat')||'all';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9+]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const db=()=>{try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}};
const catObj=id=>db()?.categories?.[String(id)]||null;
const catName=id=>catObj(id)?.name||CAT_NAMES[String(id)]||('Categoría '+id);
const logo=name=>{
  try{
    const x=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name);
    if(x)return x;
  }catch(_){}
  const v=Object.entries(db()?.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
  const p=typeof v==='string'?v:(v?.local||v?.source||'');
  if(p)return /^https?:/i.test(p)?p:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(p).replace(/^\.\//,'');
  return './assets/liga-logo.webp';
};
const categoryLogo=id=>{
  const el=document.querySelector('[data-v12-cat="'+CSS.escape(String(id))+'"] img,[data-v62-cat="'+CSS.escape(String(id))+'"] img');
  if(el?.src)return el.src;
  const first=Object.keys(catObj(id)?.rosters||{})[0];
  return first?logo(first):'./assets/liga-logo.webp';
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
  const x=d instanceof Date?d:new Date(d);
  const p=n=>String(n).padStart(2,'0');
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
  const now=new Date();
  const tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
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
function matchCard(m){
  return '<button type="button" class="v571-match" data-v571-match="'+esc(m.key)+'">'+
    '<span class="v571-team"><b>'+esc(m.home)+'</b><img src="'+esc(logo(m.home))+'" alt=""></span>'+
    '<span class="v571-score"><strong>'+esc(m.result||m.time)+'</strong><small>'+esc(m.date)+'</small></span>'+
    '<span class="v571-team right"><img src="'+esc(logo(m.away))+'" alt=""><b>'+esc(m.away)+'</b></span>'+
    '<em>'+esc(m.category)+(m.venue?' · '+esc(m.venue):'')+'</em>'+
  '</button>';
}
function panel(){
  const s=leagueStats(),rows=filteredRows();
  const filterLabel=filter==='all'?'Todas las categorías':catName(filter);
  return '<section class="v571-lower" data-v571-lower>'+
    '<header><span><small>RESUMEN DE LA LIGA</small><h3>Competición y agenda</h3><p>Funciones adicionales al final, con datos oficiales de Juventino Rosas.</p></span><img src="./assets/liga-logo.webp" alt=""></header>'+
    '<div class="v571-stats">'+
      '<button type="button" data-v571-route="teams"><small>EQUIPOS</small><b>'+s.teams+'</b></button>'+
      '<button type="button" data-v571-route="players"><small>REGISTROS</small><b>'+s.players+'</b></button>'+
      '<button type="button" data-v571-route="competition"><small>PARTIDOS</small><b>'+s.matches+'</b></button>'+
      '<button type="button" data-v571-open-cats><small>CATEGORÍAS</small><b>'+s.cats+'</b></button>'+
    '</div>'+
    '<div class="v571-agenda">'+
      '<div class="v571-tabs"><button type="button" data-v571-mode="today" class="'+(mode==='today'?'active':'')+'">Hoy</button><button type="button" data-v571-mode="tomorrow" class="'+(mode==='tomorrow'?'active':'')+'">Mañana</button><button type="button" data-v571-mode="scheduled" class="'+(mode==='scheduled'?'active':'')+'">Programados</button></div>'+
      '<button type="button" class="v571-filter" data-v571-open-cats><span>'+esc(filterLabel)+'</span><i>⌄</i></button>'+
      '<div class="v571-list">'+(rows.length?rows.map(matchCard).join(''):'<div class="v571-empty">No hay partidos oficiales publicados para este filtro.</div>')+'</div>'+
      '<button type="button" class="v571-calendar" data-v571-route="v4-calendar"><span>Calendario completo</span><i>↗</i></button>'+
    '</div>'+
    '<div class="v571-tools">'+
      '<button type="button" data-v571-route="leagueData"><span>▦</span><b>Posiciones</b></button>'+
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
function openCategories(){
  closeSheet();
  const layer=document.createElement('div');layer.className='v571-sheet-layer';layer.dataset.v571Sheet='';
  const cats=CAT_ORDER.filter(id=>catObj(id));
  layer.innerHTML='<button type="button" class="v571-sheet-backdrop" data-v571-close aria-label="Cerrar"></button>'+
    '<section class="v571-sheet" role="dialog" aria-modal="true" aria-label="Seleccionar categoría">'+
      '<header><div><small>COMPETICIÓN</small><h3>Selecciona categoría</h3></div><button type="button" data-v571-close>×</button></header>'+
      '<div class="v571-sheet-list">'+
        '<button type="button" class="v571-cat '+(filter==='all'?'active':'')+'" data-v571-cat="all"><span class="v571-all">∞</span><span><b>Todas las categorías</b><small>Ver agenda completa de la Liga</small></span><i></i></button>'+
        cats.map(id=>{
          const c=catObj(id),x=c?.counts||c?.dashboard?.counts||{};
          return '<button type="button" class="v571-cat '+(filter===id?'active':'')+'" data-v571-cat="'+esc(id)+'"><img src="'+esc(categoryLogo(id))+'" alt=""><span><b>'+esc(catName(id))+'</b><small>'+Number(x.Equipos||0)+' equipos · '+Number(x.Jugadores||c?.public_player_count_scraped||0)+' registros</small></span><i></i></button>';
        }).join('')+
      '</div>'+
    '</section>';
  document.body.appendChild(layer);document.body.classList.add('v571-sheet-open');
}
function saveMatch(m){
  if(!m)return;
  try{sessionStorage.setItem('lj-match-detail',JSON.stringify({
    id:m.key,from:'#/competition',home:m.home,away:m.away,time:m.time,date:m.date,
    venue:m.venue||'Campo por confirmar',category:m.category,jornada:m.phase||''
  }))}catch(_){}
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
  const r=e.target.closest('[data-v571-route]');
  if(r){e.preventDefault();location.hash='#/'+r.dataset.v571Route;return}
  if(e.target.closest('[data-v571-bracket]')){
    e.preventDefault();
    const tabs=[...document.querySelectorAll('#screen .tab,[data-v40-tab],[data-v12-tab]')];
    const b=tabs.find(x=>/Cuadro|Liguilla/i.test(x.textContent||''));
    if(b){b.click();b.scrollIntoView({behavior:'smooth',block:'center'})}
    else location.hash='#/bracketBuilder';
  }
},true);

window.addEventListener('hashchange',()=>{closeSheet();schedule()});
window.addEventListener('ljr:official-data',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();