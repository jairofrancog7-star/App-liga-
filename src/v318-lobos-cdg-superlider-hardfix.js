/* V318 — Lobos CDG · SÚPER LÍDER · 03 may 2026.
   Crea una sola tarjeta en Historia > Campeones y usa la foto aportada por el usuario como fondo. */
(function(){
'use strict';
if(window.__LJR_V318_LOBOS_CDG_SUPERLIDER__) return;
window.__LJR_V318_LOBOS_CDG_SUPERLIDER__=true;

const PARTS=[
  './src/v314-lobos-cdg-superlider-photo-01.b64?v=20260924-lobos-superlider-v318',
  './src/v314-lobos-cdg-superlider-photo-02.b64?v=20260924-lobos-superlider-v318',
  './src/v314-lobos-cdg-superlider-photo-03.b64?v=20260924-lobos-superlider-v318',
  './src/v314-lobos-cdg-superlider-photo-04.b64?v=20260924-lobos-superlider-v318'
];
const EXPECTED_LEN=40216;
let PHOTO='';
let loading=null;
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

function loadPhoto(){
  if(PHOTO) return Promise.resolve(PHOTO);
  if(loading) return loading;
  loading=Promise.all(PARTS.map(src=>fetch(src,{cache:'no-store'}).then(r=>{
    if(!r.ok) throw new Error('HTTP '+r.status+' '+src);
    return r.text();
  }))).then(parts=>{
    const b64=parts.join('').replace(/\s+/g,'');
    if(b64.length!==EXPECTED_LEN || !b64.startsWith('UklGR')){
      throw new Error('Foto Lobos CDG incompleta: '+b64.length);
    }
    PHOTO='data:image/webp;base64,'+b64;
    try{ const preload=new Image(); preload.src=PHOTO; }catch(e){}
    return PHOTO;
  }).catch(err=>{
    console.warn('[V318 Lobos CDG] No se pudo armar la foto',err);
    return '';
  });
  return loading;
}
function isTarget(card){
  const t=norm(card?.textContent||'');
  return t.includes('lobos cdg') &&
    (t.includes('03 may 2026')||t.includes('3 may 2026')) &&
    t.includes('super lider');
}
function onChampions(){
  const active=document.querySelector('.v35-tab.active,[data-v35-tab].active');
  return !!active && norm(active.textContent).includes('campeones');
}
function ensureStyle(){
  if(document.getElementById('v318-lobos-superlider-style')) return;
  const s=document.createElement('style');
  s.id='v318-lobos-superlider-style';
  s.textContent=`
    .v318-lobos-superlider{
      position:relative!important;overflow:hidden!important;isolation:isolate!important;
      display:block!important;visibility:visible!important;opacity:1!important;min-height:360px!important;
      background-color:#07075d!important;background-size:cover!important;background-position:center 48%!important;background-repeat:no-repeat!important;
    }
    .v318-lobos-superlider>.v318-lobos-photo{
      position:absolute!important;inset:0!important;z-index:0!important;width:100%!important;height:100%!important;
      object-fit:cover!important;object-position:center 48%!important;display:block!important;visibility:visible!important;opacity:1!important;
      margin:0!important;padding:0!important;border:0!important;border-radius:inherit!important;pointer-events:none!important;
    }
    .v318-lobos-superlider>.v318-lobos-shade{
      position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;
      background:linear-gradient(180deg,rgba(2,7,55,.02) 0%,rgba(2,7,55,.08) 38%,rgba(2,7,55,.42) 72%,rgba(2,7,55,.88) 100%)!important;
    }
    .v318-lobos-superlider>.v35-history-moment-content{
      position:relative!important;z-index:2!important;background:transparent!important;background-image:none!important;
    }
    .v318-lobos-superlider .v35-history-status{position:relative!important;z-index:2!important;background:transparent!important}
    .v318-lobos-superlider .v35-history-status>span{background:rgba(2,10,67,.28)!important;border-color:rgba(77,226,244,.70)!important}
    .v318-lobos-superlider h3,.v318-lobos-superlider strong,.v318-lobos-superlider b,.v318-lobos-superlider p,
    .v318-lobos-superlider span,.v318-lobos-superlider time{text-shadow:0 2px 8px rgba(0,0,0,.92)!important}
  `;
  document.head.appendChild(s);
}
function makePhoto(){
  const img=document.createElement('img');
  img.className='v318-lobos-photo';
  img.alt='Lobos CDG · Súper líder · 03 may 2026';
  img.loading='eager';
  img.decoding='async';
  if(PHOTO) img.src=PHOTO;
  return img;
}
function makeShade(){
  const x=document.createElement('span');
  x.className='v318-lobos-shade';
  x.setAttribute('aria-hidden','true');
  return x;
}
function makeCard(){
  const a=document.createElement('article');
  a.className='v35-history-moment v35-history-moment-photo v318-lobos-superlider';
  a.dataset.v318LobosSuperlider='1';
  a.appendChild(makePhoto());
  a.appendChild(makeShade());
  const c=document.createElement('div');
  c.className='v35-history-moment-content';
  c.innerHTML=
    '<div class="v35-history-meta"><span class="v35-history-kind">SÚPER LÍDER</span><time class="v35-history-date">03 may 2026</time></div>'+
    '<h3>Lobos CDG</h3>'+
    '<strong>Súper líder · Temporada 2026</strong>'+
    '<div class="v35-history-status"><span><b>Fecha</b>03 may 2026</span><span><b>Temporada</b>2026</span></div>'+
    '<p>Lobos CDG · Súper líder · 03 de mayo de 2026.</p>';
  a.appendChild(c);
  return a;
}
function applyPhoto(card){
  if(!PHOTO || !card || !isTarget(card)) return;
  ensureStyle();
  card.classList.add('v318-lobos-superlider','v35-history-moment-photo');
  card.style.setProperty('display','block','important');
  card.style.setProperty('visibility','visible','important');
  card.style.setProperty('opacity','1','important');
  card.style.setProperty('background-image','linear-gradient(180deg,rgba(2,7,55,.02),rgba(2,7,55,.52)),url("'+PHOTO+'")','important');
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 48%','important');
  card.style.setProperty('background-repeat','no-repeat','important');

  let img=card.querySelector(':scope > .v318-lobos-photo');
  if(!img){
    img=makePhoto();
    card.prepend(img);
    if(!card.querySelector(':scope > .v318-lobos-shade')){
      card.insertBefore(makeShade(),img.nextSibling);
    }
  }
  if(img.getAttribute('src')!==PHOTO) img.src=PHOTO;

  card.querySelectorAll(':scope > .v35-history-bg-photo,:scope > .v120-exact-event-bg').forEach(old=>{
    old.style.setProperty('display','none','important');
  });
}
function insertChronological(container,node){
  const target=Date.UTC(2026,4,3);
  const months={ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11};
  const parse=el=>{
    const t=norm(el.textContent);
    const m=t.match(/(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\s+(20\d{2})/);
    return m?Date.UTC(Number(m[3]),months[m[2]],Number(m[1])):null;
  };
  const before=[...container.children].find(el=>{const ts=parse(el);return ts!==null&&ts<target;});
  if(before) container.insertBefore(node,before); else container.appendChild(node);
}
function pickContainer(){
  const content=document.querySelector('[data-v35-content]');
  if(!content) return null;
  return content.querySelector('.v35-history-archive-compact .v35-history-moments') ||
         content.querySelector('.v35-history-moments');
}
function ensure(){
  if(!/history/i.test(location.hash||'')) return;
  ensureStyle();

  const existing=[...document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card,article')].filter(isTarget);
  if(existing.length){
    existing.slice(1).forEach(n=>n.remove());
    applyPhoto(existing[0]);
    return;
  }
  if(!onChampions()) return;

  const container=pickContainer();
  if(!container) return;
  const card=makeCard();
  insertChronological(container,card);
  applyPhoto(card);
}
let timer=0;
function schedule(ms=0){
  clearTimeout(timer);
  timer=setTimeout(()=>{
    if(!PHOTO){
      loadPhoto().then(()=>{ensure();setTimeout(ensure,150);setTimeout(ensure,500);});
      return;
    }
    ensure();
    setTimeout(ensure,120);
    setTimeout(ensure,420);
    setTimeout(ensure,1000);
  },ms);
}
window.addEventListener('hashchange',()=>schedule(30));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],[data-history-tab],button,[data-route]')) schedule(70);
},true);
const root=document.querySelector('#screen')||document.body;
new MutationObserver(()=>schedule(45)).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>schedule(50),{once:true});
}else{
  schedule(30);
}
})();