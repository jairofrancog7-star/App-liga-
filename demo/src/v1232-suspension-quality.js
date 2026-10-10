/* V1232 | Control ligero de calidad en avisos.
   Automatizacion LOCAL: no publica, no envia, no modifica registros oficiales.
   Complementa la IA opcional de v1062 y el flujo protegido de v1074. */
(()=>{
'use strict';
if(window.__LJR_V1232_SUSP_QA__)return;
window.__LJR_V1232_SUSP_QA__=true;
const ROUTE='suspensionTool',FLOW='ljr-v1074-suspension-flow',QUEUE='ljr-v713-auto-notices';
const $=(s,r=document)=>r?.querySelector(s);
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const get=(k,p)=>String($('[data-v64-susp-'+k+']',p)?.value||'').trim();
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const state={auto:true};
const labels={cat:'Categoría',round:'Jornada',type:'Tipo de aviso',reason:'Motivo',date:'Fecha efectiva',time:'Hora',message:'Mensaje adicional'};
function audit(page){
 const s=Object.fromEntries(['cat','round','type','scope','match','venue','reason','date','time','message'].map(k=>[k,get(k,page)]));
 const issues=[],tips=[],add=(level,msg)=>issues.push({level,msg});
 for(const [key,label] of Object.entries(labels))if(!s[key])add('error','Completa '+label+'.');
 if(s.scope==='Un partido'&&(!s.match||s.match==='Todos los partidos'))add('error','Selecciona el partido exacto de esta jornada.');
 if(s.scope==='Uno o varios campos'&&(!s.venue||s.venue==='Todos los campos'))add('error','Selecciona el campo afectado.');
 if(s.message&&s.message.length<24)add('warning','El mensaje es muy breve. Indica a equipos y delegados dónde consultar la confirmación.');
 if(s.message&&/\b(?:confirmado|aprobado|autorizado)\b/i.test(s.message))
  tips.push('Comprueba que las palabras «confirmado / autorizado» correspondan a una decisión real.');
 if(s.date&&s.time){
  const when=new Date(s.date+'T'+s.time);
  if(Number.isFinite(when.getTime())&&when.getTime()<Date.now()-12*3600000)
   add('warning','La fecha efectiva ya pasó. Verifica que sea intencional.');
 }
 const flow=read(FLOW)||{},q=read(QUEUE),queue=Array.isArray(q)?q:[];
 const hash=JSON.stringify(Object.fromEntries(['cat','round','type','scope','match','venue','reason','priority','date','time','message','channel'].map(k=>[k,get(k,page)])));
 const reviewed=flow.reviewHash===hash&&!!flow.reviewedAt;
 const authorized=reviewed&&flow.authorization?.hash===hash&&!!flow.authorization?.name;
 if(flow.reviewHash&&!reviewed)tips.push('Cambiaste el formulario después de revisarlo: vuelve a solicitar aprobación.');
 if(flow.previousScheduledId&&queue.some(x=>String(x.id)===String(flow.previousScheduledId)&&!x.published))
  add('warning','Hay una programación anterior activa; revísala y cancélala si quedó obsoleta.');
 const duplicate=queue.some(item=>!item.published&&String(item.type||'')==='suspension'&&
  String(item.title||'').trim()===s.type&&
  String(item.body||'').includes('Categoría: '+s.cat)&&
  String(item.body||'').includes('Jornada: '+s.round)&&
  s.message.length>0&&String(item.body||'').includes(s.message));
 if(duplicate)add('warning','Parece existir un aviso similar programado en este dispositivo. Evita duplicarlo.');
 if(!reviewed)tips.push('La revisión humana aún no está registrada para la versión actual.');
 else if(!authorized)tips.push('Falta registrar una autorización real antes de programar.');
 else tips.push('La autorización registrada aquí es una constancia local, no una firma digital verificada.');
 tips.push('Los mensajes de WhatsApp requieren que selecciones el chat y pulses Enviar.');
 const errors=issues.filter(i=>i.level==='error').length;
 return {issues,tips,errors,reviewed,authorized,ready:!errors&&!issues.some(i=>i.level==='warning'),hash};
}
function panel(page){
 const flow=$('[data-v1074-content],.v1074-content',page);
 if(!flow)return null;
 let el=$('[data-v1232-qa]',flow);
 if(el)return el;
 el=document.createElement('section');el.className='v1232-qa';el.dataset.v1232Qa='';
 el.innerHTML='<div class="v1232-head"><span aria-hidden="true">✦</span><div><strong>Asistente de revisión local</strong><small>Control automático de calidad · sin enviar ni publicar</small></div></div>'+
 '<p data-v1232-status role="status" aria-live="polite"></p>'+
 '<div class="v1232-actions"><button type="button" data-v1232-check>Revisar ahora</button><button type="button" data-v1232-write>Redacción local</button><button type="button" data-v1232-copy>Copiar revisión</button></div>'+
 '<label class="v1232-toggle"><input type="checkbox" data-v1232-auto checked><span>Revisar automáticamente al modificar el aviso</span></label>'+
 '<ul data-v1232-items></ul>'+
 '<small class="v1232-foot">IA ligera basada en reglas, sin descargas ni conexión. No sustituye el visto bueno de la directiva.</small>';
 const target=$('.v1074-progress',flow);
 if(target)target.insertAdjacentElement('afterend',el);else flow.prepend(el);
 return el;
}
let cachePage=null,cacheHash='',timer=0;
function draw(page,force=false){
 const ui=panel(page);if(!ui)return;
 const a=audit(page);
 const checksum=JSON.stringify([a.issues,a.tips,a.reviewed,a.authorized,a.ready,state.auto]);
 if(!force&&cachePage===page&&checksum===cacheHash)return;
 cachePage=page;cacheHash=checksum;
 const status=$('[data-v1232-status]',ui);
 status.textContent=a.errors?'Necesita correcciones: '+a.errors+' campo(s) obligatorio(s).':
 a.issues.length?'Revisión con '+a.issues.length+' observación(es). Verifica antes de autorizar.':
 'Datos completos para revisión humana. No se ha publicado nada.';
 status.dataset.v1232Tone=a.errors?'error':a.issues.length?'warning':'ready';
 const list=$('[data-v1232-items]',ui);
 const rows=[...a.issues,...a.tips.map(msg=>({level:'info',msg}))];
 list.replaceChildren();
 for(const row of rows){
  const li=document.createElement('li');li.dataset.v1232Level=row.level;li.textContent=row.msg;list.append(li);
 }
 const auto=$('[data-v1232-auto]',ui);if(auto)auto.checked=state.auto;
}
function later(page,delay=350){
 clearTimeout(timer);timer=setTimeout(()=>{if(page.isConnected&&route()===ROUTE)draw(page)},delay);
}
function message(page,value){
 const status=$('[data-v1232-status]',page);if(status)status.textContent=value;
}
function boot(){
 const screen=$('#screen');if(!screen)return;
 let scheduled=false;
 const mount=()=>{
  scheduled=false;
  if(route()!==ROUTE)return;
  const page=$('.v425-suspension',screen);
  if(page&&window.LJR_MEDIA?.admin)draw(page);
 };
 const queueMount=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(mount)};
 new MutationObserver(queueMount).observe(screen,{childList:true,subtree:true});
 screen.addEventListener('input',e=>{
  if(route()!==ROUTE||!e.target.matches('[data-v64-susp-message]'))return;
  const page=e.target.closest('.v425-suspension');if(page&&state.auto)later(page);
 });
 screen.addEventListener('change',e=>{
  if(route()!==ROUTE)return;
  const page=e.target.closest('.v425-suspension');if(!page)return;
  if(e.target.matches('[data-v64-susp-cat],[data-v64-susp-round],[data-v64-susp-type],[data-v64-susp-scope],[data-v64-susp-match],[data-v64-susp-venue],[data-v64-susp-reason],[data-v64-susp-priority],[data-v64-susp-date],[data-v64-susp-time],[data-v64-susp-channel],[data-v64-susp-message]')){
   if(state.auto)later(page);
  }
  if(e.target.matches('[data-v1232-auto]')){
   state.auto=!!e.target.checked;
   if(state.auto)draw(page,true);
  }
 });
 screen.addEventListener('click',e=>{
  if(route()!==ROUTE)return;
  const b=e.target.closest('button');if(!b)return;
  const page=b.closest('.v425-suspension');if(!page)return;
  if(b.matches('[data-v1232-check]')){draw(page,true);return}
  if(b.matches('[data-v1232-write]')){
   const original=$('[data-v1062-generate]',page);
   if(original){original.click();message(page,'Se abrió el redactor existente. Revisa y aplica su sugerencia manualmente.')}
   else message(page,'El redactor aún no cargó; escribe el aviso y utiliza Revisar ahora.');
   return;
  }
  if(b.matches('[data-v1232-copy]')){
   const result=audit(page);
   const text=['Revisión LOCAL — Liga Juventino Rosas',...result.issues.map(x=>'• '+x.msg),...result.tips.map(x=>'• '+x)].join('\n');
   if(!navigator.clipboard?.writeText){message(page,'Portapapeles no disponible en este navegador.');return}
   navigator.clipboard.writeText(text).then(()=>message(page,'Revisión copiada. El aviso NO se publicó.')).catch(()=>message(page,'No fue posible copiar. Usa Revisar ahora.'));
   return;
  }
  if(b.matches('[data-v1074-review],[data-v1074-authorize],[data-v1074-schedule],[data-v1074-cancel],[data-v1074-stage],[data-v64-susp-save]'))later(page,800);
 });
 window.addEventListener('hashchange',queueMount);
 window.addEventListener('pageshow',queueMount);
 window.addEventListener('liga:admin',queueMount);
 window.addEventListener('focus',queueMount);
 queueMount();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
