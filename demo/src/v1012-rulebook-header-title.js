/* V1012 · Etiqueta exclusiva de Reglamento; mantiene los botones nativos. */
(()=>{
 'use strict';
 if(window.__LJR_V1012_RULEBOOK_HEADER__)return;
 window.__LJR_V1012_RULEBOOK_HEADER__=true;
 const route=()=>String(location.hash||'').replace('#/','').replace('#','').split('?')[0]||'home';
 function sync(){
  const bar=document.querySelector('#app>.topbar,.app-shell>.topbar');
  if(!bar)return;
  const label=bar.querySelector('.v1012-rulebook-title');
  if(route()!=='rulebook'){label?.remove();return;}
  if(label)return;
  const title=document.createElement('span');
  title.className='v1012-rulebook-title';
  title.setAttribute('aria-hidden','true');
  title.innerHTML='<strong>Reglamento</strong><small>DOCUMENTO OFICIAL · 2026–2027</small>';
  bar.appendChild(title);
 }
 const refresh=()=>{sync();requestAnimationFrame(sync);setTimeout(sync,130);};
 window.addEventListener('hashchange',refresh);
 window.addEventListener('popstate',refresh);
 window.addEventListener('pageshow',refresh);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});
 else refresh();
})();
