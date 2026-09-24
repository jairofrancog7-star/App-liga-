/* V294 — hard-fix Campeones · 14 abr 2015 · Juventus.
   Guarantees that the card is visible in Historia > Campeones even if later renderers rebuild the tab. */
(function(){
  'use strict';
  if(window.__LJR_V283_COPA_2015__) return;
  window.__LJR_V283_COPA_2015__=true;

  const PHOTO='./assets/history/archive-v279/campeones-copa-14-abr-2015.jpg?v=20260923-juventus-copa-14abr2015-v294';

  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  }
  function isTarget(card){
    const t=norm(card && card.textContent);
    return t.includes('14 abr 2015') && t.includes('campeon') && t.includes('copa');
  }
  function onChampionsTab(){
    const active=document.querySelector('.v35-tab.active');
    return norm(active?.textContent).includes('campeones');
  }
  function style(){
    if(document.getElementById('v283-copa-2015-style')) return;
    const s=document.createElement('style');
    s.id='v283-copa-2015-style';
    s.textContent=`
      .v283-copa-2015{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        display:block!important;
        visibility:visible!important;
        opacity:1!important;
        min-height:360px!important;
        background-color:#07075d!important;
        background-image:linear-gradient(180deg,rgba(3,6,50,.02) 0%,rgba(3,6,50,.12) 36%,rgba(3,6,50,.48) 72%,rgba(3,6,50,.88) 100%),url("${PHOTO}")!important;
        background-size:cover!important;
        background-position:center 46%!important;
        background-repeat:no-repeat!important;
      }
      .v283-copa-2015>.v283-copa-2015-photo{
        position:absolute!important;
        inset:0!important;
        z-index:0!important;
        width:100%!important;
        height:100%!important;
        min-width:100%!important;
        min-height:100%!important;
        object-fit:cover!important;
        object-position:center 46%!important;
        display:block!important;
        visibility:visible!important;
        opacity:1!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:inherit!important;
        pointer-events:none!important;
      }
      .v283-copa-2015>.v283-copa-2015-shade{
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        background:linear-gradient(180deg,rgba(2,7,55,.02) 0%,rgba(2,7,55,.12) 34%,rgba(2,7,55,.50) 72%,rgba(2,7,55,.90) 100%)!important;
      }
      .v283-copa-2015>.v35-history-moment-content,
      .v283-copa-2015>.v35-champion-content{
        position:relative!important;
        z-index:2!important;
        background:transparent!important;
        background-image:none!important;
      }
      .v283-copa-2015 .v35-history-kind,
      .v283-copa-2015 .v35-history-date,
      .v283-copa-2015 h3,
      .v283-copa-2015 h4,
      .v283-copa-2015 strong,
      .v283-copa-2015 b,
      .v283-copa-2015 p,
      .v283-copa-2015 span,
      .v283-copa-2015 time{
        text-shadow:0 2px 6px rgba(0,0,0,.82);
      }
    `;
    document.head.appendChild(s);
  }
  function photo(){
    const img=document.createElement('img');
    img.className='v283-copa-2015-photo';
    img.src=PHOTO;
    img.alt='Juventus · Campeón de Copa · 14 abr 2015';
    img.loading='eager';
    img.decoding='async';
    return img;
  }
  function shade(){
    const x=document.createElement('span');
    x.className='v283-copa-2015-shade';
    x.setAttribute('aria-hidden','true');
    return x;
  }
  function makeCard(){
    const a=document.createElement('article');
    a.className='v35-history-moment v35-history-moment-photo v283-copa-2015';
    a.dataset.v283Copa2015='1';
    a.appendChild(photo());
    a.appendChild(shade());
    const c=document.createElement('div');
    c.className='v35-history-moment-content';
    c.innerHTML=
      '<div class="v35-history-meta"><span class="v35-history-kind">CAMPEÓN</span><time class="v35-history-date">14 abr 2015</time></div>'+
      '<h3>Juventus</h3>'+
      '<strong>Campeón de Copa</strong>'+
      '<div class="v35-history-status"><span><b>Ganador</b>Juventus</span><span><b>Fecha</b>14 abr 2015</span><span><b>Temporada</b>2015</span></div>'+
      '<p>Publicación histórica del 14 de abril de 2015: “Los campeones de copa”. El equipo campeón es Juventus.</p>';
    a.appendChild(c);
    return a;
  }
  function forceExisting(){
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
      if(!isTarget(card)) return;
      card.classList.add('v283-copa-2015');
      // v294-title-fix: correct the historical team name in an already-rendered card.
      const title=card.querySelector('h3');
      if(title) title.textContent='Juventus';
      card.querySelectorAll('.v35-history-status span').forEach(span=>{
        const label=norm(span.querySelector('b')?.textContent);
        if(label==='ganador') span.childNodes[span.childNodes.length-1].textContent='Juventus';
      });
      card.style.setProperty('display','block','important');
      card.style.setProperty('visibility','visible','important');
      card.style.setProperty('opacity','1','important');
      card.style.setProperty('background-image','linear-gradient(180deg,rgba(3,6,50,.02),rgba(3,6,50,.88)),url("'+PHOTO+'")','important');
      card.style.setProperty('background-size','cover','important');
      card.style.setProperty('background-position','center 46%','important');
      if(!card.querySelector(':scope > .v283-copa-2015-photo')){
        const old=card.querySelector(':scope > .v35-history-bg-photo,:scope > .v35-champion-bg-photo,:scope > .v120-exact-event-bg');
        if(old) old.remove();
        card.prepend(photo());
        const sh=shade();
        card.insertBefore(sh,card.children[1]||null);
      }
    });
  }
  function insertChronological(container,node){
    const children=[...container.children];
    const jan2015=children.find(el=>{
      const t=norm(el.textContent);
      return t.includes('18 ene 2015') || t.includes('11 ene 2015');
    });
    if(jan2015) container.insertBefore(node,jan2015);
    else container.appendChild(node);
  }
  function ensure(){
    if((location.hash||'').indexOf('history')<0) return;
    style();
    forceExisting();
    if(!onChampionsTab()) return;

    const containers=[...document.querySelectorAll('.v35-history-archive-compact .v35-history-moments,.v35-tab-body + .v35-history-archive .v35-history-moments')];
    containers.forEach(container=>{
      if([...container.children].some(isTarget)) return;
      insertChronological(container,makeCard());
    });
  }

  let timer=0;
  function schedule(delay){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      ensure();
      setTimeout(ensure,80);
      setTimeout(ensure,260);
      setTimeout(ensure,700);
    },delay||0);
  }

  window.addEventListener('hashchange',()=>schedule(30));
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(80);
  },true);

  const root=document.querySelector('#screen')||document.body;
  new MutationObserver(()=>schedule(40)).observe(root,{childList:true,subtree:true});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});
  }else{
    schedule(60);
  }
})();