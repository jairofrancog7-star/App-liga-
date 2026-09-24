(()=>{
'use strict';
const V='20260924-boavista-dataurl-v295';
const files=[
'v292-boavista-photo-01.b64','v292-boavista-photo-02.b64','v292-boavista-photo-03.b64','v292-boavista-photo-04.b64',
'v292-boavista-photo-05a.b64','v292-boavista-photo-05b.b64','v292-boavista-photo-05c.b64','v292-boavista-photo-06.b64',
'v292-boavista-photo-07a.b64','v292-boavista-photo-07b.b64','v292-boavista-photo-07c.b64',
'v292-boavista-photo-08a.b64','v292-boavista-photo-08b.b64','v292-boavista-photo-08c.b64','v292-boavista-photo-09a.b64'
];
let data='',promise=null,raf=0;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const target=c=>{
 const h=norm(c.querySelector('h3,h4')?.textContent||'');
 const all=norm(c.textContent||'');
 return h.includes('boavista')&&all.includes('11 ene 2015');
};
function load(){
 if(data)return Promise.resolve(data);
 if(promise)return promise;
 promise=Promise.all(files.map(async name=>{
   const r=await fetch('/App-liga-/src/'+name+'?v='+V,{cache:'no-store'});
   if(!r.ok)throw new Error(name+': '+r.status);
   return (await r.text()).replace(/\s+/g,'');
 })).then(parts=>{
   const b64=parts.join('');
   if(b64.length!==74128||!b64.startsWith('UklGR')||!b64.endsWith('AAAAA=='))throw new Error('base64 incompleto '+b64.length);
   data='data:image/webp;base64,'+b64;
   return data;
 });
 return promise;
}
function paint(c,src){
 if(!c?.isConnected||!target(c))return;
 c.querySelectorAll('.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo,.v286-boavista-2015-bg,.v295-boavista-data-bg').forEach(n=>n.remove());
 let sh=c.querySelector(':scope > .v295-boavista-data-shade');
 if(sh)sh.remove();
 const img=document.createElement('img');
 img.className='v35-history-bg-photo v120-exact-event-bg v120-photo-only-bg v295-boavista-data-bg';
 img.alt='Boavista · Campeón · Primera Fuerza · 11 ene 2015';
 img.src=src;
 img.loading='eager';
 img.decoding='async';
 img.style.cssText='position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;visibility:visible!important;opacity:1!important;z-index:0!important;object-fit:cover!important;object-position:center 43%!important;transform:none!important;filter:none!important;margin:0!important;padding:0!important;border:0!important;pointer-events:none!important;';
 c.prepend(img);
 sh=document.createElement('span');
 sh.className='v295-boavista-data-shade';
 sh.setAttribute('aria-hidden','true');
 sh.style.cssText='position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(2,5,45,.06) 0%,rgba(2,5,45,.12) 38%,rgba(2,5,45,.30) 68%,rgba(2,5,45,.66) 100%),linear-gradient(90deg,rgba(2,5,45,.14),rgba(2,5,45,.02) 72%)!important;';
 c.insertBefore(sh,img.nextSibling);
 c.style.setProperty('position','relative','important');
 c.style.setProperty('overflow','hidden','important');
 c.style.setProperty('isolation','isolate','important');
 c.style.setProperty('background','#060653','important');
 c.querySelectorAll('.v35-history-moment-shade,.v120-exact-shade').forEach(n=>n.style.setProperty('display','none','important'));
 c.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
   n.style.setProperty('position','relative','important');
   n.style.setProperty('z-index','2','important');
   n.style.setProperty('background','transparent','important');
 });
 c.classList.add('v35-history-moment-photo','v120-has-exact-bg','v120-photo-only-card');
 c.dataset.v295Boavista='ready';
}
function patch(){
 if(!/history|safe-about/.test(location.hash||''))return;
 const cards=[...document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card')].filter(target);
 if(!cards.length)return;
 if(data){cards.forEach(c=>{if(c.dataset.v295Boavista!=='ready'||!c.querySelector('.v295-boavista-data-bg'))paint(c,data)});return;}
 load().then(src=>cards.forEach(c=>paint(c,src))).catch(e=>console.error('[Boavista 11 ene 2015]',e));
}
function schedule(ms=0){clearTimeout(schedule.t);schedule.t=setTimeout(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(patch)},ms)}
window.addEventListener('hashchange',()=>schedule(40));
document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab],button,[data-route]'))schedule(90)},true);
new MutationObserver(ms=>{if(ms.some(m=>[...m.addedNodes].some(n=>n.nodeType===1&&!n.classList?.contains('v295-boavista-data-bg')&&!n.classList?.contains('v295-boavista-data-shade'))))schedule(40)}).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});
load().then(()=>schedule()).catch(e=>console.error('[Boavista preload]',e));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(80),{once:true});else schedule(40);
setTimeout(patch,500);setTimeout(patch,1400);
})();