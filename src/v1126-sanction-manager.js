/* V1126 — Gestor de sanciones en borrador. Nunca modifica datos oficiales. */
(function(){
'use strict';
if(window.LJR_SANCTION_ENHANCE)return;
window.LJR_SANCTION_ENHANCE=function(api){
 const {cats,players:rawPlayers,modal,esc,norm,read,write,toast,log,dl,go}=api;
 const KEY='ljr-sanction-local-drafts-v1126';
 const TYPES=[['yellow','Amonestación · amarilla'],['red','Expulsión · roja'],['matches','Suspensión por partidos'],['until','Suspensión hasta una fecha'],['indefinite','Suspensión indefinida'],['lifetime','Suspensión permanente']];
 const REASONS=[['yellow-accum','Acumulación de amarillas'],['double-yellow','Doble amarilla'],['straight-red','Expulsión directa'],['serious-foul','Juego brusco grave'],['violent','Conducta violenta'],['fight','Riña'],['insults','Insultos u ofensas'],['threats','Amenazas'],['unsporting','Conducta antideportiva'],['referee','Ofensas al árbitro'],['leave-field','Abandono del campo'],['ineligible','Alineación indebida'],['other','Otro motivo']];
 const id=()=>('local-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8));
 const key=p=>norm(p.name)+'|'+norm(p.team)+'|'+String(p.cat||'');
 const distinct=new Set();
 const players=rawPlayers.filter(p=>{if(!p?.name||distinct.has(key(p)))return false;distinct.add(key(p));return true}).sort((a,b)=>String(a.name).localeCompare(String(b.name),'es'));
 const catName=v=>cats.find(c=>String(c.id)===String(v))?.name||'Sin categoría';
 const option=(v,t)=>'<option value="'+esc(v)+'">'+esc(t)+'</option>';
 const label=(arr,v)=>arr.find(x=>x[0]===v)?.[1]||'—';
 const safeRead=()=>{const a=read(KEY,[]);return Array.isArray(a)?a.filter(x=>x&&typeof x==='object'&&typeof x.player==='string').slice(0,100):[]};
 let drafts=safeRead();
 const legacy=read('v160-sanction-draft',null);
 if(legacy?.player&&!drafts.some(x=>x.id==='legacy-local-sanction')){
  drafts.unshift({...legacy,id:'legacy-local-sanction',status:'Borrador local',createdAt:legacy.updatedAt||new Date().toISOString()});
  write(KEY,drafts);
 }
 let selected=null,activeId='',step=0,showHistory=false;
 const m=modal('Nueva sanción','Herramienta local para preparar una sanción. No publica ni modifica registros oficiales.',
  '<div class="v1126-sanction">'+
  '<nav class="v1126-steps" aria-label="Pasos del formulario">'+
    '<button type="button" data-step="0">1. Jugador</button><button type="button" data-step="1">2. Incidente</button><button type="button" data-step="2">3. Revisar</button>'+
  '</nav>'+
  '<div class="v1126-stage" data-panel="0">'+
    '<label class="v1126-field v1126-wide"><span>Buscar jugador por nombre</span><input type="search" data-search placeholder="Escribe el nombre para encontrarlo" autocomplete="off"></label>'+
    '<div class="v1126-grid">'+
      '<label class="v1126-field"><span>Categoría</span><select data-cat>'+option('','Todas las categorías')+cats.map(c=>option(c.id,c.name)).join('')+'</select></label>'+
      '<label class="v1126-field"><span>Equipo</span><select data-team>'+option('','Todos los equipos')+'</select></label>'+
    '</div>'+
    '<div class="v1126-found" data-count aria-live="polite"></div>'+
    '<div class="v1126-results" data-results aria-label="Resultados de jugadores"></div>'+
    '<div class="v1126-selected" data-selected aria-live="polite">Elige un jugador para continuar. No se selecciona nadie automáticamente.</div>'+
  '</div>'+
  '<div class="v1126-stage" data-panel="1" hidden>'+
    '<div class="v1126-grid">'+
      '<label class="v1126-field"><span>Fecha del incidente</span><input type="date" data-incident-date></label>'+
      '<label class="v1126-field"><span>Jornada</span><input data-round maxlength="32" placeholder="Ej. Jornada 12"></label>'+
      '<label class="v1126-field"><span>Partido</span><input data-match maxlength="180" placeholder="Local vs Visitante"></label>'+
      '<label class="v1126-field"><span>Cancha</span><input data-venue maxlength="120" placeholder="Nombre del campo"></label>'+
      '<label class="v1126-field"><span>Árbitro</span><input data-referee maxlength="120" placeholder="Nombre del árbitro"></label>'+
      '<label class="v1126-field"><span>Referencia de cédula</span><input data-report maxlength="180" placeholder="Folio o identificación"></label>'+
    '</div>'+
    '<label class="v1126-field"><span>Tipo de sanción</span><select data-type>'+TYPES.map(x=>option(x[0],x[1])).join('')+'</select></label>'+
    '<label class="v1126-field"><span>Motivo</span><select data-reason>'+option('','Selecciona un motivo')+REASONS.map(x=>option(x[0],x[1])).join('')+'</select></label>'+
    '<label class="v1126-field" data-detail-wrap hidden><span>Describe el motivo</span><textarea data-detail maxlength="600" placeholder="Explica qué sucedió"></textarea></label>'+
    '<div class="v1126-grid" data-matches-wrap>'+
      '<label class="v1126-field"><span>Partidos de suspensión</span><input type="number" min="1" max="999" step="1" data-matches value="1"></label>'+
      '<label class="v1126-field"><span>Partidos cumplidos (registro manual)</span><input type="number" min="0" max="999" step="1" data-served value="0"></label>'+
    '</div>'+
    '<label class="v1126-field" data-until-wrap hidden><span>Suspensión hasta</span><input type="date" data-until></label>'+
    '<p class="v1126-counter" data-remaining>Los partidos pendientes son una estimación local, no una habilitación oficial.</p>'+
    '<label class="v1126-field"><span>Hechos y observaciones</span><textarea data-notes maxlength="1600" placeholder="Descripción de los hechos según el acta arbitral"></textarea></label>'+
    '<label class="v1126-field"><span>Enlace o referencia de evidencia</span><input data-evidence maxlength="500" placeholder="Folio o enlace de cédula / informe"></label>'+
    '<p class="v1126-hint">No adjuntes documentos personales ni identificaciones. Este borrador se guarda únicamente en este dispositivo.</p>'+
  '</div>'+
  '<div class="v1126-stage" data-panel="2" hidden>'+
    '<div class="v1126-preview" data-preview></div>'+
    '<p class="v1126-hint">Revisa los datos antes de guardar o compartir. Las sanciones solo son oficiales si la Liga las valida y publica.</p>'+
  '</div>'+
  '<p class="v1126-feedback" data-feedback role="status" aria-live="polite" hidden></p>'+
  '<div class="v1126-actions">'+
    '<button type="button" class="v1126-secondary" data-back>Anterior</button>'+
    '<button type="button" class="v1126-primary" data-next>Continuar</button>'+
    '<button type="button" class="v1126-primary" data-save>Guardar borrador</button>'+
    '<button type="button" class="v1126-secondary" data-png>Descargar PNG</button>'+
    '<button type="button" class="v1126-secondary" data-share>Compartir borrador</button>'+
  '</div>'+
  '<div class="v1126-footer"><button type="button" data-history-toggle>Mis borradores locales (<span data-draft-count>0</span>)</button>'+
    '<button type="button" data-discipline>Ver disciplina oficial</button></div>'+
  '<section class="v1126-history" data-history hidden aria-label="Historial de borradores"></section>'+
  '</div>');
 m.classList.add('v639-sanction-modal','v1126-sanction-modal');
 const $=s=>m.querySelector(s);
 const $$=s=>Array.from(m.querySelectorAll(s));
 const value=s=>String($(s)?.value||'').trim();
 const feedback=msg=>{const el=$('[data-feedback]');el.hidden=!msg;el.textContent=msg||'';if(msg)el.scrollIntoView({block:'nearest',behavior:'smooth'})};
 function teams(){
  const current=value('[data-team]'),wanted=value('[data-cat]');
  const ts=[...new Set(players.filter(p=>!wanted||String(p.cat||'')===wanted).map(p=>String(p.team||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  $('[data-team]').innerHTML=option('','Todos los equipos')+ts.map(n=>option(n,n)).join('');
  $('[data-team]').value=ts.includes(current)?current:'';
 }
 function selectedHtml(){
  const box=$('[data-selected]');
  box.innerHTML=selected?
   '<strong>Jugador seleccionado</strong><span>'+esc(selected.name)+' · '+esc(selected.team||'Sin equipo')+' · '+esc(catName(selected.cat))+'</span><button type="button" data-clear>Quitar selección</button>':
   'Selecciona expresamente un jugador. No se asignará al primero de la lista.';
  $('[data-clear]')?.addEventListener('click',()=>{selected=null;selectedHtml();listPlayers()});
 }
 function listPlayers(){
  const search=norm(value('[data-search]')),cat=value('[data-cat]'),team=value('[data-team]');
  const list=players.filter(p=>(!cat||String(p.cat||'')===cat)&&(!team||norm(p.team)===norm(team))&&(!search||norm(p.name).includes(search)||norm(p.team).includes(search)));
  $('[data-count]').textContent=list.length+' jugador'+(list.length===1?'':'es')+' encontrado'+(list.length===1?'':'s')+(list.length>25?' · mostrando 25. Escribe para buscar mejor.':'');
  const root=$('[data-results]');
  root.innerHTML=list.slice(0,25).map((p,i)=>'<button type="button" data-pick="'+i+'" aria-label="Seleccionar '+esc(p.name)+'">'+
    '<span class="v1126-avatar" aria-hidden="true">⚽</span><span><strong>'+esc(p.name)+'</strong><small>'+esc(p.team||'Sin equipo')+' · '+esc(catName(p.cat))+'</small></span><span aria-hidden="true">›</span></button>').join('')||'<p>No se encontraron jugadores registrados con estos filtros.</p>';
  $$('[data-pick]').forEach(btn=>btn.addEventListener('click',()=>{
    const p=list[Number(btn.dataset.pick)];if(!p)return;
    selected=p;selectedHtml();feedback('');
    const catSel=$('[data-cat]');catSel.value=String(p.cat||'');
    teams();if([...$('[data-team]').options].some(o=>o.value===p.team))$('[data-team]').value=p.team||'';
    listPlayers();
  }));
 }
 function duration(){
  const type=value('[data-type]'),matchesType=type==='matches'||type==='red';
  $('[data-matches-wrap]').hidden=!matchesType;
  $('[data-until-wrap]').hidden=type!=='until';
  $('[data-detail-wrap]').hidden=value('[data-reason]')!=='other';
  const n=Number(value('[data-matches]')),s=Number(value('[data-served]'));
  $('[data-remaining]').textContent=matchesType&&Number.isInteger(n)&&n>0&&Number.isInteger(s)&&s>=0&&s<=n?
   'Pendientes: '+(n-s)+' de '+n+' partido(s) · control local, sujeto al reglamento y actas oficiales.':
   'Los partidos pendientes no se calculan para este tipo de sanción.';
 }
 function getDraft(strict){
  if(!selected){feedback('Selecciona un jugador registrado.');return null}
  const type=value('[data-type]'),reason=value('[data-reason]'),matches=Number(value('[data-matches]')),served=Number(value('[data-served]'));
  if(strict&&!value('[data-incident-date]')){feedback('Indica la fecha del incidente.');return null}
  if(strict&&!reason){feedback('Selecciona el motivo.');return null}
  if(strict&&reason==='other'&&!value('[data-detail]')){feedback('Describe el motivo.');return null}
  if((type==='matches'||type==='red')&&(!Number.isInteger(matches)||matches<1||matches>999||!Number.isInteger(served)||served<0||served>matches)){
    if(strict){feedback('Revisa los partidos de suspensión y cumplidos.');return null}
  }
  if(strict&&type==='until'&&!value('[data-until]')){feedback('Indica la fecha final de la suspensión.');return null}
  return {
   id:activeId||id(),player:selected.name,team:selected.team||'',cat:String(selected.cat||''),category:catName(selected.cat),
   sanctionType:type,sanctionLabel:label(TYPES,type),reason,reasonLabel:reason==='other'?value('[data-detail]'):label(REASONS,reason),
   reasonDetail:value('[data-detail]'),matches:(type==='matches'||type==='red')&&Number.isInteger(matches)&&matches>0?matches:0,
   served:(type==='matches'||type==='red')&&Number.isInteger(served)&&served>=0?Math.min(served,matches||0):0,
   until:type==='until'?value('[data-until]'):'',
   incidentDate:value('[data-incident-date]'),round:value('[data-round]'),match:value('[data-match]'),
   venue:value('[data-venue]'),referee:value('[data-referee]'),report:value('[data-report]'),
   evidence:value('[data-evidence]'),notes:value('[data-notes]'),
   status:'Borrador local',createdAt:drafts.find(x=>x.id===activeId)?.createdAt||new Date().toISOString(),
   updatedAt:new Date().toISOString()
  };
 }
 const line=(title,text)=>'<div class="v1126-preview-row"><span>'+esc(title)+'</span><strong>'+esc(text||'—')+'</strong></div>';
 function preview(){
  const x=getDraft(false);if(!x)return;
  const pending=x.matches?Math.max(0,x.matches-x.served)+' pendiente(s) de '+x.matches:'No aplica';
  $('[data-preview]').innerHTML='<div class="v1126-draft-mark">BORRADOR LOCAL · NO OFICIAL</div>'+
   line('Jugador',x.player)+line('Equipo y categoría',x.team+' · '+x.category)+line('Tipo',x.sanctionLabel)+
   line('Motivo',x.reasonLabel)+line('Partidos pendientes',pending)+line('Fecha límite',x.until)+
   line('Fecha del incidente',x.incidentDate)+line('Jornada / partido',x.round+' · '+x.match)+
   line('Cancha / árbitro',x.venue+' · '+x.referee)+line('Cédula',x.report)+line('Evidencia',x.evidence)+line('Observaciones',x.notes);
 }
 function view(n){
  step=n;
  $$('[data-panel]').forEach((p,i)=>p.hidden=i!==step);
  $$('[data-step]').forEach((b,i)=>{b.classList.toggle('is-active',i===step);b.setAttribute('aria-current',i===step?'step':'false')});
  $('[data-back]').hidden=step===0;
  $('[data-next]').hidden=step===2;
  $('[data-next]').textContent=step===0?'Continuar al incidente':'Revisar sanción';
  $('[data-save]').textContent=activeId?'Actualizar borrador':'Guardar borrador';
  $('[data-png]').hidden=step!==2;
  $('[data-share]').hidden=step!==2;
  if(step===2)preview();
  feedback('');
  m.querySelector('.v105-dialog')?.scrollTo({top:0,behavior:'smooth'});
 }
 function saveDraft(){
  const x=getDraft(false);if(!x)return null;
  if(x.matches&&(x.served>x.matches||x.served<0)){feedback('Revisa el número de partidos cumplidos.');return null}
  activeId=x.id;
  drafts=[x,...drafts.filter(v=>v.id!==x.id)].slice(0,100);
  write(KEY,drafts);
  // Mantener compatibilidad con el borrador de la versión anterior sin publicar nada.
  write('v160-sanction-draft',x);
  log('Borrador local de sanción para '+x.player);
  toast('Borrador local guardado');
  renderHistory();view(step);
  return x;
 }
 function restore(x){
  const matches=players.filter(p=>norm(p.name)===norm(x.player)&&norm(p.team)===norm(x.team)&&String(p.cat||'')===String(x.cat||''));
  selected=matches.length===1?matches[0]:null;activeId=x.id||'';
  for(const [selector,key] of [
    ['[data-incident-date]','incidentDate'],['[data-round]','round'],['[data-match]','match'],['[data-venue]','venue'],
    ['[data-referee]','referee'],['[data-report]','report'],['[data-type]','sanctionType'],['[data-reason]','reason'],
    ['[data-detail]','reasonDetail'],['[data-matches]','matches'],['[data-served]','served'],['[data-until]','until'],
    ['[data-evidence]','evidence'],['[data-notes]','notes']
  ])$(selector).value=x[key]??'';
  $('[data-search]').value=x.player||'';
  $('[data-cat]').value=selected?String(selected.cat||''):'';
  teams();if(selected)$('[data-team]').value=selected.team||'';
  selectedHtml();listPlayers();duration();showHistory=false;renderHistory();
  view(selected?1:0);
  if(!selected)feedback('No se encontró un único jugador coincidente. Selecciónalo antes de guardar.');
 }
 function renderHistory(){
  $('[data-draft-count]').textContent=String(drafts.length);
  const box=$('[data-history]');box.hidden=!showHistory;if(!showHistory)return;
  box.innerHTML='<h4>Borradores guardados en este dispositivo</h4>'+
   (drafts.length?drafts.slice(0,30).map(x=>
    '<article><div><strong>'+esc(x.player)+'</strong><small>'+esc(x.team||'Sin equipo')+' · '+esc(x.sanctionLabel||label(TYPES,x.sanctionType))+
    ' · '+esc(new Date(x.updatedAt||Date.now()).toLocaleDateString('es-MX'))+'</small></div>'+
    '<button type="button" data-edit="'+esc(x.id)+'">Editar</button><button type="button" data-delete="'+esc(x.id)+'">Eliminar</button></article>').join(''):
    '<p>Aún no tienes borradores guardados.</p>');
  $$('[data-edit]').forEach(b=>b.onclick=()=>{const x=drafts.find(y=>y.id===b.dataset.edit);if(x)restore(x)});
  $$('[data-delete]').forEach(b=>b.onclick=()=>{
   const x=drafts.find(y=>y.id===b.dataset.delete);
   if(!x||!window.confirm('¿Eliminar este borrador local de '+x.player+'?'))return;
   drafts=drafts.filter(y=>y.id!==x.id);write(KEY,drafts);
   if(activeId===x.id)activeId='';
   renderHistory();toast('Borrador eliminado');
  });
 }
 function exportPng(x){
  const cv=document.createElement('canvas');cv.width=1080;cv.height=1550;
  const c=cv.getContext('2d');if(!c){toast('No se pudo generar la imagen');return}
  const bg=c.createLinearGradient(0,0,0,1550);bg.addColorStop(0,'#123da6');bg.addColorStop(1,'#041044');c.fillStyle=bg;c.fillRect(0,0,1080,1550);
  c.strokeStyle='#64dcec';c.lineWidth=4;c.strokeRect(40,40,1000,1470);
  c.fillStyle='#fff';c.font='bold 43px Arial';c.fillText('LIGA JUVENTINO ROSAS',75,125);
  c.fillStyle='#70e4f5';c.font='bold 60px Arial';c.fillText('REGISTRO DISCIPLINARIO',75,207);
  c.fillStyle='#ffe6a2';c.font='bold 32px Arial';c.fillText('BORRADOR LOCAL · NO OFICIAL',75,264);
  const fields=[
   ['JUGADOR',x.player],['EQUIPO / CATEGORÍA',x.team+' · '+x.category],
   ['TIPO DE SANCIÓN',x.sanctionLabel],['MOTIVO',x.reasonLabel],
   ['SUSPENSIÓN',x.matches?Math.max(0,x.matches-x.served)+' pendientes de '+x.matches+' partidos':x.until?'Hasta '+x.until:x.sanctionLabel],
   ['FECHA / JORNADA',x.incidentDate+' · '+x.round],['PARTIDO',x.match],
   ['CANCHA / ÁRBITRO',x.venue+' · '+x.referee],['CÉDULA / EVIDENCIA',x.report+' · '+x.evidence],['NOTAS',x.notes]
  ];
  fields.forEach((pair,i)=>{
   const y=305+i*109;c.fillStyle='rgba(255,255,255,.06)';c.fillRect(75,y,930,94);
   c.fillStyle='#8fbbef';c.font='bold 20px Arial';c.fillText(pair[0],95,y+27);
   c.fillStyle='#fff';c.font='bold 26px Arial';
   const text=String(pair[1]||'—').replace(/\s+/g,' ');
   let shown=text;while(shown.length>1&&c.measureText(shown).width>880)shown=shown.slice(0,-2);
   c.fillText(shown.length<text.length?shown+'…':shown,95,y+67);
  });
  c.fillStyle='#d0daf7';c.font='21px Arial';c.fillText('Documento local. No acredita autorización, notificación ni vigencia oficial.',75,1454);
  cv.toBlob(blob=>{if(!blob)return toast('No se pudo exportar el PNG');dl(blob,'borrador-sancion-'+norm(x.player).replace(/\s+/g,'-')+'.png');toast('PNG del borrador descargado')},'image/png');
 }
 $('[data-search]').addEventListener('input',listPlayers);
 $('[data-cat]').addEventListener('change',()=>{selected=null;teams();selectedHtml();listPlayers()});
 $('[data-team]').addEventListener('change',()=>{selected=null;selectedHtml();listPlayers()});
 $('[data-type]').addEventListener('change',duration);
 $('[data-reason]').addEventListener('change',duration);
 $('[data-matches]').addEventListener('input',duration);
 $('[data-served]').addEventListener('input',duration);
 $$('[data-step]').forEach(b=>b.onclick=()=>{
  const n=Number(b.dataset.step);
  if(n>0&&!selected){feedback('Selecciona primero un jugador registrado.');return}
  if(n===2&&!getDraft(true))return;
  view(n);
 });
 $('[data-back]').onclick=()=>view(Math.max(0,step-1));
 $('[data-next]').onclick=()=>{
  if(step===0&&!selected){feedback('Selecciona un jugador para continuar.');return}
  if(step===1&&!getDraft(true))return;
  view(Math.min(2,step+1));
 };
 $('[data-save]').onclick=saveDraft;
 $('[data-png]').onclick=()=>{const x=getDraft(true);if(x)exportPng(x)};
 $('[data-share]').onclick=async()=>{
  const x=getDraft(true);if(!x)return;
  const content='BORRADOR LOCAL — NO OFICIAL\nLiga Juventino Rosas\nJugador: '+x.player+
   '\nEquipo: '+x.team+' · '+x.category+'\nSanción propuesta: '+x.sanctionLabel+
   '\nMotivo: '+x.reasonLabel+'\nFecha: '+x.incidentDate+
   (x.matches?'\nPendientes (local): '+Math.max(0,x.matches-x.served)+' de '+x.matches:'')+
   '\nNo tiene carácter oficial hasta autorización y publicación por la Liga.';
  try{
   if(navigator.share)await navigator.share({title:'Borrador disciplinario',text:content});
   else window.open('https://wa.me/?text='+encodeURIComponent(content),'_blank','noopener,noreferrer');
  }catch(e){if(e?.name!=='AbortError')feedback('No se pudo abrir Compartir. Puedes descargar el PNG.')}
 };
 $('[data-history-toggle]').onclick=()=>{showHistory=!showHistory;renderHistory()};
 $('[data-discipline]').onclick=()=>{m.remove();go('discipline')};
 teams();selectedHtml();listPlayers();duration();renderHistory();view(0);
 return m;
};
})();