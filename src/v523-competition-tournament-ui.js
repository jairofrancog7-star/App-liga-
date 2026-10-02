/* V523 — Competición inspirada en patrones de navegación de torneos.
   IMPORTANTE: solo usa datos oficiales/actuales de Liga Juventino Rosas.
   No copia equipos, resultados, jornadas ni contenido de sitios externos. */
(function(){
'use strict';

const CAT_ORDER=['3','5','4','2','1'];
const CAT_META={
  '3':{name:'Primera Fuerza',logo:'assets/branding/primera-fuerza-hd.png'},
  '5':{name:'Intermedia',logo:'assets/categories/intermedia.webp'},
  '4':{name:'Segunda Fuerza',logo:'assets/categories/segunda-fuerza.webp'},
  '2':{name:'Veteranos 35+',logo:'assets/categories/veteranos-35-user.png'},
  '1':{name:'Veteranos 50+',logo:'assets/categories/veteranos-50.webp'}
};
let raf=0;

function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function db(){try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}}
function catId(){
  const d=db(),saved=String(localStorage.getItem('v12-fixture-cat')||localStorage.getItem('v62-category')||'3');
  if(d?.categories?.[saved]||CAT_META[saved])return saved;
  return CAT_ORDER.find(id=>d?.categories?.[id])||'3';
}
function catName(id=catId()){return db()?.categories?.[String(id)]?.name||CAT_META[String(id)]?.name||('Categoría '+id)}
function catLogo(id=catId()){
  const path=CAT_META[String(id)]?.logo;
  return path?('./'+path):'./assets/liga-logo.webp';
}
function mainTabs(){return document.querySelector('#screen>.tabs')}
function tabButton(kind){
  const tabs=mainTabs(); if(!tabs)return null;
  const all=[...tabs.querySelectorAll('.tab')];
  if(kind==='fixtures')return all.find(b=>/Partidos|Resultados/i.test(b.textContent||''))||all[0]||null;
  if(kind==='standings')return all.find(b=>/Clasificaci/i.test(b.textContent||''))||all[1]||null;
  if(kind==='bracket')return all.find(b=>/Cuadro|Liguilla/i.test(b.textContent||''))||all[2]||null;
  return null;
}
function activeKind(){
  const t=mainTabs()?.querySelector('.tab.active')?.textContent||'';
  if(/Clasificaci/i.test(t))return 'standings';
  if(/Cuadro|Liguilla/i.test(t))return 'bracket';
  return 'fixtures';
}
function journeyButtons(){return [...document.querySelectorAll('[data-v12-fixtures] .v12-date-strip [data-v12-date]')]}
function selectedJourney(){
  const b=journeyButtons().find(x=>x.classList.contains('active'))||journeyButtons()[0];
  if(!b)return {title:'Jornada',key:''};
  const small=(b.querySelector('small')?.textContent||'').trim();
  const top=(b.querySelector('span')?.textContent||'').trim();
  return {title:small||top||'Jornada',sub:small&&top?top:'',key:b.dataset.v12Date||''};
}
function availableCategories(){
  const d=db(),ids=CAT_ORDER.filter(id=>d?.categories?.[id]||CAT_META[id]);
  return ids.map(id=>({id,name:catName(id),logo:catLogo(id)}));
}
function hasOfficialKnockout(){
  const c=db()?.categories?.[catId()];
  const rows=(c?.fixtures||[]).flatMap(b=>Array.isArray(b?.rows)?b.rows:[]);
  return rows.some(r=>/play.?off|octavos|cuartos|semifinal|^final\b|liguilla/i.test(String(r?.[1]||'')));
}
function chevron(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5"/></svg>'}
function tournamentHero(kind){
  const id=catId(),name=catName(id),j=selectedJourney();
  const phase=kind==='bracket'?'Liguilla / Cuadro':'Fase regular';
  return '<div class="v523-tournament-hero">'+
    '<button type="button" class="v523-category-card" data-v523-open="category">'+
      '<img src="'+esc(catLogo(id))+'" alt="'+esc(name)+'">'+
      '<span><small>LIGA MUNICIPAL DE FÚTBOL</small><strong>'+esc(name)+'</strong><em>Temporada 2026/27 · Juventino Rosas</em></span>'+
      chevron()+
    '</button>'+
    '<div class="v523-view-tabs" role="tablist" aria-label="Vista del torneo">'+
      '<button type="button" class="'+(kind==='standings'?'active':'')+'" data-v523-tab="standings">Tabla de posiciones</button>'+
      '<button type="button" class="'+(kind==='fixtures'?'active':'')+'" data-v523-tab="fixtures">Roles y jornadas</button>'+
    '</div>'+
    (kind==='fixtures'
      ? '<div class="v523-select-stack">'+
          '<button type="button" data-v523-open="phase"><span><small>Fase</small><b>'+phase+'</b></span>'+chevron()+'</button>'+
          '<button type="button" data-v523-open="journey"><span><small>Jornada</small><b>'+esc(j.title)+'</b>'+(j.sub?'<em>'+esc(j.sub)+'</em>':'')+'</span>'+chevron()+'</button>'+
        '</div>'
      : kind==='bracket'
        ? '<div class="v523-select-stack"><button type="button" data-v523-open="stage"><span><small>Etapa</small><b data-v523-stage-label>Cuadro eliminatorio</b></span>'+chevron()+'</button></div>'
        : '')+
  '</div>';
}
function standingsSwitch(){
  const id=catId(),name=catName(id);
  return '<div class="v523-standings-switch">'+
    '<div class="v523-mini-cat"><img src="'+esc(catLogo(id))+'" alt=""><span><small>Temporada 2026/27</small><b>'+esc(name)+'</b></span></div>'+
    '<div class="v523-view-tabs"><button type="button" class="active" data-v523-tab="standings">Tabla de posiciones</button><button type="button" data-v523-tab="fixtures">Roles y jornadas</button></div>'+
  '</div>';
}
function enhanceMatch(row){
  if(!row||row.dataset.v523Enhanced==='1')return;
  const teams=[...row.querySelectorAll('.v12-result-team')].slice(0,2);
  if(teams.length<2)return;
  const names=teams.map(t=>(t.querySelector('b')?.textContent||'Equipo').trim());
  const logos=teams.map(t=>t.querySelector('img')?.getAttribute('src')||'');
  const primary=(row.querySelector('.v12-schedule-meta time')?.textContent||'Por confirmar').trim();
  const venue=(row.dataset.v12Venue||row.querySelector('.v76-match-venue')?.textContent||'Campo por confirmar').trim();
  const category=(row.dataset.v12Category||catName()).trim();
  const jornada=(row.dataset.v12Jornada||'').trim();
  const oldBtn=row.querySelector('[data-match]');
  const key=oldBtn?.dataset.match||'';
  const logo=(src,name)=>src?'<img src="'+esc(src)+'" alt="'+esc(name)+'">':'<span>'+esc(name.split(/\s+/).map(x=>x[0]||'').join('').slice(0,3))+'</span>';
  const card=document.createElement('div');
  card.className='v523-match-card';
  card.innerHTML=
    '<div class="v523-match-main">'+
      '<div class="v523-match-team left">'+logo(logos[0],names[0])+'<b>'+esc(names[0])+'</b></div>'+
      '<div class="v523-match-score"><strong>'+esc(primary)+'</strong><small>'+esc(jornada?('Jornada '+jornada):category)+'</small></div>'+
      '<div class="v523-match-team right">'+logo(logos[1],names[1])+'<b>'+esc(names[1])+'</b></div>'+
    '</div>'+
    '<div class="v523-match-foot"><span>'+esc(category)+'</span><span>'+esc(venue)+'</span><button type="button" data-v523-details="'+esc(key)+'">Ver detalles</button></div>';
  row.prepend(card);
  row.dataset.v523Enhanced='1';
}
function enhanceFixtures(){
  const root=document.querySelector('[data-v12-fixtures]');
  if(!root)return;

  /* V565 — el diseño nativo de Competición vuelve a ser el principal.
     Este bloque inspirado en navegación de torneos queda COMO EXTRA AL FINAL,
     sin reemplazar tarjetas, filtros, jornadas ni resultados originales. */
  let shell=root.querySelector('[data-v523-shell]');
  if(!shell){
    shell=document.createElement('div');
    shell.dataset.v523Shell='fixtures';
    shell.className='v523-bottom-extra';
    shell.innerHTML=tournamentHero('fixtures');
    root.append(shell);
  }else if(shell!==root.lastElementChild){
    root.append(shell);
  }

  const j=selectedJourney();
  const b=shell?.querySelector('[data-v523-open="journey"] b');
  const em=shell?.querySelector('[data-v523-open="journey"] em');
  if(b)b.textContent=j.title;
  if(em)em.textContent=j.sub||'';

  /* No se crean tarjetas duplicadas V523: se conserva el diseño original. */
  root.querySelectorAll('.v523-match-card').forEach(x=>x.remove());
  root.querySelectorAll('.v12-schedule-match[data-v523-enhanced]').forEach(x=>{
    x.removeAttribute('data-v523-enhanced');
  });
}
function enhanceBracket(){
  const root=document.querySelector('[data-v12-bracket]');
  if(!root)return;
  let shell=root.querySelector('[data-v523-shell]');
  if(!shell){
    shell=document.createElement('div');
    shell.dataset.v523Shell='bracket';
    shell.className='v523-bottom-extra';
    shell.innerHTML=tournamentHero('bracket');
    root.append(shell);
  }else if(shell!==root.lastElementChild){
    root.append(shell);
  }
  const active=root.querySelector('[data-v12-bracket-stage].active');
  const label=shell?.querySelector('[data-v523-stage-label]');
  if(label&&active)label.textContent=(active.textContent||'Cuadro eliminatorio').trim();
}
function enhanceStandings(){
  const root=document.querySelector('[data-v40-standings],[data-v12-standings]');
  if(!root)return;
  let box=root.querySelector('[data-v523-standings]');
  if(!box){
    box=document.createElement('div');
    box.dataset.v523Standings='';
    box.className='v523-bottom-extra';
    box.innerHTML=standingsSwitch();
    root.append(box);
  }else if(box!==root.lastElementChild){
    root.append(box);
  }
}
function enhance(){
  if(route()!=='competition')return;
  const kind=activeKind();
  if(kind==='fixtures')enhanceFixtures();
  else if(kind==='bracket')enhanceBracket();
  else enhanceStandings();
}
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(enhance))}

