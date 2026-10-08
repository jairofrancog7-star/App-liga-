/* V985 — Pulido visual de Buscar. Solo decora botones existentes; no altera rutas, filtros ni eventos. */
(function () {
  'use strict';
  if (window.__LJR_V985_SEARCH_UI__) return;
  window.__LJR_V985_SEARCH_UI__ = true;

  const icons = {
    venues: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-7h6v7"/>',
    news: '<rect x="4" y="3.5" width="16" height="17" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    ligaQR: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zm7 0v3h-3m0 4h3v-2m-7 2h2"/>',
    teams: '<path d="M4 5h16v10a8 8 0 0 1-16 0V5Z"/><path d="M4 9h16M12 9v10M9 22h6M12 19v3"/>',
    players: '<circle cx="10" cy="8" r="3.2"/><path d="M3.5 19a6.5 6.5 0 0 1 13 0"/><path d="M17 6a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 4"/>',
    competitions: '<path d="M7 4h10v7a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2c0 3 2 4 4 4m9-6h3v2c0 3-2 4-4 4M12 16v4m-4 0h8"/>',
    matches: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16M3 12h18"/><circle cx="12" cy="12" r="3"/>'
  };
  const specs = {
    venues: ['Campos', 'Sedes y ubicaciones'],
    news: ['Noticias', 'Avisos de la Liga'],
    ligaQR: ['QR de la Liga', 'Comparte la app'],
    teams: ['Equipos', 'Clubes y escudos'],
    players: ['Jugadores', 'Plantillas oficiales'],
    competitions: ['Competiciones', 'Categorías y tablas'],
    matches: ['Partidos', 'Jornadas y resultados']
  };
  function isSearch() {
    const hash = String(location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return hash === 'search' || (!hash && document.body?.dataset.appRoute === 'search');
  }
  function decorate(button, key, arrow) {
    if (!button || button.dataset.v985Ui === '1' || !specs[key]) return;
    const [name, sub] = specs[key];
    const badge = document.createElement('span');
    badge.className = 'v985-action-icon';
    badge.setAttribute('aria-hidden', 'true');
    badge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + icons[key] + '</svg>';
    const copy = document.createElement('span');
    copy.className = 'v985-action-copy';
    const title = document.createElement('strong');
    title.textContent = name;
    const hint = document.createElement('small');
    hint.textContent = sub;
    copy.append(title, hint);
    button.replaceChildren(badge, copy);
    if (arrow) {
      const chevron = document.createElement('span');
      chevron.className = 'v985-action-arrow';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '›';
      button.append(chevron);
    }
    button.dataset.v985Ui = '1';
  }
  let queued = false;
  function apply() {
    queued = false;
    if (!isSearch()) return;
    document.querySelectorAll('#screen .quick-grid button[data-route]').forEach(b =>
      decorate(b, b.dataset.route, true)
    );
    document.querySelectorAll('#screen [data-v412-screen="search"] .v412-mode[data-v412-mode]').forEach(b =>
      decorate(b, b.dataset.v412Mode, false)
    );
  }
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(apply);
  }
  function start() {
    const root = document.querySelector('#screen');
    if (root) new MutationObserver(queue).observe(root, {childList:true, subtree:true});
    queue();
  }
  window.addEventListener('hashchange', queue);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
