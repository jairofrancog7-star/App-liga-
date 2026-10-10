/* V1212 · Cancelar una serie local de avisos, sin tocar el servidor ni el historial.
   Funciona solo en administración; no publica avisos ni ejecuta webhooks. */
(function(){
'use strict';
if(window.__LJR_V1212_SERIES_CANCEL__)return;
// Si el programador principal ya controla las series, evitar botones duplicados.
if(window.__LJR_V1211_CANCEL_SERIES_ENABLED__)return;
window.__LJR_V1212_SERIES_CANCEL__=true;
const KEY='ljr-v713-auto-notices';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
function read(){
  try{const items=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(items)?items:[]}
  catch(_){return []}
}
function pending(row){return row&&typeof row.recurrenceId==='string'&&row.recurrenceId.length>0&&!row.published}
function countPending(items,seriesId){return items.filter(row=>pending(row)&&row.recurrenceId===seriesId).length}
async function authorized(){
  try{return !!window.LJR_MEDIA?.admin&&!!(await window.LJR_MEDIA.api('me'))?.admin}catch(_){return false}
}
function inform(root,message){
  const status=$('[data-v1211-status]',root)||$('[data-v1212-status]',root);
  if(status)status.textContent=message;
}
function hydrate(root){
  const list=$('[data-v713-list]',root);if(!list)return;
  const items=read(),done=new Set();
  for(const card of $$('[data-v713-id]',list)){
    const controls=$('.v713-item-actions',card);if(!controls)continue;
    const row=items.find(x=>x.id===card.dataset.v713Id);
    if(!pending(row))continue;
    const group=row.recurrenceId;
    if(done.has(group))continue;
    done.add(group);
    const remaining=countPending(items,group);
    if(!remaining||$('[data-v1212-cancel]',controls))continue;
    const btn=document.createElement('button');
    btn.type='button';btn.dataset.v1212Cancel=group;btn.textContent='Cancelar serie ('+remaining+')';
    btn.title='Eliminar únicamente los avisos locales pendientes de esta serie; conservar los procesados';
    btn.setAttribute('aria-label','Cancelar '+remaining+' avisos pendientes de la serie local');
    controls.append(btn);
  }
}
function mount(){
  $$('.v713-auto[data-v713-auto]').forEach(root=>{
    if(root.dataset.v1212Ready)return;
    root.dataset.v1212Ready='true';
    const list=$('[data-v713-list]',root);
    if(!list)return;
    new MutationObserver(()=>hydrate(root)).observe(list,{childList:true,subtree:true});
    hydrate(root);
    root.addEventListener('click',async e=>{
      const button=e.target.closest('[data-v1212-cancel]');
      if(!button||!root.contains(button))return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const seriesId=button.dataset.v1212Cancel;
      if(!seriesId){inform(root,'No se encontró la serie.');return}
      if(!await authorized()){inform(root,'Solo la administración autorizada puede cancelar avisos locales.');return}
      const before=read(),pendingCount=countPending(before,seriesId);
      if(!pendingCount){inform(root,'Ya no quedan avisos pendientes en esta serie.');return}
      if(!window.confirm('¿Cancelar los '+pendingCount+' avisos pendientes de esta serie? Se conservarán los avisos ya procesados y no se enviará ningún mensaje.'))return;
      // Leer otra vez después de confirmar: otros procesos pueden haber cambiado la lista.
      const latest=read(),deleted=countPending(latest,seriesId);
      if(!deleted){inform(root,'La serie ya no tiene avisos pendientes.');return}
      const keep=latest.filter(row=>!(pending(row)&&row.recurrenceId===seriesId));
      try{localStorage.setItem(KEY,JSON.stringify(keep))}
      catch(_){inform(root,'No fue posible guardar la cancelación en este teléfono.');return}
      if(typeof window.LJR_V713_NOTICE_SCHEDULER_REFRESH==='function')window.LJR_V713_NOTICE_SCHEDULER_REFRESH();
      else hydrate(root);
      inform(root,'Cancelados '+deleted+' avisos locales pendientes. Se conservaron los avisos ya procesados.');
    },true);
  });
}
if(document.documentElement)new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('hashchange',()=>setTimeout(mount,80));
document.addEventListener('DOMContentLoaded',mount);
mount();
})();