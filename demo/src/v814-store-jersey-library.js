/* V837 — Store and Fantasy use the same cached local raster. */
(function(){
'use strict';
window.LJR_V814_STORE_JERSEYS={
 decorate:()=>window.LJR_JERSEY_ART?.applyStore(),
 kitFor:team=>window.LJR_JERSEY_ART?.kitFor(team),
 activeNames:()=>window.LJR_JERSEY_ASSETS?.teams.map(x=>x.name)||[],
 catalog:()=>window.LJR_JERSEY_ASSETS?.sources||[],
 candidateKits:team=>{const item=window.LJR_JERSEY_ASSETS?.itemFor(team);return item?[item]:[]}
};
})();
