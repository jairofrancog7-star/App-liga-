/* V987 — Historia: tarjetas con detalles accesibles, escudos sin sustituir fotos,
   y un solo sistema visual para Historia. No modifica los registros históricos. */
(function () {
  'use strict';
  if (window.__LJR_V987_HISTORY_CANVAS__) return;
  window.__LJR_V987_HISTORY_CANVAS__ = true;

  const LEAGUE = './assets/liga-logo.webp';
  const CRESTS = [
    [/lobos\s*(?:cdg|c\.?d\.?g\.?)/i, './assets/season-2026/lobos-cdg.webp'],
    [/boavista/i, './assets/history/team-logos/legacy-2015-boavista.webp'],
    [/gal[aá]cticos/i, './assets/season-2026/galacticos.webp']
  ];
  const openCards = new Set();
  let pending = false;
  let index = 0;
  const isHistory = () => (location.hash || '').replace(/^#\/?/, '').split('?')[0] === 'history';

  function createLogo(src, alt) {
    const outer = document.createElement('span');
    outer.className = 'v987-history-crest';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    // Si el archivo de un equipo no existe, mostrar la Liga, nunca un logo roto.
    if (src !== LEAGUE) {
      img.addEventListener('error', function () {
        if (img.dataset.fallback) return;
        img.dataset.fallback = '1';
        img.src = LEAGUE;
        img.alt = 'Escudo de la Liga Municipal';
      }, {once: true});
    }
    outer.appendChild(img);
    return outer;
  }

  function findTeamLogo(card, name) {
    const already = card.querySelector('.v35-history-moment-content img:not(.v987-history-crest img),.v35-champion-content img:not(.v987-history-crest img)');
    if (already && already.getAttribute('src')) return null;
    for (const [pattern, src] of CRESTS) if (pattern.test(name)) return src;
    return LEAGUE;
  }

  function decorateMoment(card) {
    const content = card.querySelector('.v35-history-moment-content');
    if (!content || card.dataset.v987Decorated) return;
    card.dataset.v987Decorated = '1';
    card.classList.add('v987-history-card');
    const heading = content.querySelector('h3');
    const title = heading ? heading.textContent.trim() : '';
    const logoSource = findTeamLogo(card, title);
    if (logoSource) {
      const crest = createLogo(logoSource, logoSource === LEAGUE ? 'Escudo de la Liga Municipal' : 'Escudo de ' + title);
      crest.classList.add('v987-moment-crest');
      content.insertBefore(crest, content.firstChild);
    }
    const detail = content.querySelector(':scope > p');
    if (!detail || !detail.textContent.trim()) return;
    const date = content.querySelector('time')?.textContent.trim() || '';
    const key = title + '|' + date + '|' + detail.textContent.slice(0, 50);
    card.dataset.v987Key = key;
    const id = 'v987-history-description-' + (++index);
    detail.id = id;
    detail.classList.add('v987-moment-description');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'v987-history-more';
    button.dataset.v987HistoryMore = '1';
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '<span>Ver más detalles</span><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    content.appendChild(button);
    setOpen(card, openCards.has(key));
  }

  function setOpen(card, open) {
    card.classList.toggle('v987-open', open);
    const button = card.querySelector('[data-v987-history-more]');
    if (!button) return;
    button.setAttribute('aria-expanded', String(open));
    button.querySelector('span').textContent = open ? 'Ocultar detalles' : 'Ver más detalles';
  }

  function decorateIdentity(card) {
    if (card.dataset.v987Identity) return;
    card.dataset.v987Identity = '1';
    card.classList.add('v987-identity-card');
    const tag = card.querySelector('.v35-history-kind');
    const emblem = createLogo(LEAGUE, 'Escudo de la Liga Municipal');
    emblem.classList.add('v987-identity-crest');
    card.insertBefore(emblem, tag || card.firstChild);
  }

  function decorateTimeline(card) {
    if (card.dataset.v987Timeline) return;
    card.dataset.v987Timeline = '1';
    card.classList.add('v987-timeline-card');
    const date = card.querySelector('.v672-timeline-date');
    if (date && !date.querySelector('.v987-date-logo')) {
      const img = document.createElement('img');
      img.src = LEAGUE;
      img.alt = '';
      img.className = 'v987-date-logo';
      img.loading = 'lazy';
      date.prepend(img);
    }
  }

  function apply() {
    pending = false;
    if (!isHistory()) return;
    const root = document.querySelector('.v35-history-page');
    if (!root) return;
    root.querySelectorAll('.v35-history-moment').forEach(decorateMoment);
    root.querySelectorAll('.v35-institutional-history .v35-format-grid > article').forEach(decorateIdentity);
    root.querySelectorAll('.v35-history-timeline .v35-timeline-list > article').forEach(decorateTimeline);
  }

  function schedule() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(apply);
  }

  document.addEventListener('click', function (e) {
    const button = e.target.closest('[data-v987-history-more]');
    if (!button || !isHistory()) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const card = button.closest('.v987-history-card');
    if (!card) return;
    const next = !card.classList.contains('v987-open');
    if (next) openCards.add(card.dataset.v987Key);
    else openCards.delete(card.dataset.v987Key);
    setOpen(card, next);
  }, true);

  window.addEventListener('hashchange', schedule);
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-v35-tab],[data-v35-tab-jump],[data-v348-load-archive],[data-v340-champion-cat]'))
      window.setTimeout(schedule, 60);
  });
  function initialize() {
    const screen = document.querySelector('#screen');
    if (screen) new MutationObserver(schedule).observe(screen, {childList: true, subtree: true});
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once: true});
  else initialize();
})();