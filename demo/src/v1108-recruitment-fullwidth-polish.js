/* V1108 — Reclutamiento: mejorar textos e iconos sin sustituir formularios ni eventos. */
(()=>{
  'use strict';
  if(window.__LJR_V1108_RECRUIT_UI__)return;
  window.__LJR_V1108_RECRUIT_UI__=true;

  const NS='http://www.w3.org/2000/svg';
  const glyphs={
    cms:'<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 9h8M8 13h6M8 17h5"/>',
    edit:'<path d="M12 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6"/><path d="m9 15 8.5-8.5a2 2 0 0 1 2.8 2.8L12 18l-4 1z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    photo:'<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><circle cx="9" cy="9" r="1"/><path d="m4.5 17 5-5 3.5 3 3-3 4 4"/>',
    shield:'<path d="M12 2.8 20 6v5.6c0 5.1-3.3 8-8 9.7-4.7-1.7-8-4.6-8-9.7V6z"/><path d="M9 10h6M12 7v6"/>',
    player:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5 21v-2.2a7 7 0 0 1 14 0V21"/>',
    team:'<path d="M3.5 19v-2c0-2.8 2-4.7 4.5-5.4"/><path d="M20.5 19v-2c0-2.8-2-4.7-4.5-5.4"/><circle cx="12" cy="8" r="3.3"/><path d="M5.5 21c0-4.2 2.6-6.3 6.5-6.3s6.5 2.1 6.5 6.3"/>'
  };
  function vector(name) {
    const svg=document.createElementNS(NS,'svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('fill','none');
    svg.setAttribute('stroke','currentColor');
    svg.setAttribute('stroke-width','1.8');
    svg.setAttribute('stroke-linecap','round');
    svg.setAttribute('stroke-linejoin','round');
    svg.setAttribute('aria-hidden','true');
    svg.innerHTML=glyphs[name]||glyphs.cms;
    return svg;
  }
  function currentRoute(){
    return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'';
  }
  function recruitmentActive(){
    return currentRoute()==='recruitment'||document.body?.dataset?.appRoute==='recruitment';
  }
  function enhanceControls(screen){
    const entry=screen.querySelector(':scope > .ljr-cms-entry');
    if(!entry)return;
    const actions=[
      ['data-cms-open','cms','Administrar contenido'],
      ['data-cms-edit-page','edit','Editar esta página'],
      ['data-cms-story','clock','Historia · 24 h'],
      ['data-cms-design','photo','Crear publicación']
    ];
    actions.forEach(([attribute,iconName,fallback])=>{
      const button=entry.querySelector('button['+attribute+']');
      if(!button||button.classList.contains('v1108-cms-link'))return;
      const originalLabel=String(button.textContent||'').trim()||fallback;
      const graphic=document.createElement('span');
      graphic.className='v1108-cms-icon';graphic.setAttribute('aria-hidden','true');
      graphic.appendChild(vector(iconName));
      const label=document.createElement('span');
      label.className='v1108-cms-title';label.textContent=originalLabel;
      const arrow=document.createElement('span');
      arrow.className='v1108-cms-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');
      // Conservar la instancia original de button: permisos, listeners y acciones intactos.
      button.replaceChildren(graphic,label,arrow);
      button.classList.add('v1108-cms-link');
      button.setAttribute('aria-label',originalLabel);
    });
  }
  function enhanceRecruitment(screen){
    const page=screen.querySelector('#v190-recruitment-page');
    if(!page||page.dataset.v1108Enhanced==='1')return;
    page.dataset.v1108Enhanced='1';
    const head=page.querySelector('.v100-head');
    if(head){
      const kicker=head.querySelector('small');
      const title=head.querySelector('h2');
      const info=head.querySelector('p');
      if(kicker)kicker.textContent='ALTAS Y RECLUTAMIENTO';
      if(title)title.textContent='Nuevos equipos y jugadores';
      if(info)info.textContent='Registra interesados y prepara una convocatoria en PNG para compartir.';
    }
    page.querySelectorAll('.v190-recruit-summary > span').forEach((card,index)=>{
      card.prepend(vector(index===0?'shield':'player'));
    });
    const cards=page.querySelectorAll('.v190-recruit-card');
    cards.forEach((card,index)=>{
      const icon=card.querySelector('header > span');
      const description=card.querySelector('header small');
      const save=card.querySelector('button[type="submit"]');
      if(icon)icon.replaceChildren(vector(index===0?'team':'player'));
      if(description)description.textContent=index===0?'Club interesado en competir en la Liga':'Futbolista que busca integrarse a un equipo';
      if(save)save.textContent=index===0?'Guardar equipo':'Guardar jugador';
    });
  }
  function upgrade(){
    if(!recruitmentActive())return;
    const screen=document.querySelector('#screen');
    if(!screen)return;
    enhanceControls(screen);
    enhanceRecruitment(screen);
  }
  function start(){
    const screen=document.querySelector('#screen');
    if(!screen)return;
    let pending=false;
    new MutationObserver(()=>{
      if(pending)return;
      pending=true;
      queueMicrotask(()=>{pending=false;upgrade();});
    }).observe(screen,{childList:true,subtree:true});
    upgrade();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  window.addEventListener('hashchange',()=>queueMicrotask(upgrade));
})();