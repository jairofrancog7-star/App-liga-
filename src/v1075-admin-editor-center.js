/* V1075 — Centro editorial sin codigo. Usa API del servidor con sesion verificada.
   Los visitantes nunca reciben controles de escritura; los avisos programados del
   navegador siguen siendo LOCALES, no una publicacion remota garantizada. */
(()=>{
'use strict';
if(window.__LJR_V1075_EDITOR__)return;
window.__LJR_V1075_EDITOR__=true;
const CATS=[['all','Todas las categorías'],['3','Primera Fuerza'],['5','Intermedia'],['4','Segunda Fuerza'],['2','Veteranos 35+'],['1','Veteranos 50+']];
const TYPES={
 jornada:['Jornada','Aviso de jornada','Se informa a los equipos la programación de la jornada.'],
 horario:['Cambio de horario','Cambio de horario','Se informa una modificación de horario.'],
 cancha:['Cambio de cancha','Cambio de cancha','Se informa un cambio de cancha o sede.'],
 suspension:['Suspensión','Aviso de suspensión','Se informa una suspensión que requiere atención de los equipos.'],
 resultados:['Resultados','Resultados oficiales','Se informa la actualización de resultados oficiales.'],
 junta:['Junta','Convocatoria a junta','Se convoca a los delegados a una junta de la Liga.'],
 registro:['Inscripciones','Aviso de inscripciones','Se informa una actualización del registro de jugadores.'],
 clima:['Clima','Aviso por condiciones climáticas','Se informa una medida relacionada con las condiciones climáticas.']
};
const $=(s,r=document)=>r.querySelector(s);
const admin=()=>!!window.LJR_MEDIA?.admin;
const media=()=>window.LJR_MEDIA;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateString=s=>{try{return s?new Date(s+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}):''}catch(_){return ''}};
const catName=v=>CATS.find(x=>x[0]===v)?.[1]||'Todas las categorías';
function status(modal,value){const box=$('.ljr-editor-compose [data-status]',modal)||$('[data-status]',modal);if(box)box.textContent=value}
async function verified(){
 if(!admin())throw Error('Solo los administradores autorizados pueden editar la Liga.');
 const response=await media().api('me');
 if(!response?.admin)throw Error('La sesión de administración expiró. Vuelve a entrar.');
 return response.admin;
}
function createModal(title,html,className){
 const modal=media().modal(title,html);
 modal.querySelector('section')?.classList.add('ljr-editor-dialog',className);
 return modal;
}
function showComposer(prefill){
 if(!admin())return media()?.login?.(()=>showComposer(prefill));
 const choices=Object.entries(TYPES).map(([key,val])=>'<option value="'+key+'">'+esc(val[0])+'</option>').join('');
 const modal=createModal('Crear aviso oficial','<form class="ljr-editor-form" data-editor-form>'+
  '<p class="ljr-editor-note ljr-editor-intro">Completa los datos confirmados, prepara el mensaje y revisa antes de publicar. Los borradores permanecen privados en el servidor.</p>'+
  '<div class="ljr-editor-two">'+
  '<label>Tipo de aviso<select name="type">'+choices+'</select></label>'+
  '<label>Categoría<select name="category">'+CATS.map(x=>'<option value="'+x[0]+'">'+esc(x[1])+'</option>').join('')+'</select></label>'+
  '<label>Jornada (opcional)<select name="round" aria-label="Elegir jornada"><option value="">Elegir jornada</option></select></label>'+
  '<label>Fecha del evento (opcional)<input type="date" name="date"></label>'+
  '<label>Hora (opcional)<input type="time" name="time"></label>'+
  '<label>Cancha / sede (opcional)<select name="field" aria-label="Elegir cancha"><option value="">Elegir cancha</option></select></label>'+ 
  '<label>Equipo afectado (opcional)<select name="team" aria-label="Elegir equipo"><option value="">Elegir equipo</option></select></label>'+
  '</div>'+
  '<div class="ljr-editor-autofill"><button type="button" data-editor-match-autofill>↗ Completar desde el rol</button><small data-editor-match-hint aria-live="polite">Selecciona categoría, jornada y equipo.</small></div>'+ 
  '<label>Detalles confirmados<textarea name="details" rows="2" maxlength="1200" placeholder="Escribe el cambio o la información oficial. No se inventan resultados."></textarea></label>'+
  '<div class="ljr-editor-tools"><button type="button" data-generate="formal">✎ Comunicado</button><button type="button" data-generate="short">☰ Versión corta</button><button type="button" data-generate="urgent">⚠ Urgente</button></div>'+
  '<label>Título<input name="title" required maxlength="160"></label>'+
  '<label>Mensaje<textarea name="body" required rows="5" minlength="15" maxlength="4000"></textarea></label>'+
  '<label>Mostrar en<select name="scope"><option value="Liga">Liga</option><option value="Equipos">Equipos</option><option value="Fichajes">Fichajes</option></select></label>'+
  '<div class="ljr-editor-smart-tools" aria-label="Herramientas del aviso"><button type="button" data-editor-check>✓ Revisar datos</button><button type="button" data-editor-local-ai>✦ IA en el dispositivo</button><button type="button" data-editor-calendar>▦ Google Calendar</button><button type="button" data-editor-schedule>◷ Programar envío</button><button type="button" data-editor-copy>⧉ Copiar aviso</button></div>'+
  '<p class="ljr-editor-feedback" data-editor-feedback aria-live="polite" role="status"></p>'+
  '<div class="ljr-editor-preview"><small>VISTA PREVIA · NOTICIAS OFICIALES</small><strong data-preview-title></strong><p data-preview-body></p><small data-preview-meta></small></div>'+
  '<p class="ljr-editor-progress" data-status role="status" aria-live="polite"></p>'+
  '<div class="ljr-editor-bottom"><button type="button" data-editor-draft>Guardar borrador</button><button type="submit" data-editor-publish>Publicar en Noticias</button></div>'+
  '<small>Publicar requiere confirmación y permisos del servidor. Las notificaciones push, SMS o WhatsApp automáticas solo funcionan si el servicio HTTPS y los destinatarios autorizados están configurados.</small>'+
  '</form>','ljr-editor-compose');
 const form=$('[data-editor-form]',modal);
 const title=$('[name=title]',form),body=$('[name=body]',form);
 let savedId='', savedRevision=0, saving=false;
 // Los catálogos son públicos y solo sugieren nombres; nunca alteran los permisos de publicación.
 const fieldInput=form.elements.field,teamInput=form.elements.team,roundInput=form.elements.round;
 const normalizeName=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
 const canon=x=>window.LJR_FIELDS?.canonical?.(String(x||'').trim())||String(x||'').trim();
 const localFields=['Campo 1 · Unidad Deportiva Sur','Campo 2 · Unidad Deportiva Sur','Campo 3 · Unidad Deportiva Sur','Campo 4 · Emiliano Zapata','Campo Cerrito de Gasca','Campo de Tavera','Campo San Juan de la Cruz','Unidad Deportiva Santiago de Cuenda','Campo San Antonio de Romerillo','Campo Fraccionamiento Comontuoso','Campo de Fútbol de Pozos','Campo Rincón de Centeno','Campo San José de la Montaña','Campo San Julián Tierra Blanca'];
 let categoryTeams=new Map(),categoryRounds=new Map(),categoryGames=new Map(),availableTeamNames=[],knownFields=localFields.slice(),catalogLoaded=false;
 function pickOptions(select,values,placeholder,preserve=true){
  const old=select.value,seen=new Set();
  select.replaceChildren(new Option(placeholder,''));
  values.forEach(raw=>{const value=String(raw||'').trim(),key=normalizeName(value);if(value&&!seen.has(key)){seen.add(key);select.add(new Option(value,value));}});
  if(old&&[...select.options].some(o=>o.value===old))select.value=old;
  else if(old&&preserve){select.add(new Option(old+' · revisar',old));select.value=old;}
 }
 function roundOptions(clear=false){
  const cat=form.elements.category.value;
  const rounds=cat==='all'?[...new Set([...categoryRounds.values()].flat())]:(categoryRounds.get(cat)||[]);
  const options=rounds.length?rounds:Array.from({length:30},(_,i)=>String(i+1));
  pickOptions(roundInput,options.sort((a,b)=>+a- +b),'Elegir jornada',!clear);
  [...roundInput.options].forEach(x=>{if(x.value)x.textContent='Jornada '+x.value});
  roundInput.dataset.official=rounds.length?'1':'0';
 }
 function teamOptions(clear=false){
  const cat=form.elements.category.value;
  availableTeamNames=(cat==='all'?[...new Set([...categoryTeams.values()].flat())]:(categoryTeams.get(cat)||[])).sort((a,b)=>a.localeCompare(b,'es'));
  pickOptions(teamInput,availableTeamNames,'Elegir equipo',!clear);
 }
 function fieldOptions(){
  pickOptions(fieldInput,[...new Set([...knownFields,...(window.LJR_FIELDS?.catalog||[]).map(x=>x.name)].map(canon))]
    .filter(x=>x&&!/^(?:-{1,3}|por confirmar|sin campo|por definir|pendiente)$/i.test(x)).sort((a,b)=>a.localeCompare(b,'es')),'Elegir cancha');
 }
 function decodeDate(text){
  const m=/^(\d\d)\/(\d\d)\/(\d{4})\s+([01]\d|2[0-3]):([0-5]\d)/.exec(String(text||''));
  if(!m)return {date:'',time:''};
  const date=m[3]+'-'+m[2]+'-'+m[1],d=new Date(date+'T12:00:00');
  return Number.isFinite(+d)&&d.getFullYear()===+m[3]&&d.getMonth()+1===+m[2]&&d.getDate()===+m[1]?{date,time:(m[4]==='00'&&m[5]==='00')?'':m[4]+':'+m[5]}:{date:'',time:''};
 }
 async function loadCatalogs(){
  fieldOptions();roundOptions();teamOptions();
  try{
   let data;try{data=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA}catch(_){data=window.LJR_OFFICIAL_DATA;}
   if(!data?.categories){const r=await fetch('./data/official-live.json',{cache:'default'});if(!r.ok)throw Error('Sin rol');data=await r.json();}
   const venues=[];
   for(const [id,cat] of Object.entries(data.categories||{})){
    const teams=[],rounds=[],games=[];
    (cat.teams||[]).forEach(v=>teams.push(typeof v==='string'?v:v?.name));
    Object.keys(cat.rosters||{}).forEach(v=>teams.push(v));
    (cat.standings||[]).forEach(tab=>(tab.rows||[]).forEach(row=>{if(row[1])teams.push(row[1]);}));
    (cat.fixtures||[]).forEach(tab=>(tab.rows||[]).forEach(row=>{
     if(!Array.isArray(row)||row.length<9)return;
     const round=String(row[1]||''),home=String(row[2]||'').trim(),away=String(row[6]||'').trim(),field=canon(row[7]),date=decodeDate(row[8]);
     if(home)teams.push(home);if(away)teams.push(away);
     if(/^\d+$/.test(round)&&Number(round)<=60)rounds.push(round);
     if(field&&!/^(?:-{1,3}|por confirmar|por definir|sin campo|pendiente)$/i.test(field))venues.push(field);
     if(/^\d+$/.test(round))games.push({round,home,away,field,date:date.date,time:date.time});
    }));
    categoryTeams.set(id,[...new Set(teams.map(x=>String(x||'').trim()).filter(Boolean))]);
    categoryRounds.set(id,[...new Set(rounds)]);
    categoryGames.set(id,games);
   }
   knownFields=[...new Set([...localFields,...venues])];catalogLoaded=true;
   fieldOptions();roundOptions();teamOptions();matchHint();
  }catch(_){const h=$('[data-editor-match-hint]',form);if(h)h.textContent='Sin conexión al rol: revisa manualmente los datos antes de publicar.';}
 }
 function matchingGames(){
  const f=form.elements;
  if(f.category.value==='all'||!f.team.value||!f.round.value)return [];
  return (categoryGames.get(f.category.value)||[]).filter(g=>g.round===f.round.value&&
   (normalizeName(g.home)===normalizeName(f.team.value)||normalizeName(g.away)===normalizeName(f.team.value)));
 }
 function matchHint(){
  const hint=$('[data-editor-match-hint]',form);if(!hint)return;
  const f=form.elements,games=matchingGames();
  if(f.category.value==='all'||!f.round.value||!f.team.value)hint.textContent='Elige categoría específica, jornada y equipo para buscar su partido.';
  else if(games.length===1)hint.textContent='Rol: '+games[0].home+' vs '+games[0].away+
   (games[0].date?' · '+games[0].date:'')+(games[0].time?' · '+games[0].time:'')+(games[0].field?' · '+games[0].field:'');
  else hint.textContent=!catalogLoaded?'Esperando rol oficial…':games.length?'Hay varios partidos; verifica los datos.':'No hay un partido coincidente en el rol consultado.';
 }
 function autofillMatch(){
  const games=matchingGames();
  if(games.length!==1)return status(modal,'Elige una categoría, jornada y equipo con un solo partido oficial.');
  const g=games[0],f=form.elements,filled=[];
  for(const [key,val,label] of [['field',g.field,'cancha'],['date',g.date,'fecha'],['time',g.time,'hora']]){
   if(val&&!f[key].value){
    if(key==='field'&&![...fieldInput.options].some(o=>o.value===val))fieldInput.add(new Option(val,val));
    f[key].value=val;filled.push(label);
   }
  }
  updatePreview();checkNotice();matchHint();
  status(modal,filled.length?'Sugeridos desde el rol: '+filled.join(', ')+'. Confirma antes de publicar.':
   'No se sobrescribieron datos ni se inventó información.');
 }
 function qualityNotes(){
  const f=form.elements,warnings=[],details=f.details.value.trim();
  if(!details)warnings.push('Faltan los detalles oficiales confirmados.');
  if(f.type.value==='jornada'&&!f.round.value)warnings.push('Indica la jornada si corresponde.');
  if(f.type.value==='cancha'&&!f.field.value.trim())warnings.push('Selecciona la cancha nueva o afectada.');
  if(f.type.value==='horario'&&!f.time.value)warnings.push('Indica la hora confirmada.');
  if(f.type.value==='junta'&&(!f.date.value||!f.time.value))warnings.push('Para convocar una junta conviene indicar fecha y hora.');
  if(Boolean(f.date.value)!==Boolean(f.time.value))warnings.push('Comprueba la fecha y la hora; una de ellas está vacía.');
  if(f.category.value!=='all'&&f.team.value.trim()&&availableTeamNames.length&&!availableTeamNames.some(x=>normalizeName(x)===normalizeName(f.team.value)))warnings.push('El equipo no coincide con el catálogo de la categoría seleccionada.');
  if(f.category.value!=='all'&&f.round.value&&roundInput.dataset.official==='1'&&!(categoryRounds.get(f.category.value)||[]).includes(f.round.value))warnings.push('Jornada no encontrada en el rol de esa categoría.');
  return warnings;
 }
 function checkNotice(){
  const warnings=qualityNotes();
  const feedback=$('[data-editor-feedback]',form);
  feedback.textContent=warnings.length?'Revisa antes de publicar: '+warnings.join(' '):'Datos básicos completos. Confirma que la información oficial es correcta.';
  feedback.dataset.level=warnings.length?'warning':'ok';
  return warnings;
 }
 loadCatalogs();
 form.elements.category.addEventListener('change',()=>{roundOptions(true);teamOptions(true);matchHint();checkNotice();});
 roundInput.addEventListener('change',matchHint);
 teamInput.addEventListener('change',matchHint);
 $('[data-editor-match-autofill]',form).onclick=autofillMatch;
 $('[data-editor-check]',form).onclick=checkNotice;
 $('[data-editor-schedule]',form).onclick=()=>openScheduler($('[data-editor-schedule]',form));
 $('[data-editor-copy]',form).onclick=async()=>{
  const result=(title.value.trim()+'\n\n'+body.value.trim()).trim();
  if(!body.value.trim())return status(modal,'Escribe primero un mensaje para copiar.');
  try{
   await navigator.clipboard.writeText(result);
   status(modal,'Aviso copiado; compartirlo es una acción manual.');
  }catch(_){status(modal,'El navegador no permitió copiar. Mantén pulsado el texto para copiarlo.');}
 };
 $('[data-editor-calendar]',form).onclick=()=>{
  const f=form.elements;
  if(!f.date.value||!f.time.value)return status(modal,'Para crear un recordatorio, selecciona fecha y hora.');
  const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(f.date.value);
  const t=/^(\d{2}):(\d{2})$/.exec(f.time.value);
  if(!m||!t)return status(modal,'Fecha u hora inválida.');
  const base=Date.UTC(+m[1],+m[2]-1,+m[3],+t[1],+t[2]);
  const stamp=d=>d.toISOString().replace(/[-:]/g,'').slice(0,15);
  const link=new URL('https://calendar.google.com/calendar/render');
  link.searchParams.set('action','TEMPLATE');
  link.searchParams.set('text',title.value.trim()||'Aviso de Liga Juventino Rosas');
  link.searchParams.set('details',body.value.trim().slice(0,4000));
  link.searchParams.set('location',f.field.value.trim());
  link.searchParams.set('dates',stamp(new Date(base))+'/'+stamp(new Date(base+3600000)));
  link.searchParams.set('ctz','America/Mexico_City');
  window.open(link.toString(),'_blank','noopener,noreferrer');
  status(modal,'Se solicitó abrir Google Calendar. Confirma Guardar allí; si no se abre, permite ventanas emergentes. No se creó ningún evento automáticamente.');
 };
 $('[data-editor-local-ai]',form).onclick=async()=>{
  const button=$('[data-editor-local-ai]',form);
  if(!form.elements.details.value.trim())return status(modal,'Escribe primero los hechos confirmados en Detalles.');
  const model=window.LanguageModel;
  if(!model||typeof model.create!=='function')return status(modal,'La IA generativa local no está disponible en este navegador. Puedes usar las plantillas y Revisar datos sin conexión.');
  let session;
  button.disabled=true;status(modal,'Preparando IA en el dispositivo; puede requerir descargar un modelo local…');
  try{
   const availability=typeof model.availability==='function'?await model.availability():null;
   if(availability==='unavailable')throw Error('Modelo local no disponible en este dispositivo.');
   session=await model.create();
   const facts=[
    'Tipo: '+(TYPES[form.elements.type.value]?.[0]||'Aviso'),
    'Categoría: '+catName(form.elements.category.value),
    'Jornada: '+(form.elements.round.value||'no indicada'),
    'Fecha: '+(form.elements.date.value||'no indicada'),
    'Hora: '+(form.elements.time.value||'no indicada'),
    'Sede: '+(form.elements.field.value||'no indicada'),
    'Equipo: '+(form.elements.team.value||'no indicado'),
    'Hechos confirmados: '+form.elements.details.value.trim()
   ].join('\n');
   const generated=await session.prompt('Redacta en español un comunicado oficial breve para Liga Juventino Rosas. Usa EXCLUSIVAMENTE los hechos proporcionados, sin inventar cambios, resultados, sedes, sanciones ni horarios. No añadas datos ausentes. Devuelve solo el comunicado, sin Markdown.\n'+facts);
   const result=String(generated||'').trim().slice(0,4000);
   if(result.length<15)throw Error('La IA no devolvió un mensaje utilizable.');
   body.value=result;updatePreview();
   status(modal,'Borrador propuesto por IA local. Revisa personalmente cada dato antes de publicar; aún no se ha guardado ni enviado.');
  }catch(err){status(modal,'IA local no disponible: '+(err?.message||'error de modelo')+'. Puedes seguir con las plantillas.');}
  finally{try{session?.destroy?.()}catch(_){}button.disabled=false;}
 };
 const updatePreview=()=>{
  $('[data-preview-title]',form).textContent=title.value||'Título del aviso';
  $('[data-preview-body]',form).textContent=body.value||'Aquí aparecerá el comunicado oficial.';
  $('[data-preview-meta]',form).textContent=[catName(form.elements.category.value),form.elements.date.value?dateString(form.elements.date.value):'',form.elements.time.value,form.elements.field.value.trim(),form.elements.scope.value].filter(Boolean).join(' · ');
 };
 function generate(mode='formal'){
  const f=form.elements,t=TYPES[f.type.value]||TYPES.jornada,parts=[];
  if(f.category.value!=='all')parts.push(catName(f.category.value));
  const round=Number(f.round.value);if(Number.isInteger(round)&&round>=1&&round<=60)parts.push('Jornada '+round);
  if(f.field.value.trim())parts.push('Sede: '+f.field.value.trim());
  if(f.team.value.trim())parts.push('Equipo: '+f.team.value.trim());
  if(f.date.value)parts.push(dateString(f.date.value));
  if(f.time.value)parts.push('Hora: '+f.time.value);
  const details=f.details.value.trim().replace(/\s+/g,' ');
  const intro=mode==='urgent'?'ATENCIÓN. ':mode==='formal'?'La Liga Municipal de Fútbol Juventino Rosas A.C. informa: ':'';
  title.value=(mode==='urgent'?'URGENTE · ':'')+t[1];
  body.value=(intro+t[2]+' '+(parts.length?parts.join(' · ')+'. ':'')+
   (details?details+'. ':'')+
   (mode==='formal'?'Consulta esta información en la página oficial de la Liga.':'')).replace(/\s+/g,' ').trim();
  updatePreview();
 }
 form.querySelectorAll('[data-generate]').forEach(b=>b.onclick=()=>generate(b.dataset.generate));
 form.addEventListener('input',()=>{updatePreview();checkNotice();});form.addEventListener('change',()=>{updatePreview();checkNotice();matchHint();});
 generate('formal');checkNotice();
 // V1077: importación opcional del aviso de suspensión, sin publicar ni eludir la API.
 // Solo se rellenan campos del formulario; el administrador debe revisar y pulsar Publicar.
 if(prefill&&typeof prefill==='object'&&!Array.isArray(prefill)){
  const values={type:'suspension',category:String(prefill.category||'all'),round:String(prefill.round||''),date:String(prefill.date||''),time:String(prefill.time||''),field:String(prefill.field||'').slice(0,110),team:String(prefill.team||'').slice(0,90)};
  for(const [key,value] of Object.entries(values)){
   const field=form.elements[key];if(!field)continue;
   if(field.tagName==='SELECT'&&![...field.options].some(o=>o.value===value)){
    if(value&&['round','team','field'].includes(key))field.add(new Option(value,value));
    else continue;
   }
   field.value=value;
   if(key==='category'){roundOptions();teamOptions();}
  }
  form.elements.details.value=String(prefill.details||'').slice(0,1200);
  title.value=String(prefill.title||'Aviso de suspensión').slice(0,160);
  body.value=String(prefill.body||'').slice(0,4000);
  updatePreview();matchHint();
 }
 async function save(published){
  if(saving||!form.reportValidity())return;
  if(body.value.trim().length<15){status(modal,'Agrega un mensaje de por lo menos 15 caracteres.');return}
  if(published&&!form.elements.details.value.trim()){status(modal,'Antes de publicar, escribe los detalles oficiales confirmados del aviso.');form.elements.details.focus();return}
  if(published){const notes=checkNotice();if(notes.length&&!confirm('Hay datos por revisar:\n'+notes.join('\n')+'\n\n¿Continuar a la confirmación?'))return;
   if(!confirm('¿Confirmas que verificaste los hechos y deseas PUBLICAR este aviso para toda la Liga?'))return;}
  const buttons=form.querySelectorAll('[data-editor-draft],[data-editor-publish]');
  saving=true;buttons.forEach(x=>x.disabled=true);
  status(modal,'Verificando permiso y guardando…');
  try{
   await verified();
   const id=savedId||'content:'+crypto.randomUUID();
   const payload={title:title.value.trim(),body:body.value.trim(),scope:form.elements.scope.value,
    category:form.elements.category.value,type:form.elements.type.value,
    field:form.elements.field.value.trim().slice(0,110),team:form.elements.team.value.trim().slice(0,90),
    date:form.elements.date.value,time:form.elements.time.value,
    round:form.elements.round.value?Number(form.elements.round.value):null};
   const result=await media().api('content/'+encodeURIComponent(id),{method:'PUT',body:{kind:'news',payload,revision:savedRevision,published}});
   savedId=id;savedRevision=Number(result?.revision??savedRevision+1);
   await window.LJR_CMS?.refresh?.();
   status(modal,published?'Aviso publicado en Noticias.':'Borrador privado guardado. Ábrelo desde Revisar avisos.');
   form.querySelector('[data-editor-publish]').textContent=published?'Publicado ✓':'Publicar en Noticias';
   form.querySelector('[data-editor-draft]').textContent=published?'Guardar borrador':'Guardado ✓';
   if(published){window.dispatchEvent(new Event('liga:content'));setTimeout(()=>{if(modal.isConnected)modal.querySelector('[data-close]')?.click()},900);}
   else buttons.forEach(x=>x.disabled=false);
  }catch(err){
   status(modal,'No se guardó el aviso: '+(err?.message||'Error de conexión'));
   buttons.forEach(x=>x.disabled=false);
   if([401,403].includes(err?.status))media()?.login?.();
  }finally{saving=false}
 }
 form.onsubmit=ev=>{ev.preventDefault();save(true)};
 $('[data-editor-draft]',form).onclick=()=>save(false);
}
function openReview(){
 if(!admin())return media()?.login?.(openReview);
 const modal=createModal('Revisar avisos','<div class="ljr-editor-review ljr-review-smart">'+
  '<p class="ljr-editor-note">Comunicados guardados en el servidor de la Liga. Solo la administración autorizada puede publicar, editar o retirar.</p>'+
  '<div class="ljr-review-stats" data-review-stats aria-label="Resumen de avisos"></div>'+
  '<div class="ljr-editor-tools ljr-review-tabs" role="group" aria-label="Estado">'+
  '<button type="button" data-state="all" aria-pressed="true">Todos <span data-count="all">0</span></button>'+
  '<button type="button" data-state="draft" aria-pressed="false">Borradores <span data-count="draft">0</span></button>'+
  '<button type="button" data-state="published" aria-pressed="false">Publicados <span data-count="published">0</span></button></div>'+
  '<div class="ljr-review-filters" role="search" aria-label="Buscar avisos">'+
  '<label class="ljr-review-search"><span>Buscar aviso</span><input type="search" data-review-query placeholder="Título, equipo, sede, contenido…" autocomplete="off"></label>'+
  '<label><span>Categoría</span><select data-review-category>'+CATS.map(x=>'<option value="'+x[0]+'">'+esc(x[1])+'</option>').join('')+'</select></label>'+
  '<label><span>Tipo</span><select data-review-type><option value="all">Todos los tipos</option>'+Object.entries(TYPES).map(([key,val])=>'<option value="'+esc(key)+'">'+esc(val[0])+'</option>').join('')+'</select></label>'+ 
  '<label><span>Orden</span><select data-review-order><option value="recent">Más recientes</option><option value="old">Más antiguos</option><option value="title">Título A–Z</option></select></label></div>'+
  '<div class="ljr-review-automation"><button type="button" data-review-audit>✓ Revisar calidad</button>'+
  '<button type="button" data-review-ai>✦ Revisión inteligente local</button>'+ 
  '<button type="button" data-review-clear>Limpiar filtros</button>'+
  '<label><input type="checkbox" data-review-auto> Actualizar cada minuto</label></div>'+
  '<div class="ljr-review-insights" data-review-insights hidden role="status" aria-live="polite"></div>'+
  '<div class="ljr-review-meta" data-review-meta role="status" aria-live="polite">Consultando avisos…</div>'+ 
  '<p class="ljr-review-feedback" data-status role="status" aria-live="polite"></p>'+
  '<div data-editor-list aria-live="polite">Cargando avisos…</div>'+
  '<button type="button" data-review-more hidden>Ver más avisos</button>'+
  '<div class="ljr-review-footer"><button type="button" data-reload>↻ Actualizar lista</button>'+
  '<button type="button" data-review-new>＋ Crear aviso</button>'+
  '<button type="button" data-review-csv>↓ CSV privado</button></div>'+
  '</div>','ljr-editor-review-dialog');
 let records=[],filter='all',query='',category='all',type='all',order='recent',loading=false,ready=false,limit=40,interval=null,searchTimer=null,aiAvailability='unavailable';
 const list=$('[data-editor-list]',modal),meta=$('[data-review-meta]',modal),insights=$('[data-review-insights]',modal);
 const clean=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const timestamp=r=>String(r.updated||r.updatedAt||r.created||r.createdAt||'');
 const niceDate=d=>{const n=new Date(d);return d&&!Number.isNaN(n.getTime())?n.toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric'}):'Sin fecha'};
 const entryText=r=>{const p=r.payload||{};return [p.title,p.body,p.team,p.field,p.category,p.type,p.date].join(' ')};
 const makeButton=(text,click,cls)=>{const b=document.createElement('button');b.type='button';b.textContent=text;if(cls)b.className=cls;b.addEventListener('click',click);return b};
 const allCounts=()=>{
  const counts={all:records.length,draft:records.filter(r=>!r.published).length,published:records.filter(r=>!!r.published).length};
  modal.querySelectorAll('[data-count]').forEach(e=>{e.textContent=String(counts[e.dataset.count]||0)});
  const stats=$('[data-review-stats]',modal);
  stats.replaceChildren();
  [['Total',counts.all],['Borradores',counts.draft],['Publicados',counts.published]].forEach(([name,count])=>{
   const x=document.createElement('div');const n=document.createElement('strong');n.textContent=String(count);
   const t=document.createElement('small');t.textContent=name;x.append(n,t);stats.append(x);
  });
 };
 function paint(){
  if(!modal.isConnected)return;
  list.replaceChildren();allCounts();
  if(!ready){meta.textContent='Consultando el servidor de la Liga…';return}
  const shown=records.filter(r=>{
   const p=r.payload||{};
   return (filter==='all'||(filter==='published'?!!r.published:!r.published))&&
    (category==='all'||String(p.category??'all')===category)&&
    (type==='all'||String(p.type||'')===type)&&
    (!query||clean(entryText(r)).includes(clean(query)));
  }).sort((a,b)=>order==='title'?
   String(a.payload?.title||'').localeCompare(String(b.payload?.title||''),'es',{sensitivity:'base'}):
   order==='old'?timestamp(a).localeCompare(timestamp(b)):timestamp(b).localeCompare(timestamp(a)));
  meta.textContent=shown.length+' de '+records.length+' avisos · Solo administración · '+(interval?'Actualización automática activa':'Actualización manual');
  $('[data-review-more]',modal).hidden=shown.length<=limit;
  if(!shown.length){
   const p=document.createElement('div');p.className='ljr-editor-empty ljr-review-empty';
   const title=document.createElement('strong');title.textContent=records.length?'No hay resultados para estos filtros.':'Todavía no hay avisos guardados.';
   const hint=document.createElement('p');hint.textContent=records.length?'Prueba con otra categoría, búsqueda o estado.':'Puedes crear el primer aviso, guardarlo como borrador y publicarlo después de revisarlo.';
   p.append(title,hint);list.append(p);return;
  }
  shown.slice(0,limit).forEach(record=>{
   const p=record.payload||{},card=document.createElement('article');
   card.className='ljr-editor-row ljr-review-card';
   const top=document.createElement('div');top.className='ljr-review-card-top';
   const badge=document.createElement('span');badge.className='ljr-review-badge '+(record.published?'is-published':'is-draft');badge.textContent=record.published?'✓ Publicado':'◷ Borrador';
   const date=document.createElement('small');date.textContent=niceDate(timestamp(record));
   top.append(badge,date);card.append(top);
   const h=document.createElement('strong');h.className='ljr-review-heading';h.textContent=p.title||'Aviso sin título';card.append(h);
   const details=document.createElement('div');details.className='ljr-review-chips';
   [catName(String(p.category||'all')),TYPES[p.type]?.[0]||'General',p.team?('Equipo: '+p.team):'',p.field?('Sede: '+p.field):'']
    .filter(Boolean).forEach(value=>{const tag=document.createElement('span');tag.textContent=value;details.append(tag)});
   card.append(details);
   const body=document.createElement('p');body.className='ljr-review-body';body.textContent=p.body||'Sin contenido';
   body.hidden=true;card.append(body);
   const actions=document.createElement('div');actions.className='ljr-editor-row-actions ljr-review-actions';
   actions.append(makeButton('Ver',()=>{body.hidden=!body.hidden;preview.textContent=body.hidden?'Ver':'Ocultar'},'ljr-review-view'));
   const preview=actions.lastElementChild;
   actions.append(makeButton('Editar',()=>{window.LJR_CMS?.editor?.('news',record)},'ljr-review-edit'));
   actions.append(makeButton('Compartir',async()=>{
    if(!record.published&&!confirm('Este aviso es un borrador privado. ¿Deseas compartirlo fuera de la administración?'))return;
    const txt=(p.title||'Aviso oficial')+'\n\n'+(p.body||'')+'\n\nLiga Juventino Rosas';
    try{
     if(navigator.share){await navigator.share({title:p.title||'Aviso oficial',text:txt});status(modal,'Se abrió la opción para compartir.')}
     else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(txt);status(modal,'Aviso copiado. Puedes pegarlo en WhatsApp.')}
     else status(modal,'Tu navegador no permite compartir o copiar directamente.');
    }catch(e){if(e?.name!=='AbortError')status(modal,'No se pudo compartir: '+(e?.message||'Error'))}
   },'ljr-review-share'));
   if(!record.published){
    actions.append(makeButton('Publicar',async ev=>{
     if(!confirm('¿Publicar este aviso en Noticias para todos los visitantes? Revisa antes fechas y datos oficiales.'))return;
     const btn=ev.currentTarget;btn.disabled=true;
     try{
      await verified();
      await media().api('content/'+encodeURIComponent(record.id),{method:'PUT',body:{kind:'news',payload:record.payload,revision:record.revision,published:true}});
      await window.LJR_CMS?.refresh?.();await reload();window.dispatchEvent(new Event('liga:content'));
      status(modal,'Aviso publicado en Noticias.');
     }catch(err){status(modal,'No se pudo publicar: '+(err?.message||'Error'));btn.disabled=false}
    },'ljr-review-publish'));
   }
   actions.append(makeButton(record.published?'Retirar':'Eliminar',async ev=>{
    if(!confirm(record.published?'¿Retirar este aviso de Noticias para todos los visitantes?':'¿Eliminar este borrador permanentemente?'))return;
    const btn=ev.currentTarget;btn.disabled=true;
    try{
     await verified();
     await media().api('content/'+encodeURIComponent(record.id),{method:'DELETE',body:{revision:record.revision}});
     await window.LJR_CMS?.refresh?.();await reload();window.dispatchEvent(new Event('liga:content'));
     status(modal,'Aviso retirado correctamente.');
    }catch(err){status(modal,'No se pudo retirar: '+(err?.message||'Error'));btn.disabled=false}
   },'ljr-review-danger'));
   card.append(actions);list.append(card);
  });
 }
 function audit(){
  const findings=[],seen=new Map(),urgent=['horario','cancha','suspension','junta','jornada'];
  records.forEach(r=>{
   const p=r.payload||{},name=p.title||'Sin título',key=clean([name,p.category,p.date].join('|'));
   if(key&&seen.has(key))findings.push('Posible duplicado: '+name);
   else if(key)seen.set(key,true);
   if(!p.title?.trim())findings.push('Falta título en un aviso.');
   if(!p.body||p.body.trim().length<35)findings.push('Texto demasiado corto: '+name);
   if(urgent.includes(p.type)&&!p.date) findings.push('Revisar fecha del aviso: '+name);
   if(p.type==='cancha'&&!p.field) findings.push('Revisar sede del aviso: '+name);
   if(p.type==='horario'&&!p.time) findings.push('Revisar horario del aviso: '+name);
  });
  insights.hidden=false;insights.replaceChildren();
  const heading=document.createElement('strong');heading.textContent=findings.length?'Revisión local · '+findings.length+' observaciones':'Revisión local · Sin observaciones básicas';
  const hint=document.createElement('p');hint.textContent='Análisis automático por reglas en este dispositivo. No confirma datos oficiales ni modifica publicaciones.';
  insights.append(heading,hint);
  const ul=document.createElement('ul');
  (findings.length?[...new Set(findings)].slice(0,8):['Los avisos revisados no tienen advertencias básicas.']).forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.append(li)});
  insights.append(ul);return findings;
 }
 async function reload(){
  if(loading||!modal.isConnected)return;
  loading=true;const btn=$('[data-reload]',modal);btn.disabled=true;
  if(!ready){list.textContent='Consultando avisos…';meta.textContent='Conectando…'}
  try{
   await verified();
   const result=await media().api('content?admin=1');
   if(!Array.isArray(result?.items))throw Error('El servidor no devolvió un listado válido.');
   records=result.items.filter(x=>x?.kind==='news');ready=true;paint();
  }catch(err){
   const message='No se pueden consultar los avisos: '+(err?.message||'Error de conexión');
   meta.textContent=message;
   if(!ready){list.replaceChildren();const error=document.createElement('p');error.className='ljr-editor-empty';error.textContent=message;list.append(error)}
   status(modal,'La lista anterior, si existe, se conserva. '+message);
   if([401,403].includes(err?.status))media()?.login?.();
  }finally{loading=false;btn.disabled=false}
 }
 modal.querySelectorAll('[data-state]').forEach(b=>b.onclick=()=>{
  filter=b.dataset.state;limit=40;
  modal.querySelectorAll('[data-state]').forEach(v=>v.setAttribute('aria-pressed',String(v===b)));paint()
 });
 $('[data-review-query]',modal).addEventListener('input',e=>{
  const next=e.target.value;clearTimeout(searchTimer);
  searchTimer=setTimeout(()=>{if(!modal.isConnected)return;query=next;limit=40;paint()},120);
 });
 $('[data-review-category]',modal).addEventListener('change',e=>{category=e.target.value;limit=40;paint()});
 $('[data-review-type]',modal).addEventListener('change',e=>{type=e.target.value;limit=40;paint()});
 $('[data-review-order]',modal).addEventListener('change',e=>{order=e.target.value;paint()});
 $('[data-review-more]',modal).onclick=()=>{limit+=40;paint()};
 $('[data-review-clear]',modal).onclick=()=>{
  clearTimeout(searchTimer);query='';category='all';type='all';order='recent';filter='all';limit=40;
  $('[data-review-query]',modal).value='';
  $('[data-review-category]',modal).value='all';
  $('[data-review-type]',modal).value='all';
  $('[data-review-order]',modal).value='recent';
  modal.querySelectorAll('[data-state]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.state==='all')));
  status(modal,'Filtros limpiados.');paint();
 };
 $('[data-reload]',modal).onclick=reload;
 $('[data-review-new]',modal).onclick=()=>showComposer();
 $('[data-review-audit]',modal).onclick=()=>{if(!ready)return status(modal,'Espera a que carguen los avisos.');audit()};
 $('[data-review-auto]',modal).onchange=e=>{
  if(interval){clearInterval(interval);interval=null}
  if(e.target.checked)interval=setInterval(()=>{
   if(!modal.isConnected){clearInterval(interval);interval=null;return}
   if(document.visibilityState==='visible')reload();
  },60000);
  if(ready)paint();
 };
 $('[data-review-ai]',modal).onclick=async e=>{
  if(!ready)return status(modal,'Espera a que carguen los avisos.');
  audit();
  if(!records.length){status(modal,'Todavía no hay avisos para revisar.');return;}
  if(aiAvailability!=='available'||typeof window.LanguageModel?.create!=='function'){
   return status(modal,'IA del navegador no disponible aquí; se usó la revisión local por reglas sin enviar datos.');
  }
  const button=e.currentTarget;button.disabled=true;
  let session;
  try{
   // Crear la sesión al tocar el botón; ningún modelo externo recibe los borradores.
   const pending=window.LanguageModel.create();
   status(modal,'Analizando avisos con el modelo local del navegador…');
   session=await pending;
   const sample=records.slice(0,8).map(r=>({
    estado:r.published?'publicado':'borrador',titulo:String(r.payload?.title||'').slice(0,120),
    texto:String(r.payload?.body||'').slice(0,320),tipo:r.payload?.type||'',fecha:r.payload?.date||''
   }));
   const reply=await session.prompt('Revisa la claridad de estos comunicados de una liga de fútbol. Responde en español con máximo 5 sugerencias breves y concretas. No inventes datos, resultados ni fechas. No publiques nada. Datos: '+JSON.stringify(sample));
   const result=document.createElement('p');result.className='ljr-review-ai-response';result.textContent=String(reply).slice(0,2000);
   insights.hidden=false;insights.append(result);status(modal,'Análisis local terminado. Revisa las sugerencias antes de usarlas.');
  }catch(err){status(modal,'IA local no disponible: '+(err?.message||'Error')+'. Se conserva la revisión por reglas.')}
  finally{try{session?.destroy?.()}catch(_){}button.disabled=false}
 };
 if(typeof window.LanguageModel?.availability==='function'){
  window.LanguageModel.availability().then(x=>{aiAvailability=x;
   const button=$('[data-review-ai]',modal);
   if(button)button.title=x==='available'?'IA generativa local disponible':'Revisión automática mediante reglas locales; la IA generativa de Chrome no está disponible en este dispositivo.';
  }).catch(()=>{aiAvailability='unavailable'});
 }
 $('[data-review-csv]',modal).onclick=()=>{
  if(!ready||!records.length)return status(modal,'No hay avisos para exportar.');
  if(!confirm('Se descargará un CSV privado que podría contener borradores no publicados. No lo compartas sin autorización. ¿Continuar?'))return;
  const safe=x=>{let s=String(x??'').replace(/\r?\n/g,' ');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
  const lines=[['Estado','Título','Categoría','Tipo','Fecha','Equipo','Cancha','Mensaje'].map(safe).join(',')];
  records.forEach(r=>{const p=r.payload||{};lines.push([r.published?'Publicado':'Borrador',p.title,catName(String(p.category||'all')),p.type,p.date,p.team,p.field,p.body].map(safe).join(','))});
  const url=URL.createObjectURL(new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='avisos-liga-privado-'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  status(modal,'CSV privado descargado en este dispositivo.');
 };
 reload();
}

/* Editor visual para administradores que no conocen rutas ni programación. */
const SECTIONS=[
 ['Inicio','home','news'],['Noticias y avisos','news','news'],
 ['Competición','competition','fixture'],['Jornadas y resultados','competition','fixture'],
 ['Clasificación','competition','standings'],['Goleadores','scorers','scorers'],
 ['Equipos','teams','team'],['Jugadores','players','player'],
 ['Sancionados','discipline','sanction'],['Cédulas y documentos','cedulas','document'],
 ['Vídeos y transmisiones','video','transmission'],['Historia','history','page'],
 ['Tienda','club-store','product'],['Match Center','match','fixture'],
 ['Más y herramientas','more','page']
];
/* Auditoria local: solo analiza la pantalla; no lee ni transmite datos privados. */
function inspectEditorScreen(item){
 const scope=document.querySelector('#screen')||document.querySelector('main');
 if(!scope)return {title:item[0],metrics:{},tips:['No se encontró la pantalla para analizar.'],details:'La página todavía no terminó de abrir.'};
 const visible=node=>{
  const box=node.getBoundingClientRect(),css=getComputedStyle(node);
  return box.width>0&&box.height>0&&css.visibility!=='hidden'&&css.display!=='none';
 };
 const imgs=[...scope.querySelectorAll('img')].filter(visible);
 const broken=imgs.filter(img=>img.complete&&img.naturalWidth===0&&!!img.getAttribute('src')).length;
 const unlabelled=imgs.filter(img=>!img.hasAttribute('alt')&&!img.hasAttribute('aria-label')&&img.getAttribute('role')!=='presentation'&&img.getAttribute('aria-hidden')!=='true').length;
 const actions=[...scope.querySelectorAll('button,a,select,[role="button"]')].filter(visible);
 const small=actions.filter(node=>{const r=node.getBoundingClientRect();return r.width<36||r.height<36}).length;
 const nameless=actions.filter(node=>node.matches('button,[role="button"]')&&!String(node.innerText||node.textContent||'').trim()&&!node.getAttribute('aria-label')&&!node.getAttribute('title')).length;
 const emptyLinks=actions.filter(node=>node.tagName==='A'&&(!node.getAttribute('href')||node.getAttribute('href')==='#')).length;
 const overflowing=scope.scrollWidth>scope.clientWidth+8||document.documentElement.scrollWidth>window.innerWidth+8;
 const metrics={imagenes:imgs.length,botonesYEnlaces:actions.length,imagenesSinCargar:broken,imagenesSinDescripcion:unlabelled,controlesPequenos:small,controlesSinNombre:nameless,enlacesIncompletos:emptyLinks,desbordeHorizontal:overflowing};
 const tips=[];
 if(broken)tips.push('Revisar '+broken+' imagen(es) que no cargan y verificar sus rutas.');
 if(unlabelled)tips.push('Agregar descripciones accesibles a '+unlabelled+' imagen(es) o marcarlas como decorativas.');
 if(small)tips.push('Ampliar '+small+' control(es) táctiles a 40–44 px sin tapar el contenido.');
 if(nameless)tips.push('Dar un nombre accesible a '+nameless+' botón(es) con solo icono.');
 if(emptyLinks)tips.push('Revisar '+emptyLinks+' enlace(s) sin destino válido.');
 if(overflowing)tips.push('Corregir el desplazamiento horizontal y los elementos que salen de la pantalla.');
 if(!tips.length)tips.push('No se detectaron fallas básicas. Revisar legibilidad, contraste y separación de elementos antes de publicar.');
 tips.push('Conservar el degradado azul de la Liga y los logos originales sin fondo.');
 return {title:item[0],metrics,tips,details:'Revisión automática de la pantalla visible. Los resultados son orientativos; no modifican datos oficiales.'};
}
function showEditorAudit(item){
 if(!admin())return;
 const result=inspectEditorScreen(item);
 const modal=createModal('Revisión · '+item[0],'<section class="ljr-editor-review ljr-editor-audit">'+
  '<p class="ljr-editor-note">Análisis local y de solo lectura. No publica nada ni envía información a servicios externos.</p>'+
  '<div class="ljr-editor-audit-summary" data-audit-summary></div>'+
  '<h3>Mejoras recomendadas</h3><ul data-audit-tips></ul>'+
  '<div class="ljr-editor-audit-actions"><button type="button" data-audit-copy>Copiar diagnóstico</button>'+
  '<button type="button" data-audit-ai>IA del dispositivo</button>'+
  '<button type="button" data-audit-back>Volver al editor</button></div>'+
  '<p class="ljr-editor-note" data-audit-status aria-live="polite">La IA generativa local es opcional y depende del navegador; el diagnóstico anterior funciona sin ella.</p>'+
  '<pre data-audit-output hidden></pre></section>','ljr-editor-audit-dialog');
 const box=$('[data-audit-summary]',modal),list=$('[data-audit-tips]',modal),message=$('[data-audit-status]',modal),aiOutput=$('[data-audit-output]',modal);
 const m=result.metrics;
 box.textContent='Pantalla: '+result.title+' · '+(m.imagenes||0)+' imágenes · '+(m.botonesYEnlaces||0)+' controles · '+(m.controlesPequenos||0)+' controles pequeños.';
 result.tips.forEach(tip=>{const li=document.createElement('li');li.textContent=tip;list.append(li)});
 const printable=()=>result.title+'\n'+result.details+'\n'+Object.entries(m).map(([k,v])=>k+': '+v).join('\n')+'\n'+result.tips.map(t=>'- '+t).join('\n')+(aiOutput.hidden?'':'\nIA local:\n'+aiOutput.textContent);
 $('[data-audit-copy]',modal).onclick=async()=>{
  try{await navigator.clipboard.writeText(printable());message.textContent='Diagnóstico copiado. No se ha publicado nada.'}
  catch(_){message.textContent='No se pudo copiar automáticamente. Selecciona y copia el texto del diagnóstico.';aiOutput.hidden=false;aiOutput.textContent=printable()}
 };
 $('[data-audit-back]',modal).onclick=()=>{modal.querySelector('[data-close]')?.click();openPages()};
 $('[data-audit-ai]',modal).onclick=async event=>{
  const button=event.currentTarget,API=window.LanguageModel;
  if(!API||typeof API.availability!=='function'){
   message.textContent='Este navegador no dispone de IA generativa integrada. El diagnóstico local anterior sí está disponible (en Android también).';
   return;
  }
  button.disabled=true;message.textContent='Comprobando el modelo local del navegador…';
  let session;
  try{
   const options={expectedInputs:[{type:'text',languages:['es']}],expectedOutputs:[{type:'text',languages:['es']}]};
   const availability=await API.availability(options);
   if(availability!=='available'){
    message.textContent='El modelo no está listo ('+availability+'). No se descargará sin tu decisión. Usa las recomendaciones locales.';
    return;
   }
   session=await API.create(options);
   const prompt='Actúa como auditor UX de una app de fútbol. Responde en español con máximo 5 acciones concretas, sin inventar datos deportivos ni decir que se cambiaron cosas. Solo tienes métricas de diseño, no datos personales. Sección: '+item[0]+'. Métricas: '+JSON.stringify(m)+'. Observaciones: '+result.tips.join(' ');
   const answer=await session.prompt(prompt);
   aiOutput.textContent=String(answer||'Sin recomendaciones adicionales.').slice(0,2400);
   aiOutput.hidden=false;
   message.textContent='Sugerencias generadas en el modelo integrado del dispositivo. Revísalas antes de hacer cambios.';
  }catch(err){message.textContent='No se pudo iniciar la IA del dispositivo: '+(err?.message||'No compatible')+'. Se mantienen las recomendaciones automáticas.'}
  finally{try{session?.destroy?.()}catch(_){} button.disabled=false}
 };
}
function openPages(){
 if(!admin())return media()?.login?.(openPages);
 const stored=(()=>{try{return Number(localStorage.getItem('ljr-editor-last-section-v1'))}catch(_){return NaN}})();
 const route=String(location.hash||'').replace(/^#\/?/,'').split(/[/?]/)[0];
 const currentIndex=SECTIONS.findIndex(x=>x[1]===route);
 let picked=Number.isInteger(stored)&&stored>=0&&stored<SECTIONS.length?stored:Math.max(0,currentIndex);
 const modal=createModal('Editar mi página','<section class="ljr-editor-review ljr-editor-page-panel">'+
  '<p class="ljr-editor-note">Elige una sección para editar información oficial o modificar elementos en pantalla sin programar.</p>'+
  '<label class="ljr-editor-target">Buscar sección<input type="search" data-page-search placeholder="Ej. Goleadores, equipos, historia" autocomplete="off"></label>'+
  '<label class="ljr-editor-target">Sección de la aplicación<select data-section aria-label="Sección a editar"></select></label>'+
  '<p class="ljr-editor-section-info" data-page-detail aria-live="polite"></p>'+
  '<div class="ljr-editor-two-choice">'+
  '<button type="button" data-page-content><span aria-hidden="true">✎</span>Editar información</button>'+
  '<button type="button" data-page-visual><span aria-hidden="true">▣</span>Editar diseño en pantalla</button></div>'+
  '<div class="ljr-editor-extra-actions">'+
  '<button type="button" data-page-preview>◉ Ver sección</button>'+
  '<button type="button" data-page-analyze>◇ Revisar diseño</button>'+
  '<button type="button" data-page-copy>↗ Copiar enlace</button></div>'+
  '<small class="ljr-editor-note">La revisión detecta problemas visuales en tu dispositivo. Solo se publica al guardar con una sesión autorizada por el servidor.</small>'+
  '<p data-status aria-live="polite"></p>'+
  '</section>','ljr-editor-page-picker');
 const select=$('[data-section]',modal),search=$('[data-page-search]',modal),detail=$('[data-page-detail]',modal);
 const buttons=[...modal.querySelectorAll('[data-page-content],[data-page-visual],[data-page-preview],[data-page-analyze],[data-page-copy]')];
 const fold=t=>String(t).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function describe(){
  const item=select.options.length?SECTIONS[Number(select.value)]:null;
  detail.textContent=item?'Pantalla: '+item[0]+' · '+item[1]+' · '+(item[2]==='fixture'?'Partidos y jornadas':item[2]==='team'?'Equipos':item[2]==='player'?'Jugadores':'Contenido de la Liga'):'No se encontraron secciones. Prueba con otra palabra.';
  buttons.forEach(b=>b.disabled=!item);
 }
 function paint(){
  const matches=SECTIONS.map((item,i)=>({item,i})).filter(x=>fold(x.item[0]+' '+x.item[1]+' '+x.item[2]).includes(fold(search.value.trim())));
  select.innerHTML=matches.map(x=>'<option value="'+x.i+'">'+esc(x.item[0])+'</option>').join('');
  if(matches.length){if(!matches.some(x=>x.i===picked))picked=matches[0].i;select.value=String(picked)}
  describe();
 }
 function remember(){picked=Number(select.value);try{localStorage.setItem('ljr-editor-last-section-v1',String(picked))}catch(_){}describe()}
 select.addEventListener('change',remember);search.addEventListener('input',paint);paint();
 async function execute(mode){
  const item=select.options.length?SECTIONS[Number(select.value)]:null;if(!item||!select.options.length)return;
  try{
   await verified();remember();
   if(mode==='content'){
    if(typeof window.LJR_CMS?.open!=='function')throw Error('Editor de contenido no disponible.');
    modal.querySelector('[data-close]')?.click();window.LJR_CMS.open(item[2]);return;
   }
   modal.querySelector('[data-close]')?.click();
   location.hash='#/'+item[1];
   if(mode==='preview')return;
   setTimeout(()=>{
    if(!admin())return;
    if(mode==='analyze'){showEditorAudit(item);return}
    if(typeof window.LJR_CMS?.editPage==='function')window.LJR_CMS.editPage();
    else media()?.modal?.('Edición visual','La herramienta de edición visual no está disponible en este momento.');
   },850);
  }catch(err){status(modal,'No se puede abrir: '+(err?.message||'Error de sesión'))}
 }
 $('[data-page-content]',modal).onclick=()=>execute('content');
 $('[data-page-visual]',modal).onclick=()=>execute('visual');
 $('[data-page-preview]',modal).onclick=()=>execute('preview');
 $('[data-page-analyze]',modal).onclick=()=>execute('analyze');
 $('[data-page-copy]',modal).onclick=async()=>{
  const item=select.options.length?SECTIONS[Number(select.value)]:null;if(!item||!select.options.length)return;
  try{await verified();const url=new URL(location.href);url.hash='#/'+item[1];await navigator.clipboard.writeText(url.href);remember();status(modal,'Enlace de la sección copiado.')}
  catch(err){status(modal,'No se pudo copiar el enlace: '+(err?.message||'Permiso denegado'))}
 };
}
/* Respaldo oficial V1212: un panel cifrado sustituye a la descarga JSON abierta.
   El servidor debe imponer autorización también en la petición de contenido. */
async function exportBackup(){
 if(!admin())return media()?.login?.(exportBackup);
 try{
  const who=await verified();
  if(who.owner!==true)throw Error('Solo las cuentas principales autorizadas por el servidor pueden consultar este respaldo.');
  if(!document.querySelector('[data-ljr-backup-v1212-css]')){
   const css=document.createElement('link');css.rel='stylesheet';
   css.href=new URL('./src/v1212-official-backup-center.css?v=20261010-v1213-local-ai-official-blue',document.baseURI).href;
   css.setAttribute('data-ljr-backup-v1212-css','');document.head.append(css);
  }
  if(!window.LJR_BACKUP_CENTER?.open){
   if(!window.__LJR_BACKUP_CENTER_LOADING){
    window.__LJR_BACKUP_CENTER_LOADING=new Promise((resolve,reject)=>{
     const script=document.createElement('script');script.async=true;
     script.src=new URL('./src/v1212-official-backup-center.js?v=20261010-v1213-local-ai-official-blue',document.baseURI).href;
     script.onload=()=>window.LJR_BACKUP_CENTER?.open?resolve():reject(Error('El módulo de respaldo no pudo iniciarse.'));
     script.onerror=()=>reject(Error('No se pudo cargar el respaldo protegido.'));
     document.head.append(script);
    }).catch(error=>{window.__LJR_BACKUP_CENTER_LOADING=null;throw error});
   }
   await window.__LJR_BACKUP_CENTER_LOADING;
  }
  await window.LJR_BACKUP_CENTER.open();
 }catch(err){alert('Respaldo oficial: '+(err?.message||'No se pudo abrir.'))}
}

function openScheduler(origin){
 if(!admin())return media()?.login?.(()=>openScheduler(origin));
 origin?.closest('.liga-media-modal')?.querySelector('[data-close]')?.click();
 location.hash='#/notifications';
}
function addPanel(dialog){
 if(!admin()||dialog.querySelector('[data-ljr-editor-center]'))return;
 const home=dialog.querySelector('.ljr-admin-area');
 if(!home)return;
 const box=document.createElement('section');box.className='ljr-admin-area ljr-editor-hub';
 box.setAttribute('data-ljr-editor-center','');
 box.innerHTML='<h3 class="ljr-admin-section-title">Avisos y automatización</h3>'+
  '<p class="ljr-admin-section-sub">Publica sin programar, gestiona borradores y configura avisos desde el teléfono.</p>'+
  '<div class="ljr-editor-hub-grid">'+
  '<button type="button" data-editor-open="compose"><b>✎</b><span>Crear aviso<small>Texto guiado y publicación</small></span></button>'+
  '<button type="button" data-editor-open="review"><b>✓</b><span>Revisar avisos<small>Borradores y publicados</small></span></button>'+
  '<button type="button" data-editor-open="schedule"><b>◷</b><span>Programar avisos<small>Recordatorios en este teléfono</small></span></button>'+ 
  '<button type="button" data-editor-open="page"><b>▣</b><span>Editar páginas<small>Texto, fotos y secciones</small></span></button>'+ 
  (media()?.admin?.owner?'<button type="button" data-editor-open="backup"><b>↓</b><span>Respaldo privado<small>Solo acceso total verificado</small></span></button>':'')+'</div>'+
  '<p class="ljr-editor-security">🔒 Los visitantes solo consultan información. Editar y publicar requiere una sesión autorizada y permiso del servidor.</p>';
 home.after(box);
 box.addEventListener('click',event=>{
  const b=event.target.closest('[data-editor-open]');if(!b)return;
  const choice=b.dataset.editorOpen;
  if(choice==='compose')showComposer();
  else if(choice==='review')openReview();
  else if(choice==='schedule')openScheduler(b);
  else if(choice==='page')openPages();
  else if(choice==='backup')exportBackup();
 });
}
function scan(){
 document.querySelectorAll('.liga-media-modal > section.ljr-admin-manage').forEach(addPanel);
 if(!admin())document.querySelectorAll('[data-ljr-editor-center]').forEach(n=>n.remove());
}
let pending=false;
function scheduleScan(){if(pending)return;pending=true;queueMicrotask(()=>{pending=false;scan()})}
document.addEventListener('liga:admin',scheduleScan);
function start(){new MutationObserver(scheduleScan).observe(document.body,{childList:true,subtree:true});scan()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.LJR_EDITOR_CENTER={openNotice:showComposer,openReview,openPages,exportBackup};
})();