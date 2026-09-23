/* V290 — Abejas Pozos · Campeón de Copa 2014.
   Foto exacta aportada por el usuario como fondo de la tarjeta de Campeones. */
(function(){
'use strict';
if(window.__LJR_V290_ABEJAS_BG__)return;
window.__LJR_V290_ABEJAS_BG__=true;

const TITLE='Abejas Pozos';
const BG='./assets/history/archive-v290/abejas-pozos-campeon-copa-primera-22-feb-2014.webp?v=20260923-abejas-photo-v290';

function route(){return (location.hash||'#/home').replace(/^#\/?/,'').split('?')[0]||'home'}
function activeTab(){return document.querySelector('.v35-tab.active')?.textContent?.trim()||'Resumen'}

function photo(){
  const img=document.createElement('img');
  img.className='v35-history-bg-photo v35-bg-exact v290-abejas-bg';
  img.src=BG;
  img.alt='Trofeo de Abejas Pozos · Campeón de Copa 2014 · Primera Fuerza';
  img.loading='eager';
  img.decoding='async';
  return img;
}
function shade(){
  const d=document.createElement('div');
  d.className='v35-history-moment-shade';
  d.setAttribute('aria-hidden','true');
  return d;
}
function build(){
  const a=document.createElement('article');
  a.className='v35-history-moment v35-history-moment-photo v287-abejas-final v290-abejas-photo-card';
  a.appendChild(photo());
  a.appendChild(shade());
  const c=document.createElement('div');
  c.className='v35-history-moment-content';
  c.innerHTML=
    '<div class="v35-history-meta"><span class="v35-history-kind">CAMPEÓN</span><time class="v35-history-date">22 feb 2014</time></div>'+
    '<h3>'+TITLE+'</h3>'+
    '<strong>Campeón de Copa · Primera Fuerza</strong>'+
    '<div class="v35-history-status"><span><b>Ganador</b>Abejas Pozos</span><span><b>Temporada</b>2014</span></div>'+
    '<p>Abejas Pozos ganó la Gran Final del Torneo de Copa 2014 de Primera Fuerza frente a Juventus FC Jr.</p>';
  a.appendChild(c);
  return a;
}
function fixCard(card){
  if(!card)return;
  card.classList.add('v35-history-moment-photo','v287-abejas-final','v290-abejas-photo-card');
  card.classList.remove('v35-history-moment-reference');
  card.querySelectorAll('.v286-winner-trophy,.v287-abejas-trophy').forEach(n=>n.remove());

  let bg=card.querySelector('.v290-abejas-bg');
  if(!bg){
    card.querySelectorAll(':scope > .v35-history-bg-photo').forEach(n=>n.remove());
    bg=photo();
    card.prepend(bg);
  }else{
    bg.src=BG;
  }

  let sh=card.querySelector(':scope > .v35-history-moment-shade');
  if(!sh){
    sh=shade();
    bg.insertAdjacentElement('afterend',sh);
  }

  const kind=card.querySelector('.v35-history-kind'); if(kind)kind.textContent='CAMPEÓN';
  const date=card.querySelector('.v35-history-date'); if(date)date.textContent='22 feb 2014';
  const h3=card.querySelector('h3'); if(h3)h3.textContent=TITLE;
  const sub=card.querySelector('.v35-history-moment-content>strong'); if(sub)sub.textContent='Campeón de Copa · Primera Fuerza';

  let status=card.querySelector('.v35-history-status');
  if(!status){
    status=document.createElement('div');
    status.className='v35-history-status';
    (sub||h3).insertAdjacentElement('afterend',status);
  }
  status.innerHTML='<span><b>Ganador</b>Abejas Pozos</span><span><b>Temporada</b>2014</span>';

  const p=card.querySelector('.v35-history-moment-content>p');
  if(p)p.textContent='Abejas Pozos ganó la Gran Final del Torneo de Copa 2014 de Primera Fuerza frente a Juventus FC Jr.';
}
function ensure(){
  if(route()!=='history')return;
  const tab=activeTab();
  if(tab!=='Resumen'&&tab!=='Campeones'&&tab!=='Finales')return;

  let cards=[...document.querySelectorAll('.v35-history-moment')].filter(c=>
    c.textContent.includes('Abejas Pozos')&&c.textContent.includes('22 feb 2014')
  );
  if(!cards.length){
    const hosts=[...document.querySelectorAll('.v35-history-moments')];
    const host=hosts[hosts.length-1]||null;
    if(host){const card=build();host.appendChild(card);cards=[card]}
  }
  cards.forEach(fixCard);
}
function installStyle(){
  if(document.getElementById('v290-abejas-bg-style'))return;
  const s=document.createElement('style');
  s.id='v290-abejas-bg-style';
  s.textContent=`
    .v35-history-moment.v290-abejas-photo-card{
      position:relative!important;
      display:flex!important;
      align-items:flex-end!important;
      min-height:300px!important;
      height:300px!important;
      padding:0!important;
      overflow:hidden!important;
      border:1px solid rgba(44,208,243,.52)!important;
      border-radius:18px!important;
      background:#07075d!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 8px 20px rgba(0,0,58,.18)!important;
    }
    .v290-abejas-photo-card::after{display:none!important}
    .v290-abejas-photo-card>.v290-abejas-bg{
      display:block!important;
      visibility:visible!important;
      opacity:1!important;
      position:absolute!important;
      inset:0!important;
      z-index:0!important;
      width:100%!important;
      height:100%!important;
      max-width:none!important;
      max-height:none!important;
      object-fit:cover!important;
      object-position:center 34%!important;
      filter:saturate(1.04) contrast(1.02) brightness(.88)!important;
      transform:none!important;
    }
    .v290-abejas-photo-card>.v35-history-moment-shade{
      display:block!important;
      position:absolute!important;
      inset:0!important;
      z-index:1!important;
      background:
        linear-gradient(180deg,rgba(2,6,47,.03) 0%,rgba(2,6,47,.09) 34%,rgba(2,6,47,.58) 69%,rgba(2,6,47,.91) 100%),
        linear-gradient(90deg,rgba(2,6,47,.18),rgba(2,6,47,.02) 70%)!important;
      pointer-events:none!important;
    }
    .v290-abejas-photo-card>.v35-history-moment-content{
      position:relative!important;
      z-index:2!important;
      width:100%!important;
      min-height:0!important;
      padding:15px 15px 14px!important;
      text-shadow:0 2px 10px rgba(0,0,0,.72)!important;
    }
    .v290-abejas-photo-card .v35-history-meta{margin:0 0 6px!important;gap:6px!important}
    .v290-abejas-photo-card .v35-history-kind,
    .v290-abejas-photo-card .v35-history-date{min-height:22px!important;font-size:8px!important}
    .v290-abejas-photo-card h3{
      margin:0!important;
      max-width:100%!important;
      font-size:clamp(24px,6.2vw,32px)!important;
      line-height:1.01!important;
      color:#fff!important;
    }
    .v290-abejas-photo-card .v35-history-moment-content>strong{
      margin-top:4px!important;
      font-size:11px!important;
      line-height:1.18!important;
      color:#fff!important;
    }
    .v290-abejas-photo-card .v35-history-status{
      grid-template-columns:1fr 1fr!important;
      gap:6px!important;
      margin:8px 0 0!important;
    }
    .v290-abejas-photo-card .v35-history-status span{
      min-height:42px!important;
      padding:7px 8px!important;
      border-radius:10px!important;
      background:rgba(4,12,78,.38)!important;
      border-color:rgba(62,231,242,.48)!important;
      backdrop-filter:blur(2px)!important;
      -webkit-backdrop-filter:blur(2px)!important;
    }
    .v290-abejas-photo-card p{
      margin:7px 0 0!important;
      max-width:100%!important;
      font-size:9.5px!important;
      line-height:1.3!important;
      color:#eef1ff!important;
    }
    @media(max-width:390px){
      .v35-history-moment.v290-abejas-photo-card{min-height:280px!important;height:280px!important}
      .v290-abejas-photo-card>.v35-history-moment-content{padding:13px 13px 12px!important}
      .v290-abejas-photo-card .v35-history-status{grid-template-columns:1fr 1fr!important}
    }`;
  document.head.appendChild(s);
}

let raf=0;
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{installStyle();ensure()})}
window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab]'))setTimeout(schedule,0)},true);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();