/* V1062 — Flujo local de permisos: calendario, historial, QR y firma dibujada.
   No autentica autoridades ni sincroniza aprobaciones entre dispositivos. */
(function(){
'use strict';
if(window.__LJR_PERMISSION_WORKFLOW_V1062__)return;
window.__LJR_PERMISSION_WORKFLOW_V1062__=true;
const STORE='ljr-permissions-local-v1062',MAX=60;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const same=(a,b)=>norm(a)===norm(b);
const today=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())};
const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(String(s||''))?s:'';
const SAFE_FIELDS=['folio','type','target','category','team','person','delegate','date','until','round','field','reason','signer','role'];
const STATUS={pending:'Pendiente de revisión',approved:'Aprobado · anotación local',rejected:'Rechazado · anotación local'};
let initialized=null,showAll=false,drawn='',drawing=false,ctx=null,lastPoint=null;
function sourceRows(){try{const a=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(a)?a.filter(x=>x&&typeof x.folio==='string').slice(0,MAX):[]}catch(_){return []}}
function store(rows){try{localStorage.setItem(STORE,JSON.stringify(rows.slice(0,MAX)));return true}catch(_){return false}}
function clean(p){const result={};for(const k of SAFE_FIELDS)result[k]=String(p?.[k]||'').slice(0,k==='reason'?900:160);return result}
function persist(p){
 const item={...clean(p),status:'pending',createdAt:new Date().toISOString()};
 const rows=sourceRows().filter(r=>r.folio!==item.folio);
 const saved=store([item,...rows]);return saved;
}
function safeName(p){return p.person||p.team||'Sin nombre'}
function statusFor(r){return (r.until&&validDate(r.until)&&r.until<today())?'Vencido':STATUS[r.status]||STATUS.pending}
function soon(r){if(!validDate(r.until)||r.until<today())return false;const now=new Date(today()+'T12:00:00'),end=new Date(r.until+'T12:00:00');const days=Math.round((end-now)/86400000);return days>=0&&days<=3}
function alerts(rows){const expired=rows.filter(r=>validDate(r.until)&&r.until<today()).length;const next=rows.filter(soon).length;return {expired,next}}
function codeUrl(folio){
 const u=new URL(location.href);
 u.search='';
 u.hash='#/permissionBuilder?verify='+encodeURIComponent(folio);
 return u.toString();
}
function matrixSvg(folio,size=82){
 if(typeof window.qrcode!=='function'||!folio)return '';
 try{
  const qr=window.qrcode(0,'M');qr.addData(codeUrl(folio),'Byte');qr.make();
  const n=qr.getModuleCount(),pad=4,unit=size/(n+2*pad),parts=[];
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(qr.isDark(y,x))parts.push('M'+(x+pad)+' '+(y+pad)+'h1v1h-1z');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+(n+2*pad)+' '+(n+2*pad)+'" width="'+size+'" height="'+size+'" role="img" aria-label="QR de consulta local"><rect width="100%" height="100%" fill="#fff"/><path d="'+parts.join('')+'" fill="#07105d"/></svg>';
 }catch(_){return ''}
}
function qrHtml(p){
 const svg=matrixSvg(p.folio,82);
 if(!svg)return '';
 return '<div class="v1062-qr-print"><img alt="QR de consulta local del folio" src="data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)+'"><small>Consulta local · no certifica</small></div>';
}
function qrSvg(p){
 const svg=matrixSvg(p.folio,82);
 if(!svg)return '';
 // Se inserta como SVG anidado real para garantizar PNG, JPG y SVG sin conexión.
 return '<g transform="translate(660 842)">'+svg.replace(/width="82" height="82"/,'width="91" height="91"')+'</g>'+
 '<text x="660" y="951" font-size="9" fill="#637092" font-family="Arial">Consulta local de folio</text>';
}
function hint(message){const x=$('[data-v1062-hint]');if(x)x.textContent=message}
function notify(message){const x=$('[data-v1062-notice]');if(x){x.textContent=message;x.hidden=false;setTimeout(()=>{if(x.textContent===message)x.hidden=true},5200)}}
function fixtures(){
 const data=window.LJR_PERMISSION_BUILDER_API?.getOfficialData?.()||window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
 return data?.categories||{};
}
function fixtureStamp(raw){
 const m=String(raw||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
 if(!m)return NaN;return new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]).getTime();
}
function fixtureDay(raw){
 const m=String(raw||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
 return m?m[3]+'-'+m[2].padStart(2,'0')+'-'+m[1].padStart(2,'0'):'';
}
function fixturePick(){
 const team=$('[data-v635-team]')?.value,cat=$('[data-v635-cat]')?.value;
 if(!team||!cat)return null;
 const round=$('[data-v635-round]')?.value||'';
 const matches=[];
 for(const item of Object.values(fixtures())){
  if(!same(item?.name,cat))continue;
  for(const group of item.fixtures||[])for(const row of group?.rows||[]){
    if(!same(row?.[2],team)&&!same(row?.[6],team))continue;
    // No usar resultados publicados ni DEFAULT administrativo como próximos juegos.
    if(/^\d+$/.test(String(row?.[3]??''))&&/^\d+$/.test(String(row?.[5]??'')))continue;
    if(/\bDEFAULT\b/i.test(String(row?.[10]||'')))continue;
    const start=fixtureStamp(row?.[8]);if(!Number.isFinite(start))continue;
    matches.push({row,start,round:String(row?.[1]||''),other:same(row?.[2],team)?row[6]:row[2]});
  }
 }
 if(!matches.length)return null;
 const now=Date.now(),upcoming=matches.filter(x=>x.start>=now-4*3600000);
 const filtered=round?upcoming.filter(x=>norm(x.round)===norm(round)||norm(x.round)===norm('J'+round)):[];
 return (filtered.length?filtered:upcoming).sort((a,b)=>a.start-b.start)[0]||null;
}
function autofill(){
 const m=fixturePick();if(!m){notify('No hay partido próximo publicado para ese equipo y categoría. Puedes capturarlo manualmente.');return}
 const row=m.row;
 const date=$('[data-v635-date]'),round=$('[data-v635-round]'),field=$('[data-v635-field]'),other=$('[data-v635-field-other]');
 if(date)date.value=fixtureDay(row[8])||date.value;
 if(round&&/^\d+$/.test(m.round))round.value=m.round;
 const value=String(row[7]||'').trim();
 if(value&&field){
  const canonical=window.LJR_FIELDS?.canonical?.(value)||value;
  let found=[...field.options].find(o=>same(o.value,value)||same(o.value,canonical));
  if(found)field.value=found.value;
  else {field.value='__other__';if(other)other.value=value}
  field.dispatchEvent(new Event('change',{bubbles:true}));
  if(field.value==='__other__'&&other)other.value=value;
 }
 hint('Sugerido: '+m.other+' · '+(row[8]||'Fecha por confirmar')+' · '+(value||'Sede pendiente'));
 notify('Datos del próximo partido colocados desde el calendario oficial. Verifica antes de generar.');
}
function recordMarkup(r){
 return '<div class="v1062-history-row" data-v1062-row="'+esc(r.folio)+'">'+
 '<div class="v1062-history-copy"><b>'+esc(safeName(r))+'</b><small>'+esc(r.folio)+' · '+esc(r.category)+' · '+esc(r.until||r.date)+'</small>'+
 '<em class="'+(statusFor(r)==='Vencido'?'expired':soon(r)?'soon':'')+'">'+esc(statusFor(r))+'</em></div>'+
 '<div class="v1062-history-actions">'+
 '<button type="button" data-v1062-load="'+esc(r.folio)+'">Abrir</button>'+
 '<select aria-label="Estado local del folio '+esc(r.folio)+'" data-v1062-state="'+esc(r.folio)+'">'+
 Object.entries(STATUS).map(([k,v])=>'<option value="'+k+'"'+(r.status===k?' selected':'')+'>'+esc(v)+'</option>').join('')+'</select>'+
 '<button type="button" class="danger" aria-label="Eliminar folio '+esc(r.folio)+'" data-v1062-delete="'+esc(r.folio)+'">×</button></div></div>';
}
function renderHistory(){
 const host=$('[data-v1062-history-items]');if(!host)return;
 const rows=sourceRows(),stats=alerts(rows);
 const count=$('[data-v1062-count]');if(count)count.textContent=rows.length+' guardados';
 const alert=$('[data-v1062-alert]');if(alert)alert.textContent=stats.expired+' vencidos · '+stats.next+' próximos a vencer (3 días)';
 host.innerHTML=rows.length?rows.slice(0,showAll?MAX:3).map(recordMarkup).join(''):
 '<p class="v1062-empty">Aún no hay permisos guardados en este dispositivo.</p>';
 const toggle=$('[data-v1062-more]');if(toggle){toggle.hidden=rows.length<=3;toggle.textContent=showAll?'Ver menos':'Ver todos ('+rows.length+')'}
}
function showVerify(){
 const params=new URLSearchParams((location.hash.split('?')[1]||''));
 const folio=String(params.get('verify')||'').slice(0,160);
 if(!folio)return;
 const panel=$('[data-v1062-verification]');if(!panel)return;
 const item=sourceRows().find(r=>r.folio===folio);
 panel.hidden=false;
 panel.textContent=item?'Consulta local: '+folio+' · '+statusFor(item)+'. Sólo es un registro de ESTE navegador, no valida firma ni aprobación oficial.':
 'Este folio no figura en el historial de este navegador. No significa que sea falso: la verificación pública aún no está habilitada.';
 panel.scrollIntoView({block:'nearest'});
}
function openSaved(folio){
 const item=sourceRows().find(r=>r.folio===folio);
 const api=window.LJR_PERMISSION_BUILDER_API;
 if(!item||!api?.showStored){notify('No se pudo abrir el permiso guardado');return}
 if(api.showStored(item)){hint('Vista previa del folio '+folio+'. Las firmas no se guardan: vuelve a firmar si es necesario.');notify('Permiso recuperado del historial local')}
}
function changeState(folio,status){
 if(!STATUS[status])return;
 const rows=sourceRows(),row=rows.find(r=>r.folio===folio);if(!row)return;
 if(status==='approved'&&!confirm('Esto sólo anotará "Aprobado" en ESTE dispositivo. No verifica identidad, firma ni aprobación de la Liga. ¿Continuar?')){renderHistory();return}
 row.status=status;row.stateChangedAt=new Date().toISOString();
 if(!store(rows)){notify('No se pudo guardar este estado');return}
 renderHistory();notify('Estado actualizado en el historial local');
}
function deleteSaved(folio){
 if(!confirm('¿Eliminar este folio sólo del historial de este dispositivo?'))return;
 store(sourceRows().filter(x=>x.folio!==folio));renderHistory();notify('Registro local eliminado');
}
function drawCanvas(){
 const canvas=$('[data-v1062-canvas]');if(!canvas)return;
 const factor=Math.max(1,Math.min(2,window.devicePixelRatio||1));
 const width=Math.max(250,Math.round(canvas.getBoundingClientRect().width||310));
 canvas.width=width*factor;canvas.height=116*factor;
 ctx=canvas.getContext('2d');if(!ctx)return;
 ctx.scale(factor,factor);ctx.fillStyle='#fff';ctx.fillRect(0,0,width,116);
 ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#08156a';drawn='';
}
function point(e){const rect=e.currentTarget.getBoundingClientRect();return {x:(e.clientX-rect.left)*e.currentTarget.width/rect.width/(Math.max(1,Math.min(2,window.devicePixelRatio||1))),y:(e.clientY-rect.top)*e.currentTarget.height/rect.height/(Math.max(1,Math.min(2,window.devicePixelRatio||1)))}}
function paint(e){
 if(!drawing||!ctx)return;
 const p=point(e);
 ctx.beginPath();ctx.moveTo(lastPoint?.x??p.x,lastPoint?.y??p.y);ctx.lineTo(p.x,p.y);ctx.stroke();lastPoint=p;
 drawn='yes';
}
function signaturePanel(){
 const panel=$('[data-v1062-sign-panel]');if(!panel)return;
 panel.hidden=!panel.hidden;
 if(!panel.hidden)drawCanvas();
}
function saveSignature(){
 const canvas=$('[data-v1062-canvas]');
 if(!drawn||!canvas){notify('Dibuja primero tu firma');return}
 window.LJR_PERMISSION_BUILDER_API?.setSignature?.(canvas.toDataURL('image/png'));
 const file=$('[data-v635-signature]');if(file)file.value='';
 notify('Firma dibujada aplicada al formulario. No acredita por sí sola la identidad.');
 const panel=$('[data-v1062-sign-panel]');if(panel)panel.hidden=true;
}
function mount(){
 if(location.hash.split('?')[0]!=='#/permissionBuilder')return;
 const page=$('[data-v635-page]');if(!page||page===initialized)return;
 const col=$('.v635-preview-column',page);if(!col)return;
 initialized=page;
 const host=document.createElement('section');host.className='v1062-tools';host.setAttribute('aria-label','Herramientas locales de permisos');
 host.innerHTML='<header><div><small>CONTROL LOCAL · PERMISOS</small><h3>Gestión de permisos</h3></div><span data-v1062-count>0 guardados</span></header>'+
 '<div class="v1062-quick">'+
 '<button type="button" data-v1062-autofill>⚽ Autocompletar partido</button>'+
 '<button type="button" data-v1062-sign>✍ Firmar en pantalla</button></div>'+
 '<p class="v1062-note" data-v1062-hint>Selecciona equipo y categoría para traer el siguiente partido publicado.</p>'+
 '<div class="v1062-alert" data-v1062-alert>0 vencidos · 0 próximos a vencer</div>'+
 '<div class="v1062-history-head"><b>Historial de permisos</b><button type="button" data-v1062-more hidden>Ver todos</button></div>'+
 '<div class="v1062-history-items" data-v1062-history-items></div>'+
 '<p class="v1062-disclaimer">El historial y los estados se guardan solo en este navegador. Un QR consulta el folio localmente: NO certifica aprobación oficial ni funciona como registro público.</p>'+
 '<p data-v1062-verification class="v1062-verification" hidden></p>'+
 '<p data-v1062-notice class="v1062-notice" hidden role="status"></p>'+
 '<div data-v1062-sign-panel class="v1062-sign-panel" hidden>'+
 '<b>Firma manuscrita (este dispositivo)</b><canvas data-v1062-canvas aria-label="Dibuja la firma aquí" style="touch-action:none"></canvas>'+
 '<div class="v1062-sign-buttons"><button type="button" data-v1062-erase>Borrar</button><button type="button" data-v1062-apply>Usar firma</button></div></div>';
 col.append(host);
 host.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;
  if(t.matches('[data-v1062-autofill]'))autofill();
  else if(t.matches('[data-v1062-sign]'))signaturePanel();
  else if(t.matches('[data-v1062-erase]'))drawCanvas();
  else if(t.matches('[data-v1062-apply]'))saveSignature();
  else if(t.matches('[data-v1062-more]')){showAll=!showAll;renderHistory()}
  else if(t.hasAttribute('data-v1062-load'))openSaved(t.dataset.v1062Load);
  else if(t.hasAttribute('data-v1062-delete'))deleteSaved(t.dataset.v1062Delete);
 });
 host.addEventListener('change',e=>{if(e.target.matches('[data-v1062-state]'))changeState(e.target.dataset.v1062State,e.target.value)});
 const canvas=$('[data-v1062-canvas]',host);
 canvas.addEventListener('pointerdown',e=>{e.preventDefault();drawing=true;lastPoint=point(e);canvas.setPointerCapture(e.pointerId);paint(e)});
 canvas.addEventListener('pointermove',paint);
 ['pointerup','pointercancel','lostpointercapture'].forEach(name=>canvas.addEventListener(name,()=>{drawing=false;lastPoint=null}));
 renderHistory();showVerify();
}
window.LJR_PERMISSION_WORKFLOW={
 qrHtml,qrSvg,
 onGenerated(p){if(!persist(p)){notify('Historial lleno: no se pudo guardar en este dispositivo')}renderHistory()},
 onTeamChange(){hint('Equipo elegido. Pulsa «Autocompletar partido» para consultar el rol oficial.')},
 readHistory:sourceRows
};
let ticking=false;
const schedule=()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;mount()})};
window.addEventListener('hashchange',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
if(document.querySelector('#screen'))new MutationObserver(schedule).observe(document.querySelector('#screen'),{subtree:true,childList:true});
schedule();
})();