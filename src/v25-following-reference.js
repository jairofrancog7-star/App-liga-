/* PARTS27 — Siguiendo: las 3 capturas de Google Drive son el diseño maestro.
   No se redibuja, no se reinterpreta y no se añaden textos visibles.
   Solo se agregan zonas táctiles transparentes para conectar los 3 estados. */

const V27_EMPTY='./following-empty-ref.png?v=parts27';
const V27_SHEET='./following-sheet-ref.png?v=parts27';
const V27_PICKER='./following-picker-ref.png?v=parts27';
const V27_STATE_KEY='lj-following-reference-state-v27';

let v27Mode='auto';
let v27Previous='empty';

function v27Route(){return location.hash.replace('#/','')||'home'}

function v27IsFollowed(){
  try{return localStorage.getItem(V27_STATE_KEY)==='followed'}catch{return false}
}
function v27SetFollowed(on){
  try{localStorage.setItem(V27_STATE_KEY,on?'followed':'empty')}catch{}
}

function v27NavHotspots(top){
  return '<div class="v27-nav-hits" style="top:'+top+'%">'+
    '<button data-v27-route="home" aria-label="Inicio"></button>'+
    '<button data-v27-route="competition" aria-label="Competición"></button>'+
    '<button data-v27-route="video" aria-label="Vídeo"></button>'+
    '<button data-v27-route="fantasy" aria-label="Fantasy"></button>'+
    '<button data-v27-route="more" aria-label="Más"></button>'+
  '</div>';
}

function v27Empty(){
  return '<section class="v27-following v27-empty" data-v27-following>'+
    '<div class="v27-shot v27-empty-shot">'+
      '<img src="'+V27_EMPTY+'" alt="Siguiendo">'+
      '<button class="v27-hit v27-empty-back" data-v27-route="more" aria-label="Volver"></button>'+
      '<button class="v27-hit v27-empty-plus" data-v27-picker aria-label="Añadir equipos"></button>'+
      '<button class="v27-hit v27-empty-add" data-v27-picker aria-label="Añadir equipos"></button>'+
      v27NavHotspots(92.05)+
    '</div>'+
  '</section>';
}

function v27Sheet(){
  return '<section class="v27-following v27-sheet" data-v27-following>'+
    '<div class="v27-shot v27-sheet-shot">'+
      '<img src="'+V27_SHEET+'" alt="Siguiendo América Veteranos">'+
      '<button class="v27-hit v27-sheet-back" data-v27-route="more" aria-label="Volver"></button>'+
      '<button class="v27-hit v27-sheet-plus" data-v27-picker aria-label="Añadir equipos"></button>'+
      '<button class="v27-hit v27-sheet-followed" aria-label="Siguiendo"></button>'+
      '<button class="v27-hit v27-sheet-favorite" data-v27-favorite aria-label="Equipo favorito"></button>'+
      '<button class="v27-hit v27-sheet-unfollow" data-v27-unfollow aria-label="Dejar de seguir"></button>'+
    '</div>'+
  '</section>';
}

function v27Picker(){
  const followButtons=[
    [433,156,552,198],[433,216,552,259],[433,278,552,320],[433,340,552,384],
    [433,404,552,448],[433,470,552,513],[433,534,552,577],[433,598,552,641],
    [433,662,552,706],[433,726,552,770],[433,790,552,834],[433,854,552,898],
    [433,920,552,963],[433,984,552,1027],[433,1048,552,1091],[433,1112,552,1156],
    [433,1176,552,1220],[433,1243,552,1287],[433,1307,552,1351],[433,1371,552,1415],
    [433,1439,552,1482],[433,1504,552,1548]
  ];
  return '<section class="v27-following v27-picker" data-v27-following>'+
    '<div class="v27-shot v27-picker-shot">'+
      '<img src="'+V27_PICKER+'" alt="Equipos en la competición">'+
      '<button class="v27-hit v27-picker-close" data-v27-close aria-label="Cerrar"></button>'+
      '<button class="v27-hit v27-picker-search" aria-label="Buscar equipos"></button>'+
      followButtons.map((b,i)=>{
        const l=(b[0]/585*100).toFixed(4), t=(b[1]/1702*100).toFixed(4);
        const w=((b[2]-b[0])/585*100).toFixed(4), h=((b[3]-b[1])/1702*100).toFixed(4);
        return '<button class="v27-hit v27-follow-hit" style="left:'+l+'%;top:'+t+'%;width:'+w+'%;height:'+h+'%" data-v27-follow="'+i+'" aria-label="Seguir equipo"></button>';
      }).join('')+
      v27NavHotspots(94.0)+
    '</div>'+
  '</section>';
}

function v27Bind(){
  document.querySelectorAll('[data-v27-route]').forEach(btn=>{
    btn.onclick=()=>{location.hash='#/'+btn.dataset.v27Route};
  });
  document.querySelectorAll('[data-v27-picker]').forEach(btn=>{
    btn.onclick=()=>{v27Previous=v27IsFollowed()?'sheet':'empty';v27Mode='picker';v27Render()};
  });
  const close=document.querySelector('[data-v27-close]');
  if(close)close.onclick=()=>{v27Mode=v27Previous;v27Render()};

  document.querySelectorAll('[data-v27-follow]').forEach(btn=>{
    btn.onclick=()=>{
      v27SetFollowed(true);
      v27Mode='sheet';
      v27Previous='sheet';
      v27Render();
    };
  });

  const unfollow=document.querySelector('[data-v27-unfollow]');
  if(unfollow)unfollow.onclick=()=>{
    v27SetFollowed(false);
    v27Mode='empty';
    v27Previous='empty';
    v27Render();
  };

  const favorite=document.querySelector('[data-v27-favorite]');
  if(favorite)favorite.onclick=()=>{
    try{
      const key='lj-following-favorite-v27';
      localStorage.setItem(key,localStorage.getItem(key)==='1'?'0':'1');
    }catch{}
  };
}

function v27Render(){
  if(v27Route()!=='following')return;
  const screen=document.querySelector('#screen');
  if(!screen)return;
  if(v27Mode==='auto')v27Mode=v27IsFollowed()?'sheet':'empty';
  screen.innerHTML=v27Mode==='picker'?v27Picker():(v27Mode==='sheet'?v27Sheet():v27Empty());
  v27Bind();
  requestAnimationFrame(()=>window.scrollTo(0,0));
}

function v27Schedule(){
  if(v27Route()!=='following'){v27Mode='auto';return}
  requestAnimationFrame(()=>requestAnimationFrame(v27Render));
}

window.addEventListener('hashchange',v27Schedule);
const v27Screen=document.querySelector('#screen');
if(v27Screen){
  new MutationObserver(()=>{
    if(v27Route()==='following'&&!v27Screen.querySelector('[data-v27-following]'))v27Schedule();
  }).observe(v27Screen,{childList:true,subtree:false});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',v27Schedule,{once:true});
else v27Schedule();
