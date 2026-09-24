/* V314 — Restore Abejas · Tercer lugar · Primera Fuerza · 03 nov 2019 in Historia > Campeones.
   Keeps the card present after tab rerenders and uses the exact user-provided photo as background. */
(function(){
'use strict';
if(window.__LJR_V316_ABEJAS_2019_RESTORE__)return;
window.__LJR_V314_ABEJAS_2019_RESTORE__=true;

const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
function getPhoto(){
  return './assets/history/archive-v315/abejas-tercer-lugar-03-nov-2019.webp?v=20260924-abejas-file-v316';
}
function isTarget(card){
  const t=norm(card?.textContent||'');
  return t.includes('abejas')&&t.includes('03 nov 2019')&&t.includes('tercer lugar')&&(t.includes('2018-2019')||t.includes('2018–2019'));
}
function onChampions(){
  const active=document.querySelector('.v35-tab.active');
  return !!active&&norm(active.textContent).includes('campeones');
}
function style(){
  if(document.getElementById('v316-abejas-2019-style'))return;
  const s=document.createElement('style');
  s.id='v314-abejas-2019-style';
  s.textContent=`
    .v314-abejas-2019{
      position:relative!important;overflow:hidden!important;isolation:isolate!important;
      display:block!important;visibility:visible!important;opacity:1!important;min-height:360px!important;
      background-color:#07075d!important;background-size:cover!important;background-position:center 50%!important;background-repeat:no-repeat!important;
    }
    .v314-abejas-2019>.v314-abejas-photo{
      position:absolute!important;inset:0!important;z-index:0!important;width:100%!important;height:100%!important;
      object-fit:cover!important;object-position:center 50%!important;display:block!important;visibility:visible!important;opacity:1!important;
      margin:0!important;padding:0!important;border:0!important;border-radius:inherit!important;pointer-events:none!important;
      filter:saturate(1.04) contrast(1.02) brightness(.94)!important;
    }
    .v314-abejas-2019>.v314-abejas-shade{
      position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;
      background:linear-gradient(180deg,rgba(2,7,55,.03) 0%,rgba(2,7,55,.10) 38%,rgba(2,7,55,.44) 72%,rgba(2,7,55,.86) 100%)!important;
    }
    .v314-abejas-2019>.v35-history-moment-content{
      position:relative!important;z-index:2!important;background:transparent!important;background-image:none!important;
    }
    .v314-abejas-2019 .v35-history-status{position:relative!important;z-index:2!important;background:transparent!important}
    .v314-abejas-2019 .v35-history-status>span{background:rgba(2,10,67,.30)!important;border-color:rgba(77,226,244,.70)!important}
    .v314-abejas-2019 h3,.v314-abejas-2019 strong,.v314-abejas-2019 b,.v314-abejas-2019 p,
    .v314-abejas-2019 span,.v314-abejas-2019 time{text-shadow:0 2px 8px rgba(0,0,0,.88)!important}
  `;
  document.head.appendChild(s);
}
function photo(){
  const img=document.createElement('img');
  img.className='v314-abejas-photo';
  img.src=getPhoto();
  img.alt='Abejas · tercer lugar · Primera Fuerza · 03 nov 2019';
  img.loading='eager';
  img.decoding='async';
  return img;
}
function shade(){
  const x=document.createElement('span');
  x.className='v314-abejas-shade';
  x.setAttribute('aria-hidden','true');
  return x;
}
function makeCard(){
  const a=document.createElement('article');
  a.className='v35-history-moment v35-history-moment-photo v314-abejas-2019';
  a.dataset.v314Abejas2019='1';
  a.appendChild(photo());
  a.appendChild(shade());
  const c=document.createElement('div');
  c.className='v35-history-moment-content';
  c.innerHTML=
    '<div class="v35-history-meta"><span class="v35-history-kind">TERCER LUGAR</span><time class="v35-history-date">03 nov 2019</time></div>'+
    '<h3>Abejas</h3>'+
    '<strong>Tercer lugar · Primera Fuerza · 2018–2019</strong>'+
    '<div class="v35-history-status"><span><b>Temporada</b>2018–2019</span></div>'+
    '<p>Publicación aportada por el usuario: el equipo Abejas obtuvo el tercer lugar de la temporada 2018–2019 en Primera Fuerza.</p>';
  a.appendChild(c);
  return a;
}
function patchCard(card){
  const PHOTO=getPhoto();
  if(!PHOTO||!isTarget(card))return;
  style();
  card.classList.add('v314-abejas-2019','v35-history-moment-photo');
  card.style.setProperty('display','block','important');
  card.style.setProperty('visibility','visible','important');
  card.style.setProperty('opacity','1','important');
  card.style.setProperty('background-image','linear-gradient(180deg,rgba(2,7,55,.04),rgba(2,7,55,.64)),url("'+PHOTO+'")','important');
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 50%','important');
  card.style.setProperty('background-repeat','no-repeat','important');
  const canonical=card.querySelector(':scope > .v35-history-bg-photo');
  if(canonical){
    canonical.src=PHOTO;
    canonical.loading='eager';
    canonical.style.setProperty('display','block','important');
    canonical.style.setProperty('visibility','visible','important');
    canonical.style.setProperty('opacity','1','important');
    canonical.style.setProperty('object-fit','cover','important');
    canonical.style.setProperty('object-position','center 50%','important');
  }else if(!card.querySelector(':scope > .v314-abejas-photo')){
    card.prepend(photo());
    card.insertBefore(shade(),card.children[1]||null);
  }
}
function insertChronological(container,node){
  const target=Date.UTC(2019,10,3);
  const months={ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11};
  const parse=el=>{
    const t=norm(el.textContent);
    const m=t.match(/(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\s+(20\d{2})/);
    return m?Date.UTC(Number(m[3]),months[m[2]],Number(m[1])):null;
  };
  const before=[...container.children].find(el=>{const ts=parse(el);return ts!==null&&ts<target;});
  if(before)container.insertBefore(node,before);else container.appendChild(node);
}
function ensure(){
  if(!/history/i.test(location.hash||''))return;
  style();
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(patchCard);
  if(!onChampions())return;
  const content=document.querySelector('[data-v35-content]');
  const containers=content?[...content.querySelectorAll('.v35-history-moments')]:[];
  containers.forEach(container=>{
    if([...container.children].some(isTarget))return;
    const card=makeCard();
    insertChronological(container,card);
    patchCard(card);
  });
}
let timer=0;
function schedule(ms=0){
  clearTimeout(timer);
  timer=setTimeout(()=>{ensure();setTimeout(ensure,120);setTimeout(ensure,420);setTimeout(ensure,1000);},ms);
}
window.addEventListener('hashchange',()=>schedule(30));
document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab],button,[data-route]'))schedule(70)},true);
const root=document.querySelector('#screen')||document.body;
new MutationObserver(()=>schedule(45)).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});else schedule(30);
})();