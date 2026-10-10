/* V1222 — Resumen automático local e IA bajo demanda para la pantalla de avisos.
   Los datos proceden del buzón existente; nada se publica ni se envía sin revisión.
   El análisis ligero no descarga modelos. El generador ML se solicita expresamente. */
(()=>{
'use strict';
if(window.__LJR_V1222_NOTIFICATION_ASSISTANT__)return;
window.__LJR_V1222_NOTIFICATION_ASSISTANT__=true;
const PREF='ljr-notification-assistant-v1222';
const VIEW='ljr-notifications-feed-view-v1202';
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}};
const write=(key,data)=>{try{localStorage.setItem(key,JSON.stringify(data))}catch{}};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
let auto=!!read(PREF,{}).auto,scheduled=false,worker=null,killTimer=null,lastDisplayed='';
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const all=()=>{try{const list=window.LJR_V840_NOTIFICATIONS?.inbox?.();return Array.isArray(list)?list:[]}catch{return []}};
function selection(){
  const category=String(read(VIEW,{}).category||'all');
  return all().filter(x=>category==='all'||x.category===category)
    .sort((a,b)=>Number(b.ts||0)-Number(a.ts||0)).slice(0,28);
}
function facts(rows){
  const result={total:rows.length,goals:0,finals:0,live:0,latest:[],anomalies:0};
  for(const x of rows){
    if(x.type==='goal')result.goals++;
    if(x.type==='final')result.finals++;
    if(x.live||x.type==='live')result.live++;
    const home=String(x.home||'').trim(),away=String(x.away||'').trim();
    if(!home||!away||home===away)result.anomalies++;
    if(result.latest.length<3&&home&&away){
      const score=Number.isFinite(Number(x.hs))&&Number.isFinite(Number(x.as))&&x.hs!==null&&x.as!==null
        ?home+' '+x.hs+'–'+x.as+' '+away:home+' vs '+away;
      result.latest.push({text:score+' · '+String(x.category||'Categoría')+' · '+String(x.status||'Actualización'),
        type:String(x.type||'partido'),id:String(x.id||'')});
    }
  }
  return result;
}
function report(rows){
  const f=facts(rows);
  if(!f.total)return 'Todavía no hay avisos guardados para esta categoría. El asistente no inventa partidos ni marcadores.';
  let head=f.total+' avisos registrados: '+f.finals+' resultados, '+f.goals+' alertas de gol y '+f.live+' eventos en vivo.';
  if(f.anomalies)head+=' Revisa '+f.anomalies+' registros con equipos sin identificar o duplicados.';
  return head+'\n'+f.latest.map((x,i)=>(i+1)+'. '+x.text).join('\n');
}
function state(){
 const rows=selection();
 const signature=JSON.stringify(rows.map(x=>[x.id,x.status,x.hs,x.as,x.type,x.category]));
 return {rows,signature,summary:report(rows)};
}
function mounted(){
 return route()==='notifications'?document.querySelector('[data-v840-feed]'):null;
}
function render(){
 if(document.hidden)return;
 const host=mounted();
 if(!host)return;
 const data=state();
 let panel=host.querySelector('[data-v1222-assistant]');
 if(!panel){
   panel=document.createElement('details');
   panel.className='v1222-assistant';
   panel.dataset.v1222Assistant='1';
   panel.innerHTML='<summary><span class="v1222-assistant-symbol" aria-hidden="true">✦</span><span><b>Asistente local</b><small>Resumen de partidos · automatización · IA opcional</small></span><span class="v1222-assistant-arrow" aria-hidden="true">⌄</span></summary>'+
    '<div class="v1222-assistant-body">'+
    '<p class="v1222-assistant-explain">Analiza los avisos oficiales guardados en este dispositivo, sin publicar cambios.</p>'+
    '<div class="v1222-assistant-actions"><button type="button" data-v1222-analyze>Resumir actividad</button>'+
    '<button type="button" data-v1222-auto aria-pressed="false">Automático: no</button>'+
    '<button type="button" data-v1222-model>IA local opcional</button>'+
    '<button type="button" data-v1222-cancel hidden>Cancelar IA</button></div>'+
    '<output class="v1222-assistant-output" data-v1222-result aria-live="polite"></output>'+
    '<button type="button" class="v1222-assistant-copy" data-v1222-copy hidden>Copiar resumen</button>'+
    '<small class="v1222-assistant-foot">El resumen rápido funciona sin descargas. La IA generativa utiliza el modelo local existente solo si autorizas su descarga. Verifica cualquier borrador antes de publicarlo.</small></div>';
   const filters=host.querySelector('.v840-feed-tools');
   if(filters)filters.insertAdjacentElement('afterend',panel);else host.append(panel);
 }
 const button=panel.querySelector('[data-v1222-auto]');
 button.textContent=auto?'Automático: sí':'Automático: no';
 button.setAttribute('aria-pressed',auto?'true':'false');
 if(data.signature!==panel.dataset.v1222Signature){
   panel.dataset.v1222Signature=data.signature;
   if(auto&&!worker){
     const output=panel.querySelector('[data-v1222-result]');
     output.textContent=data.summary;
     panel.querySelector('[data-v1222-copy]').hidden=!data.rows.length;
   }
 }
}
function schedule(){
 if(scheduled||route()!=='notifications')return;
 scheduled=true;
 setTimeout(()=>{scheduled=false;render()},75);
}
function terminate(){
 if(killTimer)clearTimeout(killTimer);
 killTimer=null;
 if(worker){worker.terminate();worker=null}
 const panel=mounted();
 if(panel){panel.querySelector('[data-v1222-cancel]')?.setAttribute('hidden','');
  const model=panel.querySelector('[data-v1222-model]');if(model)model.disabled=false;}
}
function panelNow(){return mounted()?.querySelector('[data-v1222-assistant]')}
function show(textValue,allowCopy){
 const panel=panelNow();if(!panel)return;
 const target=panel.querySelector('[data-v1222-result]');
 target.textContent=String(textValue||'');
 panel.querySelector('[data-v1222-copy]').hidden=!allowCopy;
 lastDisplayed=target.textContent;
 panel.open=true;
}
function startModel(){
 if(worker)return;
 const rows=state().rows;
 if(!rows.length){show('No hay avisos oficiales que resumir todavía.',false);return;}
 if(!('Worker'in window)){show('Este navegador no permite cargar el modelo. El resumen rápido sigue disponible.',false);return;}
 if(!confirm('La IA local generativa puede descargar alrededor de 800 MB en la primera ejecución y consumir bastante memoria. No se cargará sin tu permiso. ¿Deseas continuar?'))return;
 const panel=panelNow();if(!panel)return;
 const model=panel.querySelector('[data-v1222-model]');
 model.disabled=true;
 panel.querySelector('[data-v1222-cancel]').hidden=false;
 show('Preparando el modelo en este dispositivo…',false);
 const details=rows.slice(0,5).map(x=>{
    const home=String(x.home||'Local'),away=String(x.away||'Visitante');
    const score=x.hs!=null&&x.as!=null?home+' '+x.hs+'-'+x.as+' '+away:home+' vs '+away;
    return score+' / '+String(x.category||'Liga')+' / '+String(x.status||'Actualización');
 }).join('; ');
 try{
   // El mismo Worker que ya se utiliza en el estudio de publicaciones de esta app.
   worker=new Worker(new URL('./design-ai-worker.js?v=20261007-v880',document.baseURI),{type:'module'});
   worker.onmessage=({data:msg})=>{
     if(msg?.type==='progress'){show(String(msg.text||'Procesando modelo local…'),false);return;}
     if(msg?.type==='result'){
       const draft=msg.draft||{};
       terminate();
       show('BORRADOR DE IA LOCAL — REVISA LOS DATOS ANTES DE PUBLICAR\n'+
         String(draft.title||'Resumen de la Liga').slice(0,120)+'\n'+String(draft.body||'').slice(0,800),true);
     }else if(msg?.type==='error'){terminate();show('No fue posible cargar la IA: '+String(msg.text||'Error desconocido')+'. Usa el resumen rápido.',false);}
   };
   worker.onerror=()=>{terminate();show('No fue posible cargar el modelo local. Usa el resumen rápido.',false)};
   killTimer=setTimeout(()=>{terminate();show('La IA local tardó demasiado; se detuvo para proteger el rendimiento del dispositivo.',false)},240000);
   worker.postMessage({type:'generate',values:{
     title:'Resumen de actividad',type:'Comunicado',
     details:'Solo hechos de avisos existentes; no agregar resultados ni fechas. '+details.slice(0,420),
     body:'Redactar un resumen breve con datos verificables y sin inventar eventos.'
   }});
 }catch(_){terminate();show('Este dispositivo no pudo iniciar la IA local. El resumen rápido funciona sin modelo.',false);}
}
document.addEventListener('click',async event=>{
 const button=event.target.closest?.('[data-v1222-analyze],[data-v1222-auto],[data-v1222-model],[data-v1222-cancel],[data-v1222-copy]');
 if(!button||!button.closest('[data-v1222-assistant]'))return;
 event.preventDefault();
 if(button.hasAttribute('data-v1222-analyze'))show(state().summary,!!state().rows.length);
 else if(button.hasAttribute('data-v1222-auto')){
   auto=!auto;write(PREF,{auto});render();
   show(auto?state().summary:'Análisis automático desactivado. Puedes resumir la actividad manualmente.',auto&&state().rows.length>0);
 }else if(button.hasAttribute('data-v1222-model'))startModel();
 else if(button.hasAttribute('data-v1222-cancel')){terminate();show('Generación cancelada; los resultados oficiales no han cambiado.',false);}
 else if(button.hasAttribute('data-v1222-copy')){
   const value=lastDisplayed||state().summary;
   try{await navigator.clipboard.writeText(value);show('Copiado al portapapeles:\n'+value,true)}
   catch{show(value+'\nSelecciona el texto para copiarlo.',true)}
 }
});
function start(){
 const screen=document.querySelector('#screen');
 if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
 window.addEventListener('hashchange',()=>{if(route()!=='notifications')terminate();schedule()});
 window.addEventListener('focus',schedule);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
 window.addEventListener('ljr:notifications:updated',schedule);
 schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();