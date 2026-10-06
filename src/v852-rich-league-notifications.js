/* V853 — Liga Juventino rich notification studio.
   Admin can edit text/image/design, generate copy and social artwork locally,
   send a pre-publication review to WhatsApp, share/publish to Facebook through
   the existing secure webhook, and only then publish inside the blue app. */
(()=>{
'use strict';
if(window.__LJR_V853_RICH_NOTIFICATION_STUDIO__)return;
window.__LJR_V853_RICH_NOTIFICATION_STUDIO__=true;

const BUILD='v853';
const KIND='notification';
const SEEN='ljr-rich-cms-seen-v852';
const INIT='ljr-rich-cms-init-v852';
const EXPANDED='ljr-rich-expanded-v852';
const DEFAULT_ICON='./icons/icon-192.png';
const ADMIN_LOCAL='4121715599';
const ADMIN_E164='524121715599';
const FACEBOOK_PAGE='https://www.facebook.com/share/19SsGuzsRi/';
const FACEBOOK_WEBHOOK_KEY='ljr-v713-facebook-webhook';
let renderTimer=0,syncing=false,lastRecords=[];
let studio={generatedFile:null,generatedUrl:'',reviewImageUrl:'',reviewed:false,previewFileUrl:'',iconFileUrl:''};

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(_){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const media=()=>window.LJR_MEDIA||null;
const cms=()=>window.LJR_CMS||null;
const color=(v,f)=>/^#[0-9a-f]{6}$/i.test(String(v||''))?String(v):f;
const safeRoute=v=>{const s=String(v||'notifications').trim().replace(/^#\/?/,'').replace(/^\//,'');return s||'notifications'};
const payload=rec=>rec?.payload||{};
const slug=s=>String(s||'aviso-liga').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64)||'aviso-liga';

function records(){
  const all=Array.isArray(cms()?.records)?cms().records:lastRecords;
  return (all||[]).filter(x=>x&&x.kind===KIND&&x.published).sort((a,b)=>{
    const at=Number(a?.payload?.updatedAt||a?.payload?.createdAt||a?.updated||a?.created||0);
    const bt=Number(b?.payload?.updatedAt||b?.payload?.createdAt||b?.updated||b?.created||0);
    return bt-at;
  });
}
function iconFor(p={}){
  if(p.icon)return p.icon;
  return DEFAULT_ICON;
}
function typeIcon(type=''){
  return ({resultado:'⚽',partido:'🏟️',urgente:'🚨',evento:'📅',transmision:'📺',noticia:'📰',aviso:'🔔'})[String(type).toLowerCase()]||'🔔';
}
function typeLabel(type=''){
  return ({resultado:'RESULTADO',partido:'PARTIDO',urgente:'URGENTE',evento:'EVENTO',transmision:'TRANSMISIÓN',noticia:'NOTICIA',aviso:'AVISO'})[String(type).toLowerCase()]||'LIGA';
}
function timeValue(rec){
  return Number(rec?.payload?.updatedAt||rec?.payload?.createdAt||rec?.updated||rec?.created||0)||Date.now();
}
function timeText(rec){
  const ts=timeValue(rec),diff=Math.max(0,Date.now()-ts),m=Math.floor(diff/60000);
  if(m<1)return 'ahora';
  if(m<60)return m+' min';
  const h=Math.floor(m/60);if(h<24)return h+' h';
  const d=Math.floor(h/24);if(d<7)return d+' d';
  try{return new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'short'}).format(new Date(ts))}catch(_){return ''}
}
function toast(msg){
  document.querySelector('.v853-toast')?.remove();
  const n=document.createElement('div');n.className='v853-toast';n.textContent=msg;document.body.appendChild(n);
  setTimeout(()=>n.remove(),2400);
}

async function syncPublished(){
  if(syncing)return;
  syncing=true;
  try{
    const all=Array.isArray(cms()?.records)?cms().records:[];
    if(!all.length)return;
    lastRecords=all;
    const list=all.filter(x=>x&&x.kind===KIND&&x.published);
    const seen=read(SEEN,{});
    const initialized=localStorage.getItem(INIT)==='1';
    let changed=false;
    for(const rec of list){
      const rev=String(rec.revision??rec.updated??rec?.payload?.updatedAt??'1');
      if(!initialized){seen[rec.id]=rev;changed=true;continue}
      if(seen[rec.id]===rev)continue;
      seen[rec.id]=rev;changed=true;
      const p=payload(rec);
      if(window.LJR_V840_NOTIFICATIONS?.sendRich){
        await window.LJR_V840_NOTIFICATIONS.sendRich({
          title:String(p.title||'Liga Juventino Rosas'),
          body:String(p.body||'Nueva actualización de la Liga.'),
          imageUrl:String(p.image||''),
          iconUrl:String(iconFor(p)||DEFAULT_ICON),
          group:'liga-'+String(p.type||'avisos').toLowerCase().replace(/[^a-z0-9]+/g,'-')
        });
      }
    }
    if(!initialized){localStorage.setItem(INIT,'1');changed=true}
    if(changed)write(SEEN,seen);
    render();
  }finally{syncing=false}
}

function recordMarkup(rec){
  const p=payload(rec),expanded=read(EXPANDED,{})[rec.id]===true;
  const img=String(p.image||''),icon=String(iconFor(p)||DEFAULT_ICON);
  const accent=color(p.accent,'#52e8f3'),bg=color(p.background,'#08194f'),tx=color(p.textColor,'#ffffff');
  const style='--v853-accent:'+accent+';--v853-card-bg:'+bg+';--v853-card-text:'+tx;
  return '<article class="v852-notice '+(expanded?'is-expanded':'')+'" style="'+style+'" data-v852-record="'+esc(rec.id)+'">'+
    '<button type="button" class="v852-notice-main" data-v852-toggle="'+esc(rec.id)+'">'+
      '<span class="v852-thumb">'+(img?'<img src="'+esc(img)+'" alt="" loading="lazy" decoding="async">':'<img src="'+esc(icon)+'" alt="" loading="lazy" decoding="async">')+'</span>'+
      '<span class="v852-copy">'+
        '<span class="v852-title-line"><b>'+esc(p.title||'Liga Juventino Rosas')+'</b><small>· '+esc(timeText(rec))+'</small></span>'+
        '<span class="v852-body">'+esc(p.body||'Actualización de la Liga Juventino Rosas')+'</span>'+
      '</span>'+
      '<span class="v852-chevron" aria-hidden="true">'+(expanded?'⌃':'⌄')+'</span>'+
    '</button>'+
    (expanded?'<div class="v852-expanded">'+
      '<div class="v852-expanded-meta"><span>'+typeIcon(p.type)+' '+esc(typeLabel(p.type))+'</span><small>Liga Juventino Rosas</small></div>'+
      '<h3>'+esc(p.title||'Liga Juventino Rosas')+'</h3>'+
      '<p>'+esc(p.body||'')+'</p>'+
      (img?'<img class="v852-hero-image" src="'+esc(img)+'" alt="'+esc(p.title||'Aviso de la Liga')+'" loading="eager" decoding="async">':'')+
      '<button type="button" class="v852-open" data-v852-open="'+esc(safeRoute(p.route))+'">Abrir en la app</button>'+
    '</div>':'')+
  '</article>';
}
function feedMarkup(){
  const list=records().slice(0,12),isAdmin=!!media()?.admin;
  return '<section class="v852-feed" data-v852-feed>'+
    '<header class="v852-feed-head">'+
      '<span class="v852-brand"><img src="'+DEFAULT_ICON+'" alt=""><span><small>LIGA JUVENTINO ROSAS</small><b>Noticias y avisos</b></span></span>'+
      (isAdmin?'<button type="button" class="v852-admin-btn" data-v852-admin>+ Crear aviso</button>':'')+
    '</header>'+
    '<div class="v852-feed-list">'+
      (list.length?list.map(recordMarkup).join(''):'<div class="v852-empty"><span>🔔</span><b>Aquí aparecerán los avisos oficiales</b><small>Resultados, partidos, noticias, transmisiones y comunicados de la Liga.</small></div>')+
    '</div>'+
  '</section>';
}
function host(){
  return document.querySelector('.v46-ref-notifications-main')||
         document.querySelector('.v414-notifications')||
         document.querySelector('[data-v46-account="notifications"]')||
         document.querySelector('#screen');
}
function render(){
  if(route()!=='notifications')return;
  const h=host();if(!h)return;
  h.querySelector('[data-v852-feed]')?.remove();
  const match=h.querySelector('[data-v840-feed]');
  if(match)match.insertAdjacentHTML('beforebegin',feedMarkup());
  else{
    const device=h.querySelector('.v46-ref-device,.v414-device-card');
    if(device)device.insertAdjacentHTML('afterend',feedMarkup());else h.insertAdjacentHTML('afterbegin',feedMarkup());
  }
  bind(h.querySelector('[data-v852-feed]'));
}
function bind(root){
  if(!root)return;
  root.querySelectorAll('[data-v852-toggle]').forEach(b=>b.addEventListener('click',()=>{
    const id=b.dataset.v852Toggle,st=read(EXPANDED,{});
    st[id]=!st[id];write(EXPANDED,st);render();
  }));
  root.querySelectorAll('[data-v852-open]').forEach(b=>b.addEventListener('click',e=>{
    e.stopPropagation();location.hash='#/'+safeRoute(b.dataset.v852Open);
  }));
  root.querySelector('[data-v852-admin]')?.addEventListener('click',()=>openAdmin());
}

function smartDraft(type='aviso',tone='quick',details=''){
  const d=String(details||'').replace(/\s+/g,' ').trim();
  const add=d?' '+d.replace(/[.!?]+$/,'')+'.':'';
  const map={
    aviso:['Aviso importante','Información oficial de la Liga Juventino Rosas.'],
    partido:['¡Se viene partidazo!','Todo listo para un nuevo encuentro de la Liga Juventino Rosas.'],
    resultado:['Resultado oficial','Marcador confirmado en la Liga Juventino Rosas.'],
    noticia:['Noticias de la Liga','Nueva información para equipos, jugadores y afición.'],
    evento:['Próximo evento','Agenda esta fecha y acompaña a la Liga Juventino Rosas.'],
    transmision:['Transmisión en vivo','Sigue la actividad de la Liga Juventino Rosas en directo.'],
    urgente:['🚨 Atención · Aviso urgente','Información importante de última hora.']
  };
  let [title,body]=map[type]||map.aviso;
  if(tone==='short') body=(body+add).trim();
  else if(tone==='formal') body=('La Liga Municipal de Fútbol Juventino Rosas A.C. informa: '+body+add+' Favor de revisar la información oficial antes de acudir al campo.').replace(/\s+/g,' ');
  else if(tone==='viral'){
    title=(type==='resultado'?'🔥 ¡Marcador confirmado!':type==='partido'?'🔥 ¡Partidazo a la vista!':'⚡ '+title);
    body=(body+add+' Comparte y mantente pendiente de la información oficial. ⚽💙').replace(/\s+/g,' ');
  }else if(tone==='urgent'){
    title='🚨 '+title.replace(/^🚨\s*/,'');
    body=('ATENCIÓN. '+body+add+' Revisa este aviso antes de trasladarte.').replace(/\s+/g,' ');
  }else body=(body+add+' Consulta todos los detalles dentro de la app azul.').replace(/\s+/g,' ');
  return {title,body};
}
function socialText(data){
  const title=String(data.title||'Liga Juventino Rosas').trim();
  const body=String(data.body||'').trim();
  return (title+'\n\n'+body+'\n\n#LigaJuventinoRosas #FutbolJuventinoRosas').trim();
}
function reviewText(data,imageUrl=''){
  return ('🔎 REVISIÓN ANTES DE PUBLICAR\nLiga Juventino Rosas\n\n'+
    typeIcon(data.type)+' '+String(data.title||'Aviso')+'\n'+String(data.body||'')+
    (imageUrl?'\n\n🖼 Vista previa: '+imageUrl:'')+
    '\n\nDestino: App azul / Facebook\nRevisar antes de publicar.').trim();
}

async function adminRecords(){
  if(!media()?.admin)return [];
  try{
    const data=await media().api('content?admin=1');
    const list=Array.isArray(data?.items)?data.items:[];
    lastRecords=list;
    return list.filter(x=>x?.kind===KIND).sort((a,b)=>timeValue(b)-timeValue(a));
  }catch(_){return []}
}
function clearStudioUrls(){
  for(const k of ['generatedUrl','previewFileUrl','iconFileUrl']){
    const u=studio[k];if(/^blob:/i.test(u||''))try{URL.revokeObjectURL(u)}catch(_){}
  }
}
function closeAdmin(){clearStudioUrls();document.querySelector('[data-v852-admin-modal]')?.remove()}
function formData(form){return Object.fromEntries(new FormData(form))}
function formHtml(rec){
  const p=rec?.payload||{};
  const design=p.design||'neon',accent=color(p.accent,'#2fe2ee'),background=color(p.background,'#071541'),textColor=color(p.textColor,'#ffffff');
  return '<form class="v852-admin-form v853-admin-form" data-v852-form>'+
    '<section class="v853-smart">'+
      '<div class="v853-section-head"><span><small>01 · TEXTO RÁPIDO</small><b>Asistente automático</b></span><em>1 toque</em></div>'+
      '<label><span>Datos rápidos</span><input name="details" maxlength="220" value="" placeholder="Ej. Juventus vs Manchester · domingo 10:00 · Campo 1"></label>'+
      '<div class="v853-smart-actions"><button type="button" data-v853-ai="quick">✨ Generar</button><button type="button" data-v853-ai="short">Corto</button><button type="button" data-v853-ai="formal">Formal</button><button type="button" data-v853-ai="viral">Viral</button><button type="button" data-v853-ai="urgent">Urgente</button></div>'+
    '</section>'+
    '<section class="v853-edit">'+
      '<div class="v853-section-head"><span><small>02 · CONTENIDO</small><b>Editar todo</b></span></div>'+
      '<label><span>Tipo de aviso</span><select name="type">'+
        ['aviso','partido','resultado','noticia','evento','transmision','urgente'].map(v=>'<option value="'+v+'" '+(p.type===v?'selected':'')+'>'+typeIcon(v)+' '+typeLabel(v)+'</option>').join('')+
      '</select></label>'+
      '<label><span>Título</span><input name="title" maxlength="90" required value="'+esc(p.title||'')+'" placeholder="Ej. ¡Partidazo este domingo!"></label>'+
      '<label><span>Texto</span><textarea name="body" rows="5" maxlength="420" required placeholder="Escribe el mensaje que verán los aficionados">'+esc(p.body||'')+'</textarea></label>'+
      '<label><span>Imagen principal · enlace</span><input name="image" type="url" value="'+esc(p.image||'')+'" placeholder="https://..."></label>'+
      '<label class="v852-file"><span>Subir imagen desde el teléfono</span><input data-v852-file type="file" accept="image/jpeg,image/png,image/webp"></label>'+
      '<label><span>Icono / escudo · enlace</span><input name="icon" type="url" value="'+esc(p.icon||'')+'" placeholder="Opcional · PNG sin fondo"></label>'+
      '<label class="v852-file"><span>Subir icono / escudo</span><input data-v853-icon-file type="file" accept="image/jpeg,image/png,image/webp"></label>'+
    '</section>'+
    '<section class="v853-design">'+
      '<div class="v853-section-head"><span><small>03 · DISEÑO</small><b>Imagen automática para redes</b></span></div>'+
      '<div class="v853-design-grid">'+
        '<label><span>Estilo</span><select name="design"><option value="neon" '+(design==='neon'?'selected':'')+'>Azul neón</option><option value="clean" '+(design==='clean'?'selected':'')+'>Azul limpio</option><option value="photo" '+(design==='photo'?'selected':'')+'>Foto protagonista</option><option value="dark" '+(design==='dark'?'selected':'')+'>Oscuro deportivo</option></select></label>'+
        '<label><span>Color acento</span><input name="accent" type="color" value="'+accent+'"></label>'+
        '<label><span>Fondo</span><input name="background" type="color" value="'+background+'"></label>'+
        '<label><span>Texto</span><input name="textColor" type="color" value="'+textColor+'"></label>'+
      '</div>'+
      '<button type="button" class="v853-generate-design" data-v853-generate-design>🖼 Crear diseño automático 1080 × 1350</button>'+
      '<label class="v853-use-design"><input type="checkbox" name="useGenerated" checked> Usar el diseño generado como imagen principal</label>'+
    '</section>'+
    '<label><span>Al tocar abrir</span><select name="route">'+
      [['notifications','Notificaciones'],['home','Inicio'],['competition','Competición'],['scorers','Goleadores'],['video','Vídeo'],['match','Match Center'],['calendar','Calendario']].map(([v,n])=>'<option value="'+v+'" '+((p.route||'notifications')===v?'selected':'')+'>'+n+'</option>').join('')+
    '</select></label>'+
    '<section class="v853-review">'+
      '<div class="v853-section-head"><span><small>04 · REVISIÓN</small><b>Antes de publicar en la app</b></span></div>'+
      '<p>Envía la vista previa a WhatsApp '+ADMIN_LOCAL+' o compártela en Facebook. Después se habilita la publicación.</p>'+
      '<label class="v853-review-required"><input type="checkbox" name="reviewRequired" checked> Exigir revisión antes de publicar</label>'+
      '<div class="v853-review-actions"><button type="button" data-v853-whatsapp>🟢 WhatsApp '+ADMIN_LOCAL+'</button><button type="button" data-v853-facebook>🔵 Facebook</button><button type="button" data-v852-preview>🔔 Probar notificación</button></div>'+
      '<div class="v853-review-state" data-v853-review-state>○ Pendiente de revisión</div>'+
    '</section>'+
    '<div class="v852-admin-actions v853-publish-actions"><button type="button" data-v853-draft>Guardar borrador</button><button type="submit" class="primary" data-v853-publish disabled>'+(rec?.published?'Actualizar en app':'Publicar en app')+'</button></div>'+
  '</form>';
}
function previewFromForm(form){
  const p=formData(form);
  const image=studio.generatedUrl||studio.previewFileUrl||p.image||'';
  const icon=studio.iconFileUrl||p.icon||DEFAULT_ICON;
  const box=document.querySelector('[data-v852-preview-box]');if(!box)return;
  box.innerHTML='<div class="v852-preview-card" style="--v853-accent:'+color(p.accent,'#2fe2ee')+';--v853-preview-bg:'+color(p.background,'#071541')+';--v853-preview-text:'+color(p.textColor,'#ffffff')+'">'+
    '<div class="v852-preview-top"><img src="'+esc(icon)+'" alt=""><b>Liga Juventino Rosas</b><small>ahora</small></div>'+
    '<h3>'+esc(p.title||'Título del aviso')+'</h3>'+
    '<p>'+esc(p.body||'Aquí se verá el texto del aviso.')+'</p>'+
    (image?'<img class="v852-preview-image" src="'+esc(image)+'" alt="">':'')+
  '</div>';
}
function refreshGate(form){
  const required=!!form.querySelector('[name="reviewRequired"]')?.checked;
  const btn=form.querySelector('[data-v853-publish]');
  if(btn)btn.disabled=required&&!studio.reviewed;
  const state=form.querySelector('[data-v853-review-state]');
  if(state){
    state.classList.toggle('ok',studio.reviewed);
    state.textContent=studio.reviewed?'✓ Revisión preparada · listo para publicar':'○ Pendiente de revisión';
  }
}
async function imgFrom(source){
  if(!source)return null;
  try{
    const blob=source instanceof Blob?source:await fetch(String(source),{mode:'cors',cache:'no-store'}).then(r=>{if(!r.ok)throw Error('image');return r.blob()});
    if('createImageBitmap'in window)return await createImageBitmap(blob);
    const url=URL.createObjectURL(blob);
    return await new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{URL.revokeObjectURL(url);resolve(im)};im.onerror=()=>{URL.revokeObjectURL(url);reject(Error('image'))};im.src=url});
  }catch(_){return null}
}
function cover(ctx,img,x,y,w,h){
  if(!img)return;
  const iw=img.width||img.naturalWidth||1,ih=img.height||img.naturalHeight||1,s=Math.max(w/iw,h/ih);
  const dw=iw*s,dh=ih*s;
  ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
}
function contain(ctx,img,x,y,w,h){
  if(!img)return;
  const iw=img.width||img.naturalWidth||1,ih=img.height||img.naturalHeight||1,s=Math.min(w/iw,h/ih);
  const dw=iw*s,dh=ih*s;
  ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);
}
function wrapLines(ctx,text,maxWidth,maxLines=8){
  const words=String(text||'').split(/\s+/).filter(Boolean),lines=[];let line='';
  for(const word of words){
    const next=line?line+' '+word:word;
    if(ctx.measureText(next).width>maxWidth&&line){lines.push(line);line=word;if(lines.length>=maxLines)break}else line=next;
  }
  if(line&&lines.length<maxLines)lines.push(line);
  return lines;
}
async function makeDesign(form,status){
  const d=formData(form),main=form.querySelector('[data-v852-file]')?.files?.[0]||d.image||'';
  status.textContent='Creando diseño HD…';
  const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');
  const bg=color(d.background,'#071541'),accent=color(d.accent,'#2fe2ee'),tx=color(d.textColor,'#ffffff');
  x.fillStyle=bg;x.fillRect(0,0,1080,1350);
  const design=d.design||'neon',photo=await imgFrom(main);
  if(design==='photo'&&photo){
    cover(x,photo,0,0,1080,1350);
    const g=x.createLinearGradient(0,180,0,1350);g.addColorStop(0,'rgba(0,9,45,.10)');g.addColorStop(.56,'rgba(2,12,57,.74)');g.addColorStop(1,'rgba(2,7,34,.97)');x.fillStyle=g;x.fillRect(0,0,1080,1350);
  }else{
    if(design==='neon'){
      const g=x.createLinearGradient(0,0,0,1350);g.addColorStop(0,accent);g.addColorStop(.12,bg);g.addColorStop(1,'#020837');x.globalAlpha=.95;x.fillStyle=g;x.fillRect(0,0,1080,1350);x.globalAlpha=1;
      x.fillStyle='rgba(59,235,246,.14)';x.beginPath();x.arc(930,130,320,0,Math.PI*2);x.fill();
    }else if(design==='clean'){
      x.fillStyle='rgba(255,255,255,.055)';x.fillRect(55,55,970,1240);
    }else{
      const g=x.createLinearGradient(0,0,1080,1350);g.addColorStop(0,'#111827');g.addColorStop(1,bg);x.fillStyle=g;x.fillRect(0,0,1080,1350);
    }
    if(photo){
      x.save();x.beginPath();x.roundRect(70,575,940,560,40);x.clip();cover(x,photo,70,575,940,560);x.restore();
      const g=x.createLinearGradient(0,575,0,1135);g.addColorStop(0,'rgba(1,8,42,.05)');g.addColorStop(1,'rgba(1,8,42,.58)');x.fillStyle=g;x.fillRect(70,575,940,560);
    }
  }
  const logo=await imgFrom(DEFAULT_ICON);
  if(logo){x.fillStyle='#fff';x.beginPath();x.arc(105,112,43,0,Math.PI*2);x.fill();contain(x,logo,70,77,70,70)}
  x.fillStyle=tx;x.font='800 31px Arial';x.fillText('LIGA JUVENTINO ROSAS',165,106);
  x.fillStyle=accent;x.font='800 24px Arial';x.fillText(typeIcon(d.type)+' '+typeLabel(d.type),165,142);
  x.font='900 72px Arial';x.fillStyle=tx;
  let y=270;for(const line of wrapLines(x,d.title||'Aviso de la Liga',900,4)){x.fillText(line,70,y);y+=82}
  x.font='600 34px Arial';x.fillStyle=design==='photo'?'#f4f7ff':'#c9d3ef';y+=22;
  for(const line of wrapLines(x,d.body||'',900,6)){x.fillText(line,70,y);y+=48}
  x.fillStyle=accent;x.fillRect(70,1228,250,6);
  x.fillStyle='#fff';x.font='700 27px Arial';x.fillText('Información oficial',70,1282);
  x.fillStyle='#aeb9d6';x.font='600 23px Arial';x.fillText('Liga Municipal de Fútbol Juventino Rosas A.C.',70,1320);
  const blob=await new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('No se pudo crear el diseño')),'image/png',.96));
  if(studio.generatedUrl)try{URL.revokeObjectURL(studio.generatedUrl)}catch(_){}
  studio.generatedFile=new File([blob],slug(d.title)+'-liga.png',{type:'image/png'});
  studio.generatedUrl=URL.createObjectURL(studio.generatedFile);
  studio.reviewImageUrl='';studio.reviewed=false;
  previewFromForm(form);refreshGate(form);
  status.textContent='Diseño 1080 × 1350 listo. Puedes revisarlo, enviarlo o publicarlo.';
  toast('Diseño automático listo');
  return studio.generatedFile;
}
async function ensureReviewImage(form,status){
  if(studio.reviewImageUrl)return studio.reviewImageUrl;
  const d=formData(form);
  const raw=form.querySelector('[data-v852-file]')?.files?.[0]||null;
  const useGenerated=d.useGenerated==='on';
  const file=useGenerated&&studio.generatedFile?studio.generatedFile:raw;
  if(file){
    if(!cms()?.upload)throw Error('El cargador de imágenes aún no está listo.');
    status.textContent='Subiendo vista previa privada para revisión…';
    studio.reviewImageUrl=await cms().upload(file,d.title||'Vista previa Liga Juventino');
    return studio.reviewImageUrl;
  }
  return String(d.image||'').trim();
}
async function sendWhatsApp(form,status){
  try{
    if(!studio.generatedFile&&formData(form).useGenerated==='on')await makeDesign(form,status);
    const d=formData(form),imageUrl=await ensureReviewImage(form,status),text=reviewText(d,imageUrl);
    if(window.LJR_WHATSAPP_ADMIN?.openChat)window.LJR_WHATSAPP_ADMIN.openChat(text);
    else{
      const url='https://wa.me/'+ADMIN_E164+'?text='+encodeURIComponent(text);
      const w=window.open(url,'_blank','noopener,noreferrer');if(!w)location.href=url;
    }
    studio.reviewed=true;refreshGate(form);
    status.textContent='Revisión preparada para WhatsApp '+ADMIN_LOCAL+'. Publicación en app habilitada.';
  }catch(err){status.textContent=err?.message||'No se pudo preparar WhatsApp.'}
}
async function shareFacebook(form,status){
  try{
    if(!studio.generatedFile&&formData(form).useGenerated==='on')await makeDesign(form,status);
    const d=formData(form),imageUrl=await ensureReviewImage(form,status),text=socialText(d);
    const webhook=(localStorage.getItem(FACEBOOK_WEBHOOK_KEY)||'').trim();
    if(webhook){
      status.textContent='Enviando a Facebook por la conexión segura…';
      const r=await fetch(webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        source:'Liga Juventino Rosas',action:'publish_notice',type:d.type,title:d.title,message:d.body,image:imageUrl,
        page:FACEBOOK_PAGE,publishAt:new Date().toISOString()
      })});
      if(!r.ok)throw Error('Facebook respondió '+r.status+'. Se abrirá el modo manual.');
      studio.reviewed=true;refreshGate(form);
      status.textContent='Enviado a Facebook por la conexión segura. Ya puedes publicar en la app.';
      return;
    }
    const file=studio.generatedFile;
    if(file&&navigator.canShare?.({files:[file]})&&navigator.share){
      await navigator.share({title:d.title||'Liga Juventino Rosas',text,files:[file]});
    }else{
      try{await navigator.clipboard?.writeText(text)}catch(_){}
      const w=window.open(FACEBOOK_PAGE,'_blank','noopener,noreferrer');if(!w)location.href=FACEBOOK_PAGE;
    }
    studio.reviewed=true;refreshGate(form);
    status.textContent='Contenido preparado para Facebook. Si quieres publicación automática, configura el webhook seguro en Programador de avisos.';
  }catch(err){
    if(err?.name==='AbortError'){status.textContent='Compartir cancelado.';return}
    try{await navigator.clipboard?.writeText(socialText(formData(form)))}catch(_){}
    window.open(FACEBOOK_PAGE,'_blank','noopener,noreferrer');
    status.textContent='Se abrió Facebook y el texto quedó preparado para pegar.';
  }
}
async function uploadIcon(form,status){
  const file=form.querySelector('[data-v853-icon-file]')?.files?.[0];
  const d=formData(form);
  if(!file)return String(d.icon||'').trim();
  if(!cms()?.upload)throw Error('El cargador de iconos aún no está listo.');
  status.textContent='Subiendo icono…';
  return await cms().upload(file,(d.title||'Aviso')+' icono');
}
async function saveAdmin(form,rec,status,publish){
  const btn=publish?form.querySelector('[data-v853-publish]'):form.querySelector('[data-v853-draft]');
  if(btn)btn.disabled=true;
  try{
    const d=formData(form),required=!!form.querySelector('[name="reviewRequired"]')?.checked;
    if(publish&&required&&!studio.reviewed)throw Error('Primero envía la vista previa a WhatsApp o Facebook para revisión.');
    let image='';
    if(d.useGenerated==='on'&&studio.generatedFile){
      image=studio.reviewImageUrl||await ensureReviewImage(form,status);
    }else{
      const file=form.querySelector('[data-v852-file]')?.files?.[0];
      if(file){
        if(!cms()?.upload)throw Error('El cargador de imágenes aún no está listo.');
        status.textContent='Subiendo imagen…';image=await cms().upload(file,d.title||'Aviso Liga Juventino');
      }else image=String(d.image||'').trim();
    }
    const icon=await uploadIcon(form,status),now=Date.now();
    const out={
      type:String(d.type||'aviso'),title:String(d.title||'Liga Juventino Rosas').trim(),body:String(d.body||'').trim(),
      image,icon,route:safeRoute(d.route),design:String(d.design||'neon'),
      accent:color(d.accent,'#2fe2ee'),background:color(d.background,'#071541'),textColor:color(d.textColor,'#ffffff'),
      createdAt:Number(rec?.payload?.createdAt||now),updatedAt:now,reviewedAt:studio.reviewed?now:Number(rec?.payload?.reviewedAt||0)
    };
    const id=rec?.id||'notification:'+crypto.randomUUID();
    const result=await media().api('content/'+encodeURIComponent(id),{
      method:'PUT',body:{kind:KIND,payload:out,revision:rec?.revision||0,published:!!publish}
    });
    status.textContent=publish?'Publicado en la app azul.':'Borrador guardado sin publicar.';
    if(cms()?.refresh)await cms().refresh();
    if(publish&&window.LJR_V840_NOTIFICATIONS?.sendRich){
      await window.LJR_V840_NOTIFICATIONS.sendRich({title:out.title,body:out.body,imageUrl:out.image,iconUrl:out.icon||DEFAULT_ICON,group:'liga-'+out.type});
      const seen=read(SEEN,{});seen[id]=String(result?.revision??rec?.revision??out.updatedAt);write(SEEN,seen);
    }
    setTimeout(()=>{closeAdmin();render()},800);
  }catch(err){
    status.textContent=err?.message||'No se pudo guardar el aviso.';
    if(btn)btn.disabled=false;refreshGate(form);
  }
}
async function removeAdmin(rec,status){
  if(!rec||!confirm('¿Retirar este aviso de la Liga?'))return;
  try{
    await media().api('content/'+encodeURIComponent(rec.id),{method:'DELETE',body:{revision:rec.revision}});
    status.textContent='Aviso retirado.';if(cms()?.refresh)await cms().refresh();openAdmin();
  }catch(err){status.textContent=err?.message||'No se pudo retirar.'}
}
async function openAdmin(editRec=null){
  if(!media()?.admin){media()?.login?.(()=>openAdmin(editRec));return}
  closeAdmin();
  studio={generatedFile:null,generatedUrl:'',reviewImageUrl:'',reviewed:false,previewFileUrl:'',iconFileUrl:''};
  const overlay=document.createElement('div');overlay.className='v852-admin-modal';overlay.dataset.v852AdminModal='';
  overlay.innerHTML='<section class="v852-admin-sheet v853-admin-sheet">'+
    '<header><div><small>ADMINISTRADOR · ESTUDIO RÁPIDO</small><h2>Crear y revisar notificación</h2><p>Texto, imagen, diseño, WhatsApp, Facebook y publicación de la app en un solo flujo.</p></div><button type="button" data-v852-close aria-label="Cerrar">×</button></header>'+
    '<div class="v852-admin-grid v853-admin-grid"><div>'+formHtml(editRec)+'</div><aside><h3>Vista previa en vivo</h3><div data-v852-preview-box></div><div class="v853-flow"><span>1 Crear</span><span>2 Revisar</span><span>3 Publicar</span></div><div class="v852-existing" data-v852-existing><small>Cargando avisos…</small></div></aside></div>'+
    '<p class="v852-status" data-v852-status></p>'+
  '</section>';
  document.body.appendChild(overlay);
  overlay.querySelector('[data-v852-close]').onclick=closeAdmin;
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeAdmin()});
  const form=overlay.querySelector('[data-v852-form]'),status=overlay.querySelector('[data-v852-status]');
  previewFromForm(form);refreshGate(form);
  form.addEventListener('input',()=>{studio.reviewed=false;previewFromForm(form);refreshGate(form)});
  form.querySelector('[data-v852-file]')?.addEventListener('change',e=>{
    if(studio.previewFileUrl)try{URL.revokeObjectURL(studio.previewFileUrl)}catch(_){}
    studio.previewFileUrl=e.target.files?.[0]?URL.createObjectURL(e.target.files[0]):'';
    studio.generatedFile=null;if(studio.generatedUrl)try{URL.revokeObjectURL(studio.generatedUrl)}catch(_){};
    studio.generatedUrl='';studio.reviewImageUrl='';studio.reviewed=false;previewFromForm(form);refreshGate(form);
  });
  form.querySelector('[data-v853-icon-file]')?.addEventListener('change',e=>{
    if(studio.iconFileUrl)try{URL.revokeObjectURL(studio.iconFileUrl)}catch(_){}
    studio.iconFileUrl=e.target.files?.[0]?URL.createObjectURL(e.target.files[0]):'';
    previewFromForm(form);
  });
  form.querySelectorAll('[data-v853-ai]').forEach(b=>b.onclick=()=>{
    const d=formData(form),draft=smartDraft(d.type,b.dataset.v853Ai||'quick',d.details);
    form.elements.title.value=draft.title;form.elements.body.value=draft.body;
    studio.reviewed=false;previewFromForm(form);refreshGate(form);toast('Texto automático generado');
  });
  form.querySelector('[data-v853-generate-design]').onclick=()=>makeDesign(form,status);
  form.querySelector('[data-v853-whatsapp]').onclick=()=>sendWhatsApp(form,status);
  form.querySelector('[data-v853-facebook]').onclick=()=>shareFacebook(form,status);
  form.querySelector('[data-v852-preview]').onclick=async()=>{
    previewFromForm(form);const d=formData(form);
    if(window.LJR_V840_NOTIFICATIONS?.sendRich){
      const image=studio.generatedUrl||studio.previewFileUrl||d.image||'';
      const ok=await window.LJR_V840_NOTIFICATIONS.sendRich({title:d.title||'Liga Juventino Rosas',body:d.body||'Vista previa',imageUrl:image,iconUrl:studio.iconFileUrl||d.icon||DEFAULT_ICON,group:'liga-preview'});
      status.textContent=ok?'Vista previa enviada al dispositivo.':'Vista previa lista en pantalla.';
    }
  };
  form.querySelector('[data-v853-draft]').onclick=()=>saveAdmin(form,editRec,status,false);
  form.onsubmit=e=>{e.preventDefault();saveAdmin(form,editRec,status,true)};
  const list=await adminRecords(),wrap=overlay.querySelector('[data-v852-existing]');
  wrap.innerHTML='<h3>Avisos guardados</h3>'+(list.length?list.slice(0,8).map(r=>{
    const p=payload(r);
    return '<div class="v852-existing-row"><span><b>'+esc(p.title||'Aviso')+'</b><small>'+esc(typeLabel(p.type))+(r.published?' · Publicado':' · Borrador')+'</small></span><button type="button" data-v852-edit="'+esc(r.id)+'">Editar</button><button type="button" data-v852-remove="'+esc(r.id)+'">×</button></div>'
  }).join(''):'<small>Aún no hay avisos creados.</small>');
  wrap.querySelectorAll('[data-v852-edit]').forEach(b=>b.onclick=()=>openAdmin(list.find(r=>r.id===b.dataset.v852Edit)));
  wrap.querySelectorAll('[data-v852-remove]').forEach(b=>b.onclick=()=>removeAdmin(list.find(r=>r.id===b.dataset.v852Remove),status));
}

function scheduleRender(){clearTimeout(renderTimer);renderTimer=setTimeout(render,60)}
window.addEventListener('hashchange',scheduleRender);
window.addEventListener('liga:content',()=>{syncPublished();scheduleRender()});
window.addEventListener('liga:admin',scheduleRender);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncPublished();scheduleRender()}});
window.addEventListener('focus',()=>{syncPublished();scheduleRender()});
new MutationObserver(()=>{if(route()==='notifications')scheduleRender()}).observe(document.documentElement,{childList:true,subtree:true});
window.LJR_V852_RICH_NOTIFICATIONS={render,sync:syncPublished,openAdmin,build:BUILD,smartDraft};
window.LJR_V853_NOTIFICATION_STUDIO=window.LJR_V852_RICH_NOTIFICATIONS;
setTimeout(()=>{syncPublished();render()},450);
setTimeout(()=>{syncPublished();render()},1600);
})();
