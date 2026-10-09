/* V1073 - Centro de noticias: automatizacion progresiva sin duplicar contenido oficial. */
(function(){
'use strict';
if(window.__LJR_V1073_NEWS_AUTOMATION__)return;
window.__LJR_V1073_NEWS_AUTOMATION__=true;

var KEY='ljr-news-center-v1073', REV='ljr-news-cms-revisions-v1073';
var settings=read(KEY,{read:{},saved:{},mode:'all',query:'',alerts:false});
var revisions=read(REV,null);
var timer=0,checking=false,lastStatus='Actualización automática al abrir y cada minuto';
function read(key,fallback){try{var data=JSON.parse(localStorage.getItem(key));return data&&typeof data==='object'?data:fallback}catch(_){return fallback}}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(settings))}catch(_){}}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[ch]})}
function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function screen(){return route()==='news'?document.querySelector('#screen'):null}
function cms(){return window.LJR_CMS||null}
function records(){var items=cms()&&cms().records;return Array.isArray(items)?items.filter(function(r){return r&&!!r.published&&(r.kind==='news'||r.kind==='notification')&&!isFuture(r)}):[]}
function isFuture(r){var p=r.payload||{},when=p.publishAt||p.scheduledAt;return !!(when&&Number.isFinite(Date.parse(when))&&Date.parse(when)>Date.now())}
function recordId(r){return 'cms:'+String(r.kind)+':'+String(r.id)}
function scope(r){var p=r.payload||{},s=String(p.scope||p.type||'').toLowerCase();if(/fichaj|transfer|alta|baja/.test(s))return 'Fichajes';if(/equipo|club|plantilla/.test(s))return 'Equipos';return 'Liga'}
function clean(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function isRead(id){return !!settings.read[id]}
function isSaved(id){return !!settings.saved[id]}
function toast(text){var el=document.createElement('div');el.className='v1073-toast';el.textContent=text;document.body.append(el);setTimeout(function(){el.remove()},2000)}
function goto(r){location.hash='#/'+r}
function buttons(id){return '<div class="v1073-row-actions" data-v1073-actions="'+esc(id)+'">'+
  '<button type="button" data-v1073-read="'+esc(id)+'" aria-label="Marcar como leída">'+(isRead(id)?'✓ Leída':'✓ Leer')+'</button>'+
  '<button type="button" data-v1073-save="'+esc(id)+'" aria-pressed="'+isSaved(id)+'">'+(isSaved(id)?'★ Guardada':'☆ Guardar')+'</button>'+
  '<button type="button" data-v1073-share="'+esc(id)+'">↗ Compartir</button></div>'}
function mainRows(list){return Array.from(list.querySelectorAll(':scope > .v1073-row-wrap'))}
function publicCards(host){return Array.from(host.publicFeed.querySelectorAll('.v1073-official-card[data-v1073-id]'))}
function controlMarkup(){
 return '<section class="v1073-controls" aria-label="Herramientas de noticias">'+
  '<div class="v1073-search-line"><label class="v1073-search"><span aria-hidden="true">⌕</span><input type="search" maxlength="100" data-v1073-query autocomplete="off" placeholder="Buscar noticias, equipos o avisos" aria-label="Buscar noticias y avisos"></label>'+
  '<button type="button" class="v1073-icon" data-v1073-refresh title="Actualizar noticias" aria-label="Actualizar noticias">↻</button>'+
  '<button type="button" class="v1073-icon" data-v1073-alerts title="Activar avisos" aria-label="Activar avisos"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg></button></div>'+
  '<div class="v1073-control-row"><div class="v1073-filter-switch">'+
  '<button type="button" data-v1073-mode="unread">Sin leer</button>'+
  '<button type="button" data-v1073-mode="saved">Guardadas</button></div>'+
  '<button type="button" class="v1073-quiet" data-v1073-markall>Marcar leídas</button></div>'+
  '<div class="v1073-status"><span class="v1073-live-dot"></span><span data-v1073-status>Actualizaciones automáticas mientras la app está abierta</span><button type="button" data-v1073-open="notifications">Avisos ›</button></div>'+
  '<div class="v1073-admin" data-v1073-admin-wrap hidden><button type="button" data-v1073-admin>＋ Crear o programar aviso</button></div>'+
  '</section>';
}
function assure(){
 var root=screen();if(!root)return null;
 var list=root.querySelector('[data-news-list]');
 if(!list)return null;
 var controls=root.querySelector('.v1073-controls');
 if(!controls){
  var tabs=root.querySelector('.v727-news-tabs');
  controls=document.createElement('div');
  controls.innerHTML=controlMarkup();
  var panel=controls.firstElementChild;
  if(tabs)tabs.insertAdjacentElement('afterend',panel);
  else list.insertAdjacentElement('beforebegin',panel);
  controls=panel;
 }
 var input=controls.querySelector('[data-v1073-query]');
 if(input&&document.activeElement!==input&&input.value!==settings.query)input.value=settings.query||'';
 controls.querySelectorAll('[data-v1073-mode]').forEach(function(b){b.classList.toggle('active',settings.mode===b.dataset.v1073Mode);b.setAttribute('aria-pressed',String(settings.mode===b.dataset.v1073Mode))});
 var admin=controls.querySelector('[data-v1073-admin-wrap]');if(admin)admin.hidden=!window.LJR_MEDIA?.admin;
 var alerts=controls.nextElementSibling?.matches('.v1073-alert-feed')?controls.nextElementSibling:null;
 if(!alerts){alerts=document.createElement('div');alerts.className='v1073-alert-feed';alerts.dataset.v1073AlertFeed='';controls.insertAdjacentElement('afterend',alerts)}
 var pub=alerts.nextElementSibling?.matches('.v1073-official-feed')?alerts.nextElementSibling:null;
 if(!pub){pub=document.createElement('div');pub.className='v1073-official-feed';pub.dataset.v1073OfficialFeed='';alerts.insertAdjacentElement('afterend',pub)}
 root.classList.add('v1073-enhanced');
 Array.from(list.children).forEach(function(node){
  if(!node.matches?.('button.news-row[data-news]'))return;
  var id='base:'+node.dataset.news;
  var wrap=document.createElement('div');wrap.className='v1073-row-wrap';wrap.dataset.v1073Id=id;
  node.before(wrap);wrap.append(node);
  wrap.insertAdjacentHTML('beforeend',buttons(id));
 });
 return {root:root,list:list,controls:controls,alerts:alerts,publicFeed:pub};
}
function detailOf(id){
 if(id.indexOf('base:')===0){var b=document.querySelector('.v1073-row-wrap[data-v1073-id="'+id+'"] .news-row');return {title:b?.querySelector('b')?.textContent||'Noticias de la Liga',body:b?.querySelector('p')?.textContent||'',route:'newsDetail'}}
 var r=records().find(function(x){return recordId(x)===id});
 return {title:r?.payload?.title||'Aviso de Liga Juventino Rosas',body:r?.payload?.body||'',route:r?.kind==='notification'?'notifications':'news'};
}
function renderAlerts(host){
 var feed=host.alerts;if(!feed)return;
 var items=records().filter(function(r){return r.kind==='notification'}).sort(function(a,b){return Number(b.payload?.updatedAt||b.updated||b.created||0)-Number(a.payload?.updatedAt||a.updated||a.created||0)}).slice(0,3);
 var signature=items.map(function(r){return recordId(r)+'/'+String(r.revision||r.updated||r.payload?.updatedAt||'')+'/'+String(r.payload?.title||'')}).join('|');
 if(feed.dataset.signature!==signature){
  feed.dataset.signature=signature;
  feed.innerHTML=items.length?'<div class="v1073-alert-head"><strong>Comunicados oficiales</strong><button type="button" data-v1073-open="notifications">Ver todos ›</button></div>'+
   items.map(function(r){var p=r.payload||{},id=recordId(r);return '<div class="v1073-alert-card" data-v1073-id="'+esc(id)+'">'+
   '<button type="button" class="v1073-alert-main" data-v1073-open="notifications"><span class="v1073-alert-icon">'+(p.type==='urgente'?'!':'i')+'</span><span><small>'+esc(p.type==='urgente'?'AVISO URGENTE':'PUBLICACIÓN OFICIAL')+'</small><b>'+esc(p.title||'Comunicado de la Liga')+'</b><em>'+esc(p.body||'')+'</em></span><span aria-hidden="true">›</span></button>'+buttons(id)+'</div>'}).join(''):'';
 }
 feed.hidden=!items.length;
}
function renderPublicNews(host){
 var feed=host.publicFeed;
 var items=records().filter(function(r){return r.kind==='news'}).sort(function(a,b){return Number(b.payload?.updatedAt||b.updated||b.created||0)-Number(a.payload?.updatedAt||a.updated||a.created||0)}).slice(0,16);
 var signature=items.map(function(r){return recordId(r)+'/'+String(r.revision||r.updated||'')+'/'+String(r.payload?.title||'')+'/'+String(r.payload?.body||'')}).join('|');
 if(feed.dataset.signature!==signature){
  feed.dataset.signature=signature;
  feed.innerHTML=items.length?items.map(function(r){var p=r.payload||{},id=recordId(r);return '<article class="v1073-official-card" data-v1073-id="'+esc(id)+'" data-v1073-category="'+esc(scope(r))+'">'+
   '<small>NOTICIA OFICIAL · '+esc(scope(r))+'</small><h3>'+esc(p.title||'Noticias de la Liga')+'</h3><p>'+esc(p.body||p.description||'')+'</p>'+buttons(id)+'</article>'}).join(''):'';
 }
 feed.hidden=!items.length;
}
function updateButtons(){
 document.querySelectorAll('#screen [data-v1073-actions]').forEach(function(el){
  var id=el.dataset.v1073Actions;
  var read=el.querySelector('[data-v1073-read]'),save=el.querySelector('[data-v1073-save]');
  if(read){var readLabel=isRead(id)?'✓ Leída':'✓ Leer';if(read.textContent!==readLabel)read.textContent=readLabel}
  if(save){var saveLabel=isSaved(id)?'★ Guardada':'☆ Guardar';if(save.textContent!==saveLabel)save.textContent=saveLabel;save.setAttribute('aria-pressed',String(isSaved(id)))}
  el.closest('[data-v1073-id]')?.classList.toggle('v1073-unread',!isRead(id));
 });
}
function applyFilters(host){
 var q=clean(settings.query||''),mode=settings.mode||'all',category=host.root.querySelector('[data-news-filter][aria-selected="true"]')?.dataset.newsFilter||'Todas';
 var shown=0;
 mainRows(host.list).forEach(function(w){
  var txt=clean(w.querySelector('.news-row')?.textContent||'');var ok=(!q||txt.includes(q))&&(mode!=='unread'||!isRead(w.dataset.v1073Id))&&(mode!=='saved'||isSaved(w.dataset.v1073Id));
  w.hidden=!ok;if(ok)shown++;
 });
 publicCards(host).forEach(function(c){
  var id=c.dataset.v1073Id,txt=clean(c.textContent);
  var ok=(category==='Todas'||c.dataset.v1073Category===category)&&(!q||txt.includes(q))&&(mode!=='unread'||!isRead(id))&&(mode!=='saved'||isSaved(id));
  c.hidden=!ok;if(ok)shown++;
 });
 host.alerts.querySelectorAll('.v1073-alert-card').forEach(function(c){
  var rec=records().find(function(x){return recordId(x)===c.dataset.v1073Id});
  var ok=!!rec&&(category==='Todas'||scope(rec)===category)&&(!q||clean(c.textContent).includes(q))&&(mode!=='unread'||!isRead(c.dataset.v1073Id))&&(mode!=='saved'||isSaved(c.dataset.v1073Id));
  c.hidden=!ok;if(ok)shown++;
 });
 var head=host.alerts.querySelector('.v1073-alert-head');
 if(head)head.hidden=!host.alerts.querySelector('.v1073-alert-card:not([hidden])');
 var old=host.root.querySelector('.v1073-no-results');
 if(!shown){
  if(!old){old=document.createElement('p');old.className='v1073-no-results';old.textContent='No hay publicaciones con estos filtros.';host.list.insertAdjacentElement('afterend',old)}
 }else old?.remove();
 host.controls.querySelectorAll('[data-v1073-mode]').forEach(function(b){b.classList.toggle('active',mode===b.dataset.v1073Mode)});
 updateButtons();
 var st=host.controls.querySelector('[data-v1073-status]');
 if(st){var status=shown+' publicaciones visibles · '+(cms()?.loaded?'Avisos oficiales revisados cada minuto':'Esperando conexión de avisos oficiales');if(st.textContent!==status)st.textContent=status}
}
function revisionsOf(items){var out={};items.forEach(function(r){var p=r.payload||{};out[recordId(r)]=String(r.revision??r.updated??p.updatedAt??'')+'|'+String(p.title||'')+'|'+String(p.body||'')});return out}
async function deviceAlert(r){
 if(!settings.alerts||r.kind!=='news')return;
 var p=r.payload||{},title=String(p.title||'Noticias oficiales de la Liga'),body=String(p.body||'');
 if(window.Capacitor?.isNativePlatform?.() && window.LJR_V840_NOTIFICATIONS?.sendRich){try{await window.LJR_V840_NOTIFICATIONS.sendRich({title:title,body:body,route:'news',group:'liga-noticias'})}catch(_){}return}
 if(!('Notification' in window)||Notification.permission!=='granted'||!('serviceWorker' in navigator))return;
 try{var reg=await navigator.serviceWorker.getRegistration();if(reg)await reg.showNotification(title,{body:body,icon:'./assets/liga-logo.webp',tag:'ljr-noticia-'+r.id,data:{url:location.origin+location.pathname+'#/news'}})}catch(_){}
}
function checkVersions(){
 var source=cms();if(!source?.loaded)return;
 var items=records(),next=revisionsOf(items);
 if(revisions===null){revisions=next;try{localStorage.setItem(REV,JSON.stringify(next))}catch(_){}return}
 var changed=items.filter(function(r){return revisions[recordId(r)]!==undefined&&revisions[recordId(r)]!==next[recordId(r)]||revisions[recordId(r)]===undefined});
 if(changed.length){changed.forEach(function(r){if(r.kind==='news')deviceAlert(r)});lastStatus=changed.length+' publicaciones nuevas';}
 revisions=next;try{localStorage.setItem(REV,JSON.stringify(next))}catch(_){}
}
function run(){
 if(checking||route()!=='news')return;
 checking=true;try{var host=assure();if(!host)return;renderAlerts(host);renderPublicNews(host);checkVersions();applyFilters(host)}catch(err){console.warn('Noticias Liga:',err)}finally{checking=false}
}
function schedule(){clearTimeout(timer);timer=setTimeout(run,95)}
function share(id){
 var d=detailOf(id),url=location.origin+location.pathname+'#/'+(id.indexOf('base:')===0?'newsDetail':'notifications');
 if(id.indexOf('base:')===0)url=location.origin+location.pathname+'#/news';
 if(navigator.share){navigator.share({title:d.title,text:d.body,url:url}).catch(function(){});return}
 if(navigator.clipboard?.writeText)navigator.clipboard.writeText(d.title+'\n'+url).then(function(){toast('Enlace copiado')}).catch(function(){toast('No se pudo copiar')});
 else toast('Compartir no está disponible');
}
async function enableAlerts(){
 if(window.Capacitor?.isNativePlatform?.()&&window.LJR_V840_NOTIFICATIONS?.requestPermission){
  var ok=await window.LJR_V840_NOTIFICATIONS.requestPermission();settings.alerts=!!ok;persist();toast(ok?'Avisos activados':'Revisa los permisos del dispositivo');return;
 }
 if(!('Notification' in window)||!('serviceWorker' in navigator)){toast('Tu navegador no admite avisos del sistema');goto('notifications');return}
 try{
  var perm=await Notification.requestPermission();
  if(perm==='granted')await navigator.serviceWorker.register('./sw.js');
  settings.alerts=perm==='granted';persist();
  toast(settings.alerts?'Avisos activados mientras se consulta la app':'Permiso de avisos no concedido');
 }catch(_){toast('No se pudieron activar los avisos')}
}
document.addEventListener('input',function(e){
 if(!e.target.matches?.('[data-v1073-query]'))return;
 settings.query=e.target.value.slice(0,100);persist();schedule();
});
document.addEventListener('click',function(e){
 var b=e.target.closest?.('[data-v1073-mode],[data-v1073-read],[data-v1073-save],[data-v1073-share],[data-v1073-refresh],[data-v1073-alerts],[data-v1073-markall],[data-v1073-open],[data-v1073-admin]');
 if(b&&route()==='news'){
  e.preventDefault();e.stopPropagation();
  var id=b.dataset.v1073Read||b.dataset.v1073Save||b.dataset.v1073Share;
  if(b.hasAttribute('data-v1073-mode')){settings.mode=settings.mode===b.dataset.v1073Mode?'all':b.dataset.v1073Mode;persist();run()}
  else if(b.hasAttribute('data-v1073-read')){if(isRead(id))delete settings.read[id];else settings.read[id]=Date.now();persist();run()}
  else if(b.hasAttribute('data-v1073-save')){if(isSaved(id))delete settings.saved[id];else settings.saved[id]=Date.now();persist();run()}
  else if(b.hasAttribute('data-v1073-share'))share(id);
  else if(b.hasAttribute('data-v1073-markall')){document.querySelectorAll('#screen [data-v1073-id]:not([hidden])').forEach(function(el){settings.read[el.dataset.v1073Id]=Date.now()});persist();run();toast('Publicaciones marcadas como leídas')}
  else if(b.hasAttribute('data-v1073-refresh')){b.disabled=true;Promise.resolve(cms()?.refresh?.()).catch(function(){}).finally(function(){b.disabled=false;run();toast('Noticias revisadas')})}
  else if(b.hasAttribute('data-v1073-alerts'))enableAlerts();
  else if(b.hasAttribute('data-v1073-admin')){if(window.LJR_MEDIA?.admin)window.LJR_V855_NOTIFICATION_STUDIO?.openAdmin?.();else goto('notifications')}
  else if(b.dataset.v1073Open)goto(b.dataset.v1073Open);
  return;
 }
 var row=e.target.closest?.('#screen .v1073-row-wrap button.news-row[data-news]');
 if(row&&route()==='news'){settings.read['base:'+row.dataset.news]=Date.now();persist()}
},true);
addEventListener('hashchange',schedule);
addEventListener('liga:content',schedule);
addEventListener('liga:admin',schedule);
addEventListener('focus',schedule);
document.addEventListener('visibilitychange',function(){if(!document.hidden)schedule()});
function boot(){
 var root=document.querySelector('#screen');
 if(root)new MutationObserver(function(){if(route()==='news')schedule()}).observe(root,{childList:true,subtree:true});
 schedule();setInterval(function(){if(route()==='news'&&!document.hidden)run()},60000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.LJR_V1073_NEWS={refresh:run,version:'v1073'};
})();
