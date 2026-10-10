/* V1220 - Ayudante local para cambios de horario y sede.
 * Sin APIs de IA remota: reglas explicables en el dispositivo, sin modificar el rol oficial.
 * Solo genera borradores; notificaciones y cambios oficiales requieren publicación autorizada.
 */
(function(){
'use strict';
if(window.__LJR_V1220_SCHEDULE_INTELLIGENCE__)return;
window.__LJR_V1220_SCHEDULE_INTELLIGENCE__=true;
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const pad=v=>String(v).padStart(2,'0');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=(s,r=document)=>r.querySelector(s);
const all=(s,r=document)=>Array.from(r.querySelectorAll(s));
let watchRoot=null,options=[],fieldList=null,fieldPromise=null,fixtureCacheData=null,fixtureCache=[];
function parseDate(raw){
  const m=String(raw||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  return m?{date:m[3]+'-'+pad(m[2])+'-'+pad(m[1]),time:m[4]?pad(m[4])+':'+m[5]:''}:{date:'',time:''};
}
function fixtures(data=window.LJR_OFFICIAL_DATA){
  if(data&&data===fixtureCacheData)return fixtureCache;
  const output=[];
  for(const [cat,c] of Object.entries(data?.categories||{})){
    (c.fixtures||[]).forEach((block,bi)=>(block.rows||[]).forEach((r,ri)=>{
      if(!r?.[2]&&!r?.[6])return;
      const when=parseDate(r[8]);
      output.push({id:cat+'-'+bi+'-'+ri,cat,round:String(r[1]||''),category:c.name||cat,home:String(r[2]||''),away:String(r[6]||''),venue:String(r[7]||''),date:when.date,time:when.time});
    }));
  }
  if(data){fixtureCacheData=data;fixtureCache=output}
  return output;
}
function selected(root){
  const id=$('[data-v129-match]',root)?.value;
  return fixtures().find(f=>f.id===id)||null;
}
function draft(root){
  const base=selected(root);
  if(!base)return null;
  const venue=$('[data-v129-venue]',root);
  const custom=$('[data-v129-venue-custom]',root);
  return {...base,
    type:$('[data-v129-type]',root)?.value||'Cambio de horario y sede',
    nextDate:$('[data-v129-date]',root)?.value||'',
    nextTime:$('[data-v129-time]',root)?.value||'',
    nextVenue:String(venue?.value==='__custom__'?custom?.value:venue?.value||'').trim(),
    reason:String($('[data-v129-reason]',root)?.value||'').trim()};
}
function minutes(date,time){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))return NaN;
  const h=Number(time.slice(0,2)),m=Number(time.slice(3,5));
  return h<24&&m<60?Date.parse(date+'T00:00:00Z')/60000+h*60+m:NaN;
}
function conflicts(n){
  const at=minutes(n.nextDate,n.nextTime);
  if(!Number.isFinite(at)||n.type==='Suspensión')return {fields:[],teams:[]};
  const saved=(()=>{try{return JSON.parse(localStorage.getItem('ljr-schedule-changes-v1')||'[]')}catch{return []}})();
  const latest=new Map();
  for(const old of saved)if(old?.matchId)latest.set(old.matchId,old);
  const localTeam=[norm(n.home),norm(n.away)].filter(Boolean);
  const near=fixtures().map(f=>{
    const change=latest.get(f.id);
    return {...f,date:change?.newDate||f.date,time:change?.newTime||f.time,venue:change?.newVenue||f.venue};
  }).filter(f=>f.id!==n.id&&Number.isFinite(minutes(f.date,f.time))&&Math.abs(minutes(f.date,f.time)-at)<120);
  const fields=near.filter(f=>n.nextVenue&&norm(f.venue)===norm(n.nextVenue)).slice(0,4).map(f=>f.home+' vs '+f.away+' ('+f.time+' h)');
  const teams=near.filter(f=>localTeam.some(t=>t===norm(f.home)||t===norm(f.away))).slice(0,4).map(f=>f.home+' vs '+f.away+' ('+f.time+' h)');
  return {fields,teams};
}
function analyze(n){
  if(!n)return {level:'neutral',text:'Elige un partido oficial para empezar.',warnings:[],changes:[]};
  const changes=[];
  if(n.nextDate&&n.nextDate!==n.date)changes.push('fecha');
  if(n.nextTime&&n.nextTime!==n.time)changes.push('hora');
  if(n.nextVenue&&norm(n.nextVenue)!==norm(n.venue))changes.push('sede');
  const warnings=[];
  if(n.type!=='Suspensión'){
    if(!n.nextDate||!n.nextTime)warnings.push('Falta confirmar la nueva fecha u hora.');
    if(!n.nextVenue)warnings.push('Falta seleccionar la cancha de destino.');
    if(!changes.length)warnings.push('No hay diferencias respecto del partido seleccionado.');
  }
  const hits=conflicts(n);
  if(hits.fields.length)warnings.push('Posible cruce de cancha (menos de 2 horas): '+hits.fields.join(', ')+'.');
  if(hits.teams.length)warnings.push('Posible conflicto de equipo (menos de 2 horas): '+hits.teams.join(', ')+'.');
  return {level:warnings.length?'warning':changes.length||n.type==='Suspensión'?'ok':'neutral',
    text:changes.length?'Cambio detectado: '+changes.join(' · ')+'.':'Todavía no hay cambios nuevos.',
    warnings,changes};
}
function update(root){
  const status=$('[data-v1220-status]',root),list=$('[data-v1220-risks]',root);
  if(!status||!list)return;
  const report=analyze(draft(root));
  status.dataset.state=report.level;
  status.textContent=report.text;
  list.replaceChildren();
  const messages=report.warnings.length?report.warnings:['Comprobación local activa. Revisa y confirma los datos antes de difundir.'];
  for(const item of messages){const p=document.createElement('p');p.textContent=item;list.appendChild(p)}
}
function suggest(root){
  const n=draft(root);
  if(!n){announce(root,'Primero selecciona un partido.');return}
  const changes=analyze(n).changes;
  const parts=['Liga Juventino Rosas informa:'];
  if(n.type==='Suspensión')parts.push('Se comunica la suspensión del partido '+n.home+' vs '+n.away+'.');
  else {
    parts.push('Se actualiza la programación del partido '+n.home+' vs '+n.away+'.');
    if(changes.includes('fecha')||changes.includes('hora'))parts.push('Nuevo horario: '+[n.nextDate,n.nextTime? n.nextTime+' h':''].filter(Boolean).join(' · ')+'.');
    if(changes.includes('sede'))parts.push('Nueva sede: '+n.nextVenue+'.');
  }
  parts.push('Consulta los datos confirmados con la Liga antes de asistir.');
  const reason=$('[data-v129-reason]',root);
  if(reason.value.trim()&&!window.confirm('¿Reemplazar el texto que escribiste por la sugerencia local?'))return;
  reason.value=parts.join('\n');
  reason.dispatchEvent(new Event('input',{bubbles:true}));
  announce(root,'Borrador sugerido en tu dispositivo. Revísalo antes de compartir.');
}
function announce(root,message){const node=$('[data-v1220-message]',root);if(node)node.textContent=message}
function filter(root){
  const sel=$('[data-v129-match]',root);if(!sel||!options.length)return;
  const cat=$('[data-v1220-category]',root)?.value||'';
  const query=norm($('[data-v1220-search]',root)?.value||'');
  const selectedId=sel.value;
  const entries=options.filter((o,i)=>i===0||(!cat||o.textContent.split(' · ')[0]===cat)&&(!query||norm(o.textContent).includes(query)));
  sel.replaceChildren(...entries.map(o=>o.cloneNode(true)));
  if(entries.some(o=>o.value===selectedId))sel.value=selectedId;
  else {sel.value='';const base=$('[data-v129-current]',root);if(base)base.innerHTML='<b>Selecciona un partido</b><small>Elige un partido de los resultados filtrados.</small>'}
  update(root);
}
function warmFields(){
  if(fieldList||fieldPromise)return fieldPromise;
  fieldPromise=fetch('./data/fields-v38-22.json',{cache:'force-cache'})
    .then(r=>r.ok?r.json():null).then(d=>{fieldList=d?.fields||[];return fieldList})
    .catch(()=>{fieldList=[];return fieldList});
  return fieldPromise;
}
function maps(root){
  const n=draft(root),venue=n?.nextVenue||n?.venue;
  if(!venue){announce(root,'Selecciona primero una cancha.');return}
  const field=(fieldList||[]).find(f=>[f.name,...(f.aliases||[])].some(a=>norm(a)===norm(venue)));
  const place=field?.mapsQuery||field?.address||venue+', Juventino Rosas, Guanajuato';
  // Abrir dentro del gesto de clic: en Chrome Android los popups tras await pueden bloquearse.
  window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(place),'_blank','noopener,noreferrer');
}
function calendar(root){
  const n=draft(root);
  if(!n)return announce(root,'Selecciona un partido primero.');
  if(n.type==='Suspensión')return announce(root,'Los partidos suspendidos no deben agregarse como eventos activos.');
  if(!n.nextDate||!n.nextTime)return announce(root,'Confirma fecha y hora para Google Calendar.');
  if(!window.LJR_GOOGLE_CALENDAR_GLOBAL?.open)return announce(root,'El módulo de Google Calendar no está disponible en este momento.');
  window.LJR_GOOGLE_CALENDAR_GLOBAL.open({
    title:n.home+' vs '+n.away+' · Liga Juventino Rosas',
    iso:n.nextDate,time:n.nextTime,venue:n.nextVenue||n.venue,
    duration:120,description:'Programación pendiente de confirmación oficial · '+n.category+'. Verifica cambios con la Liga.'
  });
}
function useLocalQr(root){
  const q=$('[data-v129-qr] img',root),url=$('[data-v129-url]',root)?.value;
  if(!q||!url||q.dataset.v1220Processed==='1')return;
  q.dataset.v1220Processed='1';
  q.removeAttribute('src'); // No enviar datos del aviso a un servicio externo de QR.
  if(typeof window.qrcode!=='function'){q.alt='Generador QR local no disponible';return}
  try{
    const code=window.qrcode(0,'L');code.addData(url);code.make();
    q.src=code.createDataURL(5,8);q.alt='Código QR generado localmente';
  }catch(_){q.alt='Enlace demasiado largo para QR; utiliza Copiar URL';const caption=$('[data-v129-qr] small',root);if(caption)caption.textContent='Este aviso tiene demasiados detalles para un QR. Utiliza Copiar URL.';}
}
function decoratePreview(root){
  const preview=$('[data-v129-preview]',root);
  if(!preview||preview.hidden)return;
  useLocalQr(root);
  const bar=$('.v129-publish',preview);
  if(!bar||$('[data-v1220-wa]',bar))return;
  bar.insertAdjacentHTML('beforeend','<button type="button" data-v1220-wa>WhatsApp</button><button type="button" data-v1220-share>Compartir</button>');
}
function share(root,kind){
  const url=$('[data-v129-url]',root)?.value||'';
  if(!url)return announce(root,'Primero genera el aviso.');
  const description=$('.v129-caption',root)?.textContent||'Cambio de partido · Liga Juventino Rosas';
  const content=description+'\n'+url;
  if(kind==='wa')window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(content),'_blank','noopener,noreferrer');
  else if(navigator.share)navigator.share({title:'Aviso de partido · Liga Juventino Rosas',text:description,url}).catch(()=>{});
  else if(navigator.clipboard?.writeText)navigator.clipboard.writeText(content).then(()=>announce(root,'Aviso copiado para compartir.')).catch(()=>announce(root,'Utiliza Copiar URL.'));
  else announce(root,'Utiliza Copiar URL.');
}
function init(root){
  if(!root||!$('[data-v129-schedule]',root)||$('[data-v1220-controls]',root))return;
  const match=$('[data-v129-match]',root);if(!match)return;
  options=Array.from(match.options).map(o=>o.cloneNode(true));
  const categories=[...new Set(options.slice(1).map(o=>o.textContent.split(' · ')[0]))].filter(Boolean);
  const label=match.closest('label');
  label.insertAdjacentHTML('beforebegin',
    '<section class="v1220-search-tools" data-v1220-controls aria-label="Buscar partido oficial">'+
    '<label><span>Categoría</span><select data-v1220-category><option value="">Todas las categorías</option>'+
    categories.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('')+'</select></label>'+
    '<label><span>Buscar equipo o jornada</span><input type="search" data-v1220-search placeholder="Equipo, rival o jornada" autocomplete="off"></label></section>');
  const current=$('[data-v129-current]',root);
  current.insertAdjacentHTML('afterend',
    '<section class="v1220-assistant" aria-label="Asistente inteligente local">'+
    '<div class="v1220-head"><strong>✦ Asistente local</strong><span>Sin enviar datos a servidores de IA</span></div>'+
    '<p data-v1220-status data-state="neutral" role="status" aria-live="polite">Elige un partido para comenzar.</p>'+
    '<div class="v1220-risks" data-v1220-risks></div>'+
    '<button type="button" data-v1220-suggest>✦ Redactar aviso sugerido</button></section>');
  const actions=$('.v129-actions',root);
  actions.insertAdjacentHTML('afterend','<div class="v1220-extras">'+
    '<button type="button" data-v1220-calendar>Google Calendar</button>'+
    '<button type="button" data-v1220-maps>Ver cancha en Maps</button></div>'+
    '<p class="v1220-feedback" role="status" aria-live="polite" data-v1220-message>Las sugerencias y comprobaciones no publican ni reprograman partidos oficiales.</p>');
  $('[data-v1220-category]',root).addEventListener('change',()=>filter(root));
  $('[data-v1220-search]',root).addEventListener('input',()=>filter(root));
  if(!root.__ljrV1220EventsBound){
    root.__ljrV1220EventsBound=true;
  root.addEventListener('input',e=>{if(e.target.closest('.v129-editor')&&!e.target.matches('[data-v129-reason]'))update(root)});
  root.addEventListener('change',e=>{if(e.target.closest('.v129-editor'))setTimeout(()=>update(root),0)});
  root.addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;
    if(button.matches('[data-v1220-suggest]'))suggest(root);
    if(button.matches('[data-v1220-calendar]'))calendar(root);
    if(button.matches('[data-v1220-maps]'))maps(root);
    if(button.matches('[data-v1220-wa]'))share(root,'wa');
    if(button.matches('[data-v1220-share]'))share(root,'native');
  });
  // Antes de guardar o generar, verificar que realmente hay un cambio y que no falten datos.
  root.addEventListener('click',e=>{
    if(!e.target.closest('[data-v129-save],[data-v129-generate]'))return;
    const n=draft(root),report=analyze(n);
    const blocking=report.warnings.filter(w=>!w.startsWith('Posible '));
    if(blocking.length){
      e.preventDefault();e.stopImmediatePropagation();
      announce(root,blocking.join(' '));update(root);return;
    }
    if(report.warnings.length&&!window.confirm(report.warnings.join('\n')+'\n\n¿Continuar con el borrador de todos modos?')){
      e.preventDefault();e.stopImmediatePropagation();return;
    }
  },true);
  const observer=new MutationObserver(()=>decoratePreview(root));
  observer.observe(root,{childList:true,subtree:true});
  }
  warmFields();
  update(root);decoratePreview(root);
}
function boot(){
  if(route()!=='scheduleChanges')return;
  const root=$('#screen');if(!root)return;
  init(root);
  if(watchRoot===root)return;
  watchRoot=root;
  new MutationObserver(()=>{if(route()==='scheduleChanges')init(root)}).observe(root,{childList:true,subtree:false});
}
window.addEventListener('hashchange',()=>setTimeout(boot,40));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
