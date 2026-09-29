/* V347 — Historia estable.
   Los hardfix históricos antiguos ya están consolidados en el módulo principal.
   No se cargan observadores/parches legacy en segundo plano porque bloqueaban
   la interacción al cambiar entre Resumen, Temporadas, Campeones y Finales. */
(function(){
  'use strict';
  window.__LJR_V346_HISTORY_DEFERRED_PATCHES__=true;
  window.__LJR_HISTORY_LEGACY_PATCHES_DISABLED__=true;
})();
