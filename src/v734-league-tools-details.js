/* V734 — Ver detalles funcional en Más herramientas. */
(function(){
  'use strict';
  if(window.__LJR_V734_TOOL_DETAILS__)return;
  window.__LJR_V734_TOOL_DETAILS__=true;

  function route(){
    return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'';
  }

  document.addEventListener('click',event=>{
    if(route()!=='leagueTools' || !(event.target instanceof Element))return;
    const btn=event.target.closest('[data-v734-tool-details]');
    if(!btn)return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const card=btn.closest('.v734-tool-card');
    if(!card)return;

    const willOpen=!card.classList.contains('is-v734-open');
    document.querySelectorAll('.v734-tool-card.is-v734-open').forEach(other=>{
      if(other===card)return;
      other.classList.remove('is-v734-open');
      const otherBtn=other.querySelector('[data-v734-tool-details]');
      const otherPanel=other.querySelector('.v734-tool-detail-panel');
      if(otherBtn){
        otherBtn.setAttribute('aria-expanded','false');
        const s=otherBtn.querySelector('span'); if(s)s.textContent='Ver detalles';
        const i=otherBtn.querySelector('i'); if(i)i.textContent='⌄';
      }
      if(otherPanel)otherPanel.hidden=true;
    });

    card.classList.toggle('is-v734-open',willOpen);
    btn.setAttribute('aria-expanded',willOpen?'true':'false');
    const panel=card.querySelector('.v734-tool-detail-panel');
    if(panel)panel.hidden=!willOpen;
    const label=btn.querySelector('span');
    const icon=btn.querySelector('i');
    if(label)label.textContent=willOpen?'Ocultar detalles':'Ver detalles';
    if(icon)icon.textContent=willOpen?'⌃':'⌄';

    if(willOpen){
      requestAnimationFrame(()=>{
        card.scrollIntoView({block:'nearest',behavior:'smooth'});
      });
    }
  },true);
})();