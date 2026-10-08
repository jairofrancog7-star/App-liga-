/* V992 — Sólo Sobre la Liga (#/safe-about).
   Realza cuadros y habilita detalles sin tocar Historia, datos ni rutas. */
(function(){
  'use strict';
  if(window.__LJR_V992_ABOUT_CARDS__)return;
  window.__LJR_V992_ABOUT_CARDS__=true;

  const LOGO='./assets/liga-logo.webp';
  const TEAM_LOGOS=[
    [/^lobos\s*cdg$/i,'./assets/season-2026/lobos-cdg.webp'],
    [/^lobos\s*jrs?\.?$/i,'./assets/season-2026/lobos-jr-cerrito-gasca.webp'],
    [/^gal[aá]cticos/i,'./assets/season-2026/galacticos.webp'],
    [/^boavista/i,'./assets/history/team-logos/legacy-2015-boavista.webp']
  ];
  const expanded=new Set();
  let cardSeq=0,queued=false;

  function isAbout(){
    return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]==='safe-about';
  }
  function makeCrest(path,label,extraClass){
    const span=document.createElement('span');
    span.className='v992-crest '+(extraClass||'');
    const img=document.createElement('img');
    img.src=path;
    img.alt=label;
    img.loading='lazy';
    img.decoding='async';
    if(path!==LOGO)img.addEventListener('error',function(){
      if(img.dataset.v992Fallback)return;
      img.dataset.v992Fallback='1';
      img.src=LOGO;
      img.alt='Escudo de la Liga Municipal';
    },{once:true});
    span.appendChild(img);
    return span;
  }
  function teamLogo(title){
    for(const [pattern,path] of TEAM_LOGOS)if(pattern.test(title))return path;
    return LOGO;
  }
  function ensureLogo(article,kind){
    if(article.querySelector('.v992-crest'))return;
    const heading=article.querySelector('h3');
    const name=String(heading?.textContent||'').trim();
    const photo=article.querySelector(':scope > img');
    if(kind==='record'){
      // Mantener siempre escudos reales de cada campeón, pero almacenados en la app azul.
      const local=teamLogo(name);
      if(photo){
        if(local!==LOGO)photo.src=local;
        photo.classList.add('v992-original-crest');
        photo.addEventListener('error',function(){
          if(photo.dataset.v992Fallback)return;
          photo.dataset.v992Fallback='1';
          photo.src=LOGO;
          photo.alt='Escudo de la Liga Municipal';
        },{once:true});
        return;
      }
      article.insertBefore(makeCrest(local,local===LOGO?'Escudo de la Liga Municipal':'Escudo de '+name),article.firstChild);
      return;
    }
    if(kind==='timeline'){
      const time=article.querySelector(':scope > time');
      if(time)time.prepend(makeCrest(LOGO,'','v992-timeline-crest'));
      return;
    }
    article.insertBefore(makeCrest(LOGO,'','v992-mini-crest'),article.firstChild);
  }

  function ensureDetails(card,detail){
    if(!detail||!detail.textContent.trim()||card.querySelector('[data-v992-details]'))return;
    const title=card.querySelector('h3,h4,b')?.textContent?.trim()||'Registro';
    const id='v992-about-detail-'+(++cardSeq);
    const key=title+'|'+detail.textContent.trim().slice(0,100);
    card.dataset.v992Key=key;
    detail.id=id;
    detail.classList.add('v992-detail');
    const open=expanded.has(key);
    card.classList.toggle('v992-open',open);
    const button=document.createElement('button');
    button.type='button';
    button.className='v992-more';
    button.dataset.v992Details='';
    button.setAttribute('aria-controls',id);
    button.setAttribute('aria-expanded',String(open));
    button.innerHTML='<span>'+(open?'Ocultar detalles':'Ver más detalles')+'</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
    // En cronologías el botón pertenece al bloque de texto, no a la columna de fecha.
    const host=card.matches('.v33-about-timeline article')?card.querySelector(':scope > div'):card;
    (host||card).appendChild(button);
  }

  function enhance(){
    queued=false;
    if(!isAbout())return;
    const root=document.querySelector('.v33-about[data-v33-about]');
    if(!root)return;
    root.querySelectorAll('.v33-about-history-grid article').forEach(card=>{
      if(card.dataset.v992Card==='record')return;
      card.dataset.v992Card='record';
      card.classList.add('v992-card','v992-record');
      ensureLogo(card,'record');
      ensureDetails(card,card.querySelector(':scope > p'));
    });
    root.querySelectorAll('.v33-about-timeline article').forEach(card=>{
      if(card.dataset.v992Card==='timeline')return;
      card.dataset.v992Card='timeline';
      card.classList.add('v992-card','v992-timeline');
      ensureLogo(card,'timeline');
      ensureDetails(card,card.querySelector(':scope > div > p'));
    });
    root.querySelectorAll('.v33-about-format-grid article').forEach(card=>{
      if(card.dataset.v992Card==='format')return;
      card.dataset.v992Card='format';
      card.classList.add('v992-card','v992-format');
      ensureLogo(card,'small');
      ensureDetails(card,card.querySelector(':scope > p'));
    });
    root.querySelectorAll('.v33-about-board article').forEach(card=>{
      if(card.dataset.v992Card==='board')return;
      card.dataset.v992Card='board';
      card.classList.add('v992-card','v992-board');
      ensureLogo(card,'small');
    });
    root.querySelectorAll('.v33-about-history-facts > div').forEach(card=>{
      if(card.dataset.v992Card==='fact')return;
      card.dataset.v992Card='fact';
      card.classList.add('v992-card','v992-fact');
      ensureDetails(card,card.querySelector(':scope > span'));
    });
  }
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(enhance);
  }
  document.addEventListener('click',function(e){
    const btn=e.target.closest('[data-v992-details]');
    if(!btn||!isAbout())return;
    e.preventDefault();
    const card=btn.closest('.v992-card');
    if(!card)return;
    const next=!card.classList.contains('v992-open');
    card.classList.toggle('v992-open',next);
    if(next)expanded.add(card.dataset.v992Key);
    else expanded.delete(card.dataset.v992Key);
    btn.setAttribute('aria-expanded',String(next));
    btn.querySelector('span').textContent=next?'Ocultar detalles':'Ver más detalles';
  },true);
  function init(){
    const screen=document.querySelector('#screen');
    if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
    schedule();
  }
  window.addEventListener('hashchange',schedule);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();