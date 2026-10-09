/* V1073 — Centro de avisos de Noticias, sin duplicar las tarjetas existentes.
   Lee el feed oficial de GitHub Actions y avisos publicados SOLO en este equipo.
   Comprobación y notificaciones locales mientras la página está abierta. */
(function(){
'use strict';
if(window.__LJR_V1073_NOTICE_CENTER__)return;
window.__LJR_V1073_NOTICE_CENTER__=true;
const FEED='./data/active-notices.json', LOCAL='ljr-v713-auto-notices';
const STATE='ljr-v1073-notice-center', CATS=['Todas','Primera','Intermedia','Segunda','Veteranos 35+','Veteranos 50+'];
const $=(s,r=document)=>r.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v??fallback}catch(_){return fallback}};
const save=(key,v)=>{try{localStorage.setItem(key,JSON.stringify(v))}catch(_){}};
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
const state=Object.assign({category:'Todas',type:'all',search:'',read:[],saved:[],alerts:false,known:[],limit:4},read(STATE,{}));
let items=[],loaded=false,lastFetch=0,pending=false,fetchError=false;
function getLocal(){
 const rows=read(LOCAL,[]);
 if(!Array.isArray(rows))return [];
 return rows.filter(x=>x&&x.published&&x.channels?.app).map(x=>({...x,local:true}));
}
function normalize(row,index,local){
 if(!row||typeof row!=='object'||!String(row.title||'').trim())return null;
 const id=String(row.id||((local?'local-':'feed-')+index));
 return {id:(local?'local:':'global:')+id,title:String(row.title).slice(0,140),
 body:String(row.body||row.message||'').slice(0,1500),type:String(row.type||'general'),
 category:String(row.category||'Todas'),date:row.published_at||row.publishedAt||row.publishAt||'',
 png:String(row.png||'').trim(),local:!!local};
}
function merged(global){
 const ids=new Set(),output=[];
 [...global.map((x,i)=>normalize(x,i,false)),...getLocal().map((x,i)=>normalize(x,i,true))]
 .filter(Boolean).forEach(x=>{if(!ids.has(x.id)){ids.add(x.id);output.push(x)}});
 return output.sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0));
}
function cleanText(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function noticeMatches(item){
 if(state.category!=='Todas'&&item.category!=='Todas'&&cleanText(item.category)!==cleanText(state.category))return false;
 if(state.type==='unread'&&state.read.includes(item.id))return false;
 if(state.type==='saved'&&!state.saved.includes(item.id))return false;
 if(state.search&&!cleanText(item.title+' '+item.body+' '+item.category+' '+item.type).includes(cleanText(state.search)))return false;
 return true;
}
function prettyDate(s){
 if(!s)return 'Fecha no indicada';
 const d=new Date(s);if(Number.isNaN(+d))return 'Fecha no indicada';
 return d.toLocaleString('es-MX',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
}
function markCount(){
 const n=items.filter(x=>!state.read.includes(x.id)).length;
 const el=$('[data-v1073-count]');if(el)el.textContent=n+' sin leer';
 if('setAppBadge'in navigator){try{if(n)navigator.setAppBadge(n).catch(()=>{});else navigator.clearAppBadge().catch(()=>{})}catch(_){}}
}
function render(){
 const root=$('[data-v1073-center]');if(!root)return;
 root.querySelectorAll('[data-v1073-filter]').forEach(b=>{const on=state.type===b.dataset.v1073Filter;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
 const catLabel=$('[data-v1073-current-category]',root);if(catLabel)catLabel.textContent=state.category;
 root.querySelectorAll('[data-v1073-cat-option]').forEach(b=>{const selected=b.dataset.v1073CatOption===state.category;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});
 const term=$('[data-v1073-search]',root);if(term&&term.value!==state.search)term.value=state.search;
 const toggle=$('[data-v1073-enable]',root);
 if(toggle){const label=toggle.querySelector('[data-v1073-enable-label]');if(label)label.textContent=state.alerts?'Avisos activos':'Activar avisos';toggle.setAttribute('aria-pressed',String(state.alerts))}
 const status=$('[data-v1073-status]',root);
 if(status)status.textContent=fetchError?(navigator.onLine?'Fuente oficial no disponible · Mostrando avisos guardados':'Sin conexión · Avisos locales disponibles'):loaded?'Avisos oficiales actualizados':'Consultando comunicados oficiales…';
 const visible=items.filter(noticeMatches),box=$('[data-v1073-list]',root);
 if(box){
  box.innerHTML=visible.length?visible.slice(0,state.limit).map(item=>{
   const seen=state.read.includes(item.id),saved=state.saved.includes(item.id);
   return '<article class="v1073-notice '+(seen?'is-read':'')+'">'+
    '<div class="v1073-notice-top"><span class="v1073-tag">'+esc(item.type.replace(/[_-]/g,' '))+'</span><span class="v1073-time">'+esc(prettyDate(item.date))+'</span>'+(item.local?'<small class="v1073-local">Solo este dispositivo</small>':'')+'</div>'+
    '<h4>'+esc(item.title)+'</h4><p>'+esc(item.body)+'</p><div class="v1073-notice-actions">'+
    '<button data-v1073-read="'+esc(item.id)+'" type="button">'+(seen?'✓ Leído':'✓ Marcar leído')+'</button>'+
    '<button data-v1073-save="'+esc(item.id)+'" type="button" aria-pressed="'+saved+'">'+(saved?'★ Guardado':'☆ Guardar')+'</button>'+
    '<button data-v1073-share="'+esc(item.id)+'" type="button">↗ Compartir</button>'+
    (item.png&&/^\/?generated\/notices\/[a-z0-9-]+\.png$/i.test(item.png)?'<a href="'+esc('./'+item.png.replace(/^\/+/,''))+'" download>↓ Imagen</a>':'')+
    '</div></article>';
  }).join(''):'<div class="v1073-empty">'+(state.type==='saved'?'No hay avisos guardados.':state.type==='unread'?'No tienes avisos sin leer.':state.search||state.category!=='Todas'?'No se encontraron avisos con estos filtros.':loaded?'Todavía no hay avisos oficiales publicados en el archivo. Puedes activar los avisos para enterarte cuando haya novedades.':'Consultando publicaciones oficiales…')+'</div>';
 }
 const more=$('[data-v1073-more]',root);if(more)more.hidden=visible.length<=state.limit;
 markCount();
}
function persist(){save(STATE,state);render()}
function toast(s){
 let e=$('[data-v1073-toast]');if(!e){e=document.createElement('div');e.dataset.v1073Toast='';e.className='v1073-toast';document.body.append(e)}
 e.textContent=s;e.classList.add('show');clearTimeout(e._timeout);e._timeout=setTimeout(()=>e.classList.remove('show'),2800);
}
async function displayNotice(item){
 if(!state.alerts||!('Notification'in window)||Notification.permission!=='granted')return;
 try{
  const options={body:item.body.slice(0,180),tag:'ljr-'+item.id};
  if('serviceWorker'in navigator){
   const registration=await navigator.serviceWorker.getRegistration();
   if(registration?.showNotification){await registration.showNotification(item.title,options);return}
  }
  if(!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))new Notification(item.title,options);
 }catch(_){}
}
async function refresh(force=false){
 if(pending||(!force&&Date.now()-lastFetch<50000))return;
 pending=true;lastFetch=Date.now();
 let feed=[],ok=false;
 try{
  const response=await fetch(FEED+'?v='+Date.now(),{cache:'no-store'});
  if(!response.ok)throw Error('feed no disponible');
  const data=await response.json();
  feed=Array.isArray(data)?data:Array.isArray(data?.items)?data.items:[];
  ok=true;
 }catch(_){fetchError=true}
 if(ok){
  fetchError=false;
  const next=merged(feed),globalIds=next.filter(x=>!x.local).map(x=>x.id);
  if(loaded&&state.alerts){
   const incoming=next.filter(x=>!x.local&&!state.known.includes(x.id)).slice(0,2);
   for(const x of incoming)await displayNotice(x);
  }
  state.known=globalIds.slice(0,250);
  save(STATE,state);
  items=next;
  loaded=true;
 }else{
  items=merged(items.filter(x=>!x.local).map(x=>({...x,id:x.id.replace(/^global:/,''),published_at:x.date})));
  loaded=true;
 }
 pending=false;render();
}
async function enable(){
 if(!('Notification'in window)||!window.isSecureContext){toast('El navegador no admite estas notificaciones');return}
 if(state.alerts){state.alerts=false;persist();toast('Alertas en pantalla desactivadas');return}
 try{
  const p=Notification.permission==='default'?await Notification.requestPermission():Notification.permission;
  if(p!=='granted'){toast(p==='denied'?'Notificaciones bloqueadas en el navegador':'No se concedió el permiso');return}
  state.alerts=true;persist();toast('Activadas: comprobación cuando la app esté abierta');refresh(true);
 }catch(_){toast('No se pudo activar. Comprueba los permisos del navegador')}
}
async function share(item){
 const url=location.origin+location.pathname+'#/news',text=item.title+'\n'+item.body;
 try{if(navigator.share){await navigator.share({title:item.title,text,url});return}}catch(e){if(e?.name==='AbortError')return}
 try{await navigator.clipboard.writeText(text+'\n'+url);toast('Aviso copiado para compartir')}catch(_){toast('No se pudo compartir')}
}
function build(){
 const el=document.createElement('section');
 el.className='v1073-center';el.dataset.v1073Center='';
 el.innerHTML=
 '<div class="v1073-heading"><div><small>INFORMACIÓN VERIFICADA</small><h3>Centro de avisos <span data-v1073-count>0 sin leer</span></h3><p data-v1073-status>Buscando avisos oficiales…</p></div><button type="button" data-v1073-reload aria-label="Actualizar avisos" title="Actualizar avisos"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.7 9a7.5 7.5 0 0 1 12.5-2L20 12M4 12l1.8 5a7.5 7.5 0 0 0 12.5-2"/></svg></button></div>'+
 '<div class="v1073-quick"><button type="button" data-v1073-enable><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg><span data-v1073-enable-label>Activar avisos</span></button><button type="button" data-v1073-program><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>Programar aviso</span></button></div>'+
 '<div class="v1073-search"><label class="v1073-search-box"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><input data-v1073-search type="search" placeholder="Buscar avisos…" autocomplete="off" aria-label="Buscar en avisos"></label><button type="button" class="v1073-category-trigger" data-v1073-category-trigger aria-label="Seleccionar categoría" aria-expanded="false" aria-controls="v1073-category-options"><span data-v1073-current-category>Todas</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button></div>'+
 '<div class="v1073-category-menu" id="v1073-category-options" data-v1073-category-menu hidden>'+CATS.map(c=>'<button type="button" data-v1073-cat-option="'+esc(c)+'">'+esc(c)+'</button>').join('')+'</div>'+
 '<div class="v1073-filters"><button data-v1073-filter="all" type="button" class="active">Todos</button><button data-v1073-filter="unread" type="button">Sin leer</button><button data-v1073-filter="saved" type="button">Guardados</button></div>'+
 '<div class="v1073-list" data-v1073-list aria-live="polite"></div>'+
 '<button type="button" class="v1073-more" data-v1073-more hidden>Ver más avisos ↓</button>'+
 '<div class="v1073-footer"><span>Automatización: consulta al abrir y cada minuto mientras esté activa la página.</span><button type="button" data-v1073-markall>Marcar todo leído</button></div>';
 el.addEventListener('input',e=>{if(e.target.matches('[data-v1073-search]')){state.search=e.target.value;state.limit=4;persist()}});
 el.addEventListener('change',e=>{});
 const menu=el.querySelector('[data-v1073-category-menu]'),trigger=el.querySelector('[data-v1073-category-trigger]');
 function closeCategories(){menu.hidden=true;trigger.setAttribute('aria-expanded','false')}
 trigger.addEventListener('click',()=>{menu.hidden=!menu.hidden;trigger.setAttribute('aria-expanded',String(!menu.hidden))});
 el.querySelectorAll('[data-v1073-cat-option]').forEach(btn=>btn.addEventListener('click',()=>{state.category=btn.dataset.v1073CatOption;state.limit=4;closeCategories();persist()}));
 el.addEventListener('keydown',e=>{if(e.key==='Escape')closeCategories()});
 el.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.matches('[data-v1073-enable]')){enable();return}
  if(b.matches('[data-v1073-reload]')){refresh(true);return}
  if(b.matches('[data-v1073-program]')){location.hash='#/v38Alerts';return}
  if(b.matches('[data-v1073-markall]')){state.read=[...new Set([...state.read,...items.map(x=>x.id)])].slice(-500);persist();return}
  if(b.matches('[data-v1073-more]')){state.limit+=8;persist();return}
  if(b.dataset.v1073Filter){state.type=b.dataset.v1073Filter;state.limit=4;persist();return}
  const id=b.dataset.v1073Read||b.dataset.v1073Save||b.dataset.v1073Share;
  if(!id)return;const item=items.find(x=>x.id===id);if(!item)return;
  if(b.hasAttribute('data-v1073-read')){if(!state.read.includes(id))state.read.push(id);state.read=state.read.slice(-500);persist()}
  if(b.hasAttribute('data-v1073-save')){state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id].slice(-250);persist()}
  if(b.hasAttribute('data-v1073-share'))share(item);
 });
 return el;
}
function mount(){
 if(route()!=='news')return;
 const shell=$('#screen .v412-shell[data-v412-screen="news"]');
 if(!shell||shell.querySelector('[data-v1073-center]'))return;
 shell.appendChild(build());render();refresh(true);
}
let requested=false;
function schedule(){if(requested)return;requested=true;requestAnimationFrame(()=>{requested=false;mount()})}
window.addEventListener('hashchange',schedule);
window.addEventListener('focus',()=>{schedule();if(route()==='news')refresh(true)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&route()==='news')refresh(true)});
window.addEventListener('ljr:auto-notice',()=>{if(route()==='news'){items=merged(items.filter(x=>!x.local).map(x=>({...x,id:x.id.replace(/^global:/,''),published_at:x.date})));render()}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
setInterval(()=>{if(route()==='news'&&!document.hidden)refresh()},60000);
setTimeout(schedule,800);
})();