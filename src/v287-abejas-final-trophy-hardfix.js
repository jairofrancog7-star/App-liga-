/* V287 — Abejas Pozos campeón de Copa 2014.
   Asegura la tarjeta, muestra el trofeo grande y reduce su altura vertical. */
(function(){
'use strict';
if(window.__LJR_V287_ABEJAS_FINAL__)return;
window.__LJR_V287_ABEJAS_FINAL__=true;
const TITLE='Abejas Pozos vs Juventus FC Jr.';
const TROPHY='./assets/reference/final-trophy-drive.png?v=20260923-abejas-trophy-v287';
function route(){return (location.hash||'#/home').replace(/^#\/?/,'').split('?')[0]||'home'}
function activeTab(){return document.querySelector('.v35-tab.active')?.textContent?.trim()||'Resumen'}
function build(){
  const a=document.createElement('article');
  a.className='v35-history-moment v287-abejas-final';
  a.innerHTML=
    '<img class="v287-abejas-trophy" src="'+TROPHY+'" alt="Trofeo de la final de Copa 2014">'+
    '<div class="v35-history-moment-content">'+
      '<div class="v35-history-meta"><span class="v35-history-kind">FINAL</span><time class="v35-history-date">22 feb 2014</time></div>'+
      '<h3>'+TITLE+'</h3>'+
      '<strong>Gran Final · Torneo de Copa 2014 · Primera Fuerza</strong>'+
      '<div class="v35-history-status"><span><b>Ganador</b>Abejas Pozos</span><span><b>Temporada</b>2014</span></div>'+
      '<p>Abejas Pozos ganó la Gran Final de Copa 2014 de Primera Fuerza frente a Juventus FC Jr.</p>'+
    '</div>';
  return a;
}
function fixCard(card){
  if(!card)return;
  card.classList.add('v287-abejas-final');
  card.classList.remove('v35-history-moment-photo','v35-history-moment-reference');
  card.querySelectorAll('.v286-winner-trophy').forEach(n=>n.remove());
  let trophy=card.querySelector('.v287-abejas-trophy');
  if(!trophy){
    trophy=document.createElement('img');
    trophy.className='v287-abejas-trophy';
    trophy.src=TROPHY;
    trophy.alt='Trofeo de la final de Copa 2014';
    card.prepend(trophy);
  }
  const kind=card.querySelector('.v35-history-kind'); if(kind)kind.textContent='FINAL';
  const date=card.querySelector('.v35-history-date'); if(date)date.textContent='22 feb 2014';
  const h3=card.querySelector('h3'); if(h3)h3.textContent=TITLE;
  const sub=card.querySelector('.v35-history-moment-content>strong'); if(sub)sub.textContent='Gran Final · Torneo de Copa 2014 · Primera Fuerza';
  let status=card.querySelector('.v35-history-status');
  if(!status){
    status=document.createElement('div');
    status.className='v35-history-status';
    (sub||h3).insertAdjacentElement('afterend',status);
  }
  status.innerHTML='<span><b>Ganador</b>Abejas Pozos</span><span><b>Temporada</b>2014</span>';
  const p=card.querySelector('.v35-history-moment-content>p');
  if(p)p.textContent='Abejas Pozos ganó la Gran Final de Copa 2014 de Primera Fuerza frente a Juventus FC Jr.';
}
function ensure(){
  if(route()!=='history')return;
  const tab=activeTab();
  if(tab!=='Resumen'&&tab!=='Finales')return;
  let cards=[...document.querySelectorAll('.v35-history-moment')].filter(c=>c.textContent.includes(TITLE));
  if(!cards.length){
    const host=document.querySelector('.v35-history-moments');
    if(host){const card=build();host.appendChild(card);cards=[card]}
  }
  cards.forEach(fixCard);
}
function installStyle(){
  if(document.getElementById('v287-abejas-style'))return;
  const s=document.createElement('style');
  s.id='v287-abejas-style';
  s.textContent=`
    .v35-history-moment.v287-abejas-final{
      position:relative!important;display:block!important;min-height:0!important;height:auto!important;
      padding:14px 110px 13px 15px!important;overflow:hidden!important;
      border:1px solid rgba(44,208,243,.50)!important;border-radius:18px!important;
      background:linear-gradient(145deg,#162b9a 0%,#101d78 58%,#0b1261 100%)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 8px 20px rgba(0,0,58,.16)!important
    }
    .v287-abejas-final .v35-history-moment-shade,.v287-abejas-final::after{display:none!important}
    .v287-abejas-final .v35-history-moment-content{position:relative!important;z-index:2!important;min-height:0!important;padding:0!important;width:100%!important}
    .v287-abejas-final .v35-history-meta{margin:0 0 6px!important;gap:6px!important}
    .v287-abejas-final .v35-history-kind,.v287-abejas-final .v35-history-date{min-height:22px!important;font-size:8px!important}
    .v287-abejas-final h3{margin:0!important;max-width:100%!important;font-size:clamp(21px,5.5vw,29px)!important;line-height:1.02!important;letter-spacing:-.025em!important}
    .v287-abejas-final .v35-history-moment-content>strong{margin-top:4px!important;font-size:10.5px!important;line-height:1.18!important;color:#eef1ff!important}
    .v287-abejas-final .v35-history-status{grid-template-columns:1fr 1fr!important;gap:6px!important;margin:8px 0 0!important}
    .v287-abejas-final .v35-history-status span{min-height:44px!important;padding:7px 8px!important;border-radius:10px!important;font-size:9.5px!important;background:rgba(4,12,78,.30)!important}
    .v287-abejas-final .v35-history-status b{margin-bottom:3px!important;font-size:7px!important}
    .v287-abejas-final p{margin:7px 0 0!important;max-width:100%!important;font-size:9.5px!important;line-height:1.28!important;color:#d9def3!important}
    .v287-abejas-trophy{
      display:block!important;position:absolute!important;z-index:3!important;right:12px!important;top:50%!important;
      transform:translateY(-50%)!important;width:86px!important;height:118px!important;object-fit:contain!important;
      object-position:center!important;opacity:1!important;visibility:visible!important;
      filter:drop-shadow(0 7px 12px rgba(0,0,0,.38))!important;pointer-events:none!important
    }
    @media(max-width:390px){
      .v35-history-moment.v287-abejas-final{padding:12px 86px 11px 13px!important}
      .v287-abejas-trophy{right:8px!important;width:68px!important;height:96px!important}
      .v287-abejas-final h3{font-size:20px!important}
      .v287-abejas-final .v35-history-status{grid-template-columns:1fr!important}
      .v287-abejas-final .v35-history-status span{min-height:38px!important}
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