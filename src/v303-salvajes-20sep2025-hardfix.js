(()=>{
'use strict';

const PARTS=[1,2,3,4,5,6,7].map(n=>
  new URL('./v303-salvajes-photo-'+String(n).padStart(2,'0')+'.b64?v=20260923-salvajes-v303',import.meta.url)
);
const norm=s=>String(s||'')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .toLowerCase()
  .replace(/\s+/g,' ')
  .trim();

let PHOTO='';
let raf=0;

function target(card){
  const h=norm(card.querySelector('h3,h4')?.textContent||'');
  const all=norm(card.textContent||'');
  return h.includes('salvajes') && all.includes('20 sep 2025');
}

function paint(card){
  if(!PHOTO || !card?.isConnected || !target(card)) return;

  card.querySelectorAll(
    '.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo,.v303-salvajes-bg'
  ).forEach(n=>n.remove());
  card.querySelector(':scope > .v303-salvajes-shade')?.remove();

  const img=document.createElement('img');
  img.className='v35-history-bg-photo v120-exact-event-bg v120-photo-only-bg v303-salvajes-bg';
  img.alt='Salvajes · Subcampeón · Veteranos 35 y más · 20 sep 2025';
  img.src=PHOTO;
  img.loading='eager';
  img.decoding='async';
  img.style.cssText='position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;visibility:visible!important;opacity:1!important;z-index:0!important;object-fit:cover!important;object-position:center 45%!important;transform:none!important;filter:none!important;margin:0!important;padding:0!important;border:0!important;pointer-events:none!important;';
  card.prepend(img);

  const shade=document.createElement('span');
  shade.className='v303-salvajes-shade';
  shade.setAttribute('aria-hidden','true');
  shade.style.cssText='position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(2,5,45,.05) 0%,rgba(2,5,45,.10) 36%,rgba(2,5,45,.26) 68%,rgba(2,5,45,.62) 100%),linear-gradient(90deg,rgba(2,5,45,.12),rgba(2,5,45,.02) 72%)!important;';
  card.insertBefore(shade,img.nextSibling);

  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background','#060653','important');

  card.querySelectorAll('.v35-history-moment-shade,.v120-exact-shade').forEach(n=>{
    n.style.setProperty('display','none','important');
  });
  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
  });

  [...card.querySelectorAll('span')].forEach(n=>{
    if(String(n.textContent||'').trim().toUpperCase()==='FOTO DEL ARCHIVO') n.remove();
  });

  card.classList.add('v35-history-moment-photo','v120-has-exact-bg','v120-photo-only-card');
  card.dataset.v303Salvajes='ready';
}

function patch(){
  if(!PHOTO || !/history|safe-about/.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    if(target(card)) paint(card);
  });
}

function schedule(ms=0){
  clearTimeout(schedule.t);
  schedule.t=setTimeout(()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(patch);
  },ms);
}

async function load(){
  try{
    const parts=await Promise.all(PARTS.map(async url=>{
      const r=await fetch(url,{cache:'no-store'});
      if(!r.ok) throw new Error('HTTP '+r.status+' '+url.pathname);
      return (await r.text()).trim();
    }));
    const b64=parts.join('').replace(/\s+/g,'');
    if(b64.length!==55264 || !b64.startsWith('UklGR')){
      throw new Error('datos de imagen incompletos: '+b64.length);
    }
    PHOTO='data:image/webp;base64,'+b64;
    schedule(0);
    setTimeout(patch,250);
    setTimeout(patch,900);
    setTimeout(patch,1800);
  }catch(err){
    console.error('V303 Salvajes photo:',err);
  }
}

window.addEventListener('hashchange',()=>schedule(40));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(100);
},true);

new MutationObserver(ms=>{
  const changed=ms.some(m=>[...m.addedNodes].some(n=>
    n.nodeType===1 &&
    !n.classList?.contains('v303-salvajes-bg') &&
    !n.classList?.contains('v303-salvajes-shade')
  ));
  if(changed) schedule(40);
}).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});

load();
})();