/* V599 — enfoque adaptativo de rostro para fotos de jugadores.
   No usa reconocimiento facial: solo evita recortes extremos ajustando el foco
   según la proporción natural de cada foto. */
(function(){
'use strict';
if(window.__LJR_V599_PLAYER_FACE_CENTER__)return;
window.__LJR_V599_PLAYER_FACE_CENTER__=true;

const SELECTORS=[
  '.v576-player-photo',
  '.v576-player-avatar>img',
  '.v66-player-avatar>img',
  '.v42-avatar>img',
  '.v419-player-avatar>img',
  '.v446-stat-ref-avatar>img',
  '.v414-avatar>img',
  '.v123-avatar>img',
  '.v123-option-avatar>img',
  '.v379-related-avatar>img',
  '.v576-table-photo>img',
  '.v124-avatar>img',
  '.v562-avatar>img',
  '.v12-avatar>img',
  '.v33-player-team-logo.v576-player-avatar>img',
  '.v416-pitch-player i.v576-pitch-photo>img',
  '.v417-bench-player i.v576-bench-photo>img',
  '.v419-mini-pitch i.v576-mini-photo>img',
  '.v538-person.has-photo>img',
  '.v576-inline-player-photo',
  '.v576-hero-player-photo',
  '.v576-scorer-hero-photo',
  '.v576-v28-feature-photo',
  'body.v379-player-profile-active .v379-player-photo'
].join(',');

function focusY(img){
  const w=Number(img.naturalWidth)||0,h=Number(img.naturalHeight)||0;
  if(!w||!h)return 42;
  const ratio=h/w;
  /* Muy vertical = foto de cuerpo/credencial: sube el foco.
     Cuadrada/horizontal = centra para no cortar nariz, boca ni mentón. */
  if(ratio>=2.05)return 27;
  if(ratio>=1.72)return 32;
  if(ratio>=1.42)return 37;
  if(ratio>=1.18)return 43;
  return 50;
}
function apply(img){
  if(!(img instanceof HTMLImageElement))return;
  if(!img.matches(SELECTORS))return;
  if(img.naturalWidth&&img.naturalHeight){
    img.style.setProperty('--ljr-face-y',focusY(img)+'%');
    img.dataset.v599FaceFocus='1';
  }
  if(img.dataset.v599FaceBound!=='1'){
    img.dataset.v599FaceBound='1';
    img.addEventListener('load',()=>apply(img));
  }
}
function scan(root=document){
  if(root instanceof HTMLImageElement)apply(root);
  root.querySelectorAll?.(SELECTORS).forEach(apply);
}
let timer=0;
function schedule(root=document){
  clearTimeout(timer);
  timer=setTimeout(()=>scan(root),30);
}

document.addEventListener('DOMContentLoaded',()=>scan(document),{once:true});
window.addEventListener('load',()=>scan(document));
window.addEventListener('hashchange',()=>schedule(document));
window.addEventListener('ljr:official-data',()=>schedule(document));

const screen=document.querySelector('#screen')||document.documentElement;
new MutationObserver(mutations=>{
  for(const m of mutations){
    if(m.type==='attributes'&&m.target instanceof HTMLImageElement){apply(m.target);continue}
    m.addedNodes.forEach(n=>{
      if(n instanceof HTMLImageElement)apply(n);
      else if(n instanceof Element)scan(n);
    });
  }
}).observe(screen,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});

scan(document);
setTimeout(()=>scan(document),400);
setTimeout(()=>scan(document),1400);
})();
