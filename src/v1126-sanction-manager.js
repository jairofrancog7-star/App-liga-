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
 // El rol oficial es una sugerencia de captura, no una sanción ni un resultado confirmado.
 const officialFixtures=person=>{
  if(!person)return [];
  let category;
  try{category=(window.LJR_OFFICIAL_DATA||window.LJR_OFFICIAL_API?.getData?.()||{}).categories?.[String(person.cat||'')]}catch(_){}
  const rows=[],seen=new Set();
  for(const block of (category?.fixtures||[])){
   for(const r of (Array.isArray(block?.rows)?block.rows:[])){
    if(!Array.isArray(r)||!r[2]||!r[6]||![r[2],r[6]].some(t=>norm(t)===norm(person.team)))continue;
    const raw=String(r[8]||'').trim(),parts=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    let date='',sort=0;
    if(parts){const d=Number(parts[1]),m=Number(parts[2]),y=Number(parts[3]);const check=new Date(y,m-1,d);if(check.getFullYear()===y&&check.getMonth()===m-1&&check.getDate()===d){date=y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0');sort=check.getTime()}}
    const fixture={id:String(person.cat)+'|'+String(r[0]||'')+'|'+norm(r[2])+'|'+norm(r[6])+'|'+raw,
     cat:String(person.cat),round:String(r[1]||''),match:String(r[2])+' vs '+String(r[6]),
     venue:String(r[7]||'').trim(),referee:/^(---?|por definir)$/i.test(String(r[9]||'').trim())?'':String(r[9]||'').trim(),
     date,sort,raw};
    if(seen.has(fixture.id))continue;
    seen.add(fixture.id);rows.push(fixture);
   }
  }
  return rows.sort((a,b)=>b.sort-a.sort||a.match.localeCompare(b.match,'es')).slice(0,120);
 };
 const option=(v,t)=>'<option value="'+esc(v)+'">'+esc(t)+'</option>';
 const label=(arr,v)=>arr.find(x=>x[0]===v)?.[1]||'—';
 const safeRead=()=>{const a=read(KEY,[]);return Array.isArray(a)?a.filter(x=>x&&typeof x==='object'&&typeof x.player==='string').slice(0,100):[]};
 let drafts=safeRead();
 const legacy=read('v160-sanction-draft',null);
 if(legacy?.player&&!drafts.some(x=>x.id==='legacy-local-sanction'||(legacy.id&&x.id===legacy.id)||(x.player===legacy.player&&x.team===legacy.team&&String(x.cat||'')===String(legacy.cat||'')&&x.updatedAt===legacy.updatedAt))){
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
    '<label class="v1126-field"><span>Vincular partido del rol oficial (opcional)</span><select data-official-match>'+option('','Sin vincular · capturar manualmente')+'</select></label>'+
    '<p class="v1126-hint" data-fixture-hint>Los partidos se consultan en el calendario oficial; la selección solo rellena este borrador.</p>'+
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
  '<div class="v1126-footer"><button type="button" data-new>+ Nuevo borrador</button><button type="button" data-history-toggle>Mis borradores locales (<span data-draft-count>0</span>)</button>'+
    '<button type="button" data-discipline>Ver disciplina oficial</button></div>'+
  '<div class="v1126-history-filter" data-history-filter hidden><label class="v1126-field"><span>Buscar en mis borradores</span><input data-history-search type="search" placeholder="Jugador, equipo, categoría o motivo"></label>'+
    '<div class="v1126-backup-actions"><button type="button" data-backup>Descargar respaldo JSON</button><button type="button" data-import>Importar respaldo JSON</button></div>'+
    '<input type="file" data-import-file accept=".json,application/json" hidden>'+
    '<p class="v1126-hint">El respaldo contiene información disciplinaria sensible. Guárdalo en un lugar privado; nunca se sube a la Liga automáticamente.</p></div>'+
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
 function syncOfficialMatches(wanted=''){
  const select=$('[data-official-match]'),fixtures=officialFixtures(selected);
  select.innerHTML=option('','Sin vincular · capturar manualmente')+
   fixtures.map(x=>option(x.id,(x.date?x.date+' · ':'')+'J'+(x.round||'—')+' · '+x.match+(x.venue?' · '+x.venue:''))).join('');
  select.value=fixtures.some(x=>x.id===wanted)?wanted:'';
  $('[data-fixture-hint]').textContent=fixtures.length?
   fixtures.length+' partido(s) del rol encontrados para este equipo y categoría. Seleccionar rellena los campos; puedes dejarlos manuales.':
   'No hay partidos del rol que coincidan con este equipo. Puedes capturar los datos manualmente.';
 }
 function selectedHtml(){
  const box=$('[data-selected]');
  box.innerHTML=selected?
   '<strong>Jugador seleccionado</strong><span>'+esc(selected.name)+' · '+esc(selected.team||'Sin equipo')+' · '+esc(catName(selected.cat))+'</span><button type="button" data-clear>Quitar selección</button>':
   'Selecciona expresamente un jugador. No se asignará al primero de la lista.';
  $('[data-clear]')?.addEventListener('click',()=>{selected=null;syncOfficialMatches();selectedHtml();listPlayers()});
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
    selected=p;selectedHtml();syncOfficialMatches();feedback('');
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
   officialFixtureId:value('[data-official-match]'),fixtureSource:value('[data-official-match]')?'Rol oficial (referencia local)':'Captura manual',
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
   line('Fecha del incidente',x.incidentDate)+line('Origen del partido',x.fixtureSource)+line('Jornada / partido',x.round+' · '+x.match)+
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
  if(x.sanctionType==='matches'||x.sanctionType==='red'){
   const total=Number(value('[data-matches]')),served=Number(value('[data-served]'));
   if(!Number.isInteger(total)||total<1||total>999||!Number.isInteger(served)||served<0||served>total){feedback('Revisa los partidos de suspensión y cumplidos.');return null}
  }
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
  syncOfficialMatches(x.officialFixtureId||'');
  selectedHtml();listPlayers();duration();showHistory=false;renderHistory();
  view(selected?1:0);
  if(!selected)feedback('No se encontró un único jugador coincidente. Selecciónalo antes de guardar.');
 }
 function renderHistory(){
  $('[data-draft-count]').textContent=String(drafts.length);
  const box=$('[data-history]');box.hidden=!showHistory;$('[data-history-filter]').hidden=!showHistory;if(!showHistory)return;
  const search=norm(value('[data-history-search]'));
  const filtered=drafts.filter(x=>!search||norm([x.player,x.team,x.category,x.sanctionLabel,x.reasonLabel,x.match,x.round].join(' ')).includes(search));
  box.innerHTML='<h4>Borradores guardados en este dispositivo · '+filtered.length+' encontrado(s)</h4>'+
   (filtered.length?filtered.slice(0,80).map(x=>
    '<article><div><strong>'+esc(x.player)+'</strong><small>'+esc(x.team||'Sin equipo')+' · '+esc(x.sanctionLabel||label(TYPES,x.sanctionType))+
    ' · '+esc(new Date(x.updatedAt||Date.now()).toLocaleDateString('es-MX'))+'</small></div>'+
    '<button type="button" data-edit="'+esc(x.id)+'">Editar</button><button type="button" data-delete="'+esc(x.id)+'">Eliminar</button></article>').join(''):
    '<p>No hay borradores con estos filtros.</p>');
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
 $('[data-cat]').addEventListener('change',()=>{selected=null;teams();syncOfficialMatches();selectedHtml();listPlayers()});
 $('[data-team]').addEventListener('change',()=>{selected=null;syncOfficialMatches();selectedHtml();listPlayers()});
 $('[data-official-match]').addEventListener('change',()=>{
  const f=officialFixtures(selected).find(x=>x.id===value('[data-official-match]'));
  if(!f){feedback('');return}
  $('[data-round]').value=f.round;
  $('[data-match]').value=f.match;
  $('[data-incident-date]').value=f.date;
  $('[data-venue]').value=f.venue;
  $('[data-referee]').value=f.referee;
  $('[data-fixture-hint]').textContent='Partido del rol cargado como referencia. Verifica el acta antes de preparar una sanción.';
  feedback('');
 });
 for(const field of ['[data-round]','[data-match]','[data-incident-date]','[data-venue]','[data-referee]']){
  $(field).addEventListener('input',()=>{
   if(value('[data-official-match]')){
    $('[data-official-match]').value='';
    $('[data-fixture-hint]').textContent='Datos ajustados manualmente. Se eliminó el vínculo para no atribuir cambios al rol oficial.';
   }
  });
 }
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
 $('[data-new]').onclick=()=>{
  if(!window.confirm('¿Empezar un nuevo borrador? Los cambios no guardados se perderán.'))return;
  activeId='';selected=null;
  $('[data-search]').value='';$('[data-cat]').value='';teams();$('[data-team]').value='';
  for(const sel of ['[data-incident-date]','[data-round]','[data-match]','[data-venue]','[data-referee]','[data-report]','[data-reason]','[data-detail]','[data-until]','[data-evidence]','[data-notes]'])$(sel).value='';
  $('[data-type]').value='matches';$('[data-matches]').value='1';$('[data-served]').value='0';
  syncOfficialMatches();selectedHtml();listPlayers();duration();view(0);
  toast('Formulario listo para un nuevo borrador');
 };
 $('[data-history-toggle]').onclick=()=>{showHistory=!showHistory;renderHistory()};
 $('[data-history-search]').addEventListener('input',renderHistory);
 $('[data-backup]').onclick=()=>{
  if(!drafts.length){feedback('No tienes borradores para respaldar.');return}
  const payload={format:'ljr-sanction-local-backup-v1',exportedAt:new Date().toISOString(),drafts};
  const file=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  dl(file,'liga-borradores-sanciones-'+new Date().toISOString().slice(0,10)+'.json');
  toast('Respaldo JSON descargado (datos privados)');
 };
 $('[data-import]').onclick=()=>$('[data-import-file]').click();
 $('[data-import-file]').addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{
   if(file.size>1024*1024)throw Error('Máximo 1 MB por respaldo.');
   const data=JSON.parse(await file.text());
   if(data?.format!=='ljr-sanction-local-backup-v1'||!Array.isArray(data.drafts)||data.drafts.length>100)throw Error('El archivo no es un respaldo válido de sanciones.');
   const seen=new Set(drafts.map(x=>x.id)),add=[];
   const allowed=['player','team','cat','category','sanctionType','sanctionLabel','reason','reasonLabel','reasonDetail','matches','served','until','incidentDate','round','match','venue','referee','report','evidence','notes','officialFixtureId','fixtureSource','createdAt','updatedAt'];
   for(const entry of data.drafts){
    if(!entry||typeof entry!=='object'||Array.isArray(entry)||typeof entry.player!=='string'||!entry.player.trim()||entry.player.length>150)throw Error('El respaldo contiene registros inválidos.');
    const n={id:typeof entry.id==='string'&&entry.id.length<150?entry.id:id(),status:'Borrador local'};
    for(const key of allowed)if(typeof entry[key]==='string')n[key]=entry[key].slice(0,1800);
    else if((key==='matches'||key==='served')&&Number.isInteger(entry[key])&&entry[key]>=0&&entry[key]<=999)n[key]=entry[key];
    if(!seen.has(n.id)){seen.add(n.id);add.push(n)}
   }
   if(!add.length){toast('Todos los borradores ya estaban importados');return}
   if(!window.confirm('¿Importar '+add.length+' borrador(es) privados en este dispositivo? No se publicarán.'))return;
   drafts=[...add,...drafts].slice(0,100);
   write(KEY,drafts);renderHistory();toast(add.length+' borrador(es) importados');
  }catch(err){feedback(err.message||'No se pudo importar el respaldo')}
  finally{e.target.value=''}
 });
 $('[data-discipline]').onclick=()=>{m.remove();go('discipline')};
 teams();syncOfficialMatches();selectedHtml();listPlayers();duration();renderHistory();view(0);
 return m;
};
})();