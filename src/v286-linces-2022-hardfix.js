/* V308 — Linces · Primer lugar de tabla general 2022 · Primera Fuerza · 10 abr 2022.
   Card belongs only to Historia > Campeones and uses the uploaded team photo as background. */
(function(){
  'use strict';
  if(window.__LJR_V286_LINCES_2022__) return;
  window.__LJR_V286_LINCES_2022__=true;

  const PHOTO='./assets/history/archive-v286/linces-primer-lugar-tabla-general-2022-primera.jpg?v=20260924-linces-upload-exact-v308';

  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

  function isTarget(card){
    const t=norm(card&&card.textContent);
    return t.includes('linces')&&t.includes('2022')&&t.includes('primer lugar')&&t.includes('tabla general');
  }
  function onChampions(){
    return norm(document.querySelector('.v35-tab.active')?.textContent).includes('campeones');
  }
  function ensureStyle(){
    if(document.getElementById('v286-linces-2022-style')) return;
    const s=document.createElement('style');
    s.id='v286-linces-2022-style';
    s.textContent=`
      .v286-linces-2022{
        position:relative!important;overflow:hidden!important;isolation:isolate!important;
        display:block!important;visibility:visible!important;opacity:1!important;min-height:360px!important;
        background-color:#07075d!important;
        background-image:linear-gradient(180deg,rgba(3,6,50,.02) 0%,rgba(3,6,50,.10) 36%,rgba(3,6,50,.46) 72%,rgba(3,6,50,.88) 100%),url("${PHOTO}")!important;
        background-size:cover!important;background-position:center 48%!important;background-repeat:no-repeat!important;
      }
      .v286-linces-2022>.v286-linces-2022-photo{
        position:absolute!important;inset:0!important;z-index:0!important;width:100%!important;height:100%!important;
        object-fit:cover!important;object-position:center 48%!important;display:block!important;visibility:visible!important;opacity:1!important;
        margin:0!important;padding:0!important;border:0!important;border-radius:inherit!important;pointer-events:none!important;
      }
      .v286-linces-2022>.v286-linces-2022-shade{
        position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;
        background:linear-gradient(180deg,rgba(2,7,55,.01) 0%,rgba(2,7,55,.10) 38%,rgba(2,7,55,.48) 72%,rgba(2,7,55,.90) 100%)!important;
      }
      .v286-linces-2022>.v35-history-moment-content{position:relative!important;z-index:2!important;background:transparent!important;}
      .v286-linces-2022 .v35-history-kind,.v286-linces-2022 .v35-history-date,.v286-linces-2022 h3,
      .v286-linces-2022 strong,.v286-linces-2022 b,.v286-linces-2022 p,.v286-linces-2022 span,.v286-linces-2022 time{
        text-shadow:0 2px 6px rgba(0,0,0,.82);
      }
    `;
    document.head.appendChild(s);
  }
  function photo(){
    const img=document.createElement('img');
    img.className='v286-linces-2022-photo';
    img.src=PHOTO;
    img.alt='Linces · Primer lugar de tabla general 2022 · Primera Fuerza · 10 abr 2022';
    img.loading='eager'; img.decoding='async';
    return img;
  }
  function shade(){
    const s=document.createElement('span');
    s.className='v286-linces-2022-shade'; s.setAttribute('aria-hidden','true'); return s;
  }
  function makeCard(){
    const a=document.createElement('article');
    a.className='v35-history-moment v35-history-moment-photo v286-linces-2022';
    a.dataset.v286Linces2022='1';
    a.appendChild(photo()); a.appendChild(shade());
    const c=document.createElement('div');
    c.className='v35-history-moment-content';
    c.innerHTML=
      '<div class="v35-history-meta"><span class="v35-history-kind">PRIMER LUGAR</span><time class="v35-history-date">10 abr 2022</time></div>'+
      '<h3>Linces</h3>'+
      '<strong>Primer lugar de tabla general · Primera Fuerza</strong>'+
      '<div class="v35-history-status"><span><b>Fecha</b>10 abr 2022</span><span><b>Temporada</b>2022</span></div>'+
      '<p>Linces. Primer lugar de tabla general 2022, Primera Fuerza. Fecha exacta: 10 de abril de 2022.</p>';
    a.appendChild(c); return a;
  }
  function patchExisting(){
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
      if(!isTarget(card)) return;
      card.classList.add('v286-linces-2022');
      const dateEl=card.querySelector('.v35-history-date,.v35-champion-date,time');
      if(dateEl) dateEl.textContent='10 abr 2022';
      if(!card.querySelector(':scope > .v286-linces-2022-photo')){
        card.querySelector(':scope > .v35-history-bg-photo,:scope > .v120-exact-event-bg')?.remove();
        card.prepend(photo());
        card.insertBefore(shade(),card.children[1]||null);
      }
    });
  }
  function insertAt2022End(container,node){
    const kids=[...container.children];
    const first2021=kids.find(el=>norm(el.textContent).includes('2021'));
    if(first2021) container.insertBefore(node,first2021);
    else container.appendChild(node);
  }
  function ensure(){
    if((location.hash||'').indexOf('history')<0) return;
    ensureStyle(); patchExisting();
    if(!onChampions()) return;
    const containers=[...new Set(document.querySelectorAll('.v35-history-archive-compact .v35-history-moments,.v35-tab-body + .v35-history-archive .v35-history-moments,[data-v35-content] .v35-history-moments'))];
    containers.forEach(container=>{
      if([...container.children].some(isTarget)) return;
      insertAt2022End(container,makeCard());
    });
  }
  let timer=0;
  function schedule(ms=0){
    clearTimeout(timer); timer=setTimeout(()=>{ensure();setTimeout(ensure,100);setTimeout(ensure,350);},ms);
  }
  window.addEventListener('hashchange',()=>schedule(30));
  document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab],button,[data-route]'))schedule(80)},true);
  const root=document.querySelector('#screen')||document.body;
  new MutationObserver(()=>schedule(50)).observe(root,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});else schedule(60);
})();