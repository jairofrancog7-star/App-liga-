/* V74 — Facebook oficial como fuente visible de la Liga.
   No inventa campeones ni datos históricos: enlaza la fuente y deja preparada la app para contenido verificado. */
(function(){
  'use strict';
  if(window.__LJR_V74_FACEBOOK_SOURCE__)return;
  window.__LJR_V74_FACEBOOK_SOURCE__=true;

  const FB='https://www.facebook.com/share/19SsGuzsRi/';
  const route=()=>location.hash.replace(/^#\//,'').split('?')[0]||'home';

  function openFacebook(){
    window.open(FB,'_blank','noopener,noreferrer');
  }

  function shareFacebook(){
    const data={title:'Liga Municipal de Fútbol Juventino Rosas',text:'Facebook de la Liga Municipal de Fútbol Juventino Rosas',url:FB};
    if(navigator.share){navigator.share(data).catch(()=>{});return;}
    navigator.clipboard?.writeText(FB).catch(()=>{});
  }

  function card(kind){
    const el=document.createElement('section');
    el.className='v74-facebook-source';
    el.dataset.v74FacebookSource=kind||'source';
    el.innerHTML=
      '<div class="v74-fb-icon" aria-hidden="true">f</div>'+
      '<div class="v74-fb-copy">'+
        '<small>FUENTE DE LA LIGA</small>'+
        '<h3>Facebook oficial</h3>'+
        '<p>Tablas, calendarios, avisos, campeones, finales, historia y fotografías publicadas por la Liga.</p>'+
        '<div class="v74-fb-tags"><span>Tablas</span><span>Calendarios</span><span>Avisos</span><span>Campeones</span><span>Historia</span></div>'+
      '</div>'+
      '<div class="v74-fb-actions">'+
        '<button type="button" data-v74-open>Ver publicaciones</button>'+
        '<button type="button" data-v74-share>Compartir</button>'+
      '</div>';
    el.querySelector('[data-v74-open]')?.addEventListener('click',openFacebook);
    el.querySelector('[data-v74-share]')?.addEventListener('click',shareFacebook);
    return el;
  }

  function mountHistory(){
    const root=document.querySelector('.v35-history-page');
    const content=root?.querySelector('[data-v35-content]');
    if(!content)return;

    /* V367: la fuente de Facebook pertenece al contenido inferior de la
       pestaña activa. Nunca debe quedar por encima de Finales/Campeones/etc. */
    const panel=content.querySelector('.v351-history-panel.is-active:not([hidden])')||
      content.querySelector('.v351-history-panel.is-active')||content;
    let source=content.querySelector('[data-v74-facebook-source="history"]');
    if(!source)source=card('history');
    if(source.parentElement!==panel||source!==panel.lastElementChild)panel.appendChild(source);
  }

  function mountNews(){
    const screen=document.querySelector('#screen');
    if(!screen)return;

    /* V771: Noticias usa un solo bloque social. Elimina la tarjeta antigua
       "Fuente de la Liga" y mete sus acciones dentro del diseño SÍGUENOS. */
    screen.querySelectorAll('[data-v74-facebook-source="news"]').forEach(n=>n.remove());

    const social=screen.querySelector('[data-v412-screen="news"] .v412-news-socials');
    if(!social||social.querySelector('[data-v74-news-merged]'))return;

    const extra=document.createElement('div');
    extra.className='v74-news-merged';
    extra.dataset.v74NewsMerged='1';
    extra.innerHTML=
      '<p class="v74-news-source-copy">Facebook oficial · Tablas, calendarios, avisos, campeones, finales, historia y fotografías de la Liga.</p>'+
      '<div class="v74-news-tags"><span>Tablas</span><span>Calendarios</span><span>Avisos</span><span>Campeones</span><span>Historia</span></div>'+
      '<div class="v74-news-actions">'+
        '<button type="button" data-v74-open>Ver publicaciones</button>'+
        '<button type="button" data-v74-share>Compartir</button>'+
      '</div>';
    extra.querySelector('[data-v74-open]')?.addEventListener('click',openFacebook);
    extra.querySelector('[data-v74-share]')?.addEventListener('click',shareFacebook);
    social.appendChild(extra);
  }

  function mountTools(){
    const screen=document.querySelector('#screen');
    if(!screen||screen.querySelector('[data-v74-facebook-source="tools"]'))return;
    const page=screen.querySelector('.v60-tool-page');
    if(!page)return;
    const text=(page.textContent||'').toLowerCase();
    if(!text.includes('herramientas')&&!text.includes('liga completa'))return;
    /* Las fuentes/portales no desplazan herramientas principales: siempre quedan hasta abajo. */
    page.appendChild(card('tools'));
  }

  function mount(){
    const r=route();
    if(r==='history')mountHistory();
    else if(r==='news')mountNews();
    else if(r==='leagueTools')mountTools();
  }

  let raf=0;
  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(()=>{raf=0;mount();});
  }

  window.addEventListener('hashchange',schedule);
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-v35-tab]'))window.setTimeout(schedule,0);
  },true);
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
})();