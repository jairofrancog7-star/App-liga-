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
    if(!content||content.querySelector('[data-v74-facebook-source="history"]'))return;
    /* Las fuentes externas van al final: primero se conserva todo el diseño nativo de Historia. */
    content.appendChild(card('history'));
  }

  function mountNews(){
    const screen=document.querySelector('#screen');
    if(!screen||screen.querySelector('[data-v74-facebook-source="news"]'))return;
    const title=[...screen.querySelectorAll('h1')].find(h=>(h.textContent||'').trim()==='Noticias');
    if(!title)return;
    /* Noticias mantiene primero su contenido propio; la fuente queda como bloque de respaldo al final. */
    screen.appendChild(card('news'));
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
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
})();