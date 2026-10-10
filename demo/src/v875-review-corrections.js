(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const account=()=>window.LJR_V569_AUTH?.currentAccount?.()||window.LJR_MAIN_ROUTE?.state?.user;
const logo=n=>window.LJR_TEAM_LOGOS?.get?.(n)||window.LJR_SEASON_LOGOS?.get?.(n)||window.LJR_OFFICIAL_API?.getLogo?.(n)||'';
const canva=[['Tablas, jornadas y comunicados','https://www.canva.com/d/NGBodeIyVUKsUHv'],['Tablas y jornadas premium','https://www.canva.com/d/Xa410IMlElWooRL'],['Comunicados y programación','https://www.canva.com/d/cdMdwGaea5m4b-K'],['Partido de fútbol · azul','https://www.canva.com/d/82pR3gFimAxtsXD']];
const modal=(title,body)=>window.LJR_MEDIA?.modal(title,body);
let timer=0;
function cleanText(root){
 const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
 while((n=walk.nextNode())){
  if(n.parentElement?.closest('script,style,textarea,input,[contenteditable="true"]'))continue;
  const old=n.nodeValue;let value=old.replace(/\badmin\s*f[uú]t\b/gi,'Liga Juventino Rosas').replace(/\badmin\s*food\b/gi,'Liga Juventino Rosas');
  if(n.parentElement?.closest('.v35-history-page'))value=value.replace(/\b(recuperad[oa]s?|extraíd[oa]s?)\b/gi,'').replace(/\bdel ZIP\b/gi,'').replace(/\baño por precisar\b/gi,'Histórico').replace(/\bfuente\s*:[^.]*\.?/gi,'').replace(/\b(fuente|fuentes)\b/gi,'');
  if(value!==old)n.nodeValue=value;
 }
 root.querySelectorAll('[title],[aria-label]').forEach(el=>{for(const key of ['title','aria-label']){const value=el.getAttribute(key);if(value&&/admin\s*(f[uú]t|food)/i.test(value))el.setAttribute(key,value.replace(/admin\s*(f[uú]t|food)/gi,'Liga Juventino Rosas'))}});
}
function history(root){
 root.querySelectorAll('.v35-history-sources,.v358-stats-source-note,.v358-stat-source,.v35-archive-method').forEach(el=>el.hidden=true);
 root.querySelectorAll('.v35-old-table').forEach((card,i)=>{
  if(card.querySelector('[data-v875-table]'))return;
  const details=document.createElement('details');details.className='v875-table-details';details.dataset.v875Table='';
  const summary=document.createElement('summary');summary.textContent='Ver más detalles';
  const table=document.createElement('div');table.className='v875-table-content';table.id='history-table-'+i;
  for(const node of [...card.children])if(node.tagName!=='HEADER')table.append(node);
  details.append(summary,table);card.append(details);
  details.addEventListener('toggle',()=>{summary.textContent=details.open?'Ocultar detalles':'Ver más detalles'});
 });
 // The shared History resolver owns crests and damaged-source fallbacks.
 // Reviving them here caused an endless image/monogram mutation cycle.
}
/* V1004: Los cinco accesos ahora viven dentro del Centro de publicaciones.
   No insertar otra tarjeta grande ni repetir herramientas en Más. */
function studioEntry(root){
 if(route()!=='leagueTools')return;
 // El acceso oficial a la sección ya existe en Más herramientas.
 // Mantener este hook sin modificar rutas ni duplicar el editor.
}

function poll(root){
 const host=root.querySelector('.v105-poll-status')?.parentElement;if(!host||host.querySelector('[data-v875-mailbox]'))return;
 const form=document.createElement('form');form.className='v875-mailbox';form.dataset.v875Mailbox='';
 form.innerHTML=[
  '<div class="v927-mail-head">',
   '<span class="v927-mail-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="3"/><path d="m4 8 8 6 8-6"/><path d="m15.5 3 2 2 3-3"/></svg></span>',
   '<span class="v927-mail-kicker"><small>BUZÓN DE LA LIGA</small><strong>Tu opinión importa</strong></span>',
   '<span class="v927-mail-private">PRIVADO</span>',
  '</div>',
  '<h3>Tu propuesta puede mejorar la liga</h3>',
  '<p>Comparte tus ideas, sugerencias o inquietudes para mejorar nuestra liga. Cada propuesta nos ayuda a seguir creciendo.</p>',
  '<label><span class="v927-field-label">¿Qué propones mejorar?</span>',
   '<textarea name="message" minlength="10" maxlength="10000" rows="6" required placeholder="Describe tu propuesta, qué cambiarías y cómo ayudaría a la Liga…"></textarea>',
  '</label>',
  '<div class="v927-mail-footer"><span class="v927-mail-count"><strong data-count>0 / 10 000</strong><small>caracteres</small></span>',
   '<button type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/></svg><span>Enviar propuesta</span></button>',
  '</div>',
  '<p class="v927-mail-status" role="status" data-status aria-live="polite"></p>'
 ].join('');
 host.append(form);const text=form.elements.message,status=form.querySelector('[data-status]'),button=form.querySelector('button');
 text.oninput=()=>{form.querySelector('[data-count]').textContent=text.value.length+' / 10 000'};
 form.onsubmit=async e=>{
  e.preventDefault();const a=account();if(!a){status.textContent='Inicia sesión para enviar tu propuesta.';window.LJR_V569_AUTH?.openLogin?.();return}
  if(!form.reportValidity())return;button.disabled=true;status.textContent='Enviando…';
  try{await window.LJR_MEDIA.api('feedback',{method:'POST',body:{name:a.name||a.displayName||a.username||'Usuario registrado',message:text.value.trim(),accountId:String(a.id||a.email||''),subject:'Propuesta para mejorar la liga'}});status.textContent='Tu propuesta llegó al buzón privado de administración.';text.value='';text.oninput()}
  catch(error){status.textContent=error.message||'No se pudo enviar. Tu mensaje se conserva para reintentar.'}
  finally{button.disabled=false}
 };
}
function v919MeetingIcon(name){
 const p={
  calendar:'<rect x="3.5" y="5.5" width="17" height="15" rx="3"/><path d="M7 3.5v4M17 3.5v4M3.5 10h17"/><path d="m9 15 2 2 4-4"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pin:'<path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/>',
  user:'<circle cx="12" cy="8" r="3"/><path d="M5.5 20c.8-4 3-6 6.5-6s5.7 2 6.5 6"/>',
  flag:'<path d="M6 21V4m0 1h10l-2 4 2 4H6"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1 1 2-2m-3 7 1 1 2-2m-3 7 1 1 2-2"/>',
  chart:'<path d="M5 20V10m7 10V5m7 15v-7"/>',
  shield:'<path d="M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
  message:'<path d="M4 5h16v12H9l-5 4V5Z"/><path d="M8 9h8m-8 4h5"/>',
  users:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20a6 6 0 0 1 12 0m1-5a4 4 0 0 1 5 4"/>',
  save:'<path d="M5 4h12l2 2v14H5V4Z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/>',
  print:'<path d="M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/>',
  share:'<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="m4 18 5-5 3.5 3.5 3.5-4L21 17"/>'
 };
 return window.LJR_ICONS?.svg(name) || '<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.calendar)+'</svg>';
}
function v919MeetingShortcut(root){
 if(route()!=='leagueTools')return;
 const page=root.querySelector('.v726-tools-page,.v60-tool-page');if(!page||page.querySelector('[data-v919-meeting-shortcut]'))return;
 const entry=document.createElement('button');
 entry.type='button';entry.className='v919-meeting-shortcut';entry.dataset.v919MeetingShortcut='1';
 entry.innerHTML='<span class="v919-shortcut-icon">'+v919MeetingIcon('calendar')+'</span><span class="v919-shortcut-copy"><small>JUNTA SEMANAL · MARTES</small><b>Minuta y acuerdos de la Liga</b><em>Asistencia, agenda, pendientes, imprimir PDF y compartir</em></span><span class="v919-shortcut-arrow">›</span>';
 const target=page.querySelector('.v726-tool-grid,.v60-tool-grid');
 (target||page).insertAdjacentElement('beforebegin',entry);
 entry.onclick=()=>{
  if(typeof window.LJR_OPEN_MEETING==='function'){window.LJR_OPEN_MEETING();return}
  window.LJR_MAIN_ROUTE?.go?.('v38Weekly')||(location.hash='#/v38Weekly');
  setTimeout(()=>document.querySelector('[data-v105-action="meeting"]')?.click(),350);
 };
}
function meeting(root){
 const form=root.querySelector('.v105-meeting-form');if(!form||form.querySelector('[data-v875-meeting]'))return;
 const meetingModal=form.closest('.v105-modal');
 if(meetingModal){
  meetingModal.classList.add('v875-meeting-modal');
  meetingModal.style.setProperty('inset','0 0 calc(var(--v34-nav-h,69px) + env(safe-area-inset-bottom,0px)) 0','important');
  meetingModal.style.setProperty('padding','14px','important');
  meetingModal.style.setProperty('box-sizing','border-box','important');
  const meetingDialog=meetingModal.querySelector('.v105-dialog');
  if(meetingDialog){
   meetingDialog.style.setProperty('max-height','calc(100dvh - var(--v34-nav-h,69px) - env(safe-area-inset-bottom,0px) - 28px)','important');
   meetingDialog.style.setProperty('scroll-padding-bottom','28px','important');
   meetingDialog.style.setProperty('margin-bottom','0','important');
  }
 }
 const wrap=document.createElement('div');wrap.dataset.v875Meeting='';wrap.className='v875-meeting-options';
 let old={};try{old=JSON.parse(localStorage.getItem('ljr-meeting-options-v875')||'{}')}catch{}
 const topics=[['Resultados de jornada','chart'],['Programación y campos','calendar'],['Arbitraje y disciplina','shield'],['Propuestas del buzón','message'],['Equipos y registros','users']];
 wrap.innerHTML='<label><span class="v919-field-label">'+v919MeetingIcon('clock')+'Hora</span><input data-meeting-field="time" type="time" value="'+esc(old.time||'19:00')+'"></label><label><span class="v919-field-label">'+v919MeetingIcon('pin')+'Lugar</span><input data-meeting-field="place" value="'+esc(old.place||'')+'" placeholder="Sede de la junta"></label><label><span class="v919-field-label">'+v919MeetingIcon('user')+'Responsable</span><input data-meeting-field="owner" value="'+esc(old.owner||'')+'" placeholder="Nombre del responsable"></label><label><span class="v919-field-label">'+v919MeetingIcon('flag')+'Fecha límite de acuerdos</span><input data-meeting-field="deadline" type="date" value="'+esc(old.deadline||'')+'"></label><label class="wide"><span class="v919-field-label">'+v919MeetingIcon('list')+'Pendientes y seguimiento</span><textarea data-meeting-field="tasks" rows="4" placeholder="Acuerdo · responsable · fecha límite">'+esc(old.tasks||'')+'</textarea></label><div class="v919-topic-head wide"><span>AGREGAR AL ORDEN DEL DÍA</span><small>Toca un tema para sumarlo a la agenda</small></div><div class="v875-agenda-chips wide">'+topics.map(t=>'<button type="button" data-add-topic="'+esc(t[0])+'"><span>'+v919MeetingIcon(t[1])+'</span><b>'+esc(t[0])+'</b></button>').join('')+'</div>';
 form.append(wrap);
 const dialog=meetingModal?.querySelector('.v105-dialog');
 if(dialog&&!dialog.querySelector('[data-v919-meeting-hero]')){
  const hero=document.createElement('div');hero.className='v919-meeting-hero';hero.dataset.v919MeetingHero='1';
  hero.innerHTML='<span class="v919-hero-logo"><img src="./assets/liga-logo-oficial-transparente.png" alt="Liga Juventino Rosas"></span><span class="v919-hero-copy"><small>OPERACIÓN SEMANAL</small><b>Junta de la Liga</b><em>Agenda, acuerdos y seguimiento</em></span><span class="v919-hero-day">MAR</span>';
  window.LJR_MINUTA_MEDIA?.transparentLogo?.().then(src=>{if(src&&hero.isConnected)hero.querySelector('img').src=src}).catch(()=>{});
  const title=dialog.querySelector(':scope>h3');if(title){title.hidden=true;title.insertAdjacentElement('beforebegin',hero)}
  const intro=dialog.querySelector(':scope>p');if(intro)intro.classList.add('v919-meeting-intro');
 }
 const actions=form.parentElement.querySelector('.v105-actions');
 const saveButton=actions?.querySelector('[data-save]');
 const printButtonBase=actions?.querySelector('[data-pdf]');
 if(saveButton){saveButton.classList.add('v919-action','is-save');saveButton.innerHTML=v919MeetingIcon('save')+'<span>Guardar junta</span>'}
 if(printButtonBase){printButtonBase.classList.add('v919-action','is-print');printButtonBase.innerHTML=v919MeetingIcon('print')+'<span>Imprimir PDF</span>'}
 const share=document.createElement('button');share.type='button';share.className='v105-btn alt v919-action is-share';share.innerHTML=v919MeetingIcon('share')+'<span>Compartir minuta</span>';actions?.append(share);
 const png=document.createElement('button');png.type='button';png.className='v105-btn alt v919-action is-png';png.innerHTML=v919MeetingIcon('image')+'<span>Descargar PNG</span>';actions?.append(png);
 const onPNG=(button,asShare)=>async()=>{
  const original=button.innerHTML;button.disabled=true;button.innerHTML=v919MeetingIcon('image')+'<span>Preparando PNG…</span>';
  try{await window.LJR_MINUTA_MEDIA.exportPNG(form,asShare)}
  catch(error){console.warn('Minuta PNG:',error);button.innerHTML='<span>No se pudo generar PNG</span>';setTimeout(()=>{if(button.isConnected)button.innerHTML=original},1800)}
  finally{button.disabled=false;if(button.innerHTML.includes('Preparando PNG'))button.innerHTML=original}
 };
 share.onclick=onPNG(share,true);
 png.onclick=onPNG(png,false);
 const printButton=form.parentElement.querySelector('[data-pdf]');
 const printMeeting=async()=>{
  const get=s=>form.querySelector(s)?.value?.trim?.()||'';
  const fmtDate=value=>{
   const m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
   if(!m)return value||'—';
   const d=new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),12,0,0);
   try{return new Intl.DateTimeFormat('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d)}
   catch(_){return value}
  };
  const nl=value=>esc(value||'—').replace(/\n/g,'<br>');
  const data={
   date:get('[data-x="date"]'),time:get('[data-meeting-field="time"]'),place:get('[data-meeting-field="place"]'),
   attendance:get('[data-x="attendance"]'),owner:get('[data-meeting-field="owner"]'),deadline:get('[data-meeting-field="deadline"]'),
   agenda:get('[data-x="agenda"]'),agreements:get('[data-x="agreements"]'),tasks:get('[data-meeting-field="tasks"]')
  };
  // Imagen ya sin el fondo oscuro, tomada del mismo escudo oficial de la app.
  const leagueLogo=await window.LJR_MINUTA_MEDIA?.transparentLogo?.()||new URL('./assets/liga-logo-oficial-transparente.png',document.baseURI).href;
  const html='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
   '<title>Minuta · Liga Juventino Rosas</title><style>'+
   '@page{size:letter;margin:13mm}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#111827;font-family:Arial,Helvetica,sans-serif}'+
   'body{font-size:11pt;line-height:1.42}.page{width:100%}.head{display:grid;grid-template-columns:94px minmax(0,1fr);gap:14px;align-items:center;border-bottom:3px solid #0b4fb3;padding:0 0 12px;margin-bottom:16px}.head-logo{width:90px;height:90px;object-fit:contain;display:block;background:transparent}.head-copy{min-width:0}.kicker{font-size:9pt;font-weight:800;letter-spacing:.12em;color:#0b4fb3}.head h1{margin:4px 0 4px;font-size:22pt;line-height:1.08;color:#071b4d}.head p{margin:0;color:#475569;font-size:10pt}'+
   '.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px 18px;margin-bottom:16px}.meta div{border:1px solid #cbd5e1;border-radius:8px;padding:8px 10px;min-height:48px}.meta b{display:block;font-size:8.5pt;color:#0b4fb3;text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px}.section{break-inside:avoid;margin:0 0 13px}.section h2{margin:0 0 6px;font-size:11pt;color:#0b4fb3;border-bottom:1px solid #dbe3f0;padding-bottom:4px}.box{border:1px solid #cbd5e1;border-radius:8px;padding:10px 12px;min-height:52px;white-space:normal}.footer{margin-top:18px;padding-top:8px;border-top:1px solid #cbd5e1;color:#64748b;font-size:8.5pt;text-align:center}'+
   '@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{page-break-after:auto}}</style></head><body><main class="page">'+
   '<header class="head"><img class="head-logo" src="'+esc(leagueLogo)+'" alt="Liga Juventino Rosas"><div class="head-copy"><div class="kicker">LIGA MUNICIPAL DE FÚTBOL JUVENTINO ROSAS</div><h1>Minuta de junta semanal</h1><p>Documento generado desde la aplicación oficial de la Liga.</p></div></header>'+
   '<section class="meta"><div><b>Fecha de junta</b>'+esc(fmtDate(data.date))+'</div><div><b>Hora</b>'+esc(data.time||'—')+'</div><div><b>Lugar</b>'+esc(data.place||'—')+'</div><div><b>Responsable</b>'+esc(data.owner||'—')+'</div><div><b>Asistencia</b>'+esc(data.attendance||'—')+'</div><div><b>Fecha límite de acuerdos</b>'+esc(fmtDate(data.deadline))+'</div></section>'+
   '<section class="section"><h2>Orden del día</h2><div class="box">'+nl(data.agenda)+'</div></section>'+
   '<section class="section"><h2>Acuerdos / minuta</h2><div class="box">'+nl(data.agreements)+'</div></section>'+
   '<section class="section"><h2>Pendientes y seguimiento</h2><div class="box">'+nl(data.tasks)+'</div></section>'+
   '<footer class="footer">Liga Juventino Rosas · Minuta para impresión / PDF</footer></main></body></html>';
  document.querySelector('[data-v875-print-frame]')?.remove();
  const frame=document.createElement('iframe');
  frame.dataset.v875PrintFrame='';
  frame.setAttribute('aria-hidden','true');
  frame.style.cssText='position:fixed;left:-12000px;top:0;width:816px;height:1056px;border:0;background:#fff;visibility:visible;pointer-events:none';
  document.body.append(frame);
  const doc=frame.contentDocument||frame.contentWindow?.document;
  if(!doc){frame.remove();return}
  doc.open();doc.write(html);doc.close();
  let started=false;
  const run=()=>{
   if(started)return;started=true;
   try{frame.contentWindow?.focus();frame.contentWindow?.print()}
   catch(error){console.warn('No se pudo imprimir minuta:',error);frame.remove()}
  };
  const waitAssets=()=>{
   const imgs=[...doc.images];
   if(!imgs.length||imgs.every(img=>img.complete)){setTimeout(run,80);return}
   let pending=imgs.filter(img=>!img.complete).length;
   const done=()=>{pending--;if(pending<=0)setTimeout(run,80)};
   imgs.filter(img=>!img.complete).forEach(img=>{img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true})});
   setTimeout(run,1400);
  };
  frame.addEventListener('load',waitAssets,{once:true});
  setTimeout(()=>{if(frame.isConnected&&doc.readyState==='complete')waitAssets()},320);
  const cleanup=()=>setTimeout(()=>frame.remove(),1200);
  try{frame.contentWindow?.addEventListener('afterprint',cleanup,{once:true})}catch(_){}
  setTimeout(()=>frame.remove(),60000);
 };
 if(printButton){
  printButton.onclick=e=>{e.preventDefault();e.stopPropagation();printMeeting().catch(error=>console.warn('PDF de minuta:',error))};
  printButton.type='button';
 }
 wrap.querySelectorAll('[data-meeting-field]').forEach(input=>input.oninput=()=>{const data={};wrap.querySelectorAll('[data-meeting-field]').forEach(el=>data[el.dataset.meetingField]=el.value);localStorage.setItem('ljr-meeting-options-v875',JSON.stringify(data))});
 const topicStatus=document.createElement('small');
 topicStatus.className='v919-topic-status';topicStatus.setAttribute('role','status');topicStatus.setAttribute('aria-live','polite');
 wrap.querySelector('.v875-agenda-chips')?.after(topicStatus);
 const agenda=form.querySelector('[data-x="agenda"]');
 const hasTopic=topic=>!!agenda&&agenda.value.split(/\r?\n/).some(line=>line.trim().replace(/^[•-]\s*/, '')===topic);
 wrap.querySelectorAll('[data-add-topic]').forEach(button=>{
   const topic=button.dataset.addTopic;
   const refresh=()=>{const added=hasTopic(topic);button.classList.toggle('is-added',added);button.setAttribute('aria-pressed',String(added))};
   refresh();
   button.addEventListener('click',event=>{
     event.preventDefault();
     if(!agenda){topicStatus.textContent='No se encontró el campo Orden del día.';return}
     if(!hasTopic(topic)){
       agenda.value=agenda.value.trimEnd()+(agenda.value.trim()?'\n':'')+'• '+topic;
       agenda.dispatchEvent(new Event('input',{bubbles:true}));
       agenda.dispatchEvent(new Event('change',{bubbles:true}));
       topicStatus.textContent='✓ '+topic+' agregado al orden del día.';
     }else topicStatus.textContent='✓ '+topic+' ya está en el orden del día.';
     refresh();
   });
 });
}
function profiles(){
 if(route()!=='video')return;
 let a=null;try{a=window.LJR_V569_AUTH?.currentAccount?.()||window.LJR_MAIN_ROUTE?.state?.user||null}catch(_){}
 const fallback='<img class="v17-tv-profile-icon" src="./profile-reference.svg" alt="">';
 const photo=a&&(a.avatar||a.photoURL||a.picture);
 const gamer=a&&/^gamer:[0-8]$/.test(a.avatarPreset||'');
 let html=fallback;
 if(photo)html='<img class="ljr-profile-image v17-tv-profile-photo" src="'+esc(photo)+'" alt="Mi perfil">';
 else if(gamer&&window.LJR_CHROME?.avatar)html=window.LJR_CHROME.avatar(a);
 document.querySelectorAll('.v17-tv-profile').forEach(button=>{
  if(button.innerHTML!==html)button.innerHTML=html;
  button.classList.toggle('has-account-avatar',!!(photo||gamer));
  button.setAttribute('aria-label',a?'Mi perfil':'Perfil');
 });
}
function liveCard(root){
 if(route()!=='notifications')return;
 const record=window.LJR_CMS?.records?.find(r=>r.kind==='fixture'&&r.published&&(r.payload?.status==='live'||r.payload?.status==='en_vivo'));
 if(!record){root.querySelector('[data-v875-live]')?.remove();return}const p=record.payload;if(!p.home||!p.away)return;
 const signature=JSON.stringify([p.home,p.away,p.homeScore,p.awayScore,p.minute]);let card=root.querySelector('[data-v875-live]');if(card?.dataset.signature===signature)return;
 if(!card){card=document.createElement('button');card.type='button';card.className='v875-live-score';card.dataset.v875Live='';root.prepend(card)}
 card.dataset.signature=signature;card.innerHTML='<small>EN VIVO · '+esc(p.minute?p.minute+"′":'Resultado directo')+'</small><div><span><img src="'+esc(logo(p.home))+'" alt=""><b>'+esc(p.home)+'</b></span><strong>'+esc(p.homeScore??0)+' – '+esc(p.awayScore??0)+'</strong><span><img src="'+esc(logo(p.away))+'" alt=""><b>'+esc(p.away)+'</b></span></div>';card.onclick=()=>window.LJR_MAIN_ROUTE?.go('matchCenter');
}
function apply(){timer=0;const root=document.querySelector('#screen');if(!root)return;cleanText(document.body);if(route()==='history')history(root);studioEntry(root);v919MeetingShortcut(root);poll(document);meeting(document);profiles();liveCard(root)}
function schedule(){if(!timer)timer=setTimeout(apply,80)}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});for(const event of ['hashchange','liga:admin','liga:content','ljr:profile-updated','storage','pageshow'])addEventListener(event,schedule);
document.addEventListener('click',e=>{if(e.target.closest('[data-v875-studio],[data-v875-canva]'))return;setTimeout(schedule,100)});
window.LJR_REVIEW_V875={apply};schedule();
})();