function closeSheet(){
  document.querySelector('[data-v523-sheet]')?.remove();
  document.body.classList.remove('v523-sheet-open');
}
function sheet(title,items){
  closeSheet();
  const layer=document.createElement('div');
  layer.className='v523-sheet-layer';
  layer.dataset.v523Sheet='';
  layer.innerHTML='<button class="v523-sheet-backdrop" type="button" data-v523-close aria-label="Cerrar"></button>'+
    '<section class="v523-sheet" role="dialog" aria-modal="true" aria-label="'+esc(title)+'">'+
      '<header><h3>'+esc(title)+'</h3><button type="button" data-v523-close aria-label="Cerrar">×</button></header>'+
      '<div class="v523-sheet-list">'+items.join('')+'</div>'+
    '</section>';
  document.body.appendChild(layer);
  document.body.classList.add('v523-sheet-open');
}
function openCategorySheet(){
  const current=catId();
  sheet('Selecciona categoría',availableCategories().map(c=>
    '<button type="button" class="v523-sheet-option '+(c.id===current?'active':'')+'" data-v523-category="'+esc(c.id)+'">'+
      '<img src="'+esc(c.logo)+'" alt=""><span><b>'+esc(c.name)+'</b><small>Liga Juventino Rosas</small></span><i></i>'+
    '</button>'
  ));
}
function openJourneySheet(){
  const buttons=journeyButtons();
  if(!buttons.length){
    sheet('Jornadas',['<div class="v523-sheet-empty">No hay jornadas oficiales publicadas para esta categoría.</div>']);
    return;
  }
  sheet('Calendario completo',buttons.map((b,i)=>{
    const top=(b.querySelector('span')?.textContent||'').trim();
    const small=(b.querySelector('small')?.textContent||('Jornada '+(i+1))).trim();
    return '<button type="button" class="v523-sheet-option '+(b.classList.contains('active')?'active':'')+'" data-v523-journey="'+esc(b.dataset.v12Date||'')+'">'+
      '<span><b>'+esc(small)+'</b><small>'+esc(top)+'</small></span><i></i>'+
    '</button>';
  }));
}
function openPhaseSheet(){
  const knockout=hasOfficialKnockout();
  sheet('Fase del torneo',[
    '<button type="button" class="v523-sheet-option active" data-v523-phase="regular"><span><b>Fase regular</b><small>Jornadas y resultados oficiales</small></span><i></i></button>',
    '<button type="button" class="v523-sheet-option '+(knockout?'':'disabled')+'" data-v523-phase="bracket" '+(knockout?'':'disabled')+'><span><b>Liguilla / Cuadro</b><small>'+(knockout?'Etapas eliminatorias oficiales':'Aún no hay cruces oficiales publicados')+'</small></span><i></i></button>'
  ]);
}
function openStageSheet(){
  const buttons=[...document.querySelectorAll('[data-v12-bracket] [data-v12-bracket-stage]')];
  sheet('Etapa del cuadro',buttons.map(b=>
    '<button type="button" class="v523-sheet-option '+(b.classList.contains('active')?'active':'')+'" data-v523-stage="'+esc(b.dataset.v12BracketStage||'')+'"><span><b>'+esc((b.textContent||'Etapa').trim())+'</b><small>Cuadro de Liga Juventino Rosas</small></span><i></i></button>'
  ));
}

