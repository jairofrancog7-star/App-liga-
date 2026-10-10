/* V566 — Complementos de Competición SOLO en la parte inferior.
   No reemplaza cabeceras, pestañas, tarjetas, tablas, calendario ni Cuadro existentes.
   Usa únicamente datos y controles de Liga Juventino Rosas. */
(function(){
'use strict';
if(window.__LJR_V566_COMP_BOTTOM__)return;
window.__LJR_V566_COMP_BOTTOM__=true;

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
function tabs(){return document.querySelector('#screen>.tabs')}
function tabButton(kind){
  const all=[...(tabs()?.querySelectorAll('.tab')||[])];
  if(kind==='fixtures')return all.find(b=>/Partidos|Resultados/i.test(b.textContent||''))||all[0]||null;
  if(kind==='standings')return all.find(b=>/Clasificaci/i.test(b.textContent||''))||all[1]||null;
  if(kind==='bracket')return all.find(b=>/Cuadro|Liguilla/i.test(b.textContent||''))||all[2]||null;
  return null;
}
function activeKind(){
  const t=tabs()?.querySelector('.tab.active')?.textContent||'';
  if(/Clasificaci/i.test(t))return 'standings';
  if(/Cuadro|Liguilla/i.test(t))return 'bracket';
  return 'fixtures';
}
function journeyButtons(){return [...document.querySelectorAll('[data-v12-fixtures] [data-v12-date]')]}
function currentJourney(){
  const b=journeyButtons().find(x=>x.classList.contains('active'))||journeyButtons()[0];
  const small=(b?.querySelector('small')?.textContent||'').trim();
  const top=(b?.querySelector('span')?.textContent||'').trim();
  return {title:small||top||'Jornada actual',sub:small&&top?top:'',key:b?.dataset.v12Date||''};
}
function availableCategories(){
  const d=db();
  return CAT_ORDER.filter(id=>d?.categories?.[id]||CAT_META[id]).map(id=>({id,name:catName(id),logo:catLogo(id)}));
}
function hasOfficialKnockout(){
  const c=db()?.categories?.[catId()];
  const rows=(c?.fixtures||[]).flatMap(b=>Array.isArray(b?.rows)?b.rows:[]);
  return rows.some(r=>/play.?off|octavos|cuartos|semifinal|^final\b|liguilla/i.test(String(r?.[1]||'')));
}
function icon(name){
  const map={
    calendar:'<path d="M5 4v3M19 4v3M4 9h16M5 6h14a2 2 0 0 1 2 2v11H3V8a2 2 0 0 1 2-2Zm2 6h3v3H7zm7 0h3v3h-3z"/>',
    table:'<path d="M4 5h16v14H4zM4 10h16M9 5v14"/>',
    trophy:'<path d="M8 4h8v3a4 4 0 0 1-8 0V4Zm0 1H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4M12 11v4m-3 4h6m-5-4h4v4h-4z"/>',
    category:'<path d="M4 5h7v6H4zM13 5h7v6h-7zM4 13h7v6H4zM13 13h7v6h-7z"/>'
  };
  return window.LJR_ICONS?.decorate('<svg viewBox="0 0 24 24" aria-hidden="true">'+(map[name]||map.calendar)+'</svg>',name) || '<svg viewBox="0 0 24 24" aria-hidden="true">'+(map[name]||map.calendar)+'</svg>';
}
function lowerTitle(kicker,title,sub){
  return '<header class="v566-head"><span><small>'+esc(kicker)+'</small><b>'+esc(title)+'</b><em>'+esc(sub)+'</em></span><img src="'+esc(catLogo())+'" alt=""></header>';
}
function categoryStrip(){
  const current=catId();
  return '<div class="v567-cat-strip" aria-label="Categorías de Liga Juventino Rosas">'+
    availableCategories().map(c=>
      '<button type="button" class="'+(c.id===current?'active':'')+'" data-v566-category-direct="'+esc(c.id)+'">'+
        '<img src="'+esc(c.logo)+'" alt=""><span><b>'+esc(c.name)+'</b><small>'+(c.id==='1'?'50 y más':'Categoría oficial')+'</small></span>'+
      '</button>'
    ).join('')+
  '</div>';
}
function fixturesPanel(){
  const j=currentJourney();
  const knockout=hasOfficialKnockout();
  return '<section class="v566-comp-lower" data-v566-bottom="fixtures">'+
    lowerTitle('COMPETICIÓN','Más opciones','Accesos extra al final; el diseño principal de arriba se conserva igual.')+
    '<div class="v566-grid">'+
      '<button type="button" data-v566-open="journeys">'+icon('calendar')+'<span><b>Calendario completo</b><small>'+esc(j.title)+(j.sub?' · '+esc(j.sub):'')+'</small></span><i>›</i></button>'+
      '<button type="button" data-v566-open="categories">'+icon('category')+'<span><b>Cambiar categoría</b><small>'+esc(catName())+'</small></span><i>›</i></button>'+
      '<button type="button" data-v566-tab="standings">'+icon('table')+'<span><b>Tabla de posiciones</b><small>Clasificación oficial</small></span><i>›</i></button>'+
      '<button type="button" data-v566-tab="bracket" '+(knockout?'':'disabled')+'>'+icon('trophy')+'<span><b>Cuadro / Liguilla</b><small>'+(knockout?'Cruces oficiales publicados':'Sin cruces oficiales publicados')+'</small></span><i>›</i></button>'+
    '</div>'+
    '<div class="v567-cat-head"><span>CATEGORÍAS</span><b>Acceso rápido</b></div>'+
    categoryStrip()+
  '</section>';
}
function standingsPanel(){
  return '<section class="v566-comp-lower" data-v566-bottom="standings">'+
    lowerTitle('CLASIFICACIÓN','Continuar en la competición','La tabla de arriba no se modifica.')+
    '<div class="v566-grid two">'+
      '<button type="button" data-v566-tab="fixtures">'+icon('calendar')+'<span><b>Roles y jornadas</b><small>Partidos y resultados</small></span><i>›</i></button>'+
      '<button type="button" data-v566-tab="bracket" '+(hasOfficialKnockout()?'':'disabled')+'>'+icon('trophy')+'<span><b>Cuadro / Liguilla</b><small>'+(hasOfficialKnockout()?'Etapas eliminatorias':'Aún no publicado')+'</small></span><i>›</i></button>'+
    '</div>'+
  '</section>';
}
function bracketPanel(){
  return '<section class="v566-comp-lower" data-v566-bottom="bracket">'+
    lowerTitle('CUADRO','Más de la competición','El cuadro de arriba conserva su diseño y controles actuales.')+
    '<div class="v566-grid two">'+
      '<button type="button" data-v566-tab="fixtures">'+icon('calendar')+'<span><b>Roles y jornadas</b><small>Volver al calendario oficial</small></span><i>›</i></button>'+
      '<button type="button" data-v566-tab="standings">'+icon('table')+'<span><b>Clasificación</b><small>Tabla oficial</small></span><i>›</i></button>'+
    '</div>'+
  '</section>';
}
function removeOldTop(){
  document.querySelectorAll('[data-v523-shell],[data-v523-standings],.v523-tournament-hero,.v523-standings-switch,.v523-match-card').forEach(x=>x.remove());
  document.querySelectorAll('.v12-schedule-match.v523-enhanced,.v12-schedule-match[data-v523-enhanced]').forEach(row=>{
    row.classList.remove('v523-enhanced');
    row.removeAttribute('data-v523-enhanced');
    row.querySelectorAll(':scope > .v523-match-card').forEach(x=>x.remove());
  });
}
function placeBottom(root,kind,html){
  if(!root)return;
  document.querySelectorAll('.v566-comp-lower').forEach(x=>{
    if(x.dataset.v566Bottom!==kind)x.remove();
  });
  let panel=document.querySelector('.v566-comp-lower[data-v566-bottom="'+kind+'"]');
  if(!panel){
    const wrap=document.createElement('div');
    wrap.innerHTML=html.trim();
    panel=wrap.firstElementChild;
  }
  if(!panel)return;
  if(root.nextElementSibling!==panel)root.insertAdjacentElement('afterend',panel);
}
function mount(){
  if(route()!=='competition')return;
  removeOldTop();
  const kind=activeKind();
  if(kind==='fixtures'){
    placeBottom(document.querySelector('[data-v12-fixtures]'),'fixtures',fixturesPanel());
  }else if(kind==='standings'){
    placeBottom(document.querySelector('[data-v40-standings],[data-v12-standings]'),'standings',standingsPanel());
  }else{
    placeBottom(document.querySelector('[data-v12-bracket]'),'bracket',bracketPanel());
  }
}
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(mount))}
function closeSheet(){
  document.querySelector('[data-v566-sheet]')?.remove();
  document.body.classList.remove('v566-sheet-open');
}
function sheet(title,items){
  closeSheet();
  const layer=document.createElement('div');
  layer.className='v566-sheet-layer';
  layer.dataset.v566Sheet='';
  layer.innerHTML='<button class="v566-sheet-backdrop" type="button" data-v566-close aria-label="Cerrar"></button>'+
    '<section class="v566-sheet" role="dialog" aria-modal="true" aria-label="'+esc(title)+'">'+
      '<header><h3>'+esc(title)+'</h3><button type="button" data-v566-close aria-label="Cerrar">×</button></header>'+
      '<div class="v566-sheet-list">'+items.join('')+'</div>'+
    '</section>';
  document.body.appendChild(layer);
  document.body.classList.add('v566-sheet-open');
}
function openJourneys(){
  const buttons=journeyButtons();
  if(!buttons.length){
    sheet('Calendario completo',['<div class="v566-empty">No hay jornadas oficiales publicadas para esta categoría.</div>']);
    return;
  }
  const seen=new Set(),items=[];
  buttons.forEach((b,i)=>{
    const top=(b.querySelector('span')?.textContent||'').trim();
    const small=(b.querySelector('small')?.textContent||('Jornada '+(i+1))).trim();
    const key=b.dataset.v12Date||'';
    const uniq=[key,top,small].join('|');
    if(seen.has(uniq))return;
    seen.add(uniq);
    items.push('<button type="button" class="v566-option '+(b.classList.contains('active')?'active':'')+'" data-v566-journey="'+esc(key)+'">'+
      '<span><b>'+esc(small)+'</b><small>'+esc(top)+'</small></span><i></i></button>');
  });
  sheet('Calendario completo',items);
}
function openCategories(){
  const current=catId();
  const cats=availableCategories();
  /* La categoría 1 debe aparecer siempre al final como 50 y más. */
  if(!cats.some(c=>c.id==='1')){
    cats.push({id:'1',name:'Veteranos 50+',logo:catLogo('1')});
  }
  sheet('Selecciona categoría',cats.map(c=>
    '<button type="button" class="v566-option cat '+(c.id===current?'active':'')+'" data-v566-category="'+esc(c.id)+'">'+
      '<img src="'+esc(c.logo)+'" alt=""><span><b>'+esc(c.name)+'</b><small>'+(c.id==='1'?'50 y más · Liga Juventino Rosas':'Liga Juventino Rosas')+'</small></span><i></i></button>'
  ));
}

