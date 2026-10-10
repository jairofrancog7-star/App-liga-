/* V562 — paridad funcional con el APK AdminFut: modo árbitro offline local y cola de cédulas. */
(function(){
'use strict';
if(window.__LJR_V562_ADMINFUT_PARITY__)return;
window.__LJR_V562_ADMINFUT_PARITY__=true;

const ROUTE='refereeOffline';
const BUILD='20261010-v1130-referee-workspace';
const STATE_KEY='ljr-v562-referee-offline';
const CAT_NAMES={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
let currentMatchKey='';
let localData=null;
let renderTimer=0;
let autoSaveTimer=0;
let clockInterval=0;
let activeEditorKey='';

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function readState(){
  try{
    const x=JSON.parse(localStorage.getItem(STATE_KEY)||'null')||{};
    return Object.assign({},x,{drafts:x.drafts||{},queue:Array.isArray(x.queue)?x.queue:[],filter:x.filter||'all',search:x.search||'',view:x.view||'all',myReferee:x.myReferee||'',offlineReadyAt:Number(x.offlineReadyAt)||0});
  }catch(_){return {drafts:{},queue:[],filter:'all',search:'',view:'all',myReferee:'',offlineReadyAt:0}}
}
function writeState(next){try{localStorage.setItem(STATE_KEY,JSON.stringify(next));return true}catch(err){console.warn('Referee offline storage failed',err);return false}}
function data(){
  try{return localData||window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}
  catch(_){return localData||window.LJR_OFFICIAL_DATA||{}}
}
function toast(msg){
  document.querySelector('.v562-toast')?.remove();
  const t=document.createElement('div');t.className='v562-toast';t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>t.remove(),2600);
}
function parseDate(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return NaN;
  return new Date(Number(m[3]),Number(m[2])-1,Number(m[1]),Number(m[4]||0),Number(m[5]||0)).getTime();
}
function rowScore(v){const s=String(v??'').trim();return /^-?\d+$/.test(s)?Number(s):null}
function fixtures(){
  const out=[];
  Object.entries(data()?.categories||{}).forEach(([cid,c])=>{
    (c?.fixtures||[]).forEach((block,bi)=>(block?.rows||[]).forEach((r,ri)=>{
      if(!Array.isArray(r)||!r[2]||!r[6])return;
      const date=String(r[8]||''),stamp=parseDate(date),home=String(r[2]||'').trim(),away=String(r[6]||'').trim();
      out.push({
        key:[cid,bi,ri,r[0]||'',date,home,away].join('|'),cat:String(cid),category:c?.name||CAT_NAMES[cid]||('Categoría '+cid),
        number:String(r[0]||''),round:String(r[1]||''),home,away,homeScore:rowScore(r[3]),awayScore:rowScore(r[5]),
        field:String(r[7]||''),date,stamp,referee:String(r[9]||''),extra:String(r[10]||'')
      });
    }));
  });
  return out;
}
function playerName(x){
  if(typeof x==='string')return x.trim();
  if(Array.isArray(x))return String(x.find(v=>typeof v==='string'&&v.trim())||'').trim();
  if(x&&typeof x==='object')return String(x.name||x.player||x.nombre||x.jugador||'').trim();
  return '';
}
function roster(catId,team){
  const c=data()?.categories?.[String(catId)]||{};
  const key=Object.keys(c.rosters||{}).find(k=>norm(k)===norm(team));
  if(!key)return [];
  const raw=c.rosters[key];
  const rows=Array.isArray(raw)?raw:(raw?.players||raw?.rows||[]);
  const seen=new Set(),out=[];
  (rows||[]).forEach(x=>{const n=playerName(x),k=norm(n);if(n&&k&&!seen.has(k)){seen.add(k);out.push(n)}});
  return out;
}
function recentFixtures(){
  const s=readState(),q=norm(s.search),now=Date.now();
  let list=fixtures().filter(m=>s.filter==='all'||m.cat===s.filter)
    .filter(m=>!q||norm(m.home+' '+m.away+' '+m.category+' '+m.field+' '+m.date).includes(q));
  if(s.view==='drafts')list=list.filter(m=>matchHasDraft(s,m));
  if(s.view==='queue')list=list.filter(m=>matchHasQueue(s,m));
  if(s.view==='upcoming')list=list.filter(m=>m.homeScore===null&&m.awayScore===null&&(!Number.isFinite(m.stamp)||m.stamp>=now-6*3600000));
  if(s.view==='finished')list=list.filter(m=>m.homeScore!==null&&m.awayScore!==null);
  if(s.view==='mine'&&norm(s.myReferee))list=list.filter(m=>norm(m.referee).includes(norm(s.myReferee)));
  list.sort((a,b)=>{
    const af=Number.isFinite(a.stamp)&&a.stamp>=now-6*3600000,bf=Number.isFinite(b.stamp)&&b.stamp>=now-6*3600000;
    if(af!==bf)return af?-1:1;
    if(af&&bf)return a.stamp-b.stamp;
    if(Number.isFinite(a.stamp)&&Number.isFinite(b.stamp))return b.stamp-a.stamp;
    return 0;
  });
  return list.slice(0,60);
}
function capState(){
  const p=window.Capacitor?.Plugins||{};
  return {native:!!window.Capacitor,prefs:!!p.Preferences,push:!!p.PushNotifications,biometric:!!(p.LigaBiometric||p.NativeBiometric)};
}
function dataSummary(){
  const d=data(),c=d?.categories?.['3']||{},counts=c.counts||c.dashboard?.counts||{};
  return {captured:d?.captured_at_utc||'',verified:d?.verified_date||'',teams:counts.Equipos||0,played:counts['Partidos Jugados']||0,pending:counts['Partidos Pendientes']||0,players:counts.Jugadores||0};
}
function badge(m){
  const now=Date.now();
  if(/suspend/i.test(m.extra))return '<span class="v562-state warn">SUSPENDIDO</span>';
  if(m.homeScore!==null&&m.awayScore!==null)return '<span class="v562-state done">RESULTADO</span>';
  if(Number.isFinite(m.stamp)&&m.stamp<now)return '<span class="v562-state past">POR CERRAR</span>';
  return '<span class="v562-state next">PROGRAMADO</span>';
}
function homeMarkup(){
 const s=readState(),sum=dataSummary(),cap=capState(),matches=recentFixtures(),pending=s.queue.filter(x=>!x.synced).length,drafts=Object.keys(s.drafts).length;
 const cats=['all','3','5','4','2','1'];
 const views=[['all','Todos'],['upcoming','Próximos'],['drafts','Borradores'],['queue','En cola'],['finished','Resultados'],['mine','Asignados']];
 const shortcut=(icon,name,key)=>'<button class="v1130-shortcut" type="button" data-v562-quick="'+key+'"><span aria-hidden="true">'+icon+'</span><b>'+name+'</b></button>';
 return '<section class="v562-page v1130-referee" data-v562-page>'+
 '<header class="v562-head"><button type="button" data-v562-back aria-label="Volver">←</button><div><small>JR CONTROL · LIGA JUVENTINO ROSAS</small><h1>Centro arbitral</h1><p>Modo árbitro · partidos y cédulas sin señal</p></div><span class="v562-net '+(navigator.onLine?'on':'off')+'" data-v562-net>'+(navigator.onLine?'EN LÍNEA':'SIN SEÑAL')+'</span></header>'+
 '<div class="v562-kpis"><span><b>'+drafts+'</b><small>Borradores</small></span><span><b>'+pending+'</b><small>En cola</small></span><span><b>'+matches.length+'</b><small>Partidos visibles</small></span></div>'+
 '<nav class="v1130-shortcuts" aria-label="Herramientas de arbitraje">'+shortcut('⚽','Mis partidos','all')+shortcut('📋','Mis cédulas','drafts')+shortcut('⏱','Cronómetro','timer')+shortcut('📶','Preparar sin señal','offline')+'</nav>'+
 '<article class="v562-info"><div><small>DATOS OFICIALES · PRIMERA</small><b>'+esc(sum.teams)+' equipos · '+esc(sum.played)+' jugados · '+esc(sum.pending)+' pendientes</b><em>'+esc(sum.players)+' jugadores · verificación '+esc(sum.verified||'pendiente')+'</em></div><button type="button" data-v562-refresh>Actualizar</button></article>'+
 '<div class="v1130-ready" data-v562-ready>'+(s.offlineReadyAt?'✓ Modo sin señal preparado · '+new Date(s.offlineReadyAt).toLocaleString('es-MX'):'Para trabajar sin señal, prepara los datos mientras tengas internet.')+'</div>'+
 '<div class="v562-tools"><label><span>Categoría</span><select data-v562-filter>'+cats.map(id=>'<option value="'+id+'" '+(s.filter===id?'selected':'')+'>'+(id==='all'?'Todas':esc(CAT_NAMES[id]))+'</option>').join('')+'</select></label><label class="search"><span>Buscar equipo, campo o fecha</span><input data-v562-search type="search" value="'+esc(s.search)+'" placeholder="Buscar partido"></label></div>'+
 '<div class="v1130-filters" role="group" aria-label="Filtrar partidos">'+views.map(v=>'<button type="button" data-v562-view="'+v[0]+'" class="'+(s.view===v[0]?'active':'')+'">'+v[1]+'</button>').join('')+'</div>'+
 (s.view==='mine'?'<label class="v1130-my-ref">Nombre del árbitro asignado<input data-v562-ref-filter value="'+esc(s.myReferee)+'" placeholder="Escribe el nombre de la designación"></label>':'')+
 '<div class="v562-actions"><button type="button" data-v562-notify>🔔 Avisos</button><button type="button" data-v562-export '+(pending?'':'disabled')+'>Exportar cola ('+pending+')</button><button type="button" data-v562-sync '+(pending?'':'disabled')+'>Sincronizar</button></div>'+
 '<details class="v1130-more"><summary>Respaldo, herramientas y compatibilidad</summary><div class="v1130-tool-grid"><button type="button" data-v562-backup>Descargar respaldo JSON</button><button type="button" data-v562-import>Restaurar respaldo</button><button type="button" data-v562-prep>Preparar datos offline</button></div><input data-v562-file type="file" accept="application/json,.json" hidden><p>Los datos se guardan en este dispositivo. El envío oficial requiere una cuenta y un servidor autorizados.</p><div class="v562-cap"><span><b>APK</b><small>'+(cap.native?'Detectada':'Navegador web')+'</small></span><span><b>Avisos nativos</b><small>'+(cap.push?'Disponibles':'No configurados')+'</small></span><span><b>Biometría</b><small>'+(cap.biometric?'Disponible':'No disponible')+'</small></span></div></details>'+
 '<h2 class="v562-title">Partidos oficiales <small>· '+matches.length+' resultados</small></h2><div class="v562-match-list">'+(matches.length?matches.map(matchCard).join(''):'<div class="v562-empty">No hay partidos para este filtro. Cambia la categoría o selección.</div>')+'</div>'+
 '<p class="v562-note">La cédula local no modifica resultados ni sanciones oficiales. La sincronización segura se habilitará únicamente con acceso autorizado de la Liga.</p></section>';
}
function matchCard(m){
 const s=readState(),draft=matchHasDraft(s,m),queued=matchHasQueue(s,m);
 return '<article class="v562-match" data-v562-card data-v562-search-key="'+esc(norm(m.home+' '+m.away+' '+m.category+' '+m.field+' '+m.date))+'"><div class="v562-match-top"><small>'+esc(m.category)+' · J'+esc(m.round||'—')+'</small>'+badge(m)+'</div>'+
 '<div class="v562-versus"><span><b>'+esc(m.home)+'</b><em>LOCAL</em></span><strong>'+((m.homeScore!==null&&m.awayScore!==null)?esc(m.homeScore)+' - '+esc(m.awayScore):'VS')+'</strong><span><b>'+esc(m.away)+'</b><em>VISITANTE</em></span></div>'+
 '<div class="v562-meta"><span>📅 '+esc(m.date||'Fecha pendiente')+'</span><span>📍 '+esc(m.field||'Campo pendiente')+'</span></div>'+
 '<div class="v1130-card-actions"><button type="button" data-v562-open="'+esc(m.key)+'">'+(draft?'Continuar borrador':queued?'Revisar en cola':'Abrir cédula')+' ›</button><button type="button" data-v562-map="'+esc(m.key)+'" aria-label="Ruta hacia la cancha">🗺 Ruta</button><button type="button" data-v562-calendar="'+esc(m.key)+'" aria-label="Añadir partido a Google Calendar">📆 Calendario</button></div></article>';
}
function blankPlayer(name){return {name,status:'titular',goals:0,yellow1:false,yellow2:false,red:false,suspension:0}}
function draftFor(m){
  const s=readState(),saved=s.drafts[m.key];
  if(saved)return Object.assign({events:[],timer:{elapsedMs:0,runningSince:0,period:'Primer tiempo'}},saved);
  const oldKey=Object.keys(s.drafts).find(k=>recoverMatch(m,k));if(oldKey)return Object.assign({events:[],timer:{elapsedMs:0,runningSince:0,period:'Primer tiempo'}},s.drafts[oldKey],{matchKey:m.key});
  return {matchKey:m.key,referee:m.referee&&m.referee!=='---'?m.referee:'',homeDefault:false,awayDefault:false,homeReason:'',awayReason:'',homePlayers:roster(m.cat,m.home).map(blankPlayer),awayPlayers:roster(m.cat,m.away).map(blankPlayer),events:[],timer:{elapsedMs:0,runningSince:0,period:'Primer tiempo'},updatedAt:0};
}
function teamEditor(side,name,players,draft){
  const isHome=side==='home',def=isHome?draft.homeDefault:draft.awayDefault,reason=isHome?draft.homeReason:draft.awayReason;
  return '<section class="v562-team-editor"><header><b>'+esc(name)+'</b><label><input type="checkbox" data-v562-default="'+side+'" '+(def?'checked':'')+'> Default</label></header><div class="v562-default-reason" '+(def?'':'hidden')+' data-v562-reason-wrap="'+side+'"><input type="text" data-v562-reason="'+side+'" value="'+esc(reason)+'" placeholder="Motivo del default"></div>'+
  '<div class="v562-table-scroll"><table><thead><tr><th>#</th><th>Jugador</th><th>Estado</th><th>Gol</th><th>🟨</th><th>🟨🟨</th><th>🟥</th><th>J</th></tr></thead><tbody>'+
  (players.length?players.map((p,i)=>playerRow(side,p,i)).join(''):'<tr><td colspan="8" class="v562-no-roster">Plantilla pública no disponible en el snapshot.</td></tr>')+'</tbody></table></div></section>';
}
function playerRow(side,p,i){
  p=Object.assign(blankPlayer(p?.name||''),p||{});
  return '<tr data-v562-player-row="'+side+'" data-v562-index="'+i+'" data-v562-name="'+esc(p.name)+'"><td>'+(i+1)+'</td><td><b>'+esc(p.name)+'</b></td><td><select data-v562-status><option value="titular" '+(p.status==='titular'?'selected':'')+'>T</option><option value="cambio" '+(p.status==='cambio'?'selected':'')+'>C</option><option value="ausente" '+(p.status==='ausente'?'selected':'')+'>—</option></select></td><td><input data-v562-goals type="number" min="0" max="20" value="'+(Number(p.goals)||0)+'"></td><td><input data-v562-y1 type="checkbox" '+(p.yellow1?'checked':'')+'></td><td><input data-v562-y2 type="checkbox" '+(p.yellow2?'checked':'')+'></td><td><input data-v562-red type="checkbox" '+(p.red?'checked':'')+'></td><td><input data-v562-susp type="number" min="0" max="20" value="'+(Number(p.suspension)||0)+'"></td></tr>';
}
function elapsedTime(timer){
  if(!timer)return 0;
  return Math.max(0,(Number(timer.elapsedMs)||0)+(timer.runningSince?Math.max(0,Date.now()-Number(timer.runningSince)):0));
}
function clockText(ms){const sec=Math.floor(ms/1000);return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function eventMarkup(events){
  if(!events?.length)return '<p class="v1130-no-events">Todavía no hay incidencias registradas.</p>';
  return events.slice().sort((a,b)=>Number(a.minute)-Number(b.minute)).map(e=>{
    const idx=events.indexOf(e);
    return '<div class="v1130-event"><b>'+esc(e.minute)+"' · "+esc(e.type)+'</b><span>'+esc(e.team)+' · '+esc(e.player||'Sin jugador')+(e.note?' · '+esc(e.note):'')+'</span><button type="button" data-v562-event-remove="'+idx+'" aria-label="Eliminar incidencia">✕</button></div>';
  }).join('');
}
function editorMarkup(m){
  const d=draftFor(m),hp=d.homePlayers?.length?d.homePlayers:roster(m.cat,m.home).map(blankPlayer),ap=d.awayPlayers?.length?d.awayPlayers:roster(m.cat,m.away).map(blankPlayer),timer=d.timer||{};
  const periods=['Primer tiempo','Descanso','Segundo tiempo','Tiempo extra','Penales'];
  return '<section class="v562-page v562-editor v1130-referee" data-v562-page data-v562-editor-root>'+
    '<header class="v562-head"><button type="button" data-v562-list aria-label="Volver a los partidos">←</button><div><small>'+esc(m.category)+' · JORNADA '+esc(m.round||'—')+'</small><h1>Cédula offline</h1><p>'+esc(m.date||'Fecha pendiente')+' · '+esc(m.field||'Campo pendiente')+'</p></div><span class="v562-net '+(navigator.onLine?'on':'off')+'" data-v562-net>'+(navigator.onLine?'EN LÍNEA':'SIN SEÑAL')+'</span></header>'+
    '<article class="v562-score"><span><b>'+esc(m.home)+'</b><em>LOCAL</em></span><strong>VS</strong><span><b>'+esc(m.away)+'</b><em>VISITANTE</em></span></article>'+
    '<div class="v1130-save-status" data-v562-save-status role="status">Guardado automático activado · datos solo en este teléfono</div>'+
    '<section class="v1130-clock"><div><small>CRONÓMETRO DEL PARTIDO</small><strong data-v562-clock>'+clockText(elapsedTime(timer))+'</strong><select data-v562-period aria-label="Periodo">'+periods.map(p=>'<option '+(timer.period===p?'selected':'')+'>'+p+'</option>').join('')+'</select></div>'+
    '<div class="v1130-clock-actions"><button type="button" data-v562-clock-action="start">▶ Iniciar</button><button type="button" data-v562-clock-action="pause">Ⅱ Pausar</button><button type="button" data-v562-clock-action="reset">↻ Reiniciar</button></div></section>'+
    '<label class="v562-ref"><span>Árbitro responsable</span><input type="text" data-v562-referee value="'+esc(d.referee||'')+'" placeholder="Nombre del árbitro"></label>'+
    teamEditor('home',m.home,hp,d)+teamEditor('away',m.away,ap,d)+
    '<section class="v1130-incidents"><h2>📝 Cronología de incidencias</h2><p>Registra goles, tarjetas, cambios, lesiones y observaciones con el minuto. No cambia los datos oficiales.</p>'+
    '<div class="v1130-event-form"><label>Minuto<input type="number" data-v562-event-minute min="0" max="130" value="1"></label><label>Tipo<select data-v562-event-type><option>Gol</option><option>Amarilla</option><option>Segunda amarilla</option><option>Roja</option><option>Cambio</option><option>Lesión</option><option>Observación</option></select></label><label>Equipo<select data-v562-event-team><option value="'+esc(m.home)+'">'+esc(m.home)+'</option><option value="'+esc(m.away)+'">'+esc(m.away)+'</option></select></label><label>Jugador<input data-v562-event-player placeholder="Nombre o dorsal"></label><label class="wide">Detalles<input data-v562-event-note placeholder="Motivo o comentario opcional"></label><button type="button" data-v562-event-add>+ Añadir incidencia</button></div>'+
    '<div class="v1130-event-list" data-v562-events>'+eventMarkup(d.events||[])+'</div></section>'+
    '<div class="v1130-validation" data-v562-validation role="alert" hidden></div>'+
    '<div class="v562-savebar"><button type="button" data-v562-save>💾 Guardar borrador</button><button type="button" data-v562-queue>📥 Enviar a cola</button><button type="button" data-v562-final class="primary">✓ Finalizar cédula</button><button type="button" data-v562-pdf>📄 Imprimir / PDF</button></div>'+
    '<p class="v562-note">Al finalizar, la cédula se queda en la cola local hasta que exista sincronización privada autenticada. El cronómetro es una herramienta auxiliar, no reemplaza el control arbitral.</p></section>';
}
function captureDraft(m){
  const root=document.querySelector('[data-v562-editor-root]');if(!root)return draftFor(m);
  const d=draftFor(m);d.referee=root.querySelector('[data-v562-referee]')?.value.trim()||'';
  d.homeDefault=!!root.querySelector('[data-v562-default="home"]')?.checked;d.awayDefault=!!root.querySelector('[data-v562-default="away"]')?.checked;
  d.homeReason=root.querySelector('[data-v562-reason="home"]')?.value.trim()||'';d.awayReason=root.querySelector('[data-v562-reason="away"]')?.value.trim()||'';
  const readPlayers=side=>Array.from(root.querySelectorAll('[data-v562-player-row="'+side+'"]').values()).map(row=>({
    name:row.dataset.v562Name||'',status:row.querySelector('[data-v562-status]')?.value||'titular',goals:Number(row.querySelector('[data-v562-goals]')?.value)||0,
    yellow1:!!row.querySelector('[data-v562-y1]')?.checked,yellow2:!!row.querySelector('[data-v562-y2]')?.checked,red:!!row.querySelector('[data-v562-red]')?.checked,
    suspension:Number(row.querySelector('[data-v562-susp]')?.value)||0
  }));
  d.homePlayers=readPlayers('home');d.awayPlayers=readPlayers('away');d.events=Array.isArray(d.events)?d.events:[];d.timer=d.timer||{elapsedMs:0,runningSince:0,period:'Primer tiempo'};d.updatedAt=Date.now();return d;
}
function validateDraft(d){
  const errors=[];
  if(!String(d.referee||'').trim())errors.push('Escribe el nombre del árbitro.');
  if(d.homeDefault&&!d.homeReason?.trim())errors.push('Indica el motivo del default del local.');
  if(d.awayDefault&&!d.awayReason?.trim())errors.push('Indica el motivo del default del visitante.');
  if(d.homeDefault&&d.awayDefault)errors.push('Revisa los dos defaults: ambos equipos están marcados.');
  for(const p of [...(d.homePlayers||[]),...(d.awayPlayers||[])]){
    if(p.yellow2&&!p.yellow1)errors.push('La segunda amarilla de '+p.name+' requiere registrar la primera.');
    if(!Number.isInteger(p.goals)||p.goals<0||p.goals>20)errors.push('Revisa los goles de '+p.name+'.');
  }
  return errors;
}
function persistDraft(m,d,quiet=false){
  const s=readState();s.drafts[m.key]=d;
  const ok=writeState(s),node=document.querySelector('[data-v562-save-status]');
  if(node)node.textContent=ok?'✓ Guardado local '+new Date().toLocaleTimeString('es-MX'):'⚠ No se pudo guardar: libera espacio o exporta un respaldo';
  if(!ok&&!quiet)toast('No se guardó la cédula: almacenamiento lleno o restringido');
  return ok;
}
function autoSave(m){if(!m||!document.querySelector('[data-v562-editor-root]'))return false;return persistDraft(m,captureDraft(m),true)}
function scheduleAutoSave(m){
  clearTimeout(autoSaveTimer);
  const node=document.querySelector('[data-v562-save-status]');
  if(node)node.textContent='Guardando cambios…';
  autoSaveTimer=setTimeout(()=>autoSave(m),520);
}
function saveDraft(m,queue=false,finalize=false){
  clearTimeout(autoSaveTimer);
  const d=captureDraft(m);
  if(finalize){
    const errors=validateDraft(d),el=document.querySelector('[data-v562-validation]');
    if(errors.length){if(el){el.hidden=false;el.innerHTML='<b>Antes de finalizar:</b><ul>'+errors.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';el.scrollIntoView({behavior:'smooth',block:'center'})}return false}
    if(el)el.hidden=true;
  }
  const s=readState();s.drafts[m.key]=d;
  if(queue){
    s.queue=s.queue.filter(x=>!(x.matchKey===m.key&&!x.synced));
    s.queue.unshift({id:'cedula-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),matchKey:m.key,cat:m.cat,category:m.category,partido:m.number,jornada:m.round,home:m.home,away:m.away,date:m.date,field:m.field,finalize,createdAt:Date.now(),synced:false,payload:d});
  }
  if(!writeState(s)){toast('No se guardó; revisa el almacenamiento antes de salir');return false}
  toast(queue?(finalize?'Cédula final guardada en cola local':'Cédula pendiente guardada en cola'):'Borrador guardado');
  if(queue){currentMatchKey='';render()}
  return true;
}
function updateClock(m,action){
  const d=captureDraft(m),timer=d.timer||{elapsedMs:0,runningSince:0,period:'Primer tiempo'};
  if(action==='start'&&!timer.runningSince)timer.runningSince=Date.now();
  if(action==='pause'&&timer.runningSince){timer.elapsedMs=elapsedTime(timer);timer.runningSince=0}
  if(action==='reset'){if(!confirm('¿Reiniciar el cronómetro de este partido?'))return;timer.elapsedMs=0;timer.runningSince=0}
  timer.period=document.querySelector('[data-v562-period]')?.value||timer.period||'Primer tiempo';
  d.timer=timer;persistDraft(m,d);
  document.querySelector('[data-v562-clock]')?.replaceChildren(document.createTextNode(clockText(elapsedTime(timer))));
}
function addIncident(m){
  const root=document.querySelector('[data-v562-editor-root]');if(!root)return;
  const minute=Number(root.querySelector('[data-v562-event-minute]')?.value);
  if(!Number.isInteger(minute)||minute<0||minute>130){toast('Indica un minuto válido entre 0 y 130');return}
  const d=captureDraft(m);
  d.events=Array.isArray(d.events)?d.events:[];
  d.events.push({id:'evt-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),minute,type:root.querySelector('[data-v562-event-type]')?.value||'Observación',team:root.querySelector('[data-v562-event-team]')?.value||m.home,player:root.querySelector('[data-v562-event-player]')?.value.trim().slice(0,110)||'',note:root.querySelector('[data-v562-event-note]')?.value.trim().slice(0,400)||'',at:Date.now()});
  if(persistDraft(m,d)){
    root.querySelector('[data-v562-events]').innerHTML=eventMarkup(d.events);
    root.querySelector('[data-v562-event-player]').value='';
    root.querySelector('[data-v562-event-note]').value='';
    toast('Incidencia guardada en el teléfono');
  }
}
function removeIncident(m,index){
  const d=captureDraft(m);if(!Array.isArray(d.events)||!d.events[index])return;
  d.events.splice(index,1);
  if(persistDraft(m,d))document.querySelector('[data-v562-events]').innerHTML=eventMarkup(d.events);
}
function exportQueue(){
  const s=readState(),pending=s.queue.filter(x=>!x.synced);if(!pending.length){toast('No hay cédulas pendientes');return}
  const blob=new Blob([JSON.stringify({schema:1,build:BUILD,exportedAt:new Date().toISOString(),items:pending},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='cedulas-offline-pendientes-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);
}
async function refreshOfficial(){
  toast('Actualizando datos oficiales…');
  try{
    if(window.LJR_V508_OFFICIAL?.refresh){await window.LJR_V508_OFFICIAL.refresh();localData=window.LJR_V508_OFFICIAL.getData?.()||null}
    if(!localData){const r=await fetch('./data/official-live.json?refresh='+Date.now(),{cache:'no-store'});if(r.ok)localData=await r.json()}
    toast('Datos oficiales recargados');render();
  }catch(_){toast('No se pudieron actualizar; se conservan los datos locales')}
}
async function activateNotifications(){
  try{
    // V840: los avisos del APK pertenecen a Liga Juventino; no registrar un push
    // genérico desde el módulo AdminFut para evitar avisos duplicados o con otra identidad.
    if(window.LJR_V840_NOTIFICATIONS?.requestPermission){
      const ok=await window.LJR_V840_NOTIFICATIONS.requestPermission();
      toast(ok?'Avisos de Liga Juventino activados':'Permiso de notificaciones no concedido');
      return;
    }
    location.hash='#/notifications';
    toast('Configura los avisos desde Notificaciones de Liga Juventino');
  }catch(_){location.hash='#/notifications'}
}
async function syncQueue(){
  const s=readState(),pending=s.queue.filter(x=>!x.synced);if(!pending.length)return;
  const api=window.LJR_ADMINFUT_SYNC;
  if(!navigator.onLine){toast('Sigues sin conexión; la cola queda guardada');return}
  if(!api||typeof api.send!=='function'){toast('Falta vincular la autenticación privada de Liga Juventino Rosas; no se envió nada');return}
  let ok=0;
  for(const item of pending){try{const res=await api.send(item);if(res?.ok){item.synced=true;item.syncedAt=Date.now();ok++}}catch(_){}}
  writeState(s);toast(ok?'Sincronizadas '+ok+' cédulas':'No se pudo sincronizar la cola');render();
}

function downloadJson(obj,filename){
 const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();
 setTimeout(()=>{a.remove();URL.revokeObjectURL(url)},800);
}
function backupAll(){
 const s=readState();
 downloadJson({schema:2,kind:'ljr-referee-backup',build:BUILD,exportedAt:new Date().toISOString(),drafts:s.drafts,queue:s.queue},'respaldo-arbitros-'+new Date().toISOString().slice(0,10)+'.json');
 toast('Respaldo descargado. Guárdalo en un lugar privado.');
}
async function restoreBackup(file){
 if(!file)return;
 if(file.size>15000000){toast('Respaldo demasiado grande (máximo 15 MB)');return}
 try{
  const obj=JSON.parse(await file.text());
  if(!obj||typeof obj!=='object'||!obj.drafts||typeof obj.drafts!=='object'||Array.isArray(obj.drafts)||!Array.isArray(obj.queue)||obj.kind!=='ljr-referee-backup'){toast('El archivo no es un respaldo válido del árbitro');return}
  const s=readState();let added=0;
  for(const [key,value] of Object.entries(obj.drafts)){
   if(key.length>500||!value||typeof value!=='object'||!Array.isArray(value.homePlayers)||!Array.isArray(value.awayPlayers))continue;
   if(!Object.prototype.hasOwnProperty.call(s.drafts,key)){s.drafts[key]=value;added++}
  }
  const ids=new Set(s.queue.map(x=>x.id));
  for(const row of obj.queue){if(row&&typeof row.id==='string'&&row.id.length<160&&typeof row.matchKey==='string'&&row.payload&&!ids.has(row.id)){s.queue.push(row);ids.add(row.id);added++}}
  if(!writeState(s)){toast('No se pudo restaurar el respaldo por falta de almacenamiento');return}
  toast('Respaldo fusionado: '+added+' registros nuevos, sin borrar datos existentes');
  render();
 }catch(err){toast('No se pudo leer el archivo de respaldo')}
}
function openFieldMap(m){
 const field=String(m.field||'').trim();
 if(!field){toast('Este partido no tiene cancha registrada');return}
 const place=field+', Juventino Rosas, Guanajuato, México';
 window.open('https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(place),'_blank','noopener,noreferrer');
}
function openCalendar(m){
 const start=parseDate(m.date);
 if(!Number.isFinite(start)){toast('Este partido no tiene fecha y hora válidas');return}
 const dt=new Date(start),end=new Date(start+120*60000);
 const localStamp=d=>new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,19).replace(/[-:]/g,'').replace('T','T');
 const params=new URLSearchParams({action:'TEMPLATE',text:m.home+' vs '+m.away+' · Liga Juventino Rosas',dates:localStamp(dt)+'/'+localStamp(end),ctz:'America/Mexico_City',location:m.field+', Juventino Rosas, Gto.',details:m.category+' · Jornada '+(m.round||'sin definir')+' · Consulta la programación oficial antes de asistir.'});
 window.open('https://calendar.google.com/calendar/render?'+params.toString(),'_blank','noopener,noreferrer');
}
async function prepareOffline(){
 if(!navigator.onLine){toast('Conéctate a internet para preparar los datos');return}
 if(!('caches' in window)){toast('Este navegador no permite preparar una caché offline');return}
 try{
  const cache=await caches.open('ljr-referee-offline-v1130');
  const candidates=['./','./index.html','./manifest.webmanifest','./data/official-live.json'];
  const assetNodes=document.querySelectorAll('script[src*="v562-adminfut-parity"],link[href*="v562-adminfut-parity"],link[href*="v667-referee-full-width"]');
  assetNodes.forEach(n=>candidates.push(n.src||n.href));
  let saved=0,official=false;
  for(const url of [...new Set(candidates)]){
   try{
    const res=await fetch(url,{cache:'no-store'});
    if(!res.ok)continue;
    if(url.includes('official-live.json')){
      const obj=await res.clone().json();
      if(!obj?.categories||!Object.keys(obj.categories).length)continue;
      official=true;
    }
    await cache.put(url,res.clone());saved++;
   }catch(_){}
  }
  if(!official){toast('No se pudieron guardar los datos oficiales; vuelve a intentarlo');return}
  try{await navigator.storage?.persist?.()}catch(_){}
  const s=readState();s.offlineReadyAt=Date.now();
  if(!writeState(s)){toast('Archivos preparados, pero no se pudo guardar la fecha de preparación');return}
  toast('Modo sin señal preparado: '+saved+' recursos guardados');
  const node=document.querySelector('[data-v562-ready]');
  if(node)node.textContent='✓ Datos preparados '+new Date(s.offlineReadyAt).toLocaleString('es-MX')+' · revisa actualizaciones cuando haya internet';
 }catch(_){toast('No se pudo preparar el modo sin señal')}
}
function printDraft(m){
 const d=captureDraft(m);
 if(!persistDraft(m,d))return;
 const line=(p)=>'<tr><td>'+esc(p.name)+'</td><td>'+esc(p.status)+'</td><td>'+Number(p.goals||0)+'</td><td>'+[p.yellow1?'A':null,p.yellow2?'2A':null,p.red?'R':null].filter(Boolean).join(', ')+'</td></tr>';
 const table=(team,players)=>'<h3>'+esc(team)+'</h3><table><thead><tr><th>Jugador</th><th>Estado</th><th>Goles</th><th>Tarjetas</th></tr></thead><tbody>'+players.map(line).join('')+'</tbody></table>';
 const events=(d.events||[]).map(e=>'<li>'+esc(e.minute)+"' "+esc(e.type)+' · '+esc(e.team)+' · '+esc(e.player||'')+' '+esc(e.note||'')+'</li>').join('');
 const html='<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Cédula arbitral</title><style>body{font:12px Arial,sans-serif;color:#172032;padding:22px}h1{font-size:20px;color:#063d92}h2{font-size:15px}table{width:100%;border-collapse:collapse;margin:8px 0 12px}td,th{padding:6px;border:1px solid #b8c4d7;text-align:left}.muted{color:#52617a}.sig{margin-top:40px;border-top:1px solid #222;width:220px;padding-top:6px}@media print{body{padding:4mm}}</style></head><body><h1>Liga Juventino Rosas · Cédula local</h1><p class="muted">BORRADOR LOCAL · NO ES VALIDACIÓN OFICIAL</p><h2>'+esc(m.home)+' vs '+esc(m.away)+'</h2><p>'+esc(m.category)+' · Jornada '+esc(m.round)+' · '+esc(m.date)+' · '+esc(m.field)+'</p><p><b>Árbitro:</b> '+esc(d.referee||'Sin registrar')+'</p>'+table(m.home,d.homePlayers||[])+table(m.away,d.awayPlayers||[])+'<h3>Incidencias</h3><ol>'+events+'</ol><p>Default local: '+esc(d.homeDefault?'Sí · '+d.homeReason:'No')+' | Default visitante: '+esc(d.awayDefault?'Sí · '+d.awayReason:'No')+'</p><p class="sig">Firma del árbitro</p><script>window.onload=function(){setTimeout(function(){window.print()},250)};<\/script></body></html>';
 const tab=window.open('','_blank');
 if(!tab){toast('Permite ventanas emergentes para imprimir o guardar PDF');return}
 tab.document.open();tab.document.write(html);tab.document.close();
}
function recoverMatch(m,key){
 const parts=String(key||'').split('|');
 if(parts.length<7)return false;
 return parts[0]===m.cat&&norm(parts[5])===norm(m.home)&&norm(parts[6])===norm(m.away)&&(!m.number||parts[3]===m.number);
}
function matchHasDraft(s,m){return !!s.drafts[m.key]||Object.keys(s.drafts).some(k=>recoverMatch(m,k))}
function matchHasQueue(s,m){return s.queue.some(x=>!x.synced&&(x.matchKey===m.key||recoverMatch(m,x.matchKey)))}
function refreshCards(root){
 const target=root.querySelector('.v562-match-list');
 if(!target)return;
 const matches=recentFixtures();
 target.innerHTML=matches.length?matches.map(matchCard).join(''):'<div class="v562-empty">No hay partidos para este filtro.</div>';
 const title=root.querySelector('.v562-title small');if(title)title.textContent='· '+matches.length+' resultados';
}

function findMatch(key){return fixtures().find(x=>x.key===key)||fixtures().find(x=>recoverMatch(x,key))||null}
function render(){
  if(route()!==ROUTE)return;
  const screen=document.querySelector('#screen');if(!screen)return;
  document.body.dataset.appRoute=ROUTE;
  const m=currentMatchKey?findMatch(currentMatchKey):null;
  if(currentMatchKey&&!m)currentMatchKey='';
  clearInterval(clockInterval);
  screen.innerHTML=m?editorMarkup(m):homeMarkup();bind(screen,m||null);
  if(m){clockInterval=setInterval(()=>{const clock=screen.querySelector('[data-v562-clock]');if(clock)clock.textContent=clockText(elapsedTime(draftFor(m).timer))},1000)}
  window.scrollTo(0,0);
}
function bind(root,m){
 root.querySelector('[data-v562-back]')?.addEventListener('click',()=>{location.hash='#/ligaControl'});
 root.querySelector('[data-v562-list]')?.addEventListener('click',()=>{if(m&&!autoSave(m)){toast('No se guardó. Exporta un respaldo antes de salir');return}currentMatchKey='';render()});
 root.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b||!root.contains(b))return;
  if(b.hasAttribute('data-v562-open')){currentMatchKey=b.dataset.v562Open||'';render();return}
  if(b.hasAttribute('data-v562-map')){const target=findMatch(b.dataset.v562Map);if(target)openFieldMap(target);return}
  if(b.hasAttribute('data-v562-calendar')){const target=findMatch(b.dataset.v562Calendar);if(target)openCalendar(target);return}
  if(b.hasAttribute('data-v562-view')){const s=readState();s.view=b.dataset.v562View||'all';if(!writeState(s)){toast('No se guardó el filtro');return}render();return}
  if(b.hasAttribute('data-v562-event-remove')&&m){removeIncident(m,Number(b.dataset.v562EventRemove));return}
  if(b.hasAttribute('data-v562-clock-action')&&m){updateClock(m,b.dataset.v562ClockAction);return}
  if(b.hasAttribute('data-v562-quick')){
   const type=b.dataset.v562Quick;
   if(type==='offline'){prepareOffline();return}
   if(type==='all'||type==='drafts'){const s=readState();s.view=type;writeState(s);render();return}
   if(type==='timer'){const candidate=recentFixtures()[0]||fixtures()[0];if(candidate){currentMatchKey=candidate.key;render()}else toast('Todavía no hay partidos cargados');return}
  }
 });
 root.querySelector('[data-v562-filter]')?.addEventListener('change',e=>{const s=readState();s.filter=e.target.value;writeState(s);render()});
 root.querySelector('[data-v562-search]')?.addEventListener('input',e=>{const s=readState();s.search=e.target.value;writeState(s);clearTimeout(renderTimer);renderTimer=setTimeout(()=>refreshCards(root),190)});
 root.querySelector('[data-v562-ref-filter]')?.addEventListener('input',e=>{const s=readState();s.myReferee=e.target.value;writeState(s);clearTimeout(renderTimer);renderTimer=setTimeout(()=>refreshCards(root),190)});
 root.querySelector('[data-v562-refresh]')?.addEventListener('click',refreshOfficial);
 root.querySelector('[data-v562-export]')?.addEventListener('click',exportQueue);
 root.querySelector('[data-v562-notify]')?.addEventListener('click',activateNotifications);
 root.querySelector('[data-v562-sync]')?.addEventListener('click',syncQueue);
 root.querySelector('[data-v562-backup]')?.addEventListener('click',backupAll);
 root.querySelector('[data-v562-prep]')?.addEventListener('click',prepareOffline);
 root.querySelector('[data-v562-import]')?.addEventListener('click',()=>root.querySelector('[data-v562-file]')?.click());
 root.querySelector('[data-v562-file]')?.addEventListener('change',e=>{restoreBackup(e.target.files?.[0]);e.target.value=''});
 root.querySelectorAll('[data-v562-default]').forEach(c=>c.addEventListener('change',()=>{const wrap=root.querySelector('[data-v562-reason-wrap="'+c.dataset.v562Default+'"]');if(wrap)wrap.hidden=!c.checked}));
 if(m){
  root.querySelector('[data-v562-save]')?.addEventListener('click',()=>saveDraft(m,false,false));
  root.querySelector('[data-v562-queue]')?.addEventListener('click',()=>saveDraft(m,true,false));
  root.querySelector('[data-v562-final]')?.addEventListener('click',()=>saveDraft(m,true,true));
  root.querySelector('[data-v562-pdf]')?.addEventListener('click',()=>printDraft(m));
  root.querySelector('[data-v562-event-add]')?.addEventListener('click',()=>addIncident(m));
  root.querySelector('[data-v562-period]')?.addEventListener('change',()=>{const d=captureDraft(m);d.timer.period=root.querySelector('[data-v562-period]').value;persistDraft(m,d)});
  root.querySelectorAll('[data-v562-referee], [data-v562-player-row] input, [data-v562-player-row] select, [data-v562-default], [data-v562-reason]').forEach(el=>{
   el.addEventListener('input',()=>scheduleAutoSave(m));el.addEventListener('change',()=>scheduleAutoSave(m));
  });
 }
}
function net(){document.querySelectorAll('[data-v562-net]').forEach(el=>{el.classList.toggle('on',navigator.onLine);el.classList.toggle('off',!navigator.onLine);el.textContent=navigator.onLine?'EN LÍNEA':'SIN SEÑAL'})}
window.addEventListener('online',net);window.addEventListener('offline',net);
window.addEventListener('hashchange',()=>{if(route()===ROUTE){currentMatchKey='';setTimeout(render,20)}else if(currentMatchKey){const m=findMatch(currentMatchKey);if(m)autoSave(m);currentMatchKey='';clearInterval(clockInterval)}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&currentMatchKey){const m=findMatch(currentMatchKey);if(m)autoSave(m)}});
window.addEventListener('beforeunload',()=>{if(currentMatchKey){const m=findMatch(currentMatchKey);if(m)autoSave(m)}});
window.addEventListener('ljr:official-data',()=>{if(route()===ROUTE&&!currentMatchKey)render()});
new MutationObserver(()=>{if(route()===ROUTE&&!document.querySelector('[data-v562-page]'))setTimeout(render,20)}).observe(document.documentElement,{childList:true,subtree:true});
window.LJR_V562_ADMINFUT={render,refresh:refreshOfficial,exportQueue,build:BUILD};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,80),{once:true});else setTimeout(render,40);
})();
