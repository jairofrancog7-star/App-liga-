/* V1210 · Asistente de avisos: análisis local sin nube ni modelos externos.
   Complementa v713 sin alterar su publicación/autorización oficial. */
(function(){
'use strict';
if(window.__LJR_V1210_NOTICE_ASSISTANT__)return;
window.__LJR_V1210_NOTICE_ASSISTANT__=true;
const DRAFT='ljr-v1210-notice-draft', ITEMS='ljr-v713-auto-notices';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function rows(){try{const v=JSON.parse(localStorage.getItem(ITEMS)||'[]');return Array.isArray(v)?v:[]}catch(_){return []}}
function readDraft(){try{return JSON.parse(localStorage.getItem(DRAFT)||'null')}catch(_){return null}}
function saveDraft(data){try{localStorage.setItem(DRAFT,JSON.stringify({data,updatedAt:Date.now()}))}catch(_){}}
function stamp(date){const d=new Date(date);return Number.isFinite(+d)?d.toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'}):'Sin fecha'}
function pad(n){return String(n).padStart(2,'0')}
function localPart(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function localHour(d){return pad(d.getHours())+':'+pad(d.getMinutes())}
function get(root,key){return $('[data-v713-'+key+']',root)}
function current(root){
  return {
    title:get(root,'title')?.value.trim()||'',
    body:get(root,'body')?.value.trim()||'',
    extra:get(root,'extra')?.value.trim()||'',
    date:get(root,'date')?.value||'',
    time:get(root,'time')?.value||'',
    category:get(root,'category')?.value||'Todas',
    remind:get(root,'remind')?.value||'',
    type:$('[data-v713-type].active',root)?.dataset.v713Type||'general',
    channels:$$('[data-v713-ch]',root).map(e=>[e.dataset.v713Ch,e.checked])
  };
}
function setForm(root,data){
  const btn=$('[data-v713-type="'+String(data.type||'jornada')+'"]',root);
  if(btn)btn.click();
  for(const k of ['title','body','extra','date','time','category','remind']){
    const el=get(root,k);if(el&&data[k]!=null)el.value=data[k];
  }
  if(Array.isArray(data.channels)){
    for(const [k,v] of data.channels){const el=$('[data-v713-ch="'+k+'"]',root);if(el)el.checked=!!v}
  }else if(data.channels&&typeof data.channels==='object'){
    for(const [k,v] of Object.entries(data.channels)){const el=$('[data-v713-ch="'+k+'"]',root);if(el)el.checked=!!v}
  }
}
function detectType(text){
  const t=fold(text);
  if(/suspend|cancelad|pospuest|aplazad|no se jugara|no habra jornada/.test(t))return 'suspension';
  if(/cambio de cancha|cambio de sede|ubicacion|campo (nuevo|distinto)|reubic/.test(t))return 'sede';
  if(/cambio de horario|cambio de hora|reprogram|nueva hora/.test(t))return 'horario';
  if(/junta|reunion|asamblea|delegados/.test(t))return 'junta';
  if(/urgente|ultima hora|atencion inmediata/.test(t))return 'ultima';
  if(/jornada|rol de juegos|partidos del/.test(t))return 'jornada';
  return '';
}
function infer(text,now=new Date()){
  const t=fold(text),data={};
  const type=detectType(text);if(type)data.type=type;
  if(/\bveteranos\s*50\b|\b50\s*\+/.test(t))data.category='Veteranos 50+';
  else if(/\bveteranos\s*35\b|\b35\s*\+/.test(t))data.category='Veteranos 35+';
  else if(/\bintermedia\b/.test(t))data.category='Intermedia';
  else if(/\bsegunda (fuerza|division)\b/.test(t))data.category='Segunda';
  else if(/\bprimera (fuerza|division)\b/.test(t))data.category='Primera';
  const d=new Date(now);
  if(/\bpasado manana\b/.test(t))d.setDate(d.getDate()+2);
  else if(/\bmanana\b/.test(t))d.setDate(d.getDate()+1);
  else if(/\bhoy\b/.test(t)){}
  else {
    const weekdays={domingo:0,lunes:1,martes:2,miercoles:3,jueves:4,viernes:5,sabado:6};
    const m=t.match(/\b(?:este|proximo)\s+(domingo|lunes|martes|miercoles|jueves|viernes|sabado)\b/);
    if(m){let delta=(weekdays[m[1]]-d.getDay()+7)%7;if(!delta)delta=7;d.setDate(d.getDate()+delta)}
    else d.setTime(NaN);
  }
  if(Number.isFinite(+d))data.date=localPart(d);
  const time=t.match(/\b([01]?\d|2[0-3]):([0-5]\d)\s*(am|pm|hrs?)?\b/) ||
    t.match(/\b(1[0-2]|[1-9])\s*(am|pm)\b/);
  if(time){
    let hour=Number(time[1]),minute=time[2]&&/^\d\d$/.test(time[2])?Number(time[2]):0;
    const meridian=/am|pm/.test(time[2]||'')?time[2]:(time[3]||'');
    if(meridian==='pm'&&hour<12)hour+=12;
    if(meridian==='am'&&hour===12)hour=0;
    data.time=pad(hour)+':'+pad(minute);
  }
  return data;
}
function analyze(data,editId){
  const warnings=[],tips=[],due=new Date(data.date+'T'+data.time+':00');
  if(data.title.length<8)warnings.push('Añade un título descriptivo.');
  if(data.body.length<25)warnings.push('El mensaje es muy corto; explica qué ocurrió y qué debe hacer cada equipo.');
  if(!data.date||!data.time||!Number.isFinite(+due))warnings.push('Selecciona una fecha y hora válidas.');
  else if(+due<=Date.now())warnings.push('La fecha ya pasó: elige una fecha futura.');
  if(data.category==='Todas'&&data.type!=='general')tips.push('Conviene elegir la categoría afectada para dirigir mejor el aviso.');
  if(['sede','horario','suspension'].includes(data.type)&&!(/campo|cancha|sede|horario|hora|partido|jornada/i.test(data.body+' '+data.extra)))
    tips.push('Indica qué partido, cancha u horario cambia.');
  if(data.type==='suspension'&&/lluvia|clima|tormenta/i.test(data.body+' '+data.extra))
    tips.push('Antes de anunciar suspensión por lluvia, confirma la decisión con la autoridad de la Liga.');
  if(/confirmad[oa]|oficial/i.test(data.body)&&/pendiente|por confirmar/i.test(data.body))
    warnings.push('El mensaje mezcla datos confirmados y pendientes; acláralos.');
  const duplicate=rows().some(x=>x&&x.id!==editId&&!x.published&&fold(x.title)===fold(data.title)&&
    x.category===data.category&&Math.abs(Date.parse(x.publishAt)-(+due))<300000);
  if(duplicate)warnings.push('Ya existe un aviso parecido en esa categoría y horario.');
  if(!data.channels.some(([_,v])=>v))warnings.push('Selecciona al menos un canal de salida.');
  if(data.channels.some(([k,v])=>k==='facebook'&&v))tips.push('Facebook requiere un webhook propio autorizado; este teléfono no garantiza el envío.');
  return {warnings,tips,duplicate,due,score:Math.max(0,100-warnings.length*21-tips.length*8)};
}
function copy(text){
  if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(text);
  return Promise.reject(Error('Portapapeles no disponible'));
}
async function authorized(){
  try{return !!window.LJR_MEDIA?.admin&&!!(await window.LJR_MEDIA.api('me'))?.admin}catch(_){return false}
}
function calendarUrl(item){
  const ms=Date.parse(item.publishAt||'');
  if(!Number.isFinite(ms))return '';
  const g=d=>new Date(d).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  const title='Revisar aviso local: '+(item.title||'Aviso');
  const details=(item.body||'')+'\nCategoría: '+(item.category||'Todas')+'\nRecordatorio privado; no es una publicación oficial automática.';
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(title)+
    '&dates='+g(ms)+'%2F'+g(ms+30*60000)+'&details='+encodeURIComponent(details)+'&ctz=America%2FMexico_City';
}
function setup(root){
  if(root.dataset.v1210Ready)return;
  root.dataset.v1210Ready='true';
  let editingId=null;
  const aiHead=$('.v728-ai-head small',root);
  if(aiHead)aiHead.textContent='ASISTENTE LOCAL · SIN NUBE';
  const badge=$('.v713-live',root);if(badge){badge.textContent='LOCAL';badge.title='Los avisos de este módulo se procesan en el dispositivo, no en el servidor';}
  const base=$('.v729-ai-box',root)||$('.v728-ai-box',root);
  if(!base)return;
  base.insertAdjacentHTML('afterend',
    '<section class="v1210-review" data-v1210-review aria-label="Asistente local de avisos">'+
      '<div class="v1210-head"><div><small>ASISTENTE INTELIGENTE LOCAL</small><h3>Revisar antes de programar</h3></div><span data-v1210-grade>Listo para revisar</span></div>'+
      '<p class="v1210-about">Sugerencias privadas sin enviar datos a internet. No inventa información oficial ni publica automáticamente.</p>'+
      '<div class="v1210-tools"><button type="button" data-v1210-detect>Detectar tipo, fecha y hora</button><button type="button" data-v1210-copy>Copiar aviso</button><button type="button" data-v1210-cancel hidden>Cancelar edición</button></div>'+
      '<div class="v1210-preview"><div class="v1210-previewtop"><span>VISTA PREVIA</span><span data-v1210-count>0 caracteres</span></div>'+
        '<strong data-v1210-title></strong><p data-v1210-body></p><small data-v1210-meta></small></div>'+
      '<div class="v1210-audit" data-v1210-audit role="status" aria-live="polite"></div>'+
      '<small class="v1210-draft" data-v1210-draft>Los cambios del borrador se guardan en este dispositivo.</small>'+
    '</section>');
  const review=$('[data-v1210-review]',root);
  const notify=msg=>{const el=$('[data-v1210-draft]',root);if(el)el.textContent=msg;};
  const originalSave=get(root,'save');
  const normalLabel=originalSave?.textContent||'Programar';
  const redraw=()=>{
    const d=current(root),a=analyze(d,editingId);
    $('[data-v1210-grade]',review).textContent=a.warnings.length?'Revisar '+a.warnings.length+' alerta(s)':'Revisión '+a.score+'/100';
    $('[data-v1210-grade]',review).classList.toggle('needs-attention',!!a.warnings.length);
    $('[data-v1210-title]',review).textContent=d.title||'Escribe un título';
    $('[data-v1210-body]',review).textContent=d.body||'Aquí aparecerá el mensaje del aviso.';
    $('[data-v1210-count]',review).textContent=d.body.length+' caracteres';
    $('[data-v1210-meta]',review).textContent=(d.category||'Todas')+' · '+(a.due&&Number.isFinite(+a.due)?stamp(a.due):'Sin fecha');
    const audit=$('[data-v1210-audit]',review);
    audit.replaceChildren();
    for(const w of a.warnings){const p=document.createElement('p');p.className='v1210-warning';p.textContent='Revisar: '+w;audit.append(p)}
    for(const t of a.tips.slice(0,3)){const p=document.createElement('p');p.className='v1210-tip';p.textContent='Sugerencia: '+t;audit.append(p)}
    if(!a.warnings.length&&!a.tips.length){const p=document.createElement('p');p.className='v1210-ready';p.textContent='El aviso tiene los datos básicos. Confirma que sean oficiales antes de publicarlo.';audit.append(p)}
    return a;
  };
  const save=()=>{saveDraft(current(root));notify('Borrador guardado solamente en este dispositivo · '+localHour(new Date()))};
  let timer;
  root.addEventListener('input',event=>{if(event.target.closest('.v713-form,.v729-ai-box,.v713-channels')){redraw();clearTimeout(timer);timer=setTimeout(save,400)}});
  root.addEventListener('change',event=>{if(event.target.matches('input,textarea,select')){redraw();save()}});
  root.addEventListener('click',event=>{if(event.target.closest('[data-v713-type],[data-v713-ai],[data-v713-quick],[data-v713-smart]'))setTimeout(()=>{redraw();save()},0)});
  const draft=readDraft();
  if(draft?.data&&Date.now()-draft.updatedAt<30*86400000){setForm(root,draft.data);notify('Borrador anterior recuperado en este teléfono.');}
  $('[data-v1210-detect]',review).onclick=()=>{
    const d=current(root),found=infer([d.extra,d.body,d.title].join(' '));
    if(!Object.keys(found).length){notify('No se detectaron datos claros. Prueba: mañana 17:30, Veteranos 35+, cambio de cancha.');return}
    setForm(root,{...d,...found});
    redraw();save();notify('Sugerencias detectadas; confirma la fecha y los datos antes de guardar.');
  };
  $('[data-v1210-copy]',review).onclick=()=>{const d=current(root);copy(d.title+'\n'+d.body+'\n'+d.category).then(()=>notify('Texto copiado.')).catch(()=>notify('Tu navegador no permitió copiar; selecciona el mensaje manualmente.'))};
  const resetEdit=()=>{editingId=null;if(originalSave)originalSave.textContent=normalLabel;$('[data-v1210-cancel]',review).hidden=true;redraw()};
  $('[data-v1210-cancel]',review).onclick=()=>{resetEdit();notify('Edición cancelada. Puedes seguir creando otro aviso.')};
  root.addEventListener('click',async event=>{
    if(!event.target.closest('[data-v713-save]')||!editingId)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(!await authorized()){notify('Solo administración autorizada puede modificar avisos.');return}
    const d=current(root),a=redraw();
    if(a.warnings.some(w=>/título|mensaje|fecha|existe|canal/i.test(w))){notify('Corrige las alertas antes de guardar los cambios.');return}
    const list=rows(),item=list.find(x=>x.id===editingId&&!x.published);
    if(!item){notify('El aviso ya se procesó o fue eliminado.');resetEdit();return}
    Object.assign(item,{type:d.type,title:d.title,body:d.body,category:d.category,publishAt:a.due.toISOString(),
      remindAt:Number(d.remind)?new Date(+a.due-Number(d.remind)*60000).toISOString():'',
      channels:Object.fromEntries(d.channels),status:'scheduled',reminderSent:false,forceNow:false});
    try{localStorage.setItem(ITEMS,JSON.stringify(list))}catch(_){notify('No se pudieron guardar los cambios.');return}
    const card=$('[data-v713-id="'+editingId+'"]',root);
    if(card){const status=$('.v713-item-top b',card),heading=$('h4',card),body=$('p',card),date=$('small',card);
      if(status)status.textContent='Programado local';if(heading)heading.textContent=d.title;
      if(body)body.textContent=d.body;if(date)date.textContent=stamp(item.publishAt)}
    resetEdit();save();notify('Aviso local actualizado sin crear duplicados.');
  },true);
  const list=$('[data-v713-list]',root);
  function addCardActions(){
    if(!list)return;
    $$('[data-v713-id]',list).forEach(card=>{
      const actions=$('.v713-item-actions',card);if(!actions)return;
      const item=rows().find(x=>x.id===card.dataset.v713Id);
      if(item&&!item.published&&!$('[data-v1210-edit]',actions)){
        const btn=document.createElement('button');btn.type='button';btn.dataset.v1210Edit=item.id;btn.textContent='Editar';actions.prepend(btn);
      }
      if(!$('[data-v1210-calendar]',actions)){
        const btn=document.createElement('button');btn.type='button';btn.dataset.v1210Calendar=card.dataset.v713Id;btn.textContent='Google Calendar';actions.append(btn);
      }
    });
  }
  if(list){new MutationObserver(addCardActions).observe(list,{childList:true,subtree:true});addCardActions()}
  root.addEventListener('click',async event=>{
    const edit=event.target.closest('[data-v1210-edit]');
    if(edit){
      if(!await authorized()){notify('Se necesita iniciar sesión de administración.');return}
      const item=rows().find(x=>x.id===edit.dataset.v1210Edit&&!x.published);
      if(!item){notify('Este aviso ya no se puede editar.');return}
      const d=new Date(item.publishAt);const mins=item.remindAt?Math.round((Date.parse(item.publishAt)-Date.parse(item.remindAt))/60000):0;
      editingId=item.id;
      setForm(root,{type:item.type,title:item.title,body:item.body,extra:'',date:localPart(d),time:localHour(d),
        category:item.category,remind:String(mins),channels:item.channels});
      originalSave.textContent='Guardar cambios';
      $('[data-v1210-cancel]',review).hidden=false;
      review.scrollIntoView({behavior:'smooth',block:'center'});
      redraw();notify('Editando aviso local. Guarda cambios o cancela la edición.');
      return;
    }
    const cal=event.target.closest('[data-v1210-calendar]');
    if(cal){
      const item=rows().find(x=>x.id===cal.dataset.v1210Calendar),url=item&&calendarUrl(item);
      if(!url){notify('No hay una fecha válida para crear el evento.');return}
      const opened=window.open(url,'_blank','noopener,noreferrer');
      if(!opened)notify('Permite ventanas nuevas para abrir Google Calendar.');
    }
  });
  redraw();
}
function mount(){
  $$('.v713-auto[data-v713-auto]').forEach(setup);
}
new MutationObserver(mount).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',mount);
window.addEventListener('hashchange',()=>setTimeout(mount,60));
mount();
})();