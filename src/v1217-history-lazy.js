/* V1217: cargar el archivo pesado solamente al abrir Historial.
   El resto de la liga no evalúa búsquedas, auditorías ni clasificación local. */
let promise=null;
const inHistory=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]==='historyLog';
function startHistory(){
  if(!inHistory()||promise)return;
  promise=import('./v164-history-log.js')
    .then(()=>import('./v1215-history-local-ai.js'))
    .catch(error=>{
      promise=null;
      console.warn('Historial: no fue posible cargar los módulos.',error);
    });
}
window.addEventListener('hashchange',startHistory);
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',startHistory,{once:true});
}else startHistory();
