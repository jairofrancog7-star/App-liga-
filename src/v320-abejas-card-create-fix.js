/* V320 — complemento del V318 Abejas.
   El V318 pinta/fija el fondo, pero no creaba la tarjeta si no existía.
   Este archivo SOLO crea una tarjeta Abejas faltante en Historia > Campeones. */
(function(){
  'use strict';
  if(window.__V320_ABEJAS_CARD_CREATE__) return;
  window.__V320_ABEJAS_CARD_CREATE__=true;

  const norm=v=>String(v||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/\s+/g,' ').trim();

  function isTarget(card){
    const h=norm(card?.querySelector?.('h3,h4')?.textContent||'');
    const all=norm(card?.textContent||'');
    return h==='abejas' &&
      all.includes('03 nov 2019') &&
      all.includes('tercer lugar') &&
      (all.includes('2018-2019') || all.includes('2018–2019'));
  }

  function onHistory(){
    return /history|safe-about/.test(location.hash||'');
  }

  function onChampions(){
    const active=document.querySelector('.v35-tab.active,[data-v35-tab].active');
    if(active) return norm(active.textContent).includes('campeones');
    return true;
  }

  function makeCard(){
    const card=document.createElement('article');
    card.className='v35-history-moment v35-history-moment-photo v320-abejas-created';
    card.dataset.v320AbejasCreated='1';

    const content=document.createElement('div');
    content.className='v35-history-moment-content';
    content.innerHTML=
      '<div class="v35-history-meta">'+
        '<span class="v35-history-kind">TERCER LUGAR</span>'+
        '<time class="v35-history-date">03 nov 2019</time>'+
      '</div>'+
      '<h3>Abejas</h3>'+
      '<strong>Tercer lugar · Primera Fuerza</strong>'+
      '<div class="v35-history-status">'+
        '<span><b>Temporada</b>2018–2019</span>'+
      '</div>'+
      '<p>Equipo Abejas · tercer lugar de la temporada 2018–2019 · Primera Fuerza.</p>';

    card.appendChild(content);
    return card;
  }

  function parseDate(el){
    const t=norm(el?.textContent||'');
    const months={ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,oct:9,nov:10,dic:11};
    const m=t.match(/(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\s+(20\d{2})/);
    return m?Date.UTC(Number(m[3]),months[m[2]],Number(m[1])):null;
  }

  function insertChronological(container,node){
    const target=Date.UTC(2019,10,3);
    const before=[...container.children].find(el=>{
      const ts=parseDate(el);
      return ts!==null && ts<target;
    });
    if(before) container.insertBefore(node,before);
    else container.appendChild(node);
  }

  function findContainer(){
    const content=document.querySelector('[data-v35-content]');
    if(!content) return null;
    return content.querySelector('.v35-history-archive-compact .v35-history-moments') ||
           content.querySelector('.v35-history-moments');
  }

  function ensure(){
    if(!onHistory() || !onChampions()) return;

    const existing=[...document.querySelectorAll(
      '.v35-history-moment,.v35-champion-card,.v115-card,article'
    )].filter(isTarget);

    if(existing.length){
      existing.slice(1).forEach(n=>n.remove());
      return;
    }

    const container=findContainer();
    if(!container) return;

    insertChronological(container,makeCard());
    // El MutationObserver de V318 detecta esta inserción y aplica la foto/fondo.
    window.dispatchEvent(new Event('resize'));
  }

  let timer=0;
  function schedule(ms=0){
    clearTimeout(timer);
    timer=setTimeout(()=>{
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

  new MutationObserver(()=>schedule(45))
    .observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});
  }else{
    schedule(30);
  }
})();