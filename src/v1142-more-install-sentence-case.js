/* Corrección resiliente de la capitalización en Más.
   No reemplaza menús ni eventos, solo el encabezado de instalación. */
(() => {
  'use strict';
  if (window.__LJR_MORE_INSTALL_SENTENCE_CASE__) return;
  window.__LJR_MORE_INSTALL_SENTENCE_CASE__ = true;

  const TITLE = 'Instalar la aplicación';
  const IS_TARGET = s => String(s || '').trim().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es') === 'instalar la aplicacion';
  function fix() {
    const more = document.querySelector('#screen .v19-more-page');
    if (!more) return;
    for (const label of more.querySelectorAll('.v19-more-label')) {
      if (!IS_TARGET(label.textContent)) continue;
      if (label.textContent !== TITLE) label.textContent = TITLE;
      if (!label.classList.contains('v1142-install-sentence-case')) {
        label.classList.add('v1142-install-sentence-case');
      }
    }
  }
  function start() {
    const screen = document.querySelector('#screen');
    if (!screen) return;
    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      queueMicrotask(() => { pending = false; fix(); });
    };
    new MutationObserver(schedule).observe(screen, {
      childList: true, subtree: true, characterData: true
    });
    fix();
    window.addEventListener('hashchange', schedule);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {once: true});
  } else start();
})();
