/* V102 — Vista previa interna del Reglamento.
   Corrige WebView/Android donde el iframe PDF queda en blanco. */
(function(){
  'use strict';

  const PDF='./docs/Reglamento_Liga_Juventino_Rosas_2026_2027.pdf';

  function route(){
    return location.hash.replace(/^#\//,'').split('?')[0] || 'home';
  }

  function previewMarkup(){
    return ''+
      '<div class="v102-rulebook-doc" data-v102-rulebook-doc>'+
        '<div class="v102-rulebook-toolbar">'+
          '<div class="v102-reader-identity"><span class="v102-reader-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/></svg></span><span><b>Vista previa</b><small>Reglamento oficial</small></span></div>'+
          '<div class="v102-reader-actions"><span class="v102-page-pill">1 <i>/</i> 46</span><a href="'+PDF+'" target="_blank" rel="noopener noreferrer" title="Abrir PDF completo" aria-label="Abrir PDF completo de 46 páginas"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></svg></a></div>'+
        '</div>'+
        '<div class="v102-rulebook-scroll">'+
          '<article class="v102-rulebook-paper" aria-label="Vista previa de la primera página del Reglamento oficial">'+
            '<div class="v102-page-number">1</div>'+
            '<h2>REGLAMENTO DE LA LIGA MUNICIPAL DE FÚTBOL<br>&quot;JUVENTINO ROSAS A. C.&quot;, 2026 - 2027.</h2>'+
            '<div class="v102-rulebook-officers">'+
              '<p><b>C. FLORENCIO FRANCO LERMA.</b>Presidente</p>'+
              '<p><b>C. MARTÍN JARAMILLO CELEDÓN.</b>Vicepresidente</p>'+
              '<p><b>C. JAVIER GONZALEZ LOPEZ.</b>Secretario</p>'+
              '<p><b>C. OCTAVIO ALBERTO GARCÍA.</b>Tesorero</p>'+
            '</div>'+
            '<h3>OBJETIVO:</h3>'+
            '<p>Es impulsar, fomentar y organizar de manera sistemática el desarrollo del fútbol en todos los ámbitos en el municipio.</p>'+
            '<p class="v102-closing">LA LIGA DE FÚTBOL &quot;JUVENTINO ROSAS A. C.&quot; SE RIGE BAJO EL SIGUIENTE REGLAMENTO:</p>'+
          '</article>'+
          '<div class="v102-rulebook-hint">Esta es la primera página. Abre el PDF completo para consultar las 46 páginas.</div>'+
        '</div>'+
      '</div>';
  }


  // Rediseño aislado a #/rulebook: no cambia enlaces, navegación ni contenido del PDF.
  function decoratePage(mount){
    const page=mount.closest('.v60-tool-page');
    if(!page)return;
    const panel=page.querySelector('.v60-panel');
    if(!panel || panel.classList.contains('v102-rulebook-control-card'))return;
    page.classList.add('v102-modern-rulebook');
    panel.classList.add('v102-rulebook-control-card');
    panel.insertAdjacentHTML('afterbegin',
      '<div class="v102-document-heading">'+
        '<span class="v102-document-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13h-5a4 4 0 0 0-4 3 4 4 0 0 0-4-3z"/></svg></span>'+
        '<span class="v102-document-copy"><small>DOCUMENTO OFICIAL</small><h1>Reglamento</h1><span>Liga Juventino Rosas · 2026–2027</span></span>'+
        '<span class="v102-document-count"><b>46</b><small>páginas</small></span>'+
      '</div>'
    );
    const links=panel.querySelectorAll('.v60-actions a');
    if(links[0]){
      links[0].classList.add('v102-primary-action');
      links[0].insertAdjacentHTML('afterbegin','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></svg>');
    }
    if(links[1]){
      links[1].classList.add('v102-secondary-action');
      links[1].insertAdjacentHTML('afterbegin','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 17v3h14v-3"/></svg>');
    }
    const note=panel.querySelector('.v60-note');
    if(note)note.textContent='Vista previa de la primera página. Abre o descarga el documento para leer las 46 páginas.';
  }

  function apply(){
    if(route()!=='rulebook') return;
    const mount=document.querySelector('[data-v102-rulebook-mount]');
    if(!mount)return;
    decoratePage(mount);
    if(mount.querySelector('[data-v102-rulebook-doc]'))return;
    mount.innerHTML=previewMarkup();
  }

  function schedule(){
    requestAnimationFrame(function(){
      apply();
      setTimeout(apply,120);
      setTimeout(apply,450);
    });
  }

  window.addEventListener('hashchange',schedule);
  window.addEventListener('pageshow',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});

  const screen=document.querySelector('#screen');
  if(screen){
    new MutationObserver(function(){
      if(route()==='rulebook') apply();
    }).observe(screen,{childList:true,subtree:true});
  }

  schedule();
})();