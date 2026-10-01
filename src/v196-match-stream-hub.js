/* V196 — Centro de transmisión móvil para Match Center.
   Integra varias fuentes, estados En vivo/Por iniciar/Finalizado,
   reproductor adaptable, lista de fuentes y modo flotante.
   No inventa una transmisión: solo usa enlaces vinculados por el operador. */
(function(){
'use strict';
if(window.__LJR_V196_STREAM_HUB__)return;
window.__LJR_V196_STREAM_HUB__=true;

const ROUTES=new Set(['v4-matchcenter','matchCenter','match-center']);
const LIVE_KEY='ljr-match-live-v144:';
const GLOBAL_SOURCE_KEY='ljr-live-source-v144';
const LIST_KEY='ljr-stream-list-v196:';
const SETTINGS_KEY='ljr-stream-settings-v196';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
let timer=0,lastSig='',floatingPortal=null,floatingCardNode=null,floatingDragBound=false,systemPiPActive=false,androidFullscreenHandoff=false;

function ctx(){
  const root=$('[data-v92-matchcenter]');if(!root)return null;
  const sel=$('[data-v92-match-select]',root);
  let sides=$('.v92-score-card .v92-side b',root);
  if(sides.length<2)sides=$('.v420-matchup > div > b',root);
  if(sides.length<2)sides=$('.v526-form-head > div > b',root);
  if(!sel||sides.length<2)return null;
  const category=$('.v420-match-panel h2',root)?.textContent?.trim()||
    ($('.v92-match-head p',root)?.textContent||'').split('·')[1]?.trim()||'Liga Municipal';
  const meta=$('.v92-official-meta span',root).map(x=>x.textContent.trim());
  if(!meta.length){
    const d=$('.v420-match-panel p',root)?.textContent?.trim();
    const v=$('.v420-media-card span',root)?.textContent?.trim();
    if(d)meta.push(d);if(v)meta.push(v);
  }
  return {
    root,
    key:String(sel.value||'match'),
    home:(sides[0].textContent||'Local').trim(),
    away:(sides[1].textContent||'Visitante').trim(),
    category,
    meta
  };
}
function liveState(c){
  try{
    const api=window.LJR_MATCH_LIVE?.getState?.();
    if(api&&api.key===c.key){
      if(api.source&&isOldGenericFacebook(api.source.url,api.source.name)){
        api.source.url='';api.source.name='';api.source.feedUrl='';api.source.connected=false;api.source.lastSync=0;
      }
      return api;
    }
  }catch(_){}
  try{
    const s=JSON.parse(localStorage.getItem(LIVE_KEY+c.key)||'null');
    if(s){
      if(s.source&&isOldGenericFacebook(s.source.url,s.source.name)){
        s.source.url='';s.source.name='';s.source.feedUrl='';s.source.connected=false;s.source.lastSync=0;
        try{localStorage.setItem(LIVE_KEY+c.key,JSON.stringify(s))}catch(_){}
      }
      return s;
    }
  }catch(_){}
  return {v:144,key:c.key,home:c.home,away:c.away,source:{url:'',name:'',feedUrl:'',connected:false,lastSync:0},phase:'scheduled',events:[],suggestions:[],updatedAt:Date.now()};
}
function settings(){
  try{return Object.assign({floating:false,lowQuality:false,render:'auto'},JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}'))}
  catch(_){return {floating:false,lowQuality:false,render:'auto'}}
}
function saveSettings(v){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(v))}catch(_){}}
function provider(url){
  const u=String(url||'').toLowerCase();
  if(u.includes('youtube.com')||u.includes('youtu.be'))return {key:'youtube',name:'YouTube',icon:'▶'};
  if(u.includes('facebook.com')||u.includes('fb.watch'))return {key:'facebook',name:'Facebook',icon:'f'};
  if(u.includes('tiktok.com'))return {key:'tiktok',name:'TikTok',icon:'♪'};
  if(/\.(mp4|webm|ogg|m3u8)(?:[?#]|$)/i.test(u))return {key:'video',name:'Video directo',icon:'▶'};
  return {key:'external',name:'Fuente externa',icon:'●'};
}
function isAndroidChrome(){
  const ua=navigator.userAgent||'';
  return /Android/i.test(ua)&&/(Chrome|CriOS)\//i.test(ua)&&!/EdgA\//i.test(ua)&&!/OPR\//i.test(ua);
}
function isOldGenericFacebook(url,name=''){
  const u=String(url||'').toLowerCase();
  const n=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  return u.includes('facebook.com/share/1cbukpctcm') ||
    n==='facebook / transmision externa' ||
    n==='facebook/transmision externa';
}
function safeUrl(v){
  try{const u=new URL(String(v||'').trim());return /^https?:$/.test(u.protocol)?u.toString():''}catch(_){return ''}
}
function flash(msg){
  document.querySelector('.v196-toast')?.remove();
  const n=document.createElement('div');n.className='v196-toast';n.textContent=String(msg||'');
  document.body.appendChild(n);setTimeout(()=>n.remove(),2600);
}
function openExternal(raw){
  const u=safeUrl(raw);
  if(!u){flash('Enlace no válido');return false}
  const a=document.createElement('a');
  a.href=u;a.target='_blank';a.rel='noopener noreferrer';a.style.display='none';
  document.body.appendChild(a);
  try{a.click()}catch(_){window.open(u,'_blank','noopener,noreferrer')}
  setTimeout(()=>a.remove(),300);
  return true;
}
function youtubeId(url){
  const s=String(url||'');let m=s.match(/[?&]v=([^&#]+)/i);if(m)return m[1];
  m=s.match(/youtu\.be\/([^?&#/]+)/i);if(m)return m[1];
  m=s.match(/youtube\.com\/(?:live|embed)\/([^?&#/]+)/i);return m?m[1]:'';
}
function floatingCapability(item,cfg=settings()){
  const url=safeUrl(item?.url||''),p=provider(url);
  if(!url)return {inApp:false,pip:false,docPip:false,provider:p};
  const docPip=!!window.documentPictureInPicture?.requestWindow;
  if(p.key==='video')return {inApp:true,pip:true,docPip,provider:p};
  if(p.key==='youtube')return {inApp:true,pip:false,docPip,provider:p};
  if(p.key==='facebook')return {inApp:false,pip:false,docPip:false,provider:p};
  return {inApp:false,pip:false,docPip,provider:p};
}
async function requestPiP(node){
  const video=$('video',node)||floatingCardNode?.querySelector('video')||null;
  if(!video){
    flash('Esta fuente no expone un video directo para PiP.');
    return false;
  }
  if(!document.pictureInPictureEnabled||typeof video.requestPictureInPicture!=='function'){
    return false;
  }
  if(video.readyState===0){
    return false;
  }
  try{
    video.disablePictureInPicture=false;
    video.setAttribute('playsinline','');
    /* No esperar play(): Chrome exige que requestPictureInPicture ocurra
       dentro del mismo gesto del usuario. */
    if(video.paused)video.play().catch(()=>{});
    const pipPromise=video.requestPictureInPicture();
    const pip=await pipPromise;
    systemPiPActive=!!pip||document.pictureInPictureElement===video;
    androidFullscreenHandoff=false;
    video.addEventListener('enterpictureinpicture',()=>{
      systemPiPActive=true;
      androidFullscreenHandoff=false;
      const b=document.querySelector('[data-v196-floating] small');
      if(b)b.textContent='Fuera de la app';
    });
    video.addEventListener('leavepictureinpicture',()=>{
      systemPiPActive=false;
      const hub=$('[data-v196-stream-hub]');
      if(settings().floating&&hub)setFloating(true,hub);
    },{once:true});
    try{
      if('mediaSession' in navigator){
        navigator.mediaSession.metadata=new MediaMetadata({
          title:'Liga Juventino Rosas',
          artist:'Partido en vivo',
          album:'Match Center'
        });
        navigator.mediaSession.setActionHandler('play',()=>video.play());
        navigator.mediaSession.setActionHandler('pause',()=>video.pause());
        try{
          navigator.mediaSession.setActionHandler('enterpictureinpicture',()=>video.requestPictureInPicture());
        }catch(_){}
      }
    }catch(_){}
    flash('PiP activo. Ya puedes cambiar a otra aplicación.');
    return true;
  }catch(_){
    systemPiPActive=false;
    return false;
  }
}

async function exitPiP(){
  try{if(document.pictureInPictureElement&&document.exitPictureInPicture)await document.exitPictureInPicture()}catch(_){}
  systemPiPActive=false;
}
async function requestDocumentPiP(node){
  if(!window.documentPictureInPicture?.requestWindow)return false;
  const frame=$('.v196-frame',node);
  if(!frame)return false;
  try{
    const pip=await window.documentPictureInPicture.requestWindow({width:360,height:230});
    const d=pip.document;
    d.head.innerHTML='<meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#000}body{display:grid;place-items:center}.pip-wrap{width:100%;height:100%}.pip-wrap iframe,.pip-wrap video{display:block;width:100%;height:100%;border:0;background:#000;object-fit:contain}</style>';
    const wrap=d.createElement('div');wrap.className='pip-wrap';
    const clone=frame.cloneNode(true);
    while(clone.firstChild)wrap.appendChild(clone.firstChild);
    d.body.appendChild(wrap);
    pip.addEventListener('pagehide',()=>{}, {once:true});
    flash('Ventana flotante activa. Puedes salir de la app y seguir viendo el video.');
    return true;
  }catch(_){
    return false;
  }
}
async function requestAndroidChromeFullscreen(node){
  const video=$('video',node)||floatingCardNode?.querySelector('video')||null;
  const iframe=$('iframe',node)||floatingCardNode?.querySelector('iframe')||null;
  const target=video||iframe||$('.v196-frame',node)||null;
  if(!target)return false;

  if(video){
    try{
      video.disablePictureInPicture=false;
      video.controls=true;
      video.setAttribute('playsinline','');
      if(video.paused)video.play().catch(()=>{});
    }catch(_){}
  }

  const fn=target.requestFullscreen||target.webkitRequestFullscreen||target.mozRequestFullScreen||target.msRequestFullscreen;
  if(typeof fn!=='function')return false;

  try{
    /* Chrome Android: la ruta más fiable es video en pantalla completa
       y después pulsar Inicio; Android lo convierte a PiP. */
    androidFullscreenHandoff=true;
    flash('Abriendo modo flotante de Android… después pulsa Inicio.');
    const p=fn.call(target);
    if(p&&typeof p.catch==='function')await p;
    const b=document.querySelector('[data-v196-floating] small');
    if(b)b.textContent='Pulsa Inicio';
    return true;
  }catch(_){
    androidFullscreenHandoff=false;
    return false;
  }
}

function ensureFloatingPortal(node){
  const card=node&&$('[data-v196-player-card]',node);
  if(!card)return null;
  if(floatingPortal?.isConnected&&floatingCardNode?.isConnected){
    if(card!==floatingCardNode)card.remove();
    return floatingPortal;
  }
  const p=document.createElement('div');
  p.className='v196-floating-portal';
  p.setAttribute('data-v196-floating-portal','');
  document.body.appendChild(p);
  p.appendChild(card);
  card.classList.add('is-floating','is-detached');
  floatingPortal=p;floatingCardNode=card;
  bindFloatingDrag(p);
  return p;
}
function removeFloatingPortal(){
  try{floatingPortal?.remove()}catch(_){}
  floatingPortal=null;floatingCardNode=null;floatingDragBound=false;
  document.body.classList.remove('v196-floating-player');
}
function bindFloatingDrag(portal){
  if(!portal||portal.dataset.dragBound==='1')return;
  portal.dataset.dragBound='1';
  const handle=portal.querySelector('.v196-player-head')||portal;
  let drag=null;
  handle.addEventListener('pointerdown',e=>{
    if(e.target.closest('button'))return;
    const r=portal.getBoundingClientRect();
    drag={x:e.clientX-r.left,y:e.clientY-r.top};
    portal.classList.add('is-dragging');
    try{handle.setPointerCapture(e.pointerId)}catch(_){}
  });
  handle.addEventListener('pointermove',e=>{
    if(!drag)return;
    const w=portal.offsetWidth,h=portal.offsetHeight;
    const left=Math.max(6,Math.min(innerWidth-w-6,e.clientX-drag.x));
    const top=Math.max(6,Math.min(innerHeight-h-6,e.clientY-drag.y));
    portal.style.left=left+'px';portal.style.top=top+'px';portal.style.right='auto';portal.style.bottom='auto';
  });
  const end=()=>{drag=null;portal.classList.remove('is-dragging')};
  handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);
}
function streamList(c,s){
  let list=[];
  try{list=JSON.parse(localStorage.getItem(LIST_KEY+c.key)||'[]')||[]}catch(_){}
  list=Array.isArray(list)?list.filter(x=>safeUrl(x?.url)&&!isOldGenericFacebook(x?.url,x?.name)):[];
  const current=safeUrl(s?.source?.url);
  if(current&&!list.some(x=>x.url===current)){
    list.unshift({id:'current',name:s.source.name||provider(current).name,url:current,addedAt:Date.now()});
  }
  return list.slice(0,12);
}
function saveList(c,list){
  try{localStorage.setItem(LIST_KEY+c.key,JSON.stringify(list.slice(0,12)))}catch(_){}
}
function setCurrentSource(c,item){
  const url=safeUrl(item?.url);if(!url)return;
  const s=liveState(c);
  s.source=Object.assign({feedUrl:'',connected:false,lastSync:0},s.source||{},{
    url,
    name:String(item.name||provider(url).name),
    connected:false
  });
  s.updatedAt=Date.now();
  try{
    localStorage.setItem(LIVE_KEY+c.key,JSON.stringify(s));
    localStorage.setItem(GLOBAL_SOURCE_KEY,JSON.stringify({url:s.source.url,name:s.source.name}));
  }catch(_){}
  try{window.dispatchEvent(new CustomEvent('ljr:match-live-feed',{detail:{key:c.key,source:s.source}}))}catch(_){}
  try{window.dispatchEvent(new StorageEvent('storage',{key:LIVE_KEY+c.key,newValue:JSON.stringify(s)}))}catch(_){}
  setTimeout(()=>window.LJR_MATCH_REALTIME?.reconnect?.(),60);
  schedule(20);
}
function statusInfo(c,s){
  const official=(( $('.v92-center small',c.root)?.textContent||'')+' '+($('.v92-kicker',c.root)?.textContent||'')).toUpperCase();
  const phase=String(s?.phase||'scheduled');
  if(phase==='first'||phase==='second')return {key:'live',label:'EN VIVO',sub:phase==='first'?'PRIMER TIEMPO':'SEGUNDO TIEMPO',live:true};
  if(phase==='halftime')return {key:'live',label:'EN VIVO',sub:'MEDIO TIEMPO',live:true};
  if(phase==='final'||/FINAL|RESULTADO OFICIAL/.test(official))return {key:'final',label:'FINALIZADO',sub:'PARTIDO TERMINADO',live:false};
  if(/HORARIO DEL PARTIDO|EN VIVO/.test(official))return {key:'window',label:'HORARIO EN CURSO',sub:'LISTO PARA TRANSMITIR',live:false};
  return {key:'scheduled',label:'POR INICIAR',sub:'TRANSMISIÓN PREPARABLE',live:false};
}
function playerHtml(c,s,st,current){
  const url=safeUrl(current?.url||s?.source?.url),p=provider(url),cfg=settings();
  if(!url){
    return '<div class="v196-player-empty"><span class="v196-signal">◉</span><b>'+(st.key==='final'?'Sin repetición vinculada':'Transmisión sin configurar')+'</b><p>'+(st.key==='final'?'Puedes vincular una repetición o resumen del partido.':'Vincula YouTube, Facebook, TikTok o una fuente de video para tenerla lista cuando empiece el partido.')+'</p><button type="button" data-v196-add>+ Vincular fuente</button></div>';
  }
  if(cfg.render==='external'){
    return '<div class="v196-player-empty linked"><span class="v196-provider">'+esc(p.icon)+'</span><b>'+esc(current?.name||s.source?.name||p.name)+'</b><p>El modo de reproducción está configurado para abrir el proveedor original.</p><button type="button" data-v196-open="'+esc(url)+'">Abrir transmisión</button></div>';
  }
  if(p.key==='youtube'){
    const id=youtubeId(url);
    if(id){
      const autoplay=st.live&&!cfg.lowQuality?'1':'0';
      return '<div class="v196-frame"><iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?autoplay='+autoplay+'&mute=1&playsinline=1&controls=1" title="YouTube Live" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>';
    }
  }
  if(p.key==='facebook'){
    return '<div class="v196-player-empty linked facebook"><span class="v196-provider">f</span><b>'+esc(current?.name||s.source?.name||'Facebook Live')+'</b><p>Se desactivó el iframe de Facebook en Chrome Android porque puede quedar negro o cambiar de bloque. El enlace real sigue guardado y se abre directamente en Facebook.</p><button type="button" data-v196-open="'+esc(url)+'">Abrir Facebook Live</button></div>';
  }
  if(p.key==='video'){
    return '<div class="v196-frame"><video src="'+esc(url)+'" '+(st.live?'autoplay ':'')+'controls playsinline '+(cfg.lowQuality?'preload="metadata"':'preload="auto"')+' data-v196-system-pip></video></div>';
  }
  return '<div class="v196-player-empty linked"><span class="v196-provider">'+esc(p.icon)+'</span><b>'+esc(current?.name||s.source?.name||p.name)+'</b><p>'+(p.key==='tiktok'?'TikTok puede bloquear el reproductor incrustado.':'Esta fuente se abre en su reproductor original.')+'</p><button type="button" data-v196-open="'+esc(url)+'">Abrir transmisión</button></div>';
}
function sourceButton(item,i,current){
  const p=provider(item.url),on=current&&current.url===item.url;
  return '<button type="button" class="v196-source-chip '+(on?'active':'')+'" data-v196-source="'+i+'"><em>'+esc(p.icon)+'</em><span><b>'+esc(item.name||p.name)+'</b><small>FUENTE '+(i+1)+'</small></span></button>';
}
function hubHtml(c,s){
  const st=statusInfo(c,s),list=streamList(c,s);
  const current=list.find(x=>x.url===safeUrl(s?.source?.url))||list[0]||null;
  const cfg=settings();
  const sourceCount=list.length,cap=floatingCapability(current,cfg);
  const floatOn=!!cfg.floating&&cap.inApp;
  if(cfg.floating&&!cap.inApp){cfg.floating=false;saveSettings(cfg)}
  const floatLabel=(document.pictureInPictureElement||systemPiPActive)?'Fuera de la app':(androidFullscreenHandoff?'Pulsa Inicio':(floatOn?'Activo':(current&&!cap.inApp?'No compatible':'Desactivado')));
  return '<section class="v196-stream-hub '+(floatOn?'is-floating-enabled':'')+'" data-v196-stream-hub data-match-key="'+esc(c.key)+'">'+
    '<header class="v196-event-card">'+
      '<div class="v196-event-top"><span class="v196-dot '+(st.live?'live':'')+'"></span><span><small>'+esc(st.label)+'</small><b>'+esc(c.home)+' vs '+esc(c.away)+'</b></span><em>'+esc(st.sub)+'</em></div>'+
      '<div class="v196-event-meta"><span>'+esc(c.category)+'</span><span>'+esc(c.meta[0]||'')+'</span><span>'+esc(c.meta[1]||'')+'</span></div>'+
    '</header>'+
    '<div class="v196-toolbar">'+
      '<button type="button" data-v196-events><span>▤</span><b>Partidos</b><small>Categorías</small></button>'+
      '<button type="button" data-v196-sources><span>☷</span><b>Fuentes</b><small>'+sourceCount+' disponible'+(sourceCount===1?'':'s')+'</small></button>'+
      '<button type="button" data-v196-network><span>⌁</span><b>Stream</b><small>Enlace de red</small></button>'+
      '<button type="button" data-v196-floating class="'+(floatOn?'active':'')+' '+(current&&!cap.inApp?'unsupported':'')+'"><span>▣</span><b>Flotante</b><small>'+floatLabel+'</small></button>'+
      '<button type="button" data-v196-settings><span>⚙</span><b>Ajustes</b><small>Reproducción</small></button>'+
    '</div>'+
    (list.length>1?'<div class="v196-source-rail">'+list.map((x,i)=>sourceButton(x,i,current)).join('')+'</div>':'')+
    '<section class="v196-player-card '+(floatOn?'floating-ready':'')+'" data-v196-player-card>'+
      '<div class="v196-player-head"><span><small>'+(st.live?'REPRODUCIENDO EN VIVO':st.key==='final'?'REPETICIÓN / RESUMEN':'TRANSMISIÓN PREPARADA')+'</small><b>'+esc(current?.name||s?.source?.name||'Liga Juventino Live')+'</b></span><div><button type="button" data-v196-multi title="Múltiples transmisiones">+'+Math.max(0,sourceCount-1)+'</button>'+(cap.pip?'<button type="button" data-v196-pip title="Picture-in-Picture">PiP</button>':'')+'<button type="button" data-v196-close-float title="Cerrar flotante">×</button></div></div>'+
      playerHtml(c,s,st,current)+
      '<footer><span>'+(st.live?'El partido está marcado en vivo.':st.key==='final'?'El partido ya terminó. Puedes conservar la repetición vinculada.':'La fuente queda preparada y no se marca EN VIVO hasta que el partido realmente inicie.')+'</span><div><button type="button" data-v196-add>+ Fuente</button>'+(cap.pip?'<button type="button" data-v196-pip>PiP</button>':'')+(current?'<button type="button" data-v196-open="'+esc(current.url)+'">Abrir</button>':'')+'</div></footer>'+
    '</section>'+
  '</section>';
}
function modalShell(cls,title,body){
  $('.v196-modal').forEach(x=>x.remove());
  const w=document.createElement('div');w.innerHTML='<div class="v196-modal '+cls+'"><button class="v196-backdrop" data-v196-close></button><section><header><span><small>LIVE CENTER</small><b>'+esc(title)+'</b></span><button type="button" data-v196-close>×</button></header>'+body+'</section></div>';
  const m=w.firstElementChild;document.body.appendChild(m);
  $$('[data-v196-close]',m).forEach(b=>b.onclick=()=>m.remove());
  return m;
}
function addSourceModal(c,preset=''){
  const body='<label><span>Nombre de la fuente</span><input data-v196-name value="'+esc(preset||'')+'" placeholder="Liga Juventino TV"></label>'+
    '<label><span>Enlace de transmisión</span><input data-v196-url inputmode="url" placeholder="https://..."></label>'+
    '<div class="v196-modal-actions"><button type="button" data-v196-test>Probar enlace</button><button type="button" class="primary" data-v196-save-source>Guardar fuente</button></div>'+
    '<p>Admite enlaces de YouTube, Facebook, TikTok y archivos de video web. Otras fuentes se abrirán externamente.</p>';
  const m=modalShell('source','Vincular transmisión',body);
  $('[data-v196-test]',m).onclick=()=>openExternal($('[data-v196-url]',m).value);
  $('[data-v196-save-source]',m).onclick=()=>{
    const url=safeUrl($('[data-v196-url]',m).value);if(!url){flash('Escribe un enlace válido https://');return}
    const name=$('[data-v196-name]',m).value.trim()||provider(url).name;
    const s=liveState(c),list=streamList(c,s);
    const old=list.find(x=>x.url===url);
    if(old){old.name=name}else list.push({id:'s'+Date.now(),name,url,addedAt:Date.now()});
    saveList(c,list);setCurrentSource(c,{name,url});m.remove();schedule(20);
  };
}
function eventsModal(c){
  const select=$('[data-v92-match-select]',c.root);
  if(!select)return;
  const options=Array.from(select.options).map(o=>({
    value:o.value,
    text:o.textContent.trim(),
    category:o.textContent.split('·')[0]?.trim()||'Liga',
    current:o.value===select.value
  }));
  const cats=[...new Set(options.map(x=>x.category))];
  const currentOpt=options.find(x=>x.current);
  const initial=(currentOpt?.category&&cats.includes(currentOpt.category))?currentOpt.category:(cats.includes(c.category)?c.category:'all');
  const rows=options.map((x,i)=>'<button type="button" class="v196-event-row '+(x.current?'active':'')+'" data-v196-event-choice="'+i+'" data-v196-event-cat="'+esc(x.category)+'"><span><small>'+esc(x.category)+'</small><b>'+esc(x.text.replace(x.category+' · ','').replace(x.category+'·',''))+'</b></span><em>'+(x.current?'ACTUAL':'ABRIR')+'</em></button>').join('');
  const chips='<div class="v196-event-cats"><button type="button" class="'+(initial==='all'?'active':'')+'" data-v196-event-filter="all">Todas</button>'+cats.map(x=>'<button type="button" class="'+(initial===x?'active':'')+'" data-v196-event-filter="'+esc(x)+'">'+esc(x)+'</button>').join('')+'</div>';
  const m=modalShell('events','Partidos y categorías',chips+'<div class="v196-event-list">'+rows+'</div>');
  const applyFilter=cat=>{
    Array.from(m.querySelectorAll('[data-v196-event-filter]')).forEach(x=>x.classList.toggle('active',x.dataset.v196EventFilter===cat));
    Array.from(m.querySelectorAll('[data-v196-event-choice]')).forEach(row=>row.hidden=cat!=='all'&&row.dataset.v196EventCat!==cat);
  };
  applyFilter(initial);
  Array.from(m.querySelectorAll('[data-v196-event-filter]')).forEach(b=>b.onclick=()=>applyFilter(b.dataset.v196EventFilter));
  Array.from(m.querySelectorAll('[data-v196-event-choice]')).forEach(b=>b.onclick=()=>{
    const item=options[Number(b.dataset.v196EventChoice)];if(!item)return;
    select.value=item.value;
    select.dispatchEvent(new Event('change',{bubbles:true}));
    m.remove();
  });
}
function sourcesModal(c){
  const s=liveState(c),list=streamList(c,s),current=safeUrl(s.source?.url);
  const rows=list.length?list.map((x,i)=>{
    const p=provider(x.url),on=x.url===current;
    return '<article class="v196-source-row '+(on?'active':'')+'"><em>'+esc(p.icon)+'</em><span><b>'+esc(x.name||p.name)+'</b><small>'+esc(p.name)+(on?' · EN USO':'')+'</small></span><button type="button" data-v196-use="'+i+'">'+(on?'Activa':'Usar')+'</button><button type="button" class="trash" data-v196-delete="'+i+'">×</button></article>';
  }).join(''):'<div class="v196-modal-empty">Todavía no hay fuentes guardadas para este partido.</div>';
  const m=modalShell('sources','Múltiples transmisiones','<p class="v196-modal-intro">Elige la fuente que quieres usar en el Match Center.</p><div class="v196-source-list">'+rows+'</div><button type="button" class="v196-wide" data-v196-add>+ Agregar otra fuente</button>');
  $$('[data-v196-use]',m).forEach(b=>b.onclick=()=>{const item=list[Number(b.dataset.v196Use)];if(item){setCurrentSource(c,item);m.remove()}});
  $$('[data-v196-delete]',m).forEach(b=>b.onclick=()=>{const i=Number(b.dataset.v196Delete);const next=list.filter((_,n)=>n!==i);saveList(c,next);m.remove();sourcesModal(c);schedule(20)});
  $('[data-v196-add]',m)?.addEventListener('click',()=>{m.remove();addSourceModal(c)});
}
function setFloating(enabled,node){
  const cfg=settings();cfg.floating=!!enabled;saveSettings(cfg);
  const hub=node||$('[data-v196-stream-hub]');
  const btn=hub&&$('[data-v196-floating]',hub);
  if(btn){
    btn.classList.toggle('active',!!enabled);
    btn.querySelector('small')&&(btn.querySelector('small').textContent=enabled?'Activo':'Desactivado');
  }
  if(enabled){
    if(hub)ensureFloatingPortal(hub);
    document.body.classList.add('v196-floating-player');
  }else{
    removeFloatingPortal();
  }
  lastSig='';
}
async function disableFloating(node){
  setFloating(false,node);
  await exitPiP();
}
async function toggleFloating(c,node){
  const s=liveState(c),list=streamList(c,s);
  if(!list.length){
    flash('Primero vincula una transmisión para usar el modo flotante');
    addSourceModal(c);
    return;
  }
  const current=list.find(x=>x.url===safeUrl(s?.source?.url))||list[0]||null;
  const cap=floatingCapability(current,settings());
  const next=!settings().floating;
  if(!next){await disableFloating(node);return}

  const cfg=settings();
  cfg.floating=true;
  saveSettings(cfg);

  const btn=$('[data-v196-floating]',node);
  if(btn){
    btn.classList.add('active');
    const small=btn.querySelector('small');
    if(small)small.textContent='Activando…';
  }

  /* V527: Chrome Android usa su flujo nativo más estable:
     pantalla completa -> botón Inicio -> Picture-in-Picture de Android. */
  if(isAndroidChrome()){
    const handoff=await requestAndroidChromeFullscreen(node);
    if(handoff){
      document.body.classList.add('v196-floating-player');
      return;
    }
  }

  let systemFloat=false;
  if(cap.pip)systemFloat=await requestPiP(node);
  if(!systemFloat&&cap.docPip&&!isAndroidChrome())systemFloat=await requestDocumentPiP(node);

  if(systemFloat){
    systemPiPActive=true;
    document.body.classList.add('v196-floating-player');
    if(btn?.querySelector('small'))btn.querySelector('small').textContent='Fuera de la app';
    return;
  }

  if(!cap.inApp){
    cfg.floating=false;saveSettings(cfg);
    if(btn){
      btn.classList.remove('active');
      const small=btn.querySelector('small');if(small)small.textContent='No compatible';
    }
    flash('Esta fuente no permite PiP desde Chrome. Usa una fuente de video directo o el PiP del proveedor.');
    return;
  }

  setFloating(true,node);
  flash('Flotante activo dentro de la página.');
}
function settingsModal(c){
  const cfg=settings();
  const body='<div class="v196-setting-row"><span><b>Reproductor flotante</b><small>Mantiene el video visible al desplazarte por el Match Center.</small></span><button type="button" class="v196-toggle '+(cfg.floating?'on':'')+'" data-v196-toggle-float><i></i></button></div>'+
    '<div class="v196-setting-row"><span><b>Modo de datos reducidos</b><small>Evita autoplay y carga solo lo necesario.</small></span><button type="button" class="v196-toggle '+(cfg.lowQuality?'on':'')+'" data-v196-toggle-low><i></i></button></div>'+
    '<label><span>Render del reproductor</span><select data-v196-render><option value="auto">Automático</option><option value="inline">Dentro del Match Center</option><option value="external">Abrir proveedor</option></select></label>'+
    '<button type="button" class="v196-wide" data-v196-close>Guardar y cerrar</button>';
  const m=modalShell('settings','Ajustes de reproducción',body);
  $('[data-v196-render]',m).value=cfg.render||'auto';
  $('[data-v196-toggle-float]',m).onclick=()=>{
    const s=liveState(c),list=streamList(c,s);
    if(!list.length){m.remove();flash('Vincula una transmisión antes de activar el modo flotante');addSourceModal(c);return}
    const current=list.find(x=>x.url===safeUrl(s?.source?.url))||list[0]||null;
    const cap=floatingCapability(current,cfg);
    if(!cap.inApp){cfg.floating=false;saveSettings(cfg);$('[data-v196-toggle-float]',m).classList.remove('on');flash('La fuente actual no permite modo flotante.');return}
    const hub=$('[data-v196-stream-hub]',c.root);
    if(cfg.floating){
      cfg.floating=false;saveSettings(cfg);
      $('[data-v196-toggle-float]',m).classList.remove('on');
      disableFloating(hub);
    }else{
      m.remove();
      toggleFloating(c,hub);
    }
  };
  $('[data-v196-toggle-low]',m).onclick=()=>{
    cfg.lowQuality=!cfg.lowQuality;saveSettings(cfg);
    $('[data-v196-toggle-low]',m).classList.toggle('on',cfg.lowQuality);
    lastSig='';schedule(10);
  };
  $('[data-v196-render]',m).onchange=e=>{cfg.render=e.target.value;saveSettings(cfg);lastSig='';schedule(10);flash('Ajuste de reproducción guardado')};
}
function bind(c,node){
  const s=liveState(c),list=streamList(c,s);
  const stop=e=>{e?.preventDefault?.();e?.stopPropagation?.()};
  $$('[data-v196-open]',node).forEach(b=>b.onclick=e=>{stop(e);openExternal(b.dataset.v196Open)});
  $$('[data-v196-add]',node).forEach(b=>b.onclick=e=>{stop(e);addSourceModal(c)});
  $('[data-v196-events]',node)?.addEventListener('click',e=>{stop(e);eventsModal(c)});
  $('[data-v196-sources]',node)?.addEventListener('click',e=>{stop(e);sourcesModal(c)});
  $('[data-v196-multi]',node)?.addEventListener('click',e=>{stop(e);sourcesModal(c)});
  $('[data-v196-network]',node)?.addEventListener('click',e=>{stop(e);addSourceModal(c,'Stream de red')});
  $('[data-v196-settings]',node)?.addEventListener('click',e=>{stop(e);settingsModal(c)});
  $('[data-v196-floating]',node)?.addEventListener('click',e=>{stop(e);toggleFloating(c,node)});
  Array.from(node.querySelectorAll('[data-v196-pip]')).forEach(b=>b.addEventListener('click',e=>{stop(e);if(isAndroidChrome())requestAndroidChromeFullscreen(node);else requestPiP(node)}));
  Array.from(node.querySelectorAll('[data-v196-source]')).forEach(b=>b.onclick=()=>{const item=list[Number(b.dataset.v196Source)];if(item){setFloating(false,node);setCurrentSource(c,item)}});
  $('[data-v196-close-float]',node)?.addEventListener('click',e=>{stop(e);disableFloating(node)});
}
function applyFloating(node){
  const cfg=settings(),card=$('[data-v196-player-card]',node),c=ctx();
  if(!card&&!floatingCardNode)return;
  let enabled=!!cfg.floating;

  if(document.pictureInPictureElement||systemPiPActive){
    systemPiPActive=true;
    document.body.classList.add('v196-floating-player');
    return;
  }

  if(c){
    const s=liveState(c),list=streamList(c,s),current=list.find(x=>x.url===safeUrl(s?.source?.url))||list[0]||null;
    if(!floatingCapability(current,cfg).inApp&&enabled){enabled=false;cfg.floating=false;saveSettings(cfg)}
  }
  if(enabled){
    if(card)ensureFloatingPortal(node);
    document.body.classList.add('v196-floating-player');
  }else{
    if(card)card.classList.remove('is-floating','is-detached');
    if(floatingPortal)removeFloatingPortal();
  }
}
function render(){
  if(!ROUTES.has(route())){
    $$('.v196-modal').forEach(x=>x.remove());
    if(document.pictureInPictureElement||systemPiPActive){
      document.body.classList.add('v196-floating-player');
      return;
    }
    if(settings().floating&&floatingPortal?.isConnected){
      document.body.classList.add('v196-floating-player');
      return;
    }
    document.body.classList.remove('v196-floating-player');
    if(floatingPortal)removeFloatingPortal();
    return;
  }
  const c=ctx();if(!c)return;
  const existing=$('[data-v196-stream-hub]',c.root);
  if((document.pictureInPictureElement||systemPiPActive)&&existing){
    applyFloating(existing);
    return;
  }
  const s=liveState(c),list=streamList(c,s),cfg=settings(),st=statusInfo(c,s);
  const sig=[c.key,s.phase,s.source?.url||'',s.source?.name||'',list.map(x=>x.url).join('|'),cfg.floating,cfg.lowQuality,cfg.render,st.key].join('::');
  let old=$('[data-v196-stream-hub]',c.root);
  if(old&&old.dataset.matchKey!==c.key){old.remove();old=null}
  if(old&&sig===lastSig){applyFloating(old);return}
  lastSig=sig;
  const w=document.createElement('div');w.innerHTML=hubHtml(c,s);const node=w.firstElementChild;
  if(cfg.floating&&floatingPortal?.isConnected){
    node.querySelector('[data-v196-player-card]')?.remove();
  }
  const liveAnchor=$('[data-v144-live-hub]',c.root);
  const metaAnchor=$('.v92-official-meta',c.root)||$('.v92-score-card',c.root)||$('.v420-match-panel',c.root);
  if(old)old.replaceWith(node);
  else if(liveAnchor)liveAnchor.insertAdjacentElement('beforebegin',node);
  else if(metaAnchor)metaAnchor.insertAdjacentElement('afterend',node);
  else c.root.prepend(node);
  bind(c,node);applyFloating(node);
}
function schedule(ms=80){clearTimeout(timer);timer=setTimeout(render,ms)}

/* V527 Android Chrome lifecycle: no reconstruir el reproductor durante
   la transición fullscreen -> Inicio -> PiP. */
document.addEventListener('enterpictureinpicture',()=>{
  systemPiPActive=true;
  androidFullscreenHandoff=false;
  const b=document.querySelector('[data-v196-floating] small');
  if(b)b.textContent='Fuera de la app';
},true);
document.addEventListener('leavepictureinpicture',()=>{
  systemPiPActive=false;
},true);
document.addEventListener('fullscreenchange',()=>{
  if(document.fullscreenElement)return;
  if(document.visibilityState==='hidden'&&androidFullscreenHandoff)return;
  if(!document.pictureInPictureElement){
    androidFullscreenHandoff=false;
    const b=document.querySelector('[data-v196-floating] small');
    if(b&&settings().floating)b.textContent='Activo';
  }
});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='hidden'&&androidFullscreenHandoff){
    /* Chrome Android se encarga de convertir el video fullscreen a PiP. */
    return;
  }
  if(document.visibilityState==='visible'&&document.pictureInPictureElement){
    systemPiPActive=true;
    androidFullscreenHandoff=false;
  }
});
window.addEventListener('hashchange',()=>schedule(20));
window.addEventListener('storage',e=>{if(e.key?.startsWith(LIVE_KEY)||e.key?.startsWith(LIST_KEY)||e.key===SETTINGS_KEY)schedule(20)});
window.addEventListener('ljr:match-live-feed',()=>schedule(20));
document.addEventListener('change',e=>{if(e.target.matches?.('[data-v92-match-select]'))setTimeout(()=>{lastSig='';schedule(20)},80)},true);
const screen=$('#screen');
if(screen)new MutationObserver(()=>{if(ROUTES.has(route()))schedule(60)}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});else schedule(100);

window.LJR_STREAM_CENTER={
  addSource(url,name){
    const c=ctx(),u=safeUrl(url);if(!c||!u)return false;
    const s=liveState(c),list=streamList(c,s);list.push({id:'api'+Date.now(),name:name||provider(u).name,url:u,addedAt:Date.now()});saveList(c,list);setCurrentSource(c,list[list.length-1]);return true;
  },
  openSources(){const c=ctx();if(c)sourcesModal(c)},
  getSources(){const c=ctx();return c?streamList(c,liveState(c)):[]},
  enableFloating(){const c=ctx(),node=$('[data-v196-stream-hub]');if(c&&node)toggleFloating(c,node)},
  disableFloating(){disableFloating($('[data-v196-stream-hub]'))}
};
})();