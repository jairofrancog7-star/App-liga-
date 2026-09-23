(()=>{
'use strict';

const VERSION='20260923-juventus-restored-v275';
const CHUNKS=[
  './assets/history/archive-v274/juventus-2022-photo-b64-01.txt?v='+VERSION,
  './assets/history/archive-v274/juventus-2022-photo-b64-02.txt?v='+VERSION,
  './assets/history/archive-v274/juventus-2022-photo-b64-03.txt?v='+VERSION,
  './assets/history/archive-v274/juventus-2022-photo-b64-04a.txt?v='+VERSION,\n  './assets/history/archive-v274/juventus-2022-photo-b64-04b.txt?v='+VERSION,
  './assets/history/archive-v274/juventus-2022-photo-b64-05.txt?v='+VERSION,
  './assets/history/archive-v274/juventus-2022-photo-b64-06.txt?v='+VERSION,
  './assets/history/archive-v274/juventus-2022-photo-b64-07.txt?v='+VERSION
];

let PHOTO='';
let loading=null;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

function target(card){
  const h=norm(card.querySelector('h3,h4')?.textContent||'');
  const d=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
  const all=norm(card.textContent||'');
  return h.includes('juventus') && (d.includes('17 abr 2022') || all.includes('17 abr 2022'));
}

function getPhoto(){
  if(PHOTO) return Promise.resolve(PHOTO);
  if(!loading){
    loading=Promise.all(CHUNKS.map(async url=>{
      const res=await fetch(url,{cache:'no-store'});
      if(!res.ok) throw new Error('Juventus photo chunk '+res.status);
      return (await res.text()).trim();
    })).then(parts=>{
      const b64=parts.join('').replace(/\s+/g,'');
      if(b64.length!==37856 || !b64.startsWith('/9j/') || !b64.endsWith('/Z')){
        throw new Error('Juventus photo data incomplete: '+b64.length);
      }
      PHOTO='data:image/jpeg;base64,'+b64;
      return PHOTO;
    });
  }
  return loading;
}

function apply(card,photo){
  card.querySelectorAll('.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo,.v268-juventus-2022-bg').forEach(n=>n.remove());

  const img=document.createElement('img');
  img.className='v35-history-bg-photo v120-exact-event-bg v120-photo-only-bg v268-juventus-2022-bg';
  img.alt='';
  img.setAttribute('aria-hidden','true');
  img.decoding='async';
  img.src=photo;
  [
    ['position','absolute'],['inset','0'],['width','100%'],['height','100%'],
    ['min-width','100%'],['min-height','100%'],['max-width','none'],['max-height','none'],
    ['display','block'],['visibility','visible'],['opacity','1'],['z-index','0'],
    ['object-fit','cover'],['object-position','center 42%'],['transform','none'],
    ['filter','none'],['margin','0'],['padding','0'],['border','0']
  ].forEach(([k,v])=>img.style.setProperty(k,v,'important'));
  card.prepend(img);

  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background','#07075d','important');
  card.style.setProperty('background-image','none','important');

  let shade=card.querySelector(':scope > .v275-juventus-2022-shade');
  if(!shade){
    card.querySelector(':scope > .v268-juventus-2022-shade')?.remove();
    shade=document.createElement('span');
    shade.className='v275-juventus-2022-shade';
    shade.setAttribute('aria-hidden','true');
    card.insertBefore(shade,img.nextSibling);
  }
  shade.style.cssText='position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(2,5,45,.05) 0%,rgba(2,5,45,.12) 38%,rgba(2,5,45,.38) 67%,rgba(2,5,45,.76) 100%),linear-gradient(90deg,rgba(2,5,45,.22),rgba(2,5,45,.03) 74%)!important;';

  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
  });
  card.querySelectorAll('.v35-history-status span').forEach(n=>{
    n.style.setProperty('background','rgba(3,8,70,.50)','important');
    n.style.setProperty('backdrop-filter','blur(1px)','important');
    n.style.setProperty('-webkit-backdrop-filter','blur(1px)','important');
  });

  card.classList.add('v35-history-moment-photo','v120-has-exact-bg','v120-photo-only-card');
  card.dataset.v275Juventus2022='1';
}

async function patch(){
  if(!/history|safe-about/.test(location.hash||'')) return;
  const cards=[...document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card')].filter(target);
  if(!cards.length) return;
  try{
    const photo=await getPhoto();
    cards.forEach(card=>apply(card,photo));
  }catch(err){
    console.warn('[Historia Juventus 2022] No se pudo reconstruir la foto:',err);
  }
}

let raf=0,t=0;
function schedule(ms=0){
  clearTimeout(t);
  t=setTimeout(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>patch())},ms);
}
window.addEventListener('hashchange',()=>schedule(60));
document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab],button,[data-route]'))schedule(120)},true);
const root=document.querySelector('#screen')||document.body;
new MutationObserver(()=>schedule(50)).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});
else schedule(80);
setTimeout(patch,500);
setTimeout(patch,1400);
})();