/* V668 — Operación avanzada de campos.
   Flujo físico: checador -> presidente -> decisión oficial -> aviso compartible.
   La transferencia al presidente reutiliza el canal oficial de WhatsApp ya configurado
   en LJR_WHATSAPP_ADMIN. Los reportes/decisiones también viajan como enlace firmado por
   contenido (sin fotos) para que otro teléfono pueda importarlos dentro de la app. */
(function(){
'use strict';
if(window.__LJR_V668_FIELD_OPS__)return;
window.__LJR_V668_FIELD_OPS__=true;

const REPORTS_KEY='v668-field-reports';
const DECISIONS_KEY='v668-field-decisions';
const CHECKERS_KEY='v668-field-checkers';
const ROLE_KEY='v668-field-role';
const NOTICE_KEY='v668-field-notices';
const NOTIFY_KEY='v668-field-notify';
const MAX_REPORTS=80;
const FIELDS=[
  ['uds-1','UDS · Campo 1'],
  ['uds-2','UDS · Campo 2'],
  ['uds-3','UDS · Campo 3'],
  ['campo-4','Campo 4'],
  ['fraccionamiento','Fraccionamiento'],
  ['romerillo','Romerillo'],
  ['san-julian','San Julián'],
  ['franco-tavera','Franco Tavera'],
  ['cuenda','Cuenda'],
  ['pozos','Campo de Fútbol de Pozos'],
  ['cerrito','Campo Cerrito de Gasca'],
  ['san-jose','Campo San José de la Montaña'],
  ['san-juan','Campo San Juan de la Cruz'],
  ['rincon','Campo Rincón de Centeno']
];
const WEATHER_FIELD_MAP={
  'uds-1':'sur-1','uds-2':'sur-2','uds-3':'sur-3','campo-4':'zapata-4',
  'fraccionamiento':'fraccionamiento','romerillo':'romerillo','san-julian':'san-julian',
  'franco-tavera':'tavera','cuenda':'cuenda',
  'pozos':'pozos','cerrito':'cerrito','san-jose':'san-jose',
  'san-juan':'san-juan','rincon':'rincon'
};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>document.body?.dataset?.appRoute||String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const read=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(_){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const nowLocal=()=>{const d=new Date(Date.now()-new Date().getTimezoneOffset()*60000);return d.toISOString().slice(0,16)};
let photoFiles=[],photoUrls=[],gps=null;

function toast(msg){
  $('.v668-toast')?.remove();
  const n=document.createElement('div');n.className='v668-toast';n.textContent=msg;
  document.body.appendChild(n);setTimeout(()=>n.remove(),2300);
}
function fieldName(id){return FIELDS.find(x=>x[0]===id)?.[1]||id||'Campo'}
function uid(){return 'CR-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase()}
function b64enc(obj){
  const bytes=new TextEncoder().encode(JSON.stringify(obj));
  let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));
  return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function b64dec(v){
  let s=String(v||'').replace(/-/g,'+').replace(/_/g,'/');
  while(s.length%4)s+='=';
  const bin=atob(s),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
function transferUrl(kind,payload){
  const u=new URL(location.href);
  u.hash='#/v38Weather';
  u.searchParams.set(kind,b64enc(payload));
  return u.toString();
}
function stripTransferParam(name){
  try{
    const u=new URL(location.href);u.searchParams.delete(name);
    history.replaceState(null,'',u.pathname+(u.search||'')+(u.hash||'#/v38Weather'));
  }catch(_){}
}
function reports(){return read(REPORTS_KEY,[])}
function saveReports(list){write(REPORTS_KEY,list.slice(0,MAX_REPORTS))}
function decisions(){return read(DECISIONS_KEY,{})}
function checkers(){return read(CHECKERS_KEY,[])}
function notices(){return read(NOTICE_KEY,[])}
function fieldOptions(selected=''){
  return FIELDS.map(([id,n])=>'<option value="'+esc(id)+'" '+(id===selected?'selected':'')+'>'+esc(n)+'</option>').join('');
}
function decisionLabel(status){
  return ({play:'APTO · SE JUEGA',review:'EN REVISIÓN',delay:'POR CONFIRMAR / RETRASADO',closed:'NO SE JUEGA · CANCHA CERRADA'})[status]||'SIN DECISIÓN';
}
function decisionTone(status){return status==='play'?'good':status==='closed'?'danger':status==='review'||status==='delay'?'watch':'neutral'}

function physicalAssessment(v){
  let score=100,hard='';
  const reasons=[];
  if(v.water==='puddles'){score-=48;hard='closed';reasons.push('charcos o agua estancada')}
  else if(v.water==='some'){score-=16;reasons.push('agua en algunas zonas')}
  if(v.mud==='heavy'){score-=35;reasons.push('lodo/barro fuerte')}
  else if(v.mud==='light'){score-=12;reasons.push('lodo ligero')}
  if(v.surface==='heavy')score-=18;
  else if(v.surface==='damp')score-=7;
  if(v.hardness==='veryhard'){score-=16;reasons.push('superficie demasiado dura')}
  else if(v.hardness==='hard')score-=7;
  else if(v.hardness==='loose'){score-=12;reasons.push('material suelto')}
  if(v.footing==='unsafe'){score-=60;hard='closed';reasons.push('apoyo inseguro')}
  else if(v.footing==='slippery'){score-=30;reasons.push('superficie resbalosa')}
  else if(v.footing==='soft'){score-=18;reasons.push('se hunde al pisar')}
  if(v.ball==='poor'){score-=28;reasons.push('balón no rueda/rebota utilizable')}
  else if(v.ball==='irregular'){score-=15;reasons.push('bote irregular')}
  else if(v.ball==='slow')score-=8;
  if(v.evenness==='dangerous'){score-=50;hard='closed';reasons.push('baches o surcos peligrosos')}
  else if(v.evenness==='minor')score-=10;
  if(v.debris==='dangerous'){score-=55;hard='closed';reasons.push('piedras u objetos peligrosos')}
  else if(v.debris==='some')score-=10;
  if(v.dust==='high'){score-=12;reasons.push('polvo/material fino alto')}
  else if(v.dust==='moderate')score-=5;
  if(v.goals==='unsafe'){score-=50;hard='closed';reasons.push('porterías/redes inseguras')}
  else if(v.goals==='review')score-=10;
  if(v.drainage==='poor'){score-=18;reasons.push('drenaje deficiente')}
  else if(v.drainage==='average')score-=7;
  if(v.access==='blocked'){score-=35;reasons.push('acceso bloqueado')}
  else if(v.access==='review')score-=8;
  if(v.lines==='missing')score-=10;
  else if(v.lines==='faded')score-=4;
  score=Math.max(0,Math.min(100,score));
  let key='fit',label='APTO PARA PROPONER',tone='good';
  if(hard==='closed'||score<45){key='notfit';label='NO APTO · ESCALAR A LA LIGA';tone='danger'}
  else if(score<78){key='review';label='REVISAR ANTES DE AUTORIZAR';tone='watch'}
  return {score,key,label,tone,reasons};
}
function formValues(root){
  const val=n=>root.querySelector('[name="'+n+'"]')?.value?.trim()||'';
  return {
    checker:val('checker'),field:val('field'),at:val('at')||nowLocal(),
    surfaceType:val('surfaceType')||'dirt_compact',surface:val('surface')||'dry',
    water:val('water')||'none',mud:val('mud')||'none',hardness:val('hardness')||'normal',
    footing:val('footing')||'firm',ball:val('ball')||'normal',evenness:val('evenness')||'even',
    debris:val('debris')||'clear',dust:val('dust')||'low',
    goals:val('goals')||'ok',lines:val('lines')||'ok',drainage:val('drainage')||'good',
    access:val('access')||'ok',notes:val('notes')
  };
}
function reportText(r){
  const a=r.assessment||{};
  const lines=[
    '🏟️ REVISIÓN FÍSICA DE CANCHA · Liga Juventino Rosas',
    'Folio: '+r.id,
    'Campo: '+fieldName(r.field),
    'Checador: '+(r.checker||'Sin nombre'),
    'Fecha/hora: '+new Date(r.createdAt||Date.now()).toLocaleString('es-MX'),
    'Resultado físico: '+(a.label||'POR REVISAR')+' · '+(a.score??'—')+'/100',
    'Tipo: '+r.surfaceType+' · Condición: '+r.surface+' · Agua: '+r.water+' · Lodo: '+r.mud,
    'Dureza: '+r.hardness+' · Apoyo: '+r.footing+' · Balón: '+r.ball,
    'Baches: '+r.evenness+' · Piedras/objetos: '+r.debris+' · Polvo: '+r.dust,
    'Líneas: '+r.lines+' · Porterías: '+r.goals+' · Drenaje: '+r.drainage+' · Acceso: '+r.access,
    r.location?'Ubicación registrada: '+Number(r.location.lat).toFixed(5)+', '+Number(r.location.lng).toFixed(5)+' (±'+Math.round(r.location.accuracy||0)+' m)':'',
    r.notes?'Observaciones: '+r.notes:'',
    '',
    '⚠️ Esta revisión física NO suspende por sí sola. La decisión oficial corresponde a la Liga.'
  ].filter(Boolean);
  return lines.join('\n');
}
function reportPayload(r){
  const {id,field,checker,at,createdAt,surfaceType,surface,water,mud,hardness,footing,ball,evenness,debris,dust,goals,lines,drainage,access,notes,assessment,location}=r;
  return {v:2,id,field,checker,at,createdAt,surfaceType,surface,water,mud,hardness,footing,ball,evenness,debris,dust,goals,lines,drainage,access,notes,assessment,location};
}
function syncWeatherInspection(r){
  const id=WEATHER_FIELD_MAP[r?.field];if(!id)return;
  const mapped={
    surfaceType:r.surfaceType||'dirt_compact',
    standingWater:r.water==='puddles'?'yes':'no',
    mud:r.mud||'none',
    hardness:r.hardness||'normal',
    footing:r.footing||'firm',
    ball:r.ball||'normal',
    evenness:r.evenness||'even',
    debris:r.debris||'clear',
    dust:r.dust||'low',
    lines:r.lines==='ok'?'visible':'poor',
    goals:r.goals==='unsafe'?'unsafe':'safe',
    drainage:r.drainage||'good',
    checker:r.checker||'',
    reportId:r.id||'',
    updatedAt:r.createdAt||Date.now(),
    source:'v668-field-checker'
  };
  try{localStorage.setItem('v177-field-inspection:'+id,JSON.stringify(mapped))}catch(_){}
}
function latestDecision(field){return decisions()[field]||null}

function assessmentBox(v){
  const a=physicalAssessment(v);
  return '<div class="v668-assess '+a.tone+'"><span>LECTURA FÍSICA</span><b>'+esc(a.label)+'</b><strong>'+a.score+'/100</strong><small>'+(a.reasons.length?'Señales: '+esc(a.reasons.join(' · ')):'Sin señales físicas críticas marcadas.')+'</small><em>La Liga/presidente conserva la decisión oficial.</em></div>';
}
function photoPreview(){
  return '<div class="v668-photo-status"><b>'+photoFiles.length+' foto'+(photoFiles.length===1?'':'s')+' preparada'+(photoFiles.length===1?'':'s')+'</b><span>Las fotos se pueden compartir desde el teléfono; el enlace del reporte sólo contiene datos de la inspección.</span></div>'+
    (photoUrls.length?'<div class="v668-photo-grid">'+photoUrls.slice(0,4).map(u=>'<img src="'+esc(u)+'" alt="Evidencia de cancha">').join('')+'</div>':'');
}
function checkerDatalist(){
  return '<datalist id="v668-checker-list">'+checkers().map(x=>'<option value="'+esc(x.name)+'">'+esc(fieldName(x.field))+'</option>').join('')+'</datalist>';
}
function checkerMarkup(){
  const last=read('v668-last-checker','');
  return '<section class="v668-checker-panel">'+
    '<div class="v668-section-head"><span><small>CHECADOR DE CAMPO</small><h3>Revisión física en sitio</h3></span><i>01</i></div>'+
    '<p class="v668-help">La persona que revisa la cancha registra lo que ve físicamente. El sistema prepara el reporte y lo envía al presidente para decisión oficial.</p>'+
    '<div class="v668-form two">'+
      '<label><span>Quién revisa</span><input name="checker" list="v668-checker-list" value="'+esc(last)+'" placeholder="Nombre del checador">'+checkerDatalist()+'</label>'+
      '<label><span>Cancha</span><select name="field">'+fieldOptions(localStorage.getItem('v668-last-field')||'uds-1')+'</select></label>'+
      '<label><span>Fecha y hora de revisión</span><input type="datetime-local" name="at" value="'+nowLocal()+'"></label>'+
      '<label><span>Tipo de superficie</span><select name="surfaceType"><option value="dirt_compact">Tierra compactada</option><option value="dirt_sandy">Tierra / arena</option><option value="grass">Pasto natural</option><option value="synthetic">Sintético</option></select></label>'+
      '<label><span>Condición general</span><select name="surface"><option value="dry">Seca / firme</option><option value="damp">Húmeda</option><option value="heavy">Pesada / blanda</option><option value="muddy">Lodosa / barro</option></select></label>'+
    '</div>'+
    '<div class="v668-check-grid">'+
      checkSelect('water','Charcos / agua',[['none','No'],['some','Zonas húmedas'],['puddles','Sí · agua estancada']])+
      checkSelect('mud','Barro / lodo',[['none','Nada'],['light','Ligero'],['heavy','Fuerte']])+
      checkSelect('hardness','Dureza / material',[['normal','Normal'],['hard','Duro'],['veryhard','Muy duro'],['loose','Tierra suelta']])+
      checkSelect('footing','Apoyo / tracción',[['firm','Firme'],['soft','Blando / se hunde'],['slippery','Resbaloso'],['unsafe','Inseguro']])+
      checkSelect('ball','Balón rueda / rebota',[['normal','Normal'],['slow','Muy lento'],['irregular','Irregular'],['poor','No utilizable']])+
      checkSelect('evenness','Baches / surcos',[['even','Uniforme'],['minor','Menores'],['dangerous','Peligrosos']])+
      checkSelect('debris','Piedras / objetos',[['clear','Limpio'],['some','Algunos'],['dangerous','Peligrosos']])+
      checkSelect('dust','Polvo / material fino',[['low','Bajo'],['moderate','Moderado'],['high','Alto']])+
      checkSelect('lines','Líneas visibles',[['ok','Sí'],['faded','Poco visibles'],['missing','No']])+
      checkSelect('goals','Porterías seguras',[['ok','Sí'],['review','Revisar'],['unsafe','No']])+
      checkSelect('drainage','Drenaje',[['good','Bueno'],['average','Regular'],['poor','Deficiente']])+
      checkSelect('access','Acceso al campo',[['ok','Libre'],['review','Con detalle'],['blocked','Bloqueado']])+
    '</div>'+
    '<label class="v668-notes"><span>Observaciones del checador</span><textarea name="notes" rows="3" placeholder="Ej. zona norte con lodo, portería firme, balón se frena…"></textarea></label>'+
    '<div class="v668-evidence">'+
      '<label class="v668-photo"><input type="file" accept="image/*" capture="environment" multiple data-v668-photos><span>📷 Tomar / adjuntar fotos</span><small>Evidencia física desde el teléfono</small></label>'+
      '<button type="button" data-v668-gps>⌖ Registrar ubicación</button>'+
      '<div class="v668-gps" data-v668-gps-status>Ubicación no registrada</div>'+
    '</div>'+
    '<div data-v668-photo-preview>'+photoPreview()+'</div>'+
    '<div data-v668-assessment>'+assessmentBox(formValues(document.createElement("div")))+'</div>'+
    '<div class="v668-main-actions">'+
      '<button type="button" class="secondary" data-v668-save>Guardar revisión</button>'+
      '<button type="button" class="primary" data-v668-send>Enviar al presidente</button>'+
      '<button type="button" data-v668-share-photos>Compartir fotos</button>'+
      '<button type="button" data-v668-png>Reporte PNG</button>'+
    '</div>'+
    '<p class="v668-legal">El reporte del checador es evidencia operativa. Sólo el presidente/Liga debe marcar “se juega”, “por confirmar” o “no se juega”.</p>'+
  '</section>';
}
function checkSelect(name,label,opts){
  return '<label class="v668-check"><span>'+esc(label)+'</span><select name="'+esc(name)+'">'+opts.map(([v,t])=>'<option value="'+esc(v)+'">'+esc(t)+'</option>').join('')+'</select></label>';
}
function checkerRosterMarkup(){
  const list=checkers();
  return '<div class="v668-roster">'+
    '<div class="v668-mini-head"><b>Checadores autorizados</b><small>'+list.length+' registrados en este dispositivo</small></div>'+
    '<div class="v668-roster-form"><input data-v668-new-checker placeholder="Nombre del checador"><select data-v668-new-field>'+fieldOptions('uds-1')+'</select><button type="button" data-v668-add-checker>Agregar</button></div>'+
    '<div class="v668-roster-list">'+(list.length?list.map((x,i)=>'<span><b>'+esc(x.name)+'</b><small>'+esc(fieldName(x.field))+'</small><button type="button" data-v668-remove-checker="'+i+'">×</button></span>').join(''):'<em>Aún no hay checadores guardados.</em>')+'</div>'+
  '</div>';
}
function reportCard(r){
  const dec=latestDecision(r.field),a=r.assessment||{};
  return '<article class="v668-report-card" data-report="'+esc(r.id)+'">'+
    '<header><span><small>'+esc(r.id)+'</small><b>'+esc(fieldName(r.field))+'</b></span><i class="'+esc(a.tone||'neutral')+'">'+esc(a.label||'POR REVISAR')+'</i></header>'+
    '<div class="v668-report-meta"><span>👤 '+esc(r.checker||'Sin nombre')+'</span><span>🕒 '+esc(new Date(r.createdAt||Date.now()).toLocaleString('es-MX'))+'</span>'+(r.location?'<span>⌖ GPS ±'+Math.round(r.location.accuracy||0)+' m</span>':'')+'</div>'+
    '<p>'+esc(r.notes||'Sin observaciones adicionales.')+'</p>'+
    '<div class="v668-report-score"><b>'+esc(String(a.score??'—'))+'</b><span>/100 físico</span></div>'+
    '<label class="v668-president-note"><span>Motivo / nota oficial</span><textarea rows="2" data-v668-decision-note placeholder="Ej. cancha anegada, acceso cerrado, revisión 8:00 h…">'+esc(dec?.reason||'')+'</textarea></label>'+
    '<div class="v668-decision-actions">'+
      '<button type="button" data-v668-decide="play">✓ Se juega</button>'+
      '<button type="button" data-v668-decide="review">◷ En revisión</button>'+
      '<button type="button" data-v668-decide="delay">⏳ Por confirmar</button>'+
      '<button type="button" class="danger" data-v668-decide="closed">⛔ No se juega</button>'+
    '</div>'+
    (dec?'<div class="v668-current-decision '+decisionTone(dec.status)+'"><small>DECISIÓN OFICIAL</small><b>'+esc(decisionLabel(dec.status))+'</b><span>'+esc(dec.reason||'Sin nota adicional')+'</span><button type="button" data-v668-share-decision="'+esc(r.field)+'">Compartir aviso oficial</button></div>':'')+
  '</article>';
}
function officialBoard(){
  const d=decisions(),items=FIELDS.map(([id,name])=>[id,name,d[id]]).filter(x=>x[2]);
  return '<div class="v668-official-board"><div class="v668-mini-head"><b>Estado oficial de campos</b><small>Decisiones guardadas en este dispositivo</small></div>'+
    (items.length?'<div class="v668-official-list">'+items.map(([id,name,x])=>'<article class="'+decisionTone(x.status)+'"><span><b>'+esc(name)+'</b><small>'+esc(new Date(x.createdAt).toLocaleString('es-MX'))+'</small></span><strong>'+esc(decisionLabel(x.status))+'</strong><button type="button" data-v668-share-decision="'+esc(id)+'">Compartir</button></article>').join('')+'</div>':'<p class="v668-none">Sin decisiones oficiales registradas todavía.</p>')+
  '</div>';
}
function presidentMarkup(){
  const list=reports();
  return '<section class="v668-president-panel">'+
    '<div class="v668-section-head"><span><small>LIGA / PRESIDENTE</small><h3>Bandeja de revisiones</h3></span><i>'+list.length+'</i></div>'+
    '<p class="v668-help">Aquí llegan los reportes abiertos desde el enlace del checador. La Liga conserva la decisión final y puede compartir el aviso oficial de cancha.</p>'+
    '<div class="v668-president-tools"><button type="button" data-v668-notify>🔔 Activar avisos del dispositivo</button><button type="button" data-v668-copy-import>＋ Importar reporte</button></div>'+
    checkerRosterMarkup()+officialBoard()+
    '<div class="v668-inbox-head"><b>Reportes recibidos</b><small>Más reciente primero</small></div>'+
    '<div class="v668-inbox">'+(list.length?list.map(reportCard).join(''):'<div class="v668-empty"><b>Sin reportes recibidos</b><span>Un checador puede usar “Enviar al presidente”; al abrir el enlace aquí aparecerá su revisión.</span></div>')+'</div>'+
  '</section>';
}
function noticeBanner(){
  const n=notices()[0];if(!n)return '';
  return '<div class="v668-notice-banner '+decisionTone(n.status)+'"><span><small>ÚLTIMO AVISO OFICIAL IMPORTADO</small><b>'+esc(fieldName(n.field))+' · '+esc(decisionLabel(n.status))+'</b><em>'+esc(n.reason||'Sin nota adicional')+'</em></span><button type="button" data-v668-dismiss-notice>×</button></div>';
}
function moduleMarkup(){
  const role=localStorage.getItem(ROLE_KEY)||'checker';
  return '<section class="v668-field-ops" data-v668-field-ops>'+
    noticeBanner()+
    '<header class="v668-hero"><div><small>OPERACIÓN DE CAMPOS · V668</small><h2>Checadores → Liga → aviso oficial</h2><p>Revisión física con evidencia, envío directo al presidente y decisión separada del pronóstico.</p></div><span>LIVE OPS</span></header>'+
    '<div class="v668-role-tabs"><button type="button" data-v668-role="checker" class="'+(role==='checker'?'active':'')+'">Checador de campo</button><button type="button" data-v668-role="president" class="'+(role==='president'?'active':'')+'">Liga / Presidente</button></div>'+
    '<div data-v668-role-panel>'+(role==='president'?presidentMarkup():checkerMarkup())+'</div>'+
  '</section>';
}
function host(){
  const r=route();
  if(r==='v38Weather')return $('.v163-weather-page');
  if(r==='weatherFields')return $('#v172-weather-smart')?.parentElement||$('.v60-tool-page')||$('#screen');
  return null;
}
function mount(){
  if(!['v38Weather','weatherFields'].includes(route()))return;
  const h=host();if(!h)return;
  if(route()==='v38Weather'){
    const stack=h.querySelector('.v163-weather-stack');
    if(stack&&!stack.querySelector('[data-v668-entry]')){
      const entry=document.createElement('button');
      entry.type='button';
      entry.className='v163-weather-card v668-entry-card';
      entry.dataset.v668Entry='1';
      entry.innerHTML='<span class="v163-weather-card-kicker">🛰️ CHECADORES DE CAMPO</span><strong>Operación física en cancha</strong><p>Checador → reporte con evidencia → presidente → aviso oficial.</p>';
      stack.appendChild(entry);
      entry.addEventListener('click',()=>h.querySelector('[data-v668-field-ops]')?.scrollIntoView({behavior:'smooth',block:'start'}));
    }
  }
  if(h.querySelector('[data-v668-field-ops]'))return;
  const wrap=document.createElement('div');wrap.innerHTML=moduleMarkup().trim();
  const mod=wrap.firstElementChild;
  h.appendChild(mod);bind(mod);
}
function rerender(mod){
  if(!mod)return;
  const role=localStorage.getItem(ROLE_KEY)||'checker';
  mod.querySelectorAll('[data-v668-role]').forEach(b=>b.classList.toggle('active',b.dataset.v668Role===role));
  const panel=mod.querySelector('[data-v668-role-panel]');if(panel)panel.innerHTML=role==='president'?presidentMarkup():checkerMarkup();
  bindPanel(mod);
}
function bind(mod){
  if(!mod||mod.dataset.v668Bound==='1')return;
  mod.dataset.v668Bound='1';
  mod.addEventListener('click',handleClick);
  mod.addEventListener('change',handleChange);
  mod.addEventListener('input',handleInput);
  bindPanel(mod);
}
function bindPanel(mod){
  if((localStorage.getItem(ROLE_KEY)||'checker')==='checker')updateAssessment(mod);
}
function handleInput(e){
  const mod=e.currentTarget;
  if(e.target.closest('.v668-checker-panel'))updateAssessment(mod);
}
function handleChange(e){
  const mod=e.currentTarget;
  if(e.target.matches('[data-v668-photos]')){
    photoUrls.forEach(u=>URL.revokeObjectURL(u));photoUrls=[];
    photoFiles=[...(e.target.files||[])].slice(0,8);
    photoUrls=photoFiles.map(f=>URL.createObjectURL(f));
    const box=mod.querySelector('[data-v668-photo-preview]');if(box)box.innerHTML=photoPreview();
  }
  if(e.target.closest('.v668-checker-panel'))updateAssessment(mod);
}
function updateAssessment(mod){
  const panel=mod.querySelector('.v668-checker-panel');if(!panel)return;
  const box=panel.querySelector('[data-v668-assessment]');if(box)box.innerHTML=assessmentBox(formValues(panel));
}
async function captureGps(mod){
  const status=mod.querySelector('[data-v668-gps-status]');
  if(!navigator.geolocation){if(status)status.textContent='GPS no disponible en este navegador';return}
  if(status)status.textContent='Solicitando ubicación…';
  navigator.geolocation.getCurrentPosition(p=>{
    gps={lat:p.coords.latitude,lng:p.coords.longitude,accuracy:p.coords.accuracy,at:Date.now()};
    if(status)status.textContent='✓ Ubicación registrada · precisión ±'+Math.round(gps.accuracy||0)+' m';
    status?.classList.add('ok');
  },err=>{if(status)status.textContent='No se pudo obtener ubicación: '+(err.message||'permiso no concedido')},{enableHighAccuracy:true,timeout:10000,maximumAge:30000});
}
function buildReport(mod){
  const panel=mod.querySelector('.v668-checker-panel');if(!panel)return null;
  const v=formValues(panel);
  if(!v.checker){toast('Escribe el nombre del checador');panel.querySelector('[name="checker"]')?.focus();return null}
  const assessment=physicalAssessment(v);
  const r={...v,id:uid(),createdAt:Date.now(),assessment,location:gps?{...gps}:null,photoCount:photoFiles.length,source:'field-checker'};
  const list=reports();list.unshift(r);saveReports(list);syncWeatherInspection(r);
  localStorage.setItem('v668-last-checker',v.checker);localStorage.setItem('v668-last-field',v.field);
  return r;
}
async function sendToPresident(mod){
  const r=buildReport(mod);if(!r)return;
  const link=transferUrl('fieldReport',reportPayload(r));
  const text=reportText(r)+'\n\n🔗 Abrir reporte en la app:\n'+link;
  if(window.LJR_WHATSAPP_ADMIN?.openChat){window.LJR_WHATSAPP_ADMIN.openChat(text);toast('Reporte preparado para el presidente')}
  else{
    try{if(navigator.share)await navigator.share({title:'Revisión de cancha',text,url:link});else await navigator.clipboard.writeText(text)}catch(_){}
  }
  rerender(mod);
}
async function sharePhotos(){
  if(!photoFiles.length){toast('Primero toma o selecciona fotos');return}
  try{
    if(navigator.canShare?.({files:photoFiles})&&navigator.share){await navigator.share({title:'Evidencia física de cancha',text:'Fotos de revisión física · Liga Juventino Rosas',files:photoFiles});return}
  }catch(e){if(e?.name==='AbortError')return}
  toast('Tu navegador no permite compartir estas fotos directamente');
}
async function reportPng(mod){
  const panel=mod.querySelector('.v668-checker-panel');if(!panel)return;
  const v=formValues(panel);if(!v.checker){toast('Escribe el nombre del checador');return}
  const a=physicalAssessment(v),W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d');const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#1329b6');g.addColorStop(.55,'#071276');g.addColorStop(1,'#040550');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='#62edf2';x.font='900 34px Arial';x.fillText('LIGA JUVENTINO · REVISIÓN DE CANCHA',64,82);
  x.fillStyle='#fff';x.font='900 66px Arial';wrapCanvas(x,fieldName(v.field),64,160,950,78,2);
  x.fillStyle='#aebce2';x.font='600 31px Arial';x.fillText('Checador: '+v.checker,64,330);x.fillText('Fecha: '+new Date().toLocaleString('es-MX'),64,378);
  x.fillStyle=a.tone==='danger'?'#ff7a86':a.tone==='watch'?'#ffd05a':'#65f1c7';x.font='900 48px Arial';wrapCanvas(x,a.label,64,470,950,58,2);
  x.fillStyle='#fff';x.font='900 96px Arial';x.fillText(String(a.score),64,650);x.font='700 30px Arial';x.fillText('/100 lectura física',245,650);
  const rows=[['Tipo',v.surfaceType],['Condición',v.surface],['Agua',v.water],['Lodo',v.mud],['Dureza',v.hardness],['Apoyo',v.footing],['Balón',v.ball],['Baches',v.evenness],['Piedras/objetos',v.debris],['Polvo',v.dust],['Porterías',v.goals],['Drenaje',v.drainage]];
  let y=710;x.font='700 24px Arial';rows.forEach(([k,val],i)=>{const col=i<6?0:1,row=i%6,xx=col?560:64,yy=y+row*72;x.fillStyle='#8fa6d8';x.fillText(k,xx,yy);x.fillStyle='#fff';x.fillText(String(val),xx,yy+30)});
  x.fillStyle='#62edf2';x.font='900 27px Arial';x.fillText('NO ES DECISIÓN OFICIAL',64,1260);x.fillStyle='#9cacd3';x.font='600 22px Arial';x.fillText('La Liga/presidente confirma si se juega, se revisa o se cierra el campo.',64,1302);
  const blob=await new Promise(res=>c.toBlob(res,'image/png',1));if(!blob)return;
  const file=new File([blob],'Reporte_Cancha_'+v.field+'.png',{type:'image/png'});
  const text='🏟️ Reporte físico de '+fieldName(v.field)+' · '+a.label+' · '+a.score+'/100';
  if(window.LJR_WHATSAPP_ADMIN?.shareAsset){await window.LJR_WHATSAPP_ADMIN.shareAsset(file,text);return}
  try{if(navigator.canShare?.({files:[file]})&&navigator.share)await navigator.share({title:'Reporte de cancha',text,files:[file]})}catch(_){}
}
function wrapCanvas(ctx,text,x,y,maxWidth,lineH,maxLines){
  const words=String(text).split(/\s+/),lines=[];let line='';
  for(const w of words){const n=line?line+' '+w:w;if(line&&ctx.measureText(n).width>maxWidth){lines.push(line);line=w;if(lines.length>=maxLines-1)break}else line=n}
  if(line&&lines.length<maxLines)lines.push(line);lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineH));
}
function addChecker(mod){
  const name=mod.querySelector('[data-v668-new-checker]')?.value?.trim(),field=mod.querySelector('[data-v668-new-field]')?.value||'uds-1';
  if(!name){toast('Escribe el nombre del checador');return}
  const list=checkers();list.push({name,field,createdAt:Date.now()});write(CHECKERS_KEY,list);rerender(mod);toast('Checador agregado');
}
function removeChecker(mod,i){const list=checkers();list.splice(Number(i),1);write(CHECKERS_KEY,list);rerender(mod)}
function setDecision(mod,reportId,status){
  const r=reports().find(x=>x.id===reportId);if(!r)return;
  const card=mod.querySelector('[data-report="'+CSS.escape(reportId)+'"]');
  const reason=card?.querySelector('[data-v668-decision-note]')?.value?.trim()||'';
  const d=decisions();d[r.field]={status,reason,createdAt:Date.now(),reportId:r.id,field:r.field,checker:r.checker};write(DECISIONS_KEY,d);
  toast(decisionLabel(status));
  showNotification('Estado de '+fieldName(r.field),decisionLabel(status)+(reason?' · '+reason:''));
  rerender(mod);
}
function decisionPayload(d){return {v:1,field:d.field,status:d.status,reason:d.reason||'',createdAt:d.createdAt,reportId:d.reportId||''}}
async function shareDecision(field){
  const d=decisions()[field];if(!d){toast('No hay decisión oficial para ese campo');return}
  const p=decisionPayload(d),url=transferUrl('fieldNotice',p);
  const text='📢 AVISO OFICIAL · Liga Juventino Rosas\n'+fieldName(field)+'\n'+decisionLabel(d.status)+(d.reason?'\nMotivo: '+d.reason:'')+'\nActualizado: '+new Date(d.createdAt).toLocaleString('es-MX');
  try{
    if(navigator.share){await navigator.share({title:'Aviso oficial de cancha',text,url});return}
    await navigator.clipboard.writeText(text+'\n'+url);toast('Aviso copiado');
  }catch(e){if(e?.name!=='AbortError')toast('No se pudo compartir el aviso')}
}
async function enableNotifications(){
  if(!('Notification'in window)){toast('Este navegador no admite notificaciones');return}
  try{
    let p=Notification.permission;if(p==='default')p=await Notification.requestPermission();
    write(NOTIFY_KEY,p==='granted');toast(p==='granted'?'Avisos activados':'Permiso de avisos no concedido');
  }catch(_){toast('No se pudieron activar avisos')}
}
function showNotification(title,body){
  if(!read(NOTIFY_KEY,false)||!('Notification'in window)||Notification.permission!=='granted')return;
  try{
    navigator.serviceWorker?.getRegistration?.().then(reg=>reg?.showNotification?reg.showNotification(title,{body,tag:'v668-field'}):new Notification(title,{body}));
  }catch(_){try{new Notification(title,{body})}catch(__){}}
}
async function importFromClipboard(){
  try{
    const text=await navigator.clipboard.readText();const m=text.match(/fieldReport=([A-Za-z0-9_-]+)/);
    if(!m){toast('No encontré un reporte compatible en el portapapeles');return}
    const r=b64dec(m[1]);importReport(r);toast('Reporte importado');
    const mod=$('[data-v668-field-ops]');if(mod){localStorage.setItem(ROLE_KEY,'president');rerender(mod)}
  }catch(_){toast('No se pudo leer el portapapeles')}
}
function importReport(r){
  if(!r?.id||!r?.field)return;
  const list=reports();const i=list.findIndex(x=>x.id===r.id);
  if(i>=0)list[i]={...list[i],...r,importedAt:Date.now()};else list.unshift({...r,importedAt:Date.now(),source:'shared-link'});
  saveReports(list);syncWeatherInspection(r);showNotification('Nueva revisión de cancha',fieldName(r.field)+' · '+(r.assessment?.label||'Reporte recibido'));
}
function importNotice(n){
  if(!n?.field||!n?.status)return;
  const list=notices().filter(x=>!(x.field===n.field&&x.createdAt===n.createdAt));list.unshift(n);write(NOTICE_KEY,list.slice(0,20));
  const d=decisions();d[n.field]={...n,source:'shared-notice'};write(DECISIONS_KEY,d);
  showNotification('Aviso oficial · '+fieldName(n.field),decisionLabel(n.status)+(n.reason?' · '+n.reason:''));
}
function processIncoming(){
  const u=new URL(location.href);const rp=u.searchParams.get('fieldReport'),np=u.searchParams.get('fieldNotice');
  if(rp){try{importReport(b64dec(rp));localStorage.setItem(ROLE_KEY,'president');toast('Reporte de checador recibido')}catch(_){toast('El reporte recibido no se pudo leer')}stripTransferParam('fieldReport')}
  if(np){try{importNotice(b64dec(np));toast('Aviso oficial de cancha recibido')}catch(_){toast('El aviso recibido no se pudo leer')}stripTransferParam('fieldNotice')}
}
function handleClick(e){
  const mod=e.currentTarget,b=e.target.closest('button');if(!b)return;
  if(b.dataset.v668Role){localStorage.setItem(ROLE_KEY,b.dataset.v668Role);rerender(mod);return}
  if(b.hasAttribute('data-v668-gps')){captureGps(mod);return}
  if(b.hasAttribute('data-v668-save')){const r=buildReport(mod);if(r){toast('Revisión guardada');rerender(mod)}return}
  if(b.hasAttribute('data-v668-send')){sendToPresident(mod);return}
  if(b.hasAttribute('data-v668-share-photos')){sharePhotos();return}
  if(b.hasAttribute('data-v668-png')){reportPng(mod);return}
  if(b.hasAttribute('data-v668-add-checker')){addChecker(mod);return}
  if(b.dataset.v668RemoveChecker!==undefined){removeChecker(mod,b.dataset.v668RemoveChecker);return}
  if(b.dataset.v668Decide){const card=b.closest('[data-report]');if(card)setDecision(mod,card.dataset.report,b.dataset.v668Decide);return}
  if(b.dataset.v668ShareDecision){shareDecision(b.dataset.v668ShareDecision);return}
  if(b.hasAttribute('data-v668-notify')){enableNotifications();return}
  if(b.hasAttribute('data-v668-copy-import')){importFromClipboard();return}
  if(b.hasAttribute('data-v668-dismiss-notice')){const list=notices();list.shift();write(NOTICE_KEY,list);const banner=b.closest('.v668-notice-banner');banner?.remove();return}
}

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-v668-open-checker]');if(!b)return;
  e.preventDefault();
  localStorage.setItem(ROLE_KEY,'checker');
  mount();
  setTimeout(()=>{
    const mod=$('[data-v668-field-ops]');
    if(mod){rerender(mod);mod.scrollIntoView({behavior:'smooth',block:'start'})}
  },80);
},true);

processIncoming();
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(()=>{processIncoming();mount()},70)}
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
window.addEventListener('load',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
schedule();setTimeout(schedule,900);
window.LJR_FIELD_OPS={mount,reports,decisions,shareDecision};
})();