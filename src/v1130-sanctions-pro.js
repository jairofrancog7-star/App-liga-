/* V1130 — Expedientes disciplinarios locales. No publica sanciones ni sube información. */
(function(){
'use strict';
if(window.LJR_V1130_SANCTIONS_OPEN)return;
const KEY='v1130-sanction-cases';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(_){return d}};
const notify=s=>{const b=document.createElement('div');b.className='v100-toast';b.textContent=s;document.body.append(b);setTimeout(()=>b.remove(),2500)};
const download=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)};
const types=[['yellow','Tarjeta amarilla'],['red','Tarjeta roja / expulsión'],['matches','Suspensión por partidos'],['until','Suspensión hasta una fecha'],['indefinite','Suspensión indefinida'],['lifetime','Suspensión permanente']];
const reasons=[['yellow-accum','Acumulación de amarillas'],['double-yellow','Doble amonestación'],['straight-red','Tarjeta roja directa'],['serious-foul','Juego brusco grave'],['violent','Agresión / conducta violenta'],['fight','Riña'],['insults','Insultos u ofensas'],['threats','Amenazas o intimidación'],['unsporting','Conducta antideportiva'],['referee','Reclamos al árbitro'],['leave-field','Abandono del terreno'],['ineligible','Alineación indebida / suplantación'],['other','Otro motivo']];
const label=(rows,k)=>rows.find(r=>r[0]===k)?.[1]||k||'—';
const options=(rows,placeholder)=>'<option value="">'+esc(placeholder)+'</option>'+rows.map(r=>'<option value="'+esc(r[0])+'">'+esc(r[1])+'</option>').join('');
function data(){
 const db=window.LJR_OFFICIAL_DATA||window.LJR_OFFICIAL_API?.getData?.()||{},cats=[],players=[],seen=new Set();
 Object.entries(db.categories||{}).forEach(([id,c])=>{
  cats.push([id,c.name||('Categoría '+id)]);
  Object.entries(c.rosters||{}).forEach(([team,names])=>(Array.isArray(names)?names:[]).forEach(name=>{
   const k=norm(name)+'|'+norm(team)+'|'+id;
   if(name&&!seen.has(k)){seen.add(k);players.push({name:String(name),team:String(team),cat:String(id),key:k})}
  }));
 });
 try{(window.V66_OFFICIAL_DIRECTORY?.playerList?.()||[]).forEach(p=>{
  const k=norm(p.name)+'|'+norm(p.team)+'|'+String(p.cat||'');
  if(p.name&&!seen.has(k)){seen.add(k);players.push({name:String(p.name),team:String(p.team||''),cat:String(p.cat||''),key:k})}
 })}catch(_){}
 players.sort((a,b)=>a.name.localeCompare(b.name,'es'));
 players.forEach((p,i)=>p.id=String(i));
 return {db,cats,players};
}
function open(){
 const {db,cats,players}=data();
 let history=read(KEY,[]);if(!Array.isArray(history))history=[];
 history=history.filter(x=>x&&typeof x==='object').slice(0,200);
 const legacy=read('v160-sanction-draft',{})||{};
 let currentId='',chosen='',showHistory=false;
 document.querySelectorAll('.v105-modal.v639-sanction-modal').forEach(x=>x.remove());
 const root=document.createElement('div');
 root.className='v105-modal v639-sanction-modal v1130-sanction-pro';
 root.innerHTML='<section class="v105-dialog v1130-dialog" role="dialog" aria-modal="true" aria-label="Nueva sanción">'+
 '<button type="button" class="v105-close" data-close aria-label="Cerrar">×</button>'+
 '<h3>Nueva sanción</h3><p>Expediente disciplinario de trabajo. No modifica datos oficiales.</p>'+
 '<div class="v1130-banner"><b>BORRADOR · NO OFICIAL</b><small>Solo se guarda en este dispositivo. La Liga debe comprobar y aprobar cualquier sanción real.</small></div>'+
 '<div class="v105-form v1130-form">'+
 '<div class="v1130-step">01 · Seleccionar jugador</div>'+
 '<label class="full"><span>Buscar jugador</span><input type="search" data-f="search" placeholder="Nombre o equipo" autocomplete="off"></label>'+
 '<label><span>Categoría</span><select data-f="cat">'+options(cats,'Todas las categorías')+'</select></label>'+
 '<label><span>Equipo</span><select data-f="team"><option value="">Todos los equipos</option></select></label>'+
 '<label class="full"><span>Jugador registrado</span><select data-f="player"><option value="">Selecciona un jugador</option></select><small class="v1130-count" data-count></small></label>'+
 '<div class="v1130-step">02 · Datos del partido</div>'+
 '<label><span>Jornada / fase</span><input data-f="round" maxlength="80" placeholder="Jornada 5"></label>'+
 '<label><span>Fecha</span><input type="date" data-f="date"></label>'+
 '<label class="full"><span>Buscar partido en el rol</span><select data-f="fixture"><option value="">Opcional · Elige partido</option></select></label>'+
 '<label><span>Rival</span><input data-f="rival" maxlength="100" placeholder="Equipo rival"></label>'+
 '<label><span>Cancha</span><input data-f="field" maxlength="110" placeholder="Campo / sede"></label>'+
 '<label class="full"><span>Árbitro o responsable del informe</span><input data-f="referee" maxlength="120" placeholder="Nombre del árbitro"></label>'+
 '<div class="v1130-step">03 · Sanción propuesta</div>'+
 '<label class="full"><span>Tipo de sanción</span><select data-f="type">'+options(types,'Selecciona el tipo')+'</select></label>'+
 '<label class="full"><span>Motivo</span><select data-f="reason">'+options(reasons,'Selecciona un motivo')+'</select></label>'+
 '<label class="full"><span>Descripción / detalles</span><textarea rows="2" data-f="reasonDetail" maxlength="1500" placeholder="Explica los hechos"></textarea></label>'+
 '<label data-duration="matches"><span>Partidos de suspensión</span><input type="number" data-f="matches" min="1" max="999" value="1"></label>'+
 '<label data-duration="served"><span>Partidos cumplidos</span><input type="number" data-f="served" min="0" max="999" value="0"></label>'+
 '<label class="full" data-duration="until"><span>Hasta la fecha</span><input type="date" data-f="until"></label>'+
 '<div class="v1130-hint full">Comprueba las tarjetas y partidos cumplidos con las cédulas y el reglamento. No se calcula ni aplica ninguna suspensión automáticamente.</div>'+
 '<div class="v1130-step">04 · Evidencia y seguimiento</div>'+
 '<label class="full"><span>Referencia de cédula o documento</span><input data-f="evidence" maxlength="160" placeholder="Solo folio o referencia; no se suben archivos"></label>'+
 '<label class="full"><span>Observaciones</span><textarea rows="3" data-f="notes" maxlength="2000" placeholder="Hechos, testimonios y seguimiento"></textarea></label>'+
 '<div class="v1130-summary full" data-summary aria-live="polite">Selecciona un jugador para preparar el expediente.</div>'+
 '</div>'+
 '<div class="v105-actions v1130-actions">'+
 '<button type="button" class="v105-btn" data-act="save">Guardar borrador</button>'+
 '<button type="button" class="v105-btn alt" data-act="review">Marcar para revisión</button>'+
 '<button type="button" class="v105-btn alt" data-act="png">Descargar PNG</button>'+
 '<button type="button" class="v105-btn alt" data-act="pdf">Imprimir / PDF</button>'+
 '<button type="button" class="v105-btn alt" data-act="share">Preparar aviso</button>'+
 '<button type="button" class="v105-btn alt" data-act="discipline">Disciplina oficial</button>'+
 '</div>'+
 '<div class="v1130-history"><button type="button" data-act="history" aria-expanded="false">Historial local <span data-total>0</span> ▾</button>'+
 '<div data-history hidden><input type="search" data-history-search placeholder="Buscar jugador, jornada o equipo" aria-label="Buscar expediente"><div data-history-list></div>'+
 '<button type="button" class="v105-btn alt" data-act="backup">Descargar respaldo JSON</button></div></div>'+
 '</section>';
 document.body.append(root);
 const field=n=>$('[data-f="'+n+'"]',root);
 const updateCaseData=()=>{const p=players[Number(chosen)];return chosen!==''&&p?p:null};
 const saveDB=x=>{try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch(_){notify('No se pudo guardar. Revisa el espacio del navegador.');return false}};
 function teams(){
  const old=field('team').value;
  const names=[...new Set(players.filter(p=>!field('cat').value||p.cat===field('cat').value).map(p=>p.team).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  field('team').innerHTML='<option value="">Todos los equipos</option>'+names.map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join('');
  field('team').value=names.includes(old)?old:'';
 }
 function playersList(){
  const q=norm(field('search').value),c=field('cat').value,t=field('team').value;
  const list=players.filter(p=>(!c||p.cat===c)&&(!t||norm(p.team)===norm(t))&&(!q||norm(p.name+' '+p.team).includes(q)));
  const shown=list.slice(0,80);
  field('player').innerHTML='<option value="">Selecciona expresamente un jugador</option>'+
    shown.map(p=>'<option value="'+p.id+'">'+esc(p.name)+' · '+esc(p.team)+'</option>').join('');
  if(chosen!==''&&shown.some(p=>p.id===chosen))field('player').value=chosen;
  else{chosen='';field('player').value=''}
  field('player').disabled=!shown.length;
  $('[data-count]',root).textContent=list.length+' coincidencia'+(list.length===1?'':'s')+(list.length>80?' · Escribe más para filtrar':'');
  fixtures();summary();
 }
 function fixtures(){
  const p=updateCaseData(),c=field('cat').value||p?.cat;
  const groups=db.categories?.[c]?.fixtures||[];
  let rows=[],limit=0;
  groups.forEach((g,gi)=>(g.rows||[]).forEach((r,ri)=>{
   if(limit>=120)return;
   const home=String(r?.[2]||''),away=String(r?.[6]||'');
   if(!home||!away||(p&&norm(p.team)!==norm(home)&&norm(p.team)!==norm(away)))return;
   rows.push([gi+':'+ri,home+' vs '+away+' · '+String(r[8]||'')]);limit++;
  }));
  const previous=field('fixture').value;
  field('fixture').innerHTML=options(rows,'Opcional · Elige partido');
  if(rows.some(r=>r[0]===previous))field('fixture').value=previous;
 }
 function duration(){
  const active=['matches','red'].includes(field('type').value);
  $$('[data-duration="matches"],[data-duration="served"]',root).forEach(el=>el.hidden=!active);
  $('[data-duration="until"]',root).hidden=field('type').value!=='until';
  summary();
 }
 function summary(){
  const p=updateCaseData(),active=['matches','red'].includes(field('type').value);
  $('[data-summary]',root).textContent=p
   ?p.name+' · '+p.team+' · '+label(types,field('type').value)+(active?' · '+Math.max(0,(Number(field('matches').value)||0)-(Number(field('served').value)||0))+' partidos pendientes (local)':'')+' · Sin validez oficial'
   :'Selecciona expresamente un jugador. No se asigna nadie automáticamente.';
 }
 function collect(){
  const p=updateCaseData();
  if(!p){notify('Selecciona expresamente un jugador');return null}
  const type=field('type').value,reason=field('reason').value;
  if(!type||!reason){notify('Selecciona el tipo y motivo');return null}
  if(reason==='other'&&!field('reasonDetail').value.trim()){notify('Describe el motivo');return null}
  const active=['matches','red'].includes(type),matches=Number(field('matches').value),served=Number(field('served').value);
  if(active&&(!Number.isInteger(matches)||matches<1||matches>999)){notify('Indica entre 1 y 999 partidos');return null}
  if(active&&(!Number.isInteger(served)||served<0||served>matches)){notify('Revisa los partidos cumplidos');return null}
  if(type==='until'&&!field('until').value){notify('Indica la fecha de término');return null}
  const v={id:currentId,player:p.name,playerKey:p.key,team:p.team,cat:p.cat,
   category:cats.find(x=>x[0]===p.cat)?.[1]||'Sin categoría',
   round:field('round').value.trim(),matchDate:field('date').value,
   matchRef:field('fixture').value,rival:field('rival').value.trim(),field:field('field').value.trim(),
   referee:field('referee').value.trim(),sanctionType:type,sanctionLabel:label(types,type),
   reason,reasonLabel:reason==='other'?field('reasonDetail').value.trim():label(reasons,reason),
   reasonDetail:field('reasonDetail').value.trim(),matches:active?matches:0,served:active?served:0,
   until:type==='until'?field('until').value:'',evidence:field('evidence').value.trim(),notes:field('notes').value.trim(),
   updatedAt:new Date().toISOString(),status:'Borrador local'};
  return v;
 }
 function save(status){
  const v=collect();if(!v)return null;
  const before=history.find(c=>c.id===currentId);
  v.id=before?.id||'LJR-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);
  v.createdAt=before?.createdAt||v.updatedAt;v.status=status;
  v.audit=[...(Array.isArray(before?.audit)?before.audit:[]),{at:v.updatedAt,status}].slice(-40);
  const next=[v,...history.filter(c=>c.id!==v.id)].slice(0,200);
  if(!saveDB(next))return null;
  history=next;currentId=v.id;
  try{localStorage.setItem('v160-sanction-draft',JSON.stringify(v))}catch(_){}
  renderHistory();notify(status==='En revisión local'?'Marcado para revisión local':'Borrador guardado en este navegador');
  return v;
 }
 function load(v){
  currentId=v.id||'';
  field('cat').value=cats.some(c=>c[0]===String(v.cat))?String(v.cat):'';
  teams();field('team').value=v.team||'';
  field('search').value='';
  const p=players.find(p=>p.key===(v.playerKey||norm(v.player)+'|'+norm(v.team)+'|'+String(v.cat||'')));
  chosen=p?p.id:'';
  ['round','rival','field','referee','evidence','notes','reasonDetail','until'].forEach(k=>field(k).value=v[k]||'');
  field('date').value=v.matchDate||'';field('type').value=v.sanctionType||'matches';
  field('reason').value=v.reason||'';field('matches').value=v.matches||1;field('served').value=v.served||0;
  playersList();duration();
  if([...field('fixture').options].some(o=>o.value===v.matchRef))field('fixture').value=v.matchRef;
 }
 function renderHistory(){
  $('[data-total]',root).textContent=history.length;
  if(!showHistory)return;
  const q=norm($('[data-history-search]',root).value);
  const rows=history.filter(v=>!q||norm([v.player,v.team,v.round,v.category].join(' ')).includes(q)).slice(0,60);
  $('[data-history-list]',root).innerHTML=rows.length?rows.map(v=>
   '<article class="v1130-record"><div><b>'+esc(v.player)+'</b><small>'+esc(v.team)+' · '+esc(v.round||'Sin jornada')+'</small><small>'+esc(v.status)+' · '+esc(String(v.updatedAt||'').slice(0,10))+'</small></div>'+
   '<div><button type="button" data-load="'+esc(v.id)+'">Abrir</button><button type="button" data-delete="'+esc(v.id)+'">Eliminar</button></div></article>'
  ).join(''):'<p>Aún no hay expedientes con ese filtro.</p>';
  $$('[data-load]',root).forEach(b=>b.onclick=()=>{
   const v=history.find(c=>c.id===b.dataset.load);if(!v)return;
   load(v);field('search').scrollIntoView({behavior:'smooth',block:'center'});notify('Expediente cargado');
  });
  $$('[data-delete]',root).forEach(b=>b.onclick=()=>{
   const v=history.find(c=>c.id===b.dataset.delete);
   if(!v||!confirm('¿Eliminar este expediente LOCAL de '+v.player+'?'))return;
   const next=history.filter(x=>x.id!==v.id);
   if(!saveDB(next))return;
   history=next;if(currentId===v.id)currentId='';
   renderHistory();
  });
 }
 function textFor(v){
  return ['BORRADOR DISCIPLINARIO · NO OFICIAL','Liga Juventino Rosas',
   'Jugador: '+v.player,'Equipo: '+v.team,'Categoría: '+v.category,
   'Jornada: '+(v.round||'—'),'Fecha: '+(v.matchDate||'—'),
   'Rival: '+(v.rival||'—'),'Cancha: '+(v.field||'—'),'Árbitro: '+(v.referee||'—'),
   'Tipo: '+v.sanctionLabel,'Motivo: '+v.reasonLabel,
   'Duración propuesta: '+(v.matches?v.matches+' partidos; '+v.served+' cumplidos localmente':v.until?'Hasta '+v.until:v.sanctionLabel),
   'Referencia: '+(v.evidence||'—'),'Observaciones: '+(v.notes||'—'),
   'PENDIENTE DE REVISIÓN. Este documento no comunica una sanción oficial.'].join('\n');
 }
 function png(v){
  const c=document.createElement('canvas');c.width=1080;c.height=1350;const g=c.getContext('2d');
  const gradient=g.createLinearGradient(0,0,0,1350);gradient.addColorStop(0,'#0b2d98');gradient.addColorStop(1,'#061035');g.fillStyle=gradient;g.fillRect(0,0,1080,1350);
  g.strokeStyle='#40ddeb';g.lineWidth=4;g.strokeRect(32,32,1016,1286);
  g.fillStyle='#fff';g.font='bold 37px Arial';g.fillText('LIGA JUVENTINO ROSAS',65,106);
  g.fillStyle='#52e7ed';g.font='bold 49px Arial';g.fillText('BORRADOR DE SANCIÓN',65,186);
  g.fillStyle='#ffdfa0';g.font='bold 26px Arial';g.fillText('NO OFICIAL · PENDIENTE DE VALIDACIÓN',65,245);
  const entries=[['JUGADOR',v.player],['EQUIPO',v.team],['CATEGORÍA',v.category],['PARTIDO / JORNADA',(v.round||'—')+' · '+(v.matchDate||'—')],['TIPO',v.sanctionLabel],['MOTIVO',v.reasonLabel],['DURACIÓN',v.matches?v.matches+' partidos · '+v.served+' cumplidos localmente':v.until||v.sanctionLabel],['OBSERVACIONES',v.notes||'—']];
  entries.forEach((r,i)=>{const y=288+i*123;g.fillStyle='rgba(255,255,255,.07)';g.fillRect(64,y,952,110);g.fillStyle='#78e8f2';g.font='bold 21px Arial';g.fillText(r[0],86,y+31);
    g.fillStyle='#fff';g.font='bold 29px Arial';const words=String(r[1]).split(/\s+/);let line='',row=0;
    words.forEach(w=>{if(g.measureText(line+' '+w).width>880&&line){g.fillText(line,86,y+69+row*28);row++;line=w}else line=line?line+' '+w:w});
    if(line&&row<2)g.fillText(line.slice(0,75),86,y+69+row*28);
  });
  g.fillStyle='#b5c6e5';g.font='22px Arial';g.fillText('Documento de trabajo local · No representa resolución oficial',66,1290);
  c.toBlob(blob=>blob?download(blob,'sancion-borrador-'+norm(v.player).replace(/\s+/g,'-')+'.png'):notify('Error al generar PNG'),'image/png');
 }
 function pdf(v){
  const html='<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Borrador disciplinario</title><style>body{font:15px/1.8 Arial;padding:35px;color:#12224d}h1{color:#064f9b}.warning{color:#a32714;font-weight:bold}pre{white-space:pre-wrap;font:15px/1.8 Arial}@page{size:A4;margin:15mm}</style></head><body><h1>Informe disciplinario · Liga Juventino Rosas</h1><p class="warning">BORRADOR · NO OFICIAL</p><pre>'+esc(textFor(v))+'</pre><p>Pendiente de comprobación y resolución de la Liga.</p></body></html>';
  const w=window.open('','_blank');
  if(!w)return notify('Permite ventanas emergentes para imprimir');
  w.document.open();w.document.write(html);w.document.close();w.focus();w.addEventListener('load',()=>w.print(),{once:true});
 }
 function share(v){
  const txt=textFor(v);
  if(navigator.share)return navigator.share({title:'Borrador disciplinario · NO OFICIAL',text:txt}).catch(e=>{if(e?.name!=='AbortError')notify('No se pudo compartir')});
  if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(txt).then(()=>notify('Aviso NO OFICIAL copiado')).catch(()=>notify('No se pudo copiar'));
  const ta=document.createElement('textarea');ta.value=txt;document.body.append(ta);ta.select();try{document.execCommand('copy');notify('Texto copiado')}finally{ta.remove()}
 }
 $('[data-close]',root).onclick=()=>root.remove();
 root.addEventListener('click',e=>{if(e.target===root)root.remove()});
 field('cat').onchange=()=>{chosen='';field('team').value='';teams();playersList()};
 field('team').onchange=()=>{chosen='';playersList()};
 field('search').oninput=()=>{chosen='';playersList()};
 field('player').onchange=()=>{chosen=field('player').value;fixtures();summary()};
 field('type').onchange=duration;
 field('matches').oninput=summary;field('served').oninput=summary;
 field('fixture').onchange=()=>{
  if(!field('fixture').value)return;
  const [gi,ri]=field('fixture').value.split(':').map(Number),p=updateCaseData(),cat=field('cat').value||p?.cat;
  const r=db.categories?.[cat]?.fixtures?.[gi]?.rows?.[ri];if(!r)return;
  const home=String(r[2]||''),away=String(r[6]||'');
  if(p)field('rival').value=norm(p.team)===norm(home)?away:home;
  const m=String(r[8]||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if(m)field('date').value=m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0');
  if(!field('round').value)field('round').value=String(db.categories?.[cat]?.fixtures?.[gi]?.label||'').slice(0,80);
 };
 $('[data-act="save"]',root).onclick=()=>save('Borrador local');
 $('[data-act="review"]',root).onclick=()=>{if(confirm('¿Marcar para REVISIÓN LOCAL? No envía ni publica datos oficiales.'))save('En revisión local')};
 $('[data-act="png"]',root).onclick=()=>{const v=collect();if(v)png(v)};
 $('[data-act="pdf"]',root).onclick=()=>{const v=collect();if(v)pdf(v)};
 $('[data-act="share"]',root).onclick=()=>{const v=collect();if(v)share(v)};
 $('[data-act="discipline"]',root).onclick=()=>{root.remove();location.hash='#/discipline'};
 $('[data-act="history"]',root).onclick=()=>{showHistory=!showHistory;$('[data-history]',root).hidden=!showHistory;$('[data-act="history"]',root).setAttribute('aria-expanded',String(showHistory));renderHistory()};
 $('[data-history-search]',root).oninput=renderHistory;
 $('[data-act="backup"]',root).onclick=()=>history.length?download(new Blob([JSON.stringify({tipo:'BORRADORES NO OFICIALES',cases:history},null,2)],{type:'application/json'}),'liga-sanciones-respaldo-local.json'):notify('No hay expedientes para respaldar');
 teams();playersList();field('type').value='matches';duration();
 if(legacy?.player&&legacy?.team&&legacy?.cat)load(legacy);
 $('[data-total]',root).textContent=history.length;
}
window.LJR_V1130_SANCTIONS_OPEN=open;
})();