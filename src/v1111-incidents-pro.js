/* V1111 — Bitácora de incidencias local por partido.
 * No escribe marcadores, cedulas ni sanciones oficiales; mantiene v105-incidents.
 */
(function(){
'use strict';
if(window.LJR_INCIDENTS_PRO)return;
const KEY='v105-incidents';
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const get=(root,s)=>root.querySelector(s);
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const ALL_TYPES=['Gol','Gol en propia puerta','Tarjeta amarilla','Segunda amarilla','Tarjeta roja','Sustitución','Lesión','Penal marcado','Penal fallado','Gol anulado','Fuera de juego','Suspensión por lluvia','Interrupción','Reanudación','Inicio de tiempo','Final de tiempo','Observación'];
const data=()=>{try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}};
const records=()=>{try{const raw=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(raw)?raw.filter(x=>x&&typeof x==='object').map((x,i)=>Object.assign({},x,{id:String(x.id||'anterior-'+i)})):[]}catch(_){return []}};
const save=list=>{try{localStorage.setItem(KEY,JSON.stringify(list));return true}catch(_){return false}};
const kind=t=>/Gol|Penal marcado/.test(t)?'goal':/amarilla|roja/.test(t)?'card':/Sustituci/.test(t)?'sub':'other';
const symbol=t=>/Gol|Penal marcado/.test(t)?'⚽':/amarilla/.test(t)?'🟨':/roja/.test(t)?'🟥':/Sustituci/.test(t)?'↔':'●';
function fixtures(){
 const out=[],db=data();
 Object.entries(db.categories||{}).forEach(([cat,c])=>{
  (c.fixtures||[]).forEach(group=>{
   (Array.isArray(group?.rows)?group.rows:[]).forEach(r=>{
    const home=String(r?.[2]||'').trim(),away=String(r?.[6]||'').trim();
    if(!home||!away||home==='—'||away==='—')return;
    const round=String(r?.[1]||'').trim(),season=String(c.season_id??'');
    const id=[cat,season,round,home,away].join('|');
    if(out.some(x=>x.id===id))return;
    out.push({id,cat,category:c.name||'Categoría '+cat,home,away,round,date:String(r?.[8]||''),field:String(r?.[7]||'')});
   });
  });
 });
 return out.slice(0,1400);
}
/* Igual que Equipos/Siguiendo: clubes tomados del registro oficial por categoría.
   También funciona en la bitácora general, sin elegir un partido. */
function categoryTeams(cat){
 const db=data(),out=[],seen=new Set();
 const add=value=>{
  const name=String(value||'').trim(),key=norm(name);
  if(!key||/^(sin equipo|descansa|libre|por definir|pendiente|sin asignar)$/.test(key)||
    /goles? en temporada/.test(key)||/^\d+ goles?$/.test(key)||seen.has(key))return;
  seen.add(key);out.push(name);
 };
 const ids=cat==='all'?Object.keys(db.categories||{}):[String(cat)];
 ids.forEach(id=>{
  const c=db.categories?.[id];if(!c)return;
  Object.keys(c.rosters||{}).forEach(add);
  Object.keys(c.player_profiles||{}).forEach(add);
  (c.standings||[]).forEach(group=>(group?.rows||[]).forEach(r=>add(r?.[1])));
  (c.fixtures||[]).forEach(group=>(group?.rows||[]).forEach(r=>{add(r?.[2]);add(r?.[6])}));
 });
 try{
  (window.V66_OFFICIAL_DIRECTORY?.teamList?.()||[]).forEach(x=>{
   if(cat==='all'||String(x?.cat||'')===String(cat))add(x?.name);
  });
 }catch(_){}
 return out.sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}
function players(team,cat){
 if(!team)return [];
 let ps=[];
 try{ps=window.V66_OFFICIAL_DIRECTORY?.playerList?.()||[]}catch(_){}
 if(!Array.isArray(ps))ps=[];
 const db=data(),ids=cat==='all'?Object.keys(db.categories||{}):[String(cat)];
 ids.forEach(id=>{
  const c=db.categories?.[id];if(!c)return;
  Object.entries(c.rosters||{}).forEach(([name,arr])=>{
   if(norm(name)!==norm(team)||!Array.isArray(arr))return;
   arr.forEach(x=>ps.push({name:typeof x==='string'?x:x?.name,team:name,cat:id}));
  });
 });
 const seen=new Set();
 return ps.filter(x=>x&&norm(x.team)===norm(team)&&(cat==='all'||!x.cat||String(x.cat)===String(cat)))
  .map(x=>String(x.name||'').trim()).filter(x=>{const key=norm(x);if(!key||seen.has(key))return false;seen.add(key);return true}).slice(0,220);
}
function csvFile(list,name){
 const cols=['Minuto','Tipo','Equipo','Jugador','Asistencia o entra','Detalle','Partido','Fecha de registro'];
 const safe=v=>{
  let s=String(v??'');if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s;
  return '"'+s.replace(/"/g,'""')+'"';
 };
 const lines=[cols,...list.map(x=>[String(x.min??'')+(Number(x.extra)>0?'+'+x.extra:''),x.type,x.team,x.player,x.secondary,x.note,x.matchLabel||'General',x.at])];
 const blob=new Blob(['\ufeff'+lines.map(row=>row.map(safe).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
function open(){
 const old=document.querySelector('.v105-modal');if(old)old.remove();
 let matchList=fixtures();
 const categoryChoices=()=>{
  const map=new Map(Object.entries(data().categories||{}).map(([id,c])=>[String(id),{id:String(id),name:c?.name||'Categoría '+id}]));
  matchList.forEach(x=>{if(!map.has(x.cat))map.set(x.cat,{id:x.cat,name:x.category})});
  const order=['3','5','4','2','1'];
  return [...map.values()].sort((a,b)=>(order.indexOf(a.id)<0?99:order.indexOf(a.id))-(order.indexOf(b.id)<0?99:order.indexOf(b.id)));
 };
 const cats=categoryChoices();
 let entries=records(),editing=null,undo=null,filter='all';
 const modal=document.createElement('div');
 modal.className='v105-modal v1107-admin-modal v1111-incidents-modal';
 modal.innerHTML='<section class="v105-dialog" role="dialog" aria-modal="true" aria-label="Incidencias del partido">'+
 '<button type="button" class="v105-close" data-close aria-label="Cerrar">×</button>'+
 '<h3>Incidencias del partido</h3>'+
 '<p>Registro auxiliar local · No modifica el marcador, las sanciones ni la cédula oficial.</p>'+
 '<div class="v1111-context"><label><span>Categoría</span><select data-cat><option value="all">Todas</option>'+cats.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('')+'</select></label>'+
 '<label><span>Partido</span><select data-match><option value="">Bitácora general (sin partido)</option></select></label></div>'+
 '<div class="v1111-shortcuts" aria-label="Tipos rápidos">'+
 '<button type="button" data-quick="Gol"><svg class="v1340-incident-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m12 6 4 3-1.5 5.2h-5L8 9zM8 9 4 10m5.5 4.2-2 5m7-5 2 5M16 9l4 1"/></svg><span>Gol</span></button><button type="button" data-quick="Tarjeta amarilla"><svg class="v1340-incident-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5.5" y="3" width="13" height="18" rx="2.5" fill="#FFCA38" stroke="#FFE8A5" stroke-width="1.5"/></svg><span>Amarilla</span></button>'+
 '<button type="button" data-quick="Tarjeta roja"><svg class="v1340-incident-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5.5" y="3" width="13" height="18" rx="2.5" fill="#EE475B" stroke="#FFA3AE" stroke-width="1.5"/></svg><span>Roja</span></button><button type="button" data-quick="Sustitución"><svg class="v1340-incident-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h15l-4-4m4 4-4 4M20 16H5l4-4m-4 4 4 4"/></svg><span>Cambio</span></button></div>'+
 '<div class="v105-form v1111-form">'+
 '<label><span>Minuto *</span><input data-min type="number" min="0" max="130" step="1" inputmode="numeric" placeholder="Ej. 45"></label>'+
 '<label><span>Adicional (+)</span><input data-extra type="number" min="0" max="30" step="1" inputmode="numeric" placeholder="Ej. 2"></label>'+
 '<label class="v1111-span"><span>Tipo de incidencia</span><select data-type>'+ALL_TYPES.map(t=>'<option>'+esc(t)+'</option>').join('')+'</select></label>'+
 '<label><span>Equipo</span><select data-team aria-label="Equipo de la categoría"><option value="">Selecciona un equipo</option></select></label>'+
 '<label><span>Jugador (opcional)</span><input data-player list="v1111-players" placeholder="Elegir o escribir nombre" autocomplete="off"><datalist id="v1111-players"></datalist></label>'+
 '<label class="v1111-span" data-secondary-wrap><span data-secondary-label>Asistencia / participante</span><input data-secondary placeholder="Nombre del jugador (opcional)"></label>'+
 '<label class="v1111-span"><span>Detalle (opcional)</span><textarea data-note rows="2" maxlength="900" placeholder="Qué sucedió durante el partido..."></textarea></label></div>'+
 '<section class="v1230-assistant" aria-label="Asistente de revisión local">'+
 '<div class="v1230-assistant-head"><div><strong>Revisión inteligente</strong><small>Automática · privada · sin internet</small></div><span>EN ESTE CELULAR</span></div>'+
 '<p data-ai-hint role="status" aria-live="polite">Completa los datos para recibir sugerencias.</p>'+
 '<button type="button" data-ai-apply hidden></button>'+
 '<div class="v1230-assistant-actions"><button type="button" data-ai-check>Revisar ahora</button>'+
 '<button type="button" data-ai-model>IA del dispositivo (opcional)</button></div>'+
 '<small data-ai-info>Las sugerencias no modifican registros ni resultados oficiales.</small></section>'+
 '<div class="v105-actions v1111-save-actions"><button type="button" class="v105-btn" data-add>+ Guardar incidencia</button>'+
 '<button type="button" class="v105-btn alt" data-cancel hidden>Cancelar edición</button></div>'+
 '<div class="v1111-notice" data-status role="status" aria-live="polite"></div>'+
 '<div class="v1111-topline"><strong data-count>0 incidencias</strong><span data-summary></span></div>'+
 '<div class="v1111-filters" aria-label="Filtrar registros"><button data-filter="all" class="active">Todas</button><button data-filter="goal">Goles</button><button data-filter="card">Tarjetas</button><button data-filter="sub">Cambios</button><button data-filter="other">Otras</button></div>'+
 '<div class="v105-list v1111-timeline" data-list></div>'+
 '<div class="v1111-bottom"><button type="button" data-undo disabled>↶ Deshacer</button><button type="button" data-export>↓ CSV</button><button type="button" data-share>Compartir resumen</button></div>'+
 '<p class="v1111-disclaimer">Solo en este dispositivo. Para datos oficiales usa la cédula y el proceso de validación de la Liga.</p>'+
 '</section>';
 document.body.appendChild(modal);
 const q=s=>get(modal,s),status=s=>{q('[data-status]').textContent=s};
 function chosen(){return matchList.find(x=>x.id===q('[data-match]').value)||null}
 function matchOptions(){
  const cat=q('[data-cat]').value,prior=q('[data-match]').value;
  const list=matchList.filter(x=>cat==='all'||x.cat===cat);
  q('[data-match]').innerHTML='<option value="">Bitácora general (sin partido)</option>'+
   list.map(x=>'<option value="'+esc(x.id)+'">'+esc('J'+x.round+' · '+x.home+' vs '+x.away+(x.date?' · '+x.date:''))+'</option>').join('');
  if(list.some(x=>x.id===prior))q('[data-match]').value=prior;
  teamOptions();
 }
 function teamOptions(){
  const m=chosen(),cat=m?.cat||q('[data-cat]').value,prior=q('[data-team]').value;
  const names=m?[m.home,m.away].filter(Boolean):categoryTeams(cat);
  const unique=[...new Map(names.map(name=>[norm(name),name])).values()];
  q('[data-team]').innerHTML='<option value="">'+(unique.length?'Selecciona un equipo':'Sin equipos registrados')+'</option>'+
   unique.map(t=>'<option value="'+esc(t)+'">'+esc(t)+'</option>').join('');
  const retained=unique.find(name=>norm(name)===norm(prior));
  if(retained)q('[data-team]').value=retained;
  else q('[data-player]').value='';
  fillPlayers();
 }
 function fillPlayers(){
  const m=chosen(),team=q('[data-team]').value,cat=m?.cat||q('[data-cat]').value;
  q('#v1111-players').innerHTML=players(team,cat).map(name=>'<option value="'+esc(name)+'"></option>').join('');
 }
 function secondaryLabel(){
  const t=q('[data-type]').value,w=q('[data-secondary-wrap]');
  w.hidden=!/^(Gol|Gol en propia puerta|Penal marcado|Sustitución)$/.test(t);
  q('[data-secondary-label]').textContent=t==='Sustitución'?'Entra jugador (sale el indicado arriba)':'Asistencia (opcional)';
  q('[data-secondary]').placeholder=t==='Sustitución'?'Jugador que entra':'Nombre del asistente';
  modal.querySelectorAll('[data-quick]').forEach(b=>b.classList.toggle('active',b.dataset.quick===t));
 }

 // Revisión ligera 100% local. Nunca publica ni corrige datos sin un toque explícito.
 function suggestType(note){
  const n=norm(note);
  if(!n)return '';
  const rules=[
   [/gol anulado|anularon el gol|anulo el gol/,'Gol anulado'],
   [/autogol|propia puerta|gol en contra/,'Gol en propia puerta'],
   [/penal.{0,35}(fall|erro|ataj|fuera|desvi)|fallo el penal/,'Penal fallado'],
   [/penal.{0,35}(marc|anot|convirt|gol)/,'Penal marcado'],
   [/segunda amarilla|doble amarilla/,'Segunda amarilla'],
   [/tarjeta roja|expulsion|expulsad/,'Tarjeta roja'],
   [/tarjeta amarilla|amonest/,'Tarjeta amarilla'],
   [/sustituci|sustitu|entra por|sale por|cambio de jugador/,'Sustitución'],
   [/lesion|lesionado|molestia muscular/,'Lesión'],
   [/suspension por lluvia|suspendido por lluvia/,'Suspensión por lluvia'],
   [/gol|anotacion|anoto|marco el tanto/,'Gol']
  ];
  return rules.find(rule=>rule[0].test(n))?.[1]||'';
 }
 function localReview(){
  const type=q('[data-type]').value,team=q('[data-team]').value,
   player=q('[data-player]').value.trim(),note=q('[data-note]').value.trim(),
   min=q('[data-min]').value.trim(),extra=q('[data-extra]').value.trim(),
   m=chosen(),cat=m?.cat||q('[data-cat]').value,warnings=[];
  if(!min)warnings.push('Indica el minuto del evento.');
  else if(!/^\d+$/.test(min)||Number(min)>130)warnings.push('El minuto debe estar entre 0 y 130.');
  if(extra&&(!/^\d+$/.test(extra)||Number(extra)>30))warnings.push('El tiempo añadido debe estar entre 0 y 30.');
  if(/^(Gol|Gol en propia puerta|Penal marcado|Penal fallado|Tarjeta amarilla|Segunda amarilla|Tarjeta roja|Sustitución)$/.test(type)&&!team)
   warnings.push('Elige el equipo para esta incidencia.');
  if(team&&player){
   const found=players(team,cat).some(n=>norm(n)===norm(player));
   if(!found)warnings.push('El jugador escrito no figura en la plantilla consultada. Confirma su nombre.');
  }
  if(team&&m&&![m.home,m.away].some(n=>norm(n)===norm(team)))
   warnings.push('El equipo elegido no pertenece al partido seleccionado.');
  if(team&&min&&entries.some(x=>x.id!==editing&&
   String(x.matchId||'')===String(m?.id||'')&&x.type===type&&norm(x.team)===norm(team)&&
   norm(x.player)===norm(player)&&Math.abs(Number(x.min||0)-Number(min))<=1&&Number(x.extra||0)===Number(extra||0)))
   warnings.push('Posible incidencia repetida en este mismo minuto.');
  const suggestion=suggestType(note);
  if(suggestion&&suggestion!==type)warnings.push('El detalle parece describir: '+suggestion+'.');
  const line=warnings.length?warnings.slice(0,3).join(' '):
    (min?'Sin alertas en esta revisión local. Comprueba los datos antes de guardar.':
     'Escribe el minuto, equipo y detalle para revisar.');
  q('[data-ai-hint]').textContent=line;
  const apply=q('[data-ai-apply]');
  apply.hidden=!(suggestion&&suggestion!==type);
  if(!apply.hidden){apply.textContent='Usar tipo sugerido: '+suggestion;apply.dataset.aiSuggestedType=suggestion;}
  else delete apply.dataset.aiSuggestedType;
  return {warnings,suggestion,line};
 }
 let aiReviewTimer=0,aiSession=null,aiBusy=false,modelState='checking';
 function scheduleLocalReview(){
  clearTimeout(aiReviewTimer);
  aiReviewTimer=setTimeout(localReview,140);
 }
 function deviceAIAvailability(){
  const LM=window.LanguageModel;
  if(typeof LM?.availability!=='function'||typeof LM?.create!=='function'){
   modelState='unavailable';return;
  }
  Promise.resolve().then(()=>LM.availability()).then(state=>{
   modelState=state==='available'?'available':String(state||'unavailable');
   const info=q('[data-ai-info]');
   if(!info)return;
   if(modelState==='available')info.textContent='IA integrada disponible en este navegador. Se ejecuta solo al tocar el botón; no publica cambios.';
   else if(modelState==='downloadable'||modelState==='downloading')
    info.textContent='El modelo requiere descarga. No se descargará automáticamente; funciona la revisión local sin modelo.';
  }).catch(()=>{modelState='unavailable';});
 }
 q('[data-ai-check]').addEventListener('click',()=>{clearTimeout(aiReviewTimer);localReview();});
 q('[data-ai-apply]').addEventListener('click',()=>{
  const type=q('[data-ai-apply]').dataset.aiSuggestedType;
  if(!ALL_TYPES.includes(type))return;
  q('[data-type]').value=type;secondaryLabel();localReview();
 });
 q('[data-ai-model]').addEventListener('click',async()=>{
  if(aiBusy)return;
  localReview();
  const LM=window.LanguageModel;
  if(modelState!=='available'||!LM?.create){
   q('[data-ai-info]').textContent='Modelo de IA no disponible sin descarga en este navegador. La revisión automática local continúa funcionando.';
   return;
  }
  aiBusy=true;
  const btn=q('[data-ai-model]');btn.disabled=true;btn.textContent='Analizando...';
  try{
   // La creación parte del toque del usuario; no se descarga ni llama a servicios externos.
   aiSession=await LM.create();
   if(!modal.isConnected)return;
   const input={
    minuto:q('[data-min]').value,adicional:q('[data-extra]').value,
    tipo:q('[data-type]').value,
    detalle:q('[data-note]').value.trim().slice(0,450)
   };
   const text='Analiza esta incidencia de futbol como asistente local. '
    +'Responde en español en 1 o 2 frases; indica inconsistencias o un tipo probable. '
    +'No inventes jugadores, marcadores ni hechos. No des por oficial ningún dato. Datos: '
    +JSON.stringify(input);
   const response=await aiSession.prompt(text);
   if(modal.isConnected)q('[data-ai-info]').textContent=String(response||'Sin sugerencia adicional.').slice(0,650);
  }catch(_){
   if(modal.isConnected)q('[data-ai-info]').textContent='No se pudo iniciar el modelo del navegador. Revisión local disponible sin IA generativa.';
  }finally{
   try{aiSession?.destroy?.();}catch(_){}
   aiSession=null;aiBusy=false;
   if(modal.isConnected){btn.disabled=false;btn.textContent='IA del dispositivo (opcional)';}
  }
 });
 modal.querySelectorAll('[data-min],[data-extra],[data-type],[data-team],[data-player],[data-note],[data-cat],[data-match]')
  .forEach(el=>{
   el.addEventListener(el.matches('[data-min],[data-extra],[data-player],[data-note]')?'input':'change',scheduleLocalReview);
  });
 deviceAIAvailability();

 function visible(){
  const id=q('[data-match]').value;
  return entries.filter(x=>id?x.matchId===id:!x.matchId);
 }
 function render(){
  const all=visible(),selected=all.filter(x=>filter==='all'||kind(x.type)===filter);
  const ordered=selected.slice().sort((a,b)=>(Number(a.min)||0)-(Number(b.min)||0)||(Number(a.extra)||0)-(Number(b.extra)||0)||String(a.at||'').localeCompare(String(b.at||'')));
  const goalCount=all.filter(x=>kind(x.type)==='goal').length,cardCount=all.filter(x=>kind(x.type)==='card').length;
  q('[data-count]').textContent=all.length+' incidencia'+(all.length===1?'':'s');
  q('[data-summary]').textContent='⚽ '+goalCount+' · 🟨🟥 '+cardCount;
  q('[data-list]').innerHTML=ordered.length?ordered.map(x=>{
   const tm=String(x.min??'').trim(),time=tm!==''?tm+(Number(x.extra)>0?'+'+x.extra:'')+"'":"—";
   return '<article class="v1111-event"><span class="v1111-event-icon">'+symbol(x.type)+'</span><div class="v1111-event-body"><b>'+esc(time)+' · '+esc(x.type)+'</b>'+
    '<small>'+esc([x.team,x.player].filter(Boolean).join(' · ')||'Sin equipo / jugador')+'</small>'+
    (x.secondary?'<small>'+esc(x.type==='Sustitución'?'Entra: ':'Asistencia: ')+esc(x.secondary)+'</small>':'')+
    (x.note?'<small>'+esc(x.note)+'</small>':'')+
    '<div data-photo-for="'+esc(x.id)+'"></div>'+
    '</div><div class="v1111-event-actions"><button type="button" data-edit="'+esc(x.id)+'" aria-label="Editar incidencia">✎</button>'+
    '<button type="button" data-delete="'+esc(x.id)+'" aria-label="Eliminar incidencia">×</button></div></article>';
  }).join(''):'<p class="v105-footnote">'+(all.length?'No hay eventos con este filtro.':'Sin incidencias locales en esta bitácora.')+'</p>';
  window.LJR_INCIDENTS_MEDIA?.refresh?.(modal);
  q('[data-undo]').disabled=!undo;
  q('[data-export]').disabled=!all.length;
  q('[data-share]').disabled=!all.length;
 }
 function reset(){
  editing=null;q('[data-min]').value='';q('[data-extra]').value='';q('[data-player]').value='';
  q('[data-secondary]').value='';q('[data-note]').value='';
  q('[data-add]').textContent='+ Guardar incidencia';q('[data-cancel]').hidden=true;
  modal.dispatchEvent(new CustomEvent('ljr:incident:reset'));
 }
 function snapshot(){undo=entries.map(x=>Object.assign({},x))}
 function persist(){
  if(!save(entries)){status('No se pudo guardar en este dispositivo. Revisa el almacenamiento del navegador.');return false}
  render();return true;
 }
 // El respaldo manual solo agrega registros validos que no existan. Nunca sobrescribe.
 function mergeIncoming(incoming){
  if(!Array.isArray(incoming)||incoming.length>1500){status('Respaldo invalido o demasiado grande.');return {ok:false,added:0}}
  const known=new Set(entries.map(x=>String(x.id))),add=[];
  for(const raw of incoming){
   if(!raw||typeof raw!=='object'||Array.isArray(raw))continue;
   const id=String(raw.id||'');
   if(!/^[a-zA-Z0-9_-]{1,80}$/.test(id)||known.has(id))continue;
   const min=String(raw.min??'').trim(),extra=String(raw.extra??'0').trim();
   if(min!==''&&(!/^\d{1,3}$/.test(min)||Number(min)>200))continue;
   if(!/^\d{1,2}$/.test(extra)||Number(extra)>30)continue;
   const type=String(raw.type||'Observación');
   if(!ALL_TYPES.includes(type))continue;
   const bounded=(v,max)=>String(v??'').slice(0,max);
   add.push({id,min,extra,type,team:bounded(raw.team,120),player:bounded(raw.player,120),
    secondary:bounded(raw.secondary,120),note:bounded(raw.note,900),matchId:bounded(raw.matchId,400),
    matchLabel:bounded(raw.matchLabel,280),at:bounded(raw.at,64),updatedAt:bounded(raw.updatedAt,64)});
   known.add(id);
  }
  if(!add.length){status('El respaldo no contiene registros nuevos validos.');return {ok:true,added:0,addedIds:[]}}
  const before=entries;entries=[...entries,...add];
  if(!save(entries)){entries=before;status('No queda espacio para importar el respaldo.');return {ok:false,added:0}}
  undo=null;reset();render();
  return {ok:true,added:add.length,addedIds:add.map(x=>x.id)};
 }
 q('[data-cat]').addEventListener('change',()=>{matchOptions();reset();render()});
 q('[data-match]').addEventListener('change',()=>{teamOptions();reset();render();status('')});
 q('[data-team]').addEventListener('change',()=>{q('[data-player]').value='';fillPlayers()});
 q('[data-type]').addEventListener('change',secondaryLabel);
 modal.querySelectorAll('[data-quick]').forEach(b=>b.addEventListener('click',()=>{q('[data-type]').value=b.dataset.quick;secondaryLabel()}));
 modal.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
  filter=b.dataset.filter;modal.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));render();
 }));
 q('[data-add]').addEventListener('click',()=>{
  const min=q('[data-min]').value.trim(),extra=q('[data-extra]').value.trim();
  if(min===''||!Number.isInteger(Number(min))||Number(min)<0||Number(min)>130){status('Escribe un minuto válido entre 0 y 130.');q('[data-min]').focus();return}
  if(extra!==''&&(!Number.isInteger(Number(extra))||Number(extra)<0||Number(extra)>30)){status('El tiempo añadido debe estar entre 0 y 30.');q('[data-extra]').focus();return}
  const m=chosen(),type=q('[data-type]').value,player=q('[data-player]').value.trim(),team=q('[data-team]').value;
  if(!editing&&entries.some(x=>String(x.matchId||'')===String(m?.id||'')&&String(x.min)===min&&Number(x.extra||0)===Number(extra||0)&&x.type===type&&x.team===team&&String(x.player||'')===player)){
   if(!confirm('Hay una incidencia similar registrada. ¿Quieres guardarla otra vez?'))return;
  }
  const prev=editing?entries.find(x=>x.id===editing):null;
  const entry={id:editing||('i'+Date.now().toString(36)+Math.random().toString(36).slice(2,8)),
   min,extra:extra||'0',type,team,player,secondary:q('[data-secondary]').value.trim(),
   note:q('[data-note]').value.trim(),matchId:m?.id||'',matchLabel:m?'J'+m.round+' · '+m.home+' vs '+m.away:'General',
   at:prev?.at||new Date().toISOString(),updatedAt:new Date().toISOString()};
  const before=entries.map(x=>Object.assign({},x));
  if(editing)entries=entries.map(x=>x.id===editing?entry:x);else entries.push(entry);
  undo=before;
  if(!persist()){entries=before;undo=null;render();return}
  modal.dispatchEvent(new CustomEvent('ljr:incident:saved',{detail:{entry}}));
  reset();status('Incidencia guardada en este dispositivo.');
 });
 q('[data-cancel]').addEventListener('click',()=>{reset();status('Edición cancelada.')});
 q('[data-list]').addEventListener('click',e=>{
  const b=e.target.closest('button[data-edit],button[data-delete]');if(!b)return;
  const id=b.dataset.edit||b.dataset.delete,item=entries.find(x=>x.id===id);if(!item)return;
  if(b.dataset.delete){
   if(!confirm('¿Eliminar esta incidencia local?'))return;
   const before=entries.map(x=>Object.assign({},x));entries=entries.filter(x=>x.id!==id);undo=before;
   if(!persist()){entries=before;undo=null;render();return}
   if(editing===id)reset();status('Incidencia eliminada. Puedes deshacer.');return;
  }
  editing=id;q('[data-min]').value=item.min??'';q('[data-extra]').value=item.extra||'';
  q('[data-type]').value=ALL_TYPES.includes(item.type)?item.type:'Observación';secondaryLabel();
  q('[data-team]').value=item.team||'';fillPlayers();q('[data-player]').value=item.player||'';
  q('[data-secondary]').value=item.secondary||'';q('[data-note]').value=item.note||'';
  q('[data-add]').textContent='✓ Guardar cambios';q('[data-cancel]').hidden=false;
  status('Editando incidencia '+String(item.min||'')+"'.");
  modal.dispatchEvent(new CustomEvent('ljr:incident:edit',{detail:{entry:item}}));q('[data-min]').focus();
 });
 q('[data-undo]').addEventListener('click',()=>{
  if(!undo)return;const previous=entries;entries=undo;undo=null;
  if(!persist()){entries=previous;render();return}reset();status('Último cambio deshecho.');
 });
 q('[data-export]').addEventListener('click',()=>{const list=visible();if(!list.length)return;csvFile(list,'incidencias-liga-juventino-rosas.csv');status('Archivo CSV descargado · registro no oficial.')});
 q('[data-share]').addEventListener('click',async()=>{
  const list=visible().slice().sort((a,b)=>Number(a.min||0)-Number(b.min||0));
  if(!list.length)return;
  const m=chosen(),heading=m?'J'+m.round+' · '+m.home+' vs '+m.away:'Bitácora general';
  const txt='Incidencias locales (NO OFICIAL)\n'+heading+'\n'+list.map(x=>(String(x.min||'—')+(Number(x.extra)>0?'+'+x.extra:'')+"'")+' '+x.type+' '+[x.team,x.player].filter(Boolean).join(' / ')).join('\n');
  try{if(navigator.share){await navigator.share({text:txt});status('Resumen preparado para compartir.');return}
   if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(txt);status('Resumen copiado.');return}}
  catch(err){if(err?.name==='AbortError')return}
  window.prompt('Copia el resumen local:',txt);
 });
 function close(){
  clearTimeout(aiReviewTimer);
  try{aiSession?.destroy?.();}catch(_){}
  document.removeEventListener('keydown',keys);
  window.removeEventListener('ljr:official-data',refreshOfficial);
  modal.remove();
 }
 function refreshOfficial(){
  const selectedCat=q('[data-cat]').value;
  matchList=fixtures();
  q('[data-cat]').innerHTML='<option value="all">Todas</option>'+
   categoryChoices().map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('');
  if(selectedCat==='all'||categoryChoices().some(c=>c.id===selectedCat))q('[data-cat]').value=selectedCat;
  matchOptions();render();
 }
 function keys(e){if(e.key==='Escape')close()}
 q('[data-close]').addEventListener('click',close);
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 document.addEventListener('keydown',keys);
 matchOptions();secondaryLabel();render();localReview();
 window.addEventListener('ljr:official-data',refreshOfficial);
 window.LJR_INCIDENTS_MEDIA?.attach?.({modal,getEntries:()=>entries,getVisible:visible,getChosen:chosen,merge:mergeIncoming,status});
 if(!matchList.length)status('Aún no hay partidos oficiales cargados. Puedes usar la bitácora general.');
}
const style=document.createElement('style');
style.id='v1111-incidents-css';
style.textContent=
'html body > .v105-modal.v1111-incidents-modal .v105-dialog{width:min(100%,700px)!important;max-width:700px!important;padding:16px!important}'+
'.v1111-incidents-modal .v1111-context{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.45fr);gap:8px;margin:4px 0 10px}'+
'.v1111-incidents-modal .v1111-context label{min-width:0;display:grid;gap:4px;font-size:11px;color:#a5e9f6;font-weight:800}'+
'.v1111-incidents-modal .v1111-context select{width:100%;min-width:0;height:42px;padding:7px;border:1px solid #3968ad;border-radius:10px;background:#0b185f;color:#fff;font-size:12px}'+
'.v1111-incidents-modal .v1111-shortcuts,.v1111-incidents-modal .v1111-filters{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}'+
'.v1111-incidents-modal .v1111-shortcuts button,.v1111-incidents-modal .v1111-filters button,.v1111-incidents-modal .v1111-bottom button{min-height:34px;padding:7px 10px;border:1px solid #3963ac;border-radius:10px;color:#e9f6ff;background:#142d83;font-weight:750;font-size:11px;cursor:pointer}'+
'.v1111-incidents-modal .v1111-shortcuts button.active,.v1111-incidents-modal .v1111-filters button.active{background:#3fd6ed;color:#06255c;border-color:#67e5f8}'+
'html body > .v105-modal.v1111-incidents-modal .v1111-form{padding:10px!important;gap:8px!important}'+
'html body > .v105-modal.v1111-incidents-modal .v1111-form .v1111-span{grid-column:1/-1!important}'+
'html body > .v105-modal.v1111-incidents-modal .v1111-form [hidden],html body > .v105-modal.v1111-incidents-modal [hidden]{display:none!important}'+
'html body > .v105-modal.v1111-incidents-modal .v1111-form textarea{min-height:60px!important;max-height:120px!important}'+
'.v1111-incidents-modal .v1111-notice{min-height:0;margin:5px 0;color:#a9eaf6;font-size:11px;line-height:1.35}'+
'.v1111-incidents-modal .v1111-notice:empty{display:none}'+
'.v1111-incidents-modal .v1111-topline{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:12px;color:#f3f8ff;font-size:12px}'+
'.v1111-incidents-modal .v1111-topline span{font-size:11px;color:#bce7fb}'+
'.v1111-incidents-modal .v1111-timeline{max-height:320px!important;overflow-y:auto!important}'+
'.v1111-incidents-modal .v1111-event{display:flex;gap:8px;align-items:flex-start;padding:9px!important}'+
'.v1111-incidents-modal .v1111-event-icon{width:24px;flex:0 0 24px;font-size:19px;text-align:center}'+
'.v1111-incidents-modal .v1111-event-body{flex:1;min-width:0}'+
'.v1111-incidents-modal .v1111-event-actions{display:flex;gap:4px}'+
'.v1111-incidents-modal .v1111-event-actions button{width:30px;height:30px;border-radius:8px;border:1px solid #456cb3;background:#1c347a;color:white;font-size:15px;cursor:pointer}'+
'.v1111-incidents-modal .v1111-bottom{display:flex;flex-wrap:wrap;gap:7px;margin:11px 0}'+
'.v1111-incidents-modal button:disabled{opacity:.45;cursor:not-allowed}'+
'.v1111-incidents-modal .v1111-disclaimer{font-size:10px!important;margin:8px 0 0!important;color:#b5cbed!important}'+
'@media(max-width:470px){.v1111-incidents-modal .v1111-context{grid-template-columns:1fr}.v1111-incidents-modal .v1111-shortcuts button{flex:1 0 40%}.v1111-incidents-modal .v1111-bottom button{flex:1 0 25%}}';
document.head.appendChild(style);
window.LJR_INCIDENTS_PRO={open};
})();