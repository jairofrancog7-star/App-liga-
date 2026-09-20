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
          '<span>Página 1 de 46</span>'+
          '<a href="'+PDF+'" target="_blank" rel="noopener noreferrer">Abrir PDF completo</a>'+
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
          '<div class="v102-rulebook-hint">Vista previa integrada para que el documento sea visible dentro de la app. Usa “Abrir PDF completo” o “Descargar” para consultar las 46 páginas.</div>'+
        '</div>'+
      '</div>';
  }

  function apply(){
    if(route()!=='rulebook') return;
    const wrap=document.querySelector('[data-v60-pdf-preview] .v72-preview-frame-wrap');
    if(!wrap || wrap.querySelector('[data-v102-rulebook-doc]')) return;
    wrap.innerHTML=previewMarkup();
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