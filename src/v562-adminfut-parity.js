/* V562 — paridad funcional con el APK AdminFut: modo árbitro offline local y cola de cédulas. */
(function(){
'use strict';
if(window.__LJR_V562_ADMINFUT_PARITY__)return;
window.__LJR_V562_ADMINFUT_PARITY__=true;

const ROUTE='refereeOffline';
const BUILD='20261002-v562-adminfut-parity';
const STATE_KEY='ljr-v562-referee-offline';
const CAT_NAMES={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
let currentMatchKey='';
let localData=null;
let renderTimer=0;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function readState(){
  try{
    const x=JSON.parse(localStorage.getItem(STATE_KEY)||'null')||{};
    return {drafts:x.drafts||{},queue:Array.isArray(x.queue)?x.queue:[],filter:x.filter||'all',search:x.search||''};
  }catch(_){return {drafts:{},queue:[],filter:'all',search:''}}
}
function writeState(next){try{localStorage.setItem(STATE_KEY,JSON.stringify(next))}catch(_){}}
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
  let list=fixtures().filter(m=>s.filter==='all'||m.cat===s.filter).filter(m=>!q||norm(m.home+' '+m.away+' '+m.category+' '+m.field+' '+m.date).includes(q));
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
  return '<section class="v562-page" data-v562-page>'+
    '<header class="v562-head"><button type="button" data-v562-back aria-label="Volver">‹</button><div><small>JR CONTROL · LIGA JUVENTINO ROSAS</small><h1>Modo árbitro offline</h1><p>Partidos, borradores y cédulas guardados en este teléfono.</p></div><span class="v562-net '+(navigator.onLine?'on':'off')+'" data-v562-net>'+(navigator.onLine?'EN LÍNEA':'OFFLINE')+'</span></header>'+
    '<div class="v562-kpis"><span><b>'+drafts+'</b><small>Borradores</small></span><span><b>'+pending+'</b><small>En cola</small></span><span><b>'+matches.length+'</b><small>Partidos visibles</small></span></div>'+
    '<article class="v562-info"><div><small>DATOS OFICIALES</small><b>Primera: '+esc(sum.teams)+' equipos · '+esc(sum.played)+' jugados · '+esc(sum.pending)+' pendientes</b><em>'+esc(sum.players)+' jugadores en snapshot · verificado '+esc(sum.verified||'pendiente')+'</em></div><button type="button" data-v562-refresh>Actualizar</button></article>'+
    '<article class="v562-parity"><h2>Funciones tomadas del flujo del APK Liga Juventino Rosas</h2><div><span>✓ Mis partidos sin señal</span><span>✓ Borradores de cédula</span><span>✓ Cola pendiente</span><span>✓ Titular / cambio / tarjetas / goles</span><span>✓ Default y motivo</span><span>✓ Exportación de pendientes</span></div></article>'+
    '<div class="v562-tools"><label><span>Categoría</span><select data-v562-filter>'+cats.map(id=>'<option value="'+id+'" '+(s.filter===id?'selected':'')+'>'+(id==='all'?'Todas':esc(CAT_NAMES[id]))+'</option>').join('')+'</select></label><label class="search"><span>Buscar</span><input data-v562-search type="search" value="'+esc(s.search)+'" placeholder="Equipo, campo o fecha"></label></div>'+
    '<div class="v562-actions"><button type="button" data-v562-notify>Activar avisos</button><button type="button" data-v562-export '+(pending?'':'disabled')+'>Exportar cola ('+pending+')</button><button type="button" data-v562-sync '+(pending?'':'disabled')+'>Sincronizar</button></div>'+
    '<div class="v562-cap"><span class="'+(cap.native?'ok':'')+'"><b>APK nativa</b><small>'+(cap.native?'Detectada':'Vista web / Pages')+'</small></span><span class="'+(cap.push?'ok':'')+'"><b>Push nativo</b><small>'+(cap.push?'Disponible':'Pendiente de Firebase/plugin')+'</small></span><span class="'+(cap.biometric?'ok':'')+'"><b>Biometría</b><small>'+(cap.biometric?'Disponible':'Pendiente en tu APK')+'</small></span></div>'+
    '<h2 class="v562-title">Mis partidos / partidos oficiales</h2><div class="v562-match-list">'+(matches.length?matches.map(matchCard).join(''):'<div class="v562-empty">No hay partidos para este filtro.</div>')+'</div>'+
    '<p class="v562-note">La liga azul usa aquí datos deportivos públicos. La sincronización privada con Liga Juventino Rosas no se ejecuta hasta tener autenticación oficial; los borradores permanecen locales y no exponen CURP, INE ni documentos.</p>'+
  '</section>';
}
function matchCard(m){
  const s=readState(),draft=!!s.drafts[m.key],queued=s.queue.some(x=>x.matchKey===m.key&&!x.synced);
  return '<article class="v562-match"><div class="v562-match-top"><small>'+esc(m.category)+' · J'+esc(m.round||'—')+'</small>'+badge(m)+'</div><div class="v562-versus"><span><b>'+esc(m.home)+'</b><em>LOCAL</em></span><strong>'+((m.homeScore!==null&&m.awayScore!==null)?esc(m.homeScore)+' - '+esc(m.awayScore):'VS')+'</strong><span><b>'+esc(m.away)+'</b><em>VISITANTE</em></span></div><div class="v562-meta"><span>'+esc(m.date||'Fecha pendiente')+'</span><span>'+esc(m.field||'Campo pendiente')+'</span></div><button type="button" data-v562-open="'+esc(m.key)+'">'+(draft?'Continuar borrador':queued?'Revisar cédula en cola':'Abrir cédula')+' ›</button></article>';
}
function blankPlayer(name){return {name,status:'titular',goals:0,yellow1:false,yellow2:false,red:false,suspension:0}}
function draftFor(m){
  const s=readState(),saved=s.drafts[m.key];
  if(saved)return saved;
  return {matchKey:m.key,referee:m.referee&&m.referee!=='---'?m.referee:'',homeDefault:false,awayDefault:false,homeReason:'',awayReason:'',homePlayers:roster(m.cat,m.home).map(blankPlayer),awayPlayers:roster(m.cat,m.away).map(blankPlayer),updatedAt:0};
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
function editorMarkup(m){
  const d=draftFor(m),hp=d.homePlayers?.length?d.homePlayers:roster(m.cat,m.home).map(blankPlayer),ap=d.awayPlayers?.length?d.awayPlayers:roster(m.cat,m.away).map(blankPlayer);
  return '<section class="v562-page v562-editor" data-v562-page data-v562-editor-root><header class="v562-head"><button type="button" data-v562-list aria-label="Volver">‹</button><div><small>'+esc(m.category)+' · JORNADA '+esc(m.round||'—')+'</small><h1>Cédula offline</h1><p>'+esc(m.date||'Fecha pendiente')+' · '+esc(m.field||'Campo pendiente')+'</p></div><span class="v562-net '+(navigator.onLine?'on':'off')+'" data-v562-net>'+(navigator.onLine?'EN LÍNEA':'OFFLINE')+'</span></header>'+
    '<article class="v562-score"><span><b>'+esc(m.home)+'</b><em>LOCAL</em></span><strong>VS</strong><span><b>'+esc(m.away)+'</b><em>VISITANTE</em></span></article>'+
    '<label class="v562-ref"><span>Árbitro</span><input type="text" data-v562-referee value="'+esc(d.referee||'')+'" placeholder="Nombre del árbitro"></label>'+
    teamEditor('home',m.home,hp,d)+teamEditor('away',m.away,ap,d)+
    '<div class="v562-savebar"><button type="button" data-v562-save>💾 Guardar borrador</button><button type="button" data-v562-queue>📥 Guardar en cola</button><button class="primary" type="button" data-v562-final>✅ Guardar y finalizar</button></div>'+
    '<p class="v562-note">Funciona sin señal después de cargar esta pantalla en el APK. “Finalizar” solo coloca la cédula en la cola local; no modifica Liga Juventino Rosas hasta que exista una conexión autenticada.</p></section>';
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
  d.homePlayers=readPlayers('home');d.awayPlayers=readPlayers('away');d.updatedAt=Date.now();return d;
}
function saveDraft(m,queue=false,finalize=false){
  const s=readState(),d=captureDraft(m);s.drafts[m.key]=d;
  if(queue){
    s.queue=s.queue.filter(x=>!(x.matchKey===m.key&&!x.synced));
    s.queue.unshift({id:'cedula-'+Date.now(),matchKey:m.key,cat:m.cat,category:m.category,partido:m.number,jornada:m.round,home:m.home,away:m.away,date:m.date,field:m.field,finalize,createdAt:Date.now(),synced:false,payload:d});
  }
  writeState(s);toast(queue?(finalize?'Cédula final guardada en cola':'Cédula guardada en cola'):'Borrador guardado');
  if(queue){currentMatchKey='';render()}
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
function findMatch(key){return fixtures().find(x=>x.key===key)||null}
function render(){
  if(route()!==ROUTE)return;
  const screen=document.querySelector('#screen');if(!screen)return;
  document.body.dataset.appRoute=ROUTE;
  const m=currentMatchKey?findMatch(currentMatchKey):null;
  if(currentMatchKey&&!m)currentMatchKey='';
  screen.innerHTML=m?editorMarkup(m):homeMarkup();bind(screen,m||null);window.scrollTo(0,0);
}
function bind(root,m){
  root.querySelector('[data-v562-back]')?.addEventListener('click',()=>{location.hash='#/ligaControl'});
  root.querySelector('[data-v562-list]')?.addEventListener('click',()=>{if(m)saveDraft(m,false,false);currentMatchKey='';render()});
  root.querySelectorAll('[data-v562-open]').forEach(b=>b.addEventListener('click',()=>{currentMatchKey=b.dataset.v562Open||'';render()}));
  root.querySelector('[data-v562-filter]')?.addEventListener('change',e=>{const s=readState();s.filter=e.target.value;writeState(s);render()});
  root.querySelector('[data-v562-search]')?.addEventListener('input',e=>{const s=readState();s.search=e.target.value;writeState(s);clearTimeout(renderTimer);renderTimer=setTimeout(render,180)});
  root.querySelector('[data-v562-refresh]')?.addEventListener('click',refreshOfficial);
  root.querySelector('[data-v562-export]')?.addEventListener('click',exportQueue);
  root.querySelector('[data-v562-notify]')?.addEventListener('click',activateNotifications);
  root.querySelector('[data-v562-sync]')?.addEventListener('click',syncQueue);
  root.querySelectorAll('[data-v562-default]').forEach(c=>c.addEventListener('change',()=>{const wrap=root.querySelector('[data-v562-reason-wrap="'+c.dataset.v562Default+'"]');if(wrap)wrap.hidden=!c.checked}));
  if(m){root.querySelector('[data-v562-save]')?.addEventListener('click',()=>saveDraft(m,false,false));root.querySelector('[data-v562-queue]')?.addEventListener('click',()=>saveDraft(m,true,false));root.querySelector('[data-v562-final]')?.addEventListener('click',()=>saveDraft(m,true,true))}
}
function net(){document.querySelectorAll('[data-v562-net]').forEach(el=>{el.classList.toggle('on',navigator.onLine);el.classList.toggle('off',!navigator.onLine);el.textContent=navigator.onLine?'EN LÍNEA':'OFFLINE'})}
window.addEventListener('online',net);window.addEventListener('offline',net);
window.addEventListener('hashchange',()=>{if(route()===ROUTE){currentMatchKey='';setTimeout(render,20)}});
window.addEventListener('ljr:official-data',()=>{if(route()===ROUTE&&!currentMatchKey)render()});
new MutationObserver(()=>{if(route()===ROUTE&&!document.querySelector('[data-v562-page]'))setTimeout(render,20)}).observe(document.documentElement,{childList:true,subtree:true});
window.LJR_V562_ADMINFUT={render,refresh:refreshOfficial,exportQueue,build:BUILD};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,80),{once:true});else setTimeout(render,40);
})();