document.addEventListener('click',e=>{
  if(route()!=='competition'&&!e.target.closest('[data-v523-sheet]'))return;
  const tab=e.target.closest('[data-v523-tab]');
  if(tab){e.preventDefault();tabButton(tab.dataset.v523Tab)?.click();closeSheet();schedule();return}
  const open=e.target.closest('[data-v523-open]');
  if(open){
    e.preventDefault();
    const kind=open.dataset.v523Open;
    if(kind==='category')openCategorySheet();
    if(kind==='journey')openJourneySheet();
    if(kind==='phase')openPhaseSheet();
    if(kind==='stage')openStageSheet();
    return;
  }
  if(e.target.closest('[data-v523-close]')){e.preventDefault();closeSheet();return}
  const cat=e.target.closest('[data-v523-category]');
  if(cat){
    e.preventDefault();
    const id=cat.dataset.v523Category;
    localStorage.setItem('v62-category',id);
    localStorage.setItem('v12-fixture-cat',id);
    closeSheet();
    const native=document.querySelector('[data-v12-fixtures] [data-v12-cat="'+CSS.escape(id)+'"]');
    if(native)native.click(); else {tabButton('fixtures')?.click();window.dispatchEvent(new Event('hashchange'))}
    schedule();return;
  }
  const journey=e.target.closest('[data-v523-journey]');
  if(journey){
    e.preventDefault();
    const key=journey.dataset.v523Journey||'';
    closeSheet();
    const btn=journeyButtons().find(b=>(b.dataset.v12Date||'')===key);
    btn?.click();schedule();return;
  }
  const phase=e.target.closest('[data-v523-phase]');
  if(phase){
    e.preventDefault(); if(phase.disabled)return;
    closeSheet();tabButton(phase.dataset.v523Phase==='bracket'?'bracket':'fixtures')?.click();schedule();return;
  }
  const stage=e.target.closest('[data-v523-stage]');
  if(stage){
    e.preventDefault();closeSheet();
    const btn=[...document.querySelectorAll('[data-v12-bracket-stage]')].find(b=>b.dataset.v12BracketStage===stage.dataset.v523Stage);
    btn?.click();schedule();return;
  }
  const details=e.target.closest('[data-v523-details]');
  if(details){
    e.preventDefault();e.stopPropagation();
    const row=details.closest('.v12-schedule-match');
    row?.querySelector(':scope > .v12-schedule-meta [data-match], :scope > .v12-schedule-clubs ~ .v12-schedule-meta [data-match]')?.click();
    return;
  }
},true);

window.addEventListener('hashchange',()=>{closeSheet();schedule()});
window.addEventListener('ljr:official-data',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();