document.addEventListener('click',e=>{
  const tab=e.target.closest('[data-v566-tab]');
  if(tab){
    e.preventDefault();
    if(tab.disabled)return;
    tabButton(tab.dataset.v566Tab)?.click();
    schedule();
    return;
  }
  const open=e.target.closest('[data-v566-open]');
  if(open){
    e.preventDefault();
    if(open.dataset.v566Open==='journeys')openJourneys();
    if(open.dataset.v566Open==='categories')openCategories();
    return;
  }
  if(e.target.closest('[data-v566-close]')){e.preventDefault();closeSheet();return}
  const journey=e.target.closest('[data-v566-journey]');
  if(journey){
    e.preventDefault();
    const key=journey.dataset.v566Journey||'';
    const btn=journeyButtons().find(b=>(b.dataset.v12Date||'')===key);
    closeSheet();
    btn?.click();
    schedule();
    return;
  }
  const direct=e.target.closest('[data-v566-category-direct]');
  if(direct){
    e.preventDefault();
    const id=direct.dataset.v566CategoryDirect;
    localStorage.setItem('v62-category',id);
    localStorage.setItem('v12-fixture-cat',id);
    const native=document.querySelector('[data-v12-fixtures] [data-v12-cat="'+CSS.escape(id)+'"]');
    if(native)native.click();
    else window.dispatchEvent(new Event('hashchange'));
    schedule();
    return;
  }
  const cat=e.target.closest('[data-v566-category]');
  if(cat){
    e.preventDefault();
    const id=cat.dataset.v566Category;
    localStorage.setItem('v62-category',id);
    localStorage.setItem('v12-fixture-cat',id);
    closeSheet();
    const native=document.querySelector('[data-v12-fixtures] [data-v12-cat="'+CSS.escape(id)+'"]');
    native?.click();
    schedule();
  }
},true);

window.addEventListener('hashchange',()=>{closeSheet();schedule()});
window.addEventListener('ljr:official-data',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();