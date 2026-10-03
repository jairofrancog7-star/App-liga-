/* V663 — Match Center: enrutamiento sólido de botones/pestañas.
   Corrige módulos antiguos o duplicados sin mandar a rutas ajenas. */
(function(){
'use strict';
if(window.__LJR_V663_MATCH_BUTTON_ROUTING__)return;
window.__LJR_V663_MATCH_BUTTON_ROUTING__=true;

const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const directRoutes=new Set(['v4-matchcenter','matchCenter','match-center']);
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

const textMap=[
  [/^build up$/, 'BuildUp'],
  [/^predicciones?$/, 'Predicciones'],
  [/^comentarios?$/, 'Comentarios'],
  [/^alineaciones?$/, 'Alineaciones'],
  [/^estadisticas?$/, 'Estadísticas'],
  [/^cronologia$/, 'Cronología'],
  [/^pre partido$/, 'Previa']
];

function desiredTab(button){
  const txt=norm(button.textContent);
  /* El texto visible manda sobre atributos legacy incorrectos.
     Ejemplo viejo: "Comentarios" tenía data-v92-tab="Cronología". */
  for(const [rx,tab] of textMap)if(rx.test(txt))return tab;

  const raw=String(button.dataset.v92Tab||button.dataset.v412Native||button.dataset.v412NativeTab||'').trim();
  if(raw==='BuildUp'||raw==='Predicciones'||raw==='Comentarios'||raw==='Alineaciones'||raw==='Estadísticas'||raw==='Cronología'||raw==='Previa'||raw==='Resumen'||raw==='Cuotas')return raw;
  return '';
}

document.addEventListener('click',e=>{
  if(!directRoutes.has(route()))return;
  const b=e.target.closest(
    '.v420-pills button,'+
    '.v516-matchcenter-shortcuts button,'+
    '.v412-match-tabs button,'+
    '.v412-mc-tabs button,'+
    '[data-v92-open-lineups]'
  );
  if(!b)return;
  const tab=desiredTab(b);
  if(!tab)return;
  const api=window.LJR_MATCH_CENTER;
  if(!api?.openTab)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  api.openTab(tab);
},true);
})();