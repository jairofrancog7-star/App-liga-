/* PARTS28 — Máximo goleador con datos públicos reales de AdminFut.
   No inventa jugadores ni goles. */
(function(){
'use strict';
const CATS=[
  ['3','Primera Fuerza'],
  ['5','Intermedia'],
  ['4','Segunda Fuerza'],
  ['2','Veteranos 35+'],
  ['1','Veteranos 50+']
];
const ROWS=[
  /* V488 CAT3 SCORERS */
  ["LINCES","ERNESTO BALTAZAR SOSA ARREDONDO",2,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Linces_l1lc7c"],
  ["LINCES","JORGE LUIS ALMAGUER RUIZ",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Linces_l1lc7c"],
  ["SAN JOSE FC","Marco Cesar Saavedra Escoto",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseMonta%C3%B1a_ilen4d"],
  ["LOBOS CDG","Emiliano Rubi Campos",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Lobos_efloib"],
  ["SAN JOSE FC","Mario Eduardo Cardenas Ayala",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseMonta%C3%B1a_ilen4d"],
  ["HERMANOS","Alejandro Moreno Banda",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Hermanos_kbfrmh"],
  ["NAPOLI","Juan Pablo Muñoz Guerrero",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Napoli_cp25dv"],
  ["LINCES","ISRAEL SOLORZANO LINARES",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Linces_l1lc7c"],
  ["LINCES","ANDRES AGUILLON TIERRABLANCA",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Linces_l1lc7c"],
  ["JUVENTUS","Jose Ramon Negrete Ruiz",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_fpshqs"],
  ["JUVENTUS","Jorge Luis Ramirez Conejo",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_fpshqs"],
  ["NAPOLI","Juan Pablo Mendoza Macias",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Napoli_cp25dv"],
  ["SAN JOSE FC","Jose Rosas Cardenas",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseMonta%C3%B1a_ilen4d"],
  ["NAPOLI","Juan Esteban Montecillo Solache",1,"Primera Fuerza","https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Napoli_cp25dv"],
  [
    "DYNAMO",
    "Hugo Armenta Buenavista",
    5,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/dynamo.png"
  ],
  [
    "MANCHESTER",
    "J. Carmen Subias Miranda",
    4,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/manchester.png"
  ],
  [
    "DEP. NOPALERO",
    "TELESFORO FREYRE VALADEZ",
    4,
    "Segunda Fuerza",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/dep-nopalero.png"
  ],
  [
    "MANCHESTER",
    "Antonio Huichapa Lopez",
    3,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/manchester.png"
  ],
  [
    "ATL. GALEANA",
    "Jose Guadalupe Valencia Luna",
    3,
    "Intermedia",
    ""
  ],
  [
    "LA ESPERANZA",
    "Jose Mendoza Pescador",
    3,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/la-esperanza.png"
  ],
  [
    "TOROS DE CUENDA",
    "Francisco Gutierrez Campos",
    2,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/toros-de-cuenda.png"
  ],
  [
    "CELTICOS",
    "Giovanni Sanchez Delgado",
    2,
    "Segunda Fuerza",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/celticos.png"
  ],
  [
    "ATL. GALEANA",
    "Juan Pablo Rangel Toledo",
    2,
    "Intermedia",
    ""
  ],
  [
    "ATL. GALEANA",
    "Luis Gerardo Gonzalez Ruiz",
    2,
    "Intermedia",
    ""
  ],
  [
    "MANCHESTER",
    "Manuel Cerritos Arellano",
    2,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/manchester.png"
  ],
  [
    "BOAVISTA",
    "Marco Antonio Gasca Arzate",
    2,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/boavista.png"
  ],
  [
    "DEP. ZAPATA",
    "Miguel Antonio Llanos Aguirre",
    2,
    "Segunda Fuerza",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/dep-zapata.png"
  ],
  [
    "PROMESAS FC",
    "Nestor Huitzache Alvarado",
    2,
    "Intermedia",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/promesas-fc.png"
  ],
  [
    "DYNAMO",
    "Roberto Perdomo Colin",
    2,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/dynamo.png"
  ],
  [
    "MANCHESTER",
    "Alberto Ramirez Campos",
    1,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/manchester.png"
  ],
  [
    "ALDAMA FC",
    "Daniel Yañez Rangel",
    1,
    "Intermedia",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/aldama-fc.png"
  ],
  [
    "PROMESAS FC",
    "Emiliano Centeno Gamez",
    1,
    "Intermedia",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/promesas-fc.png"
  ],
  [
    "MANCHESTER",
    "Fernando Montesinos Freyre",
    1,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/manchester.png"
  ],
  [
    "MANCHESTER",
    "Florencio Franco Lerma",
    1,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/manchester.png"
  ],
  [
    "PROMESAS FC",
    "Jonathan Brian Rico Gamez",
    1,
    "Intermedia",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/promesas-fc.png"
  ],
  [
    "DYNAMO",
    "Jose Jesus Lopez Leon",
    1,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/dynamo.png"
  ],
  [
    "TOROS DE CUENDA",
    "Jose Manuel Vargas Palacios",
    1,
    "Veteranos 50+",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/toros-de-cuenda.png"
  ],
  [
    "CELTICOS",
    "Kevin Gustavo Ojeda Ortega",
    1,
    "Segunda Fuerza",
    "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/celticos.png"
  ]
];
function route(){return location.hash.replace(/^#\/?/,'').split('?')[0]||'home'}
function currentCat(){
  let fromHash='';
  try{
    const q=String(location.hash||'').split('?')[1]||'';
    fromHash=new URLSearchParams(q).get('cat')||'';
  }catch(_){}
  const stored=String(localStorage.getItem('v62-category')||'3');
  const id=CATS.some(x=>x[0]===String(fromHash))?String(fromHash):(CATS.some(x=>x[0]===stored)?stored:'3');
  try{localStorage.setItem('v62-category',id)}catch(_){}
  return id;
}
function catName(id=currentCat()){return CATS.find(x=>x[0]===String(id))?.[1]||'Primera Fuerza'}
function rowsForCat(id=currentCat()){
  const wanted=catName(id);
  return ROWS.filter(r=>String(r[3]||'')===wanted).sort((a,b)=>(Number(b[2])||0)-(Number(a[2])||0));
}
function categoryMarkup(){
  const active=currentCat();
  return '<section class="v28-fallback-category" data-v28-category-controls aria-label="Clasificar por categoría">'+
    '<span>CLASIFICAR POR CATEGORÍA</span>'+
    '<div>'+CATS.map(([id,label])=>'<button type="button" data-v28-cat="'+id+'" class="'+(id===active?'active':'')+'" aria-pressed="'+(id===active?'true':'false')+'">'+label+'</button>').join('')+'</div>'+
  '</section>';
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function logo(r){
  const name=r[0],src=r[4];
  if(src)return '<span class="v28-team-logo"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span>';
  const ab=name.split(/\s+/).map(x=>x[0]||'').join('').slice(0,3).toUpperCase();
  return '<span class="v28-team-logo"><span class="v28-team-fallback">'+esc(ab)+'</span></span>';
}
function rowMarkup(r,i){
  return '<button type="button" class="v28-rank-row" data-v28-player="'+esc(r[1])+'">'+
    '<span class="v28-rank-number">#'+(i+3)+'</span>'+logo(r)+
    '<span class="v28-rank-copy"><b>'+esc(r[1])+'</b><small>'+esc(r[0])+' · '+esc(r[3])+'</small></span>'+
    '<strong class="v28-rank-goals">'+r[2]+'</strong></button>';
}
function feature(r,cls){
  if(!r)return '';
  return '<article class="v28-feature">'+
    '<div class="v28-feature-photo '+cls+'"></div>'+
    '<div class="v28-feature-info"><div class="v28-feature-person">'+logo(r)+'<span><b>'+esc(r[1])+'</b><small>'+esc(r[0])+' · '+esc(r[3])+'</small></span></div>'+
    '<div class="v28-feature-goals"><b>'+r[2]+'</b><small>goles</small></div></div></article>';
}
function pageMarkup(){
  const id=currentCat(),rows=rowsForCat(id);
  const shell='<section class="v28-scorers-page" data-v28-scorers data-v28-fallback="1" data-v28-cat-current="'+id+'">'+categoryMarkup();
  if(!rows.length)return shell+'<div class="v28-category-empty"><b>'+catName(id)+'</b><span>Sin goleadores publicados para esta categoría.</span></div></section>';
  return shell+feature(rows[0],'one')+feature(rows[1],'two')+
    (rows.length>2?'<div class="v28-ranking">'+rows.slice(2).map(rowMarkup).join('')+'</div>':'')+
    '<p class="v28-criteria">Datos oficiales publicados por categoría en Liga Juventino Rosas. No se inventan goles ni jugadores.</p></section>';
}
function setMoreActive(){/* Global nav active state is owned by V34. */}
function render(){
  const active=route()==='scorers';
  document.body.classList.toggle('v28-scorers-active',active);
  if(!active)return;
  const screen=document.querySelector('#screen');
  if(!screen)return;
  const existing=screen.querySelector('[data-v28-scorers]');
  if(window.LJR_OFFICIAL_DATA&&window.LJR_SCORERS_REFERENCE?.render){
    if(!existing)screen.innerHTML='<section class="v28-scorers-page" data-v28-scorers></section>';
    if(!screen.querySelector('[data-v194-scorers]'))window.LJR_SCORERS_REFERENCE.render();
    return;
  }
  if(!existing){
    screen.innerHTML=pageMarkup();
  }else if(existing.dataset.v28Fallback==='1'&&String(existing.dataset.v28CatCurrent||'')!==currentCat()){
    existing.outerHTML=pageMarkup();
  }
  setMoreActive();
  let direct=false;
  try{
    direct=sessionStorage.getItem('v16-open-official-scorers')==='1'||
           sessionStorage.getItem('v105-open-official-scorers')==='1';
    if(direct){
      sessionStorage.removeItem('v16-open-official-scorers');
      sessionStorage.removeItem('v105-open-official-scorers');
    }
  }catch(_){}
  if(direct){
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const target=screen.querySelector('[data-v28-scorers] .v28-ranking')||
                   screen.querySelector('[data-v28-scorers]');
      if(target){
        target.scrollIntoView({behavior:'auto',block:'start'});
        window.scrollBy(0,-6);
      }else{
        window.scrollTo({top:0,left:0,behavior:'auto'});
      }
    }));
  }
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(render))}
document.addEventListener('click',function(e){
  if(route()!=='scorers'||!(e.target instanceof Element))return;
  const b=e.target.closest('[data-v28-cat]');
  if(!b)return;
  const id=String(b.dataset.v28Cat||'');
  if(!CATS.some(x=>x[0]===id))return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  try{
    localStorage.setItem('v62-category',id);
    localStorage.setItem('v12-fixture-cat',id);
    localStorage.setItem('v194-scorer-team','all');
  }catch(_){}
  render();
  try{window.LJR_SCORERS_REFERENCE?.setCategory?.(id)}catch(_){}
},true);
window.addEventListener('hashchange',schedule);
const target=document.querySelector('#screen');
if(target)new MutationObserver(()=>{if(route()==='scorers'&&!target.querySelector('[data-v28-scorers]'))schedule()}).observe(target,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();