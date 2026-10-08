/* V991 — Historia: cuadros sin escudos superpuestos ni botones "Ver más detalles".
   Conserva fotografías, fechas, categoría, equipo, ganador, temporada y texto histórico.
   El diseño de lienzos de V987 permanece intacto. */
(function () {
  'use strict';
  if (window.__LJR_V987_HISTORY_CANVAS__) return;
  window.__LJR_V987_HISTORY_CANVAS__ = true;

  let pending = false;
  const isHistory = () => (location.hash || '').replace(/^#\\/?/, '').split('?')[0] === 'history';

  // Quitar sólo adornos y controles de las tarjetas, nunca la foto de fondo.
  function cleanCard(card) {
    card.querySelectorAll(
      '.v987-history-crest,.v987-identity-crest,.v987-date-logo,' +
      '.v987-history-more,[data-v987-history-more],[data-v674-details],' +
      '[data-v731-history-details]'
    ).forEach(node => node.remove());

    // Al suprimir el botón, la descripción histórica debe seguir siendo visible.
    card.querySelectorAll('.v674-detail-copy,.v731-history-detail-copy').forEach(node => {
      node.classList.remove('v674-detail-copy', 'v731-history-detail-copy');
    });
    card.querySelectorAll('[hidden].v987-moment-description').forEach(node => {
      node.hidden = false;
    });
    card.classList.remove('v674-detail-card', 'v674-expanded', 'v987-open', 'is-v731-open');
    card.dataset.v674Enhanced = '1';
  }

  function decorateMoment(card) {
    const content = card.querySelector('.v35-history-moment-content');
    if (!content) return;
    if (!card.classList.contains('v987-history-card')) {
      card.classList.add('v987-history-card');
    }
    cleanCard(card);
    const description = content.querySelector(':scope > p');
    if (description) description.classList.add('v987-moment-description');
  }

  function decorateIdentity(card) {
    card.classList.add('v987-identity-card');
    cleanCard(card);
  }

  function decorateTimeline(card) {
    card.classList.add('v987-timeline-card');
    cleanCard(card);
  }

  function apply() {
    pending = false;
    if (!isHistory()) return;
    const root = document.querySelector('.v35-history-page');
    if (!root) return;
    root.querySelectorAll('.v35-history-moment').forEach(decorateMoment);
    root.querySelectorAll('.v35-champion-card,.v115-card').forEach(cleanCard);
    root.querySelectorAll('.v35-institutional-history .v35-format-grid > article').forEach(decorateIdentity);
    root.querySelectorAll('.v35-history-timeline .v35-timeline-list > article').forEach(decorateTimeline);
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(apply);
  }

  window.addEventListener('hashchange', schedule);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-v35-tab],[data-v35-tab-jump],[data-v348-load-archive],[data-v340-champion-cat]')) {
      setTimeout(schedule, 60);
    }
  });

  function initialize() {
    const screen = document.querySelector('#screen');
    if (screen) new MutationObserver(schedule).observe(screen, {childList:true,subtree:true});
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();
})();
