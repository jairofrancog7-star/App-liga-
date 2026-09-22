/* V132 — Selector rápido de equipo para Registro/Credencial.
   Sustituye el selector nativo largo por un panel filtrable por categoría,
   letra inicial y búsqueda de nombre. Mantiene el <select> original como
   fuente de valor para no romper OCR, categoría automática ni guardado. */
(function(){
'use strict';
if(window.__LJR_V132_CREDENTIAL_TEAM_PICKER__)return;
window.__LJR_V132_CREDENTIAL_TEAM_PICKER__=true;

const DATA_URL='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9Ñ]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
let official=null,loading=null,activeCategory='all',activeLetter='all',query='';

async function loadOfficial(){
  if(window.LJR_OFFICIAL_DATA){official=window.LJR_OFFICIAL_DATA;return official}
  if(official)return official;
  if(loading)return loading;
  loading=(async()=>{
    try{
      const r=await fetch(DATA_URL+'?v='+Date.now(),{cache:'no-store'});
      if(r.ok){official=await r.json();window.LJR_OFFICIAL_DATA=official}
    }catch(_){}
    return official;
  })();
  return loading;
}

function categoryFor(name){
  const target=norm(name);if(!target)return '';
  const db=window.LJR_OFFICIAL_DATA||official||{};
  for(const [id,c] of Object.entries(db.categories||{})){
    const names=new Set(Object.keys(c.rosters||{}).map(norm));
    (c.standings||[]).forEach(b=>(b.rows||[]).forEach(r=>r?.[1]&&names.add(norm(r[1]))));
    (c.fixtures||[]).forEach(b=>(b.rows||[]).forEach(r=>{if(r?.[2])names.add(norm(r[2]));if(r?.[6])names.add(norm(r[6]))}));
    if(names.has(target))return c.name||id;
  }
  return '';
}

function logoFor(name){
  try{return window.LJR_TEAM_LOGOS?.get?.(name)||''}catch(_){return ''}
}

function nativeSelect(){
  return $('[data-v64-cred-team]');
}

function teams(){
  const sel=nativeSelect();if(!sel)return [];
  return [...sel.options].filter(o=>o.value).map(o=>{
    const category=o.dataset.category||categoryFor(o.value)||'Por confirmar';
    if(!o.dataset.category&&category!=='Por confirmar')o.dataset.category=category;
    return {name:o.value,category,logo:logoFor(o.value),letter:(norm(o.value)[0]||'#')};
  }).sort((a,b)=>a.category.localeCompare(b.category,'es',{sensitivity:'base'})||a.name.localeCompare(b.name,'es',{sensitivity:'base'}));
}

function categories(list){
  const preferred=['Primera Fuerza','Intermedia','Segunda Fuerza','Veteranos 35+','Veteranos 50+'];
  const found=[...new Set(list.map(x=>x.category).filter(Boolean))];
  return [...preferred.filter(x=>found.includes(x)),...found.filter(x=>!preferred.includes(x)).sort((a,b)=>a.localeCompare(b,'es'))];
}

function letters(list){
  return [...new Set(list.map(x=>x.letter).filter(x=>/^[A-ZÑ]$/.test(x)))].sort((a,b)=>a.localeCompare(b,'es'));
}

function triggerSelect(name,category){
  const sel=nativeSelect();if(!sel)return;
  let opt=[...sel.options].find(o=>norm(o.value)===norm(name));
  if(!opt){
    opt=document.createElement('option');opt.value=name;opt.textContent=name;sel.appendChild(opt);
  }
  if(category&&category!=='Por confirmar')opt.dataset.category=category;
  sel.value=opt.value;
  sel.dispatchEvent(new Event('input',{bubbles:true}));
  sel.dispatchEvent(new Event('change',{bubbles:true}));
  updateButton();
}

function updateButton(){
  const sel=nativeSelect(),btn=$('[data-v132-open]');if(!sel||!btn)return;
  const team=sel.value||'Seleccionar equipo';
  const cat=sel.selectedOptions?.[0]?.dataset?.category||categoryFor(sel.value)||'';
  const name=btn.querySelector('b'),small=btn.querySelector('small');
  if(name)name.textContent=team;
  if(small)small.textContent=sel.value?(cat||'Categoría por confirmar'):'Busca por categoría, letra o nombre';
}

function filtered(list){
  const q=norm(query);
  return list.filter(x=>
    (activeCategory==='all'||x.category===activeCategory)&&
    (activeLetter==='all'||x.letter===activeLetter)&&
    (!q||norm(x.name).includes(q))
  );
}

function renderSheet(){
  const sheet=$('[data-v132-sheet]');if(!sheet)return;
  const list=teams(),cats=categories(list),lets=letters(activeCategory==='all'?list:list.filter(x=>x.category===activeCategory)),show=filtered(list);
  const catRail=$('[data-v132-cats]',sheet);
  catRail.innerHTML=
    '<button type="button" class="'+(activeCategory==='all'?'active':'')+'" data-v132-cat="all">Todas</button>'+
    cats.map(c=>'<button type="button" class="'+(activeCategory===c?'active':'')+'" data-v132-cat="'+esc(c)+'">'+esc(c)+'</button>').join('');
  const letterRail=$('[data-v132-letters]',sheet);
  letterRail.innerHTML=
    '<button type="button" class="'+(activeLetter==='all'?'active':'')+'" data-v132-letter="all">TODAS</button>'+
    lets.map(l=>'<button type="button" class="'+(activeLetter===l?'active':'')+'" data-v132-letter="'+esc(l)+'">'+esc(l)+'</button>').join('');
  const results=$('[data-v132-results]',sheet);
  results.innerHTML=show.length?show.map(t=>
    '<button type="button" class="v132-team-row" data-v132-team="'+esc(t.name)+'" data-v132-category="'+esc(t.category)+'">'+
      '<span class="v132-logo">'+(t.logo?'<img src="'+esc(t.logo)+'" alt="" loading="lazy" decoding="async">':'<i>'+esc(t.name.slice(0,2).toUpperCase())+'</i>')+'</span>'+
      '<span><b>'+esc(t.name)+'</b><small>'+esc(t.category)+'</small></span><em>✓</em>'+
    '</button>'
  ).join(''):'<div class="v132-empty"><b>No encontré equipos</b><span>Cambia la categoría, letra o texto de búsqueda.</span></div>';

  $$('[data-v132-cat]',sheet).forEach(b=>b.onclick=()=>{
    activeCategory=b.dataset.v132Cat||'all';activeLetter='all';renderSheet();
  });
  $$('[data-v132-letter]',sheet).forEach(b=>b.onclick=()=>{
    activeLetter=b.dataset.v132Letter||'all';renderSheet();
  });
  $$('[data-v132-team]',sheet).forEach(b=>b.onclick=()=>{
    triggerSelect(b.dataset.v132Team||'',b.dataset.v132Category||'');
    closeSheet();
  });
}

function openSheet(){
  let layer=$('[data-v132-layer]');
  if(!layer){
    layer=document.createElement('div');layer.className='v132-layer';layer.setAttribute('data-v132-layer','');
    layer.innerHTML=
      '<button type="button" class="v132-backdrop" data-v132-close aria-label="Cerrar"></button>'+
      '<section class="v132-sheet" data-v132-sheet role="dialog" aria-modal="true" aria-label="Seleccionar equipo">'+
        '<header><div><small>REGISTRO DE JUGADOR</small><h2>Seleccionar equipo</h2></div><button type="button" data-v132-close>×</button></header>'+
        '<label class="v132-search"><span>⌕</span><input type="search" data-v132-search placeholder="Buscar equipo o escribe una letra" autocomplete="off"></label>'+
        '<div class="v132-filter-title">CATEGORÍA</div><div class="v132-rail" data-v132-cats></div>'+
        '<div class="v132-filter-title">LETRA INICIAL</div><div class="v132-rail letters" data-v132-letters></div>'+
        '<div class="v132-count" data-v132-count></div>'+
        '<div class="v132-results" data-v132-results></div>'+
      '</section>';
    document.body.appendChild(layer);
    $$('[data-v132-close]',layer).forEach(b=>b.onclick=closeSheet);
    const input=$('[data-v132-search]',layer);
    input.oninput=()=>{query=input.value||'';renderSheet()};
  }
  query='';activeCategory='all';activeLetter='all';
  const input=$('[data-v132-search]',layer);if(input)input.value='';
  layer.classList.add('open');document.body.classList.add('v132-picker-open');
  renderSheet();
  setTimeout(()=>input?.focus({preventScroll:true}),80);
}
function closeSheet(){
  $('[data-v132-layer]')?.classList.remove('open');document.body.classList.remove('v132-picker-open');
}

async function enhance(){
  if(route()!=='credentialBuilder')return;
  await loadOfficial();
  const sel=nativeSelect();if(!sel||sel.dataset.v132Enhanced)return;
  sel.dataset.v132Enhanced='1';sel.classList.add('v132-native-select');sel.tabIndex=-1;sel.setAttribute('aria-hidden','true');

  const label=sel.closest('label');if(!label)return;
  const button=document.createElement('button');
  button.type='button';button.className='v132-team-picker';button.setAttribute('data-v132-open','');
  button.innerHTML='<span class="v132-picker-icon">⌕</span><span><b>Seleccionar equipo</b><small>Busca por categoría, letra o nombre</small></span><i>›</i>';
  label.insertBefore(button,sel);
  button.onclick=e=>{e.preventDefault();e.stopPropagation();openSheet()};
  sel.addEventListener('change',updateButton);
  updateButton();
}

let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(enhance,80)}
window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,700);
})();