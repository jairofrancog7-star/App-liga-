/* PARTS28 — Máximo goleador con datos públicos reales de AdminFut.
   No inventa jugadores ni goles. */
(function(){
'use strict';
const ROWS=[
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
function route(){return location.hash.replace('#/','')||'home'}
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
    '<span class="v28-rank-copy"><b>'+esc(r[0])+'</b><small>'+esc(r[1])+' · '+esc(r[3])+'</small></span>'+
    '<strong class="v28-rank-goals">'+r[2]+'</strong></button>';
}
function feature(r,cls){
  if(!r)return '';
  return '<article class="v28-feature">'+
    '<div class="v28-feature-photo '+cls+'"></div>'+
    '<div class="v28-feature-info"><div class="v28-feature-person">'+logo(r)+'<span><b>'+esc(r[0])+'</b><small>'+esc(r[1])+' · '+esc(r[3])+'</small></span></div>'+
    '<div class="v28-feature-goals"><b>'+r[2]+'</b><small>goles</small></div></div></article>';
}
function pageMarkup(){
  if(!ROWS.length)return '<section class="v28-scorers-page" data-v28-scorers><div class="empty-state"><h2>Sin goles oficiales publicados</h2><p>AdminFut no muestra una tabla de goleo activa.</p></div></section>';
  return '<section class="v28-scorers-page" data-v28-scorers>'+feature(ROWS[0],'one')+feature(ROWS[1],'two')+
    '<div class="v28-ranking">'+ROWS.slice(2).map(rowMarkup).join('')+'</div>'+
    '<p class="v28-criteria">Datos oficiales publicados por categoría en AdminFut. No se inventan goles ni jugadores.</p></section>';
}
function setMoreActive(){const nav=document.querySelector('.bottom-nav');if(nav)nav.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.route==='more'))}
function render(){
  const active=route()==='scorers';
  document.body.classList.toggle('v28-scorers-active',active);
  if(!active)return;
  const screen=document.querySelector('#screen');
  if(!screen)return;
  if(!screen.querySelector('[data-v28-scorers]'))screen.innerHTML=pageMarkup();
  setMoreActive();
  let direct=false;
  try{
    direct=sessionStorage.getItem('v16-open-official-scorers')==='1';
    if(direct)sessionStorage.removeItem('v16-open-official-scorers');
  }catch(_){}
  if(direct){
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const page=screen.querySelector('[data-v28-scorers]');
      if(page){
        page.scrollIntoView({behavior:'auto',block:'start'});
        window.scrollBy(0,-4);
      }else{
        window.scrollTo({top:0,left:0,behavior:'auto'});
      }
    }));
  }
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(render))}
window.addEventListener('hashchange',schedule);
const target=document.querySelector('#screen');
if(target)new MutationObserver(()=>{if(route()==='scorers'&&!target.querySelector('[data-v28-scorers]'))schedule()}).observe(target,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();