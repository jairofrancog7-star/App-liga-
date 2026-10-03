/* Public media and server-authorized editing. No role is trusted from local storage. */
(()=>{
const base=window.LJR_MEDIA_BASE||location.origin,key='liga-media-session',e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let token='';try{token=localStorage.getItem(key)||sessionStorage.getItem(key)||''}catch{}let admin=null,items=[],busy=false,authReady=false,authRestore=null;const rememberKey='liga-media-remembered-until',THIRTY_DAYS=30*24*60*60*1000;
async function api(path,options={}){const headers=new Headers(options.headers);if(token&&!headers.has('Authorization'))headers.set('Authorization','Bearer '+token);if(options.body&&typeof options.body==='object'&&!(options.body instanceof Blob)&&!(options.body instanceof ArrayBuffer)){options.body=JSON.stringify(options.body);headers.set('Content-Type','application/json')}const r=await fetch(base+'/api/'+path,{...options,headers});const result=await r.json();if(!r.ok)throw Object.assign(Error(result.error||'No se pudo conectar'),{status:r.status});return result}
function setAdmin(value){admin=value;document.body.classList.toggle('liga-editor',!!admin);window.dispatchEvent(new CustomEvent('liga:admin',{detail:{admin}}));mount()}
function message(text){const n=document.createElement('div');n.className='liga-media-toast';n.textContent=text;document.body.append(n);setTimeout(()=>n.remove(),4500)}
function modal(title,body){const n=document.createElement('div');n.className='liga-media-modal';n.innerHTML='<section role="dialog" aria-modal="true" aria-label="'+e(title)+'"><header><h2>'+e(title)+'</h2><button data-close aria-label="Cerrar">×</button></header>'+body+'<p role="status" data-status></p></section>';document.body.append(n);let closed=false;const close=()=>{if(closed)return;closed=true;n.dispatchEvent(new Event('media-close'));n.remove()};n.querySelector('[data-close]').onclick=close;n.addEventListener('click',ev=>{if(ev.target===n)close()});const esc=ev=>{if(ev.key==='Escape')close()};document.addEventListener('keydown',esc);n.addEventListener('media-close',()=>document.removeEventListener('keydown',esc),{once:true});return n}
function deviceInfo(){let id=localStorage.getItem('liga-admin-device');if(!id){id=crypto.randomUUID();localStorage.setItem('liga-admin-device',id)}return {device:id,label:(navigator.userAgentData?.platform||navigator.platform||'Dispositivo')+' · '+(window.LJR_ADMIN_BIOMETRIC?'App Android':'Navegador')}}
function rememberedUntil(){try{return Number(localStorage.getItem(rememberKey)||0)}catch{return 0}}
function deviceRemembered(){return rememberedUntil()>Date.now()&&!!token}
function saveSession(nextToken,remember){
 token=String(nextToken||'').trim();
 try{
  localStorage.removeItem(key);sessionStorage.removeItem(key);
  if(remember){
   localStorage.setItem(key,token);
   localStorage.setItem(rememberKey,String(Date.now()+THIRTY_DAYS));
  }else{
   localStorage.removeItem(rememberKey);
   sessionStorage.setItem(key,token);
  }
 }catch{}
}
function clearSession(clearBiometric=true){
 token='';admin=null;authReady=true;
 try{localStorage.removeItem(key);sessionStorage.removeItem(key);localStorage.removeItem(rememberKey)}catch{}
 if(clearBiometric)window.LJR_ADMIN_BIOMETRIC?.clearSession?.().catch(()=>{});
}
async function restoreAdminSession(){
 if(admin){authReady=true;return admin}
 if(authRestore)return authRestore;
 authRestore=(async()=>{
  if(!token){authReady=true;setAdmin(null);return null}
  try{
   const r=await api('me');
   if(r?.admin){setAdmin(r.admin);authReady=true;return r.admin}
   authReady=true;setAdmin(null);return null;
  }catch(err){
   authReady=true;
   /* Sólo olvidar el dispositivo cuando el servidor realmente invalida la sesión.
      Un fallo de red no debe sacar al presidente ni volver a pedir contraseña. */
   if(err?.status===401||err?.status===403){
    clearSession(true);setAdmin(null);return null;
   }
   console.warn('Sesión de administración conservada:',err?.message||err);
   throw err;
  }finally{authRestore=null}
 })();
 return authRestore;
}
async function ensureAdmin(){
 if(admin)return admin;
 try{return await restoreAdminSession()}
 catch(err){message('No se pudo verificar el dispositivo guardado. Revisa la conexión.');return null}
}

async function login(){
 const already=$('.liga-media-modal').find(x=>x.querySelector('section[aria-label="Administración"]'));if(already)return already;
 const bio=window.LJR_ADMIN_BIOMETRIC;
 let localAccount=null;try{localAccount=window.LJR_V569_AUTH?.currentAccount?.()||null}catch{}
 const phone=String(localAccount?.phone||'').replace(/\D/g,'').replace(/^52(?=\d{10}$)/,'');
 const preferredUser=phone||'presidente';
 const n=modal('Administración','<p>Entra con tu teléfono autorizado o con el usuario del presidente.</p><form><label>Usuario o teléfono<input name="username" required autocomplete="username" inputmode="tel" value="'+e(preferredUser)+'"></label><label>Contraseña<input name="password" type="password" required autocomplete="current-password"></label><label class="liga-remember"><input type="checkbox" name="remember" checked> Recordar este dispositivo · 30 días</label><button type="submit">Entrar</button></form><button type="button" data-bio '+(bio?'hidden':'')+'>Entrar con huella</button><p><a href="'+e(base)+'/admin-setup" target="_blank" rel="noopener">Configurar acceso del presidente</a></p><small data-login-hint>'+(phone?'Teléfono detectado de tu cuenta.':'Usuario del presidente detectado: presidente.')+'</small>');
 const status=n.querySelector('[data-status]'),user=n.querySelector('input[name="username"]');
 const bioButton=n.querySelector('[data-bio]');
 if(bio)bio.hasSession().then(r=>{bioButton.hidden=!r.saved}).catch(()=>{});
 else if(window.LJR_V620_ADMIN_ACCESS?.remembered?.())bioButton.hidden=false;
 bioButton?.addEventListener('click',async()=>{try{
   if(bio){
     const saved=await bio.unlockSession();token=saved.token;const r=await api('me');setAdmin(r.admin);n.querySelector('[data-close]').click();manage();return;
   }
   await window.LJR_V620_ADMIN_ACCESS?.unlockBiometric?.();
   if(window.LJR_MEDIA?.admin){n.querySelector('[data-close]').click();manage()}
 }catch(err){token='';status.textContent=err.message||'Vuelve a entrar con tu contraseña.'}});
 n.querySelector('form').onsubmit=async ev=>{ev.preventDefault();const b=Object.fromEntries(new FormData(ev.target));b.remember=b.remember==='on';
   const raw=String(b.username||'').trim();
   const localEmail=String(localAccount?.email||'').trim().toLowerCase();
   if(raw.includes('@')&&localEmail&&raw.toLowerCase()===localEmail)b.username=phone||'presidente';
   else if(/^\+?[\d\s()-]{8,}$/.test(raw)){const p=raw.replace(/\D/g,'').replace(/^52(?=\d{10}$)/,'');b.username=p||raw}
   Object.assign(b,deviceInfo());try{
 const r=await api('login',{method:'POST',body:b});
 saveSession(r.token,b.remember);
 if(b.remember&&bio){try{await bio.storeSession({token});status.textContent='Dispositivo recordado · huella activa.'}catch(err){message('Dispositivo recordado. No se pudo activar la huella: '+err.message)}}
 setAdmin(r.admin);authReady=true;
 try{
   if(b.remember&&!bio&&window.LJR_V620_ADMIN_ACCESS?.enrollBiometric)await window.LJR_V620_ADMIN_ACCESS.enrollBiometric();
 }catch(err){message('Sesión iniciada. Huella pendiente: '+(err?.message||'no disponible'))}
 n.querySelector('[data-close]').click();manage();
 }catch(err){
   status.textContent=err.message==='Usuario o contraseña incorrectos.'
     ?'Usuario o contraseña incorrectos. Usa tu teléfono autorizado o el usuario presidente.'
     :err.message
 }}
}

async function manage(){if(!admin){await ensureAdmin();if(!admin)return login()}const n=modal('Administración de la Liga','<p>'+e(admin.name)+'</p><div class="liga-media-actions"><button data-edit>Publicar historia, foto o video</button><button data-live>Transmitir desde el teléfono</button></div><div class="liga-media-actions"><button data-password>Cambiar contraseña</button><button data-devices>Mis dispositivos</button><button data-posts>Mis publicaciones</button><button data-logout>Cerrar sesión</button></div>'+(admin.owner?'<h3>Accesos autorizados · máximo seis</h3><div data-users></div><form><label>Nombre<input name="name" required maxlength="80"></label><label>Usuario<input name="username" required pattern="[a-z0-9._-]{3,40}"></label><label>Teléfono con código de país<input name="phone" type="tel" autocomplete="tel"></label><label>Contraseña inicial<input name="password" type="password" required minlength="12" autocomplete="new-password"></label><button>Añadir administrador</button></form>':''));n.querySelector('[data-devices]').onclick=devices;n.querySelector('[data-posts]').onclick=publications;n.querySelector('[data-edit]').onclick=edit;n.querySelector('[data-live]').onclick=broadcast;const status=n.querySelector('[data-status]');n.querySelector('[data-logout]').onclick=async()=>{try{await api('logout',{method:'POST'})}finally{clearSession(true);setAdmin(null);n.querySelector('[data-close]').click()}};n.querySelector('[data-password]').onclick=()=>{const d=modal('Cambiar contraseña','<form><label>Nueva contraseña<input type="password" name="password" required minlength="12" autocomplete="new-password"></label><button>Guardar y volver a entrar</button></form>');d.querySelector('form').onsubmit=async ev=>{ev.preventDefault();try{await api('password',{method:'POST',body:Object.fromEntries(new FormData(ev.target))});token='';localStorage.removeItem(key);sessionStorage.removeItem(key);window.LJR_ADMIN_BIOMETRIC?.clearSession().catch(()=>{});setAdmin(null);d.querySelector('[data-close]').click();n.querySelector('[data-close]').click();login()}catch(err){d.querySelector('[data-status]').textContent=err.message}}};if(admin.owner){async function users(){const r=await api('admins');n.querySelector('[data-users]').innerHTML=r.admins.filter(a=>a.active).map(a=>'<div class="liga-user">'+e(a.name)+' · '+e(a.username)+(a.owner?' · Presidente':' <button data-revoke="'+e(a.id)+'">Revocar</button>')+'</div>').join('');n.querySelectorAll('[data-revoke]').forEach(b=>b.onclick=async()=>{try{await api('admins/'+b.dataset.revoke,{method:'DELETE'});await users()}catch(err){status.textContent=err.message}})}users().catch(err=>status.textContent=err.message);n.querySelector('form').onsubmit=async ev=>{ev.preventDefault();try{await api('admins',{method:'POST',body:Object.fromEntries(new FormData(ev.target))});ev.target.reset();await users();status.textContent='Administrador creado.'}catch(err){status.textContent=err.message}}}}
async function publications(){if(!admin){await ensureAdmin();if(!admin)return login()}const n=modal('Publicaciones de la Liga','<div data-post-list></div>');const r=await api('media');n.querySelector('[data-post-list]').innerHTML=r.items.map(x=>'<div class="liga-user"><b>'+e(x.title)+'</b><small> · '+(x.kind==='story'?'Historia de 24 horas':x.kind==='photo'?'Fotografía':'Video')+'</small><button data-delete="'+e(x.id)+'">Retirar</button></div>').join('')||'<p>No hay publicaciones activas.</p>';n.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{try{await api('media/'+b.dataset.delete,{method:'DELETE'});b.closest('.liga-user').remove();await refresh()}catch(err){n.querySelector('[data-status]').textContent=err.message}})}

async function devices(){if(!admin){await ensureAdmin();if(!admin)return login()}const n=modal('Mis dispositivos','<div data-devices-list>Cargando…</div>');try{const r=await api('devices');n.querySelector('[data-devices-list]').innerHTML=r.devices.map(d=>'<div class="liga-user"><b>'+e(d.label)+'</b><small> · '+e(new Date(d.created||Date.now()).toLocaleDateString('es-MX'))+'</small><button data-device-revoke="'+e(d.id)+'">Cerrar sesión</button></div>').join('');n.querySelectorAll('[data-device-revoke]').forEach(b=>b.onclick=async()=>{try{await api('devices/'+b.dataset.deviceRevoke,{method:'DELETE'});b.closest('.liga-user').remove();await api('me')}catch(err){if(err.status===401){clearSession(true);setAdmin(null);n.querySelector('[data-close]').click()}else n.querySelector('[data-status]').textContent=err.message}})}catch(err){n.querySelector('[data-status]').textContent=err.message}}

async function edit(subject='',placement='all'){subject=typeof subject==='string'?subject:'';if(!admin){await ensureAdmin();if(!admin)return login()}const n=modal('Publicar en la Liga','<form><label>Título<input name="title" required maxlength="160"></label><label>Círculo, equipo o jugador (opcional)<input name="subject" maxlength="100" value="'+e(subject)+'" placeholder="Ejemplo: Promesas FC"></label><label>Contenido<select name="kind"><option value="story">Historia · 24 horas</option><option value="video">Video o repetición</option><option value="photo">Fotografía</option></select></label><label>Categoría<select name="category"><option value="all">Todas las categorías</option><option value="3">Primera Fuerza · Dominical abierta</option><option value="5">Intermedia · Dominical abierta</option><option value="4">Segunda Fuerza · Dominical abierta</option><option value="2">Veteranos 35 · Sábado por la tarde</option><option value="1">Veteranos 50 · Sábado por la tarde</option></select></label><label>Mostrar en<select name="placement"><option value="all">Todas las secciones</option><option value="home">Inicio</option><option value="video">Videos</option><option value="history">Historia de la Liga</option><option value="moments">Momentos</option><option value="performance">Performance Zone</option></select></label><label>Foto o video<input name="file" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" required></label><small>Hasta 25 MB. Las historias caducan después de 24 horas.</small><button type="submit">Publicar</button></form>');n.querySelector('form').onsubmit=async ev=>{ev.preventDefault();const form=ev.target,button=form.querySelector('button'),status=n.querySelector('[data-status]'),b=Object.fromEntries(new FormData(form)),file=b.file;if(file.size>26214400){status.textContent='El archivo supera los 25 MB.';return}button.disabled=true;status.textContent='Subiendo archivo…';try{const draft=await api('media',{method:'POST',body:{title:b.title,kind:b.kind,category:b.category,placement:b.placement,mime:file.type,subject:b.subject}});await api('media/'+draft.id,{method:'PUT',headers:{'Content-Type':file.type,'X-File-Size':String(file.size)},body:file});await refresh();n.querySelector('[data-close]').click();message('Contenido publicado.')}catch(err){status.textContent=err.message}finally{button.disabled=false}}}
function view(item){const url=base+'/api/file/'+item.id,n=modal(item.title,item.mime.startsWith('video/')?'<video controls autoplay playsinline src="'+e(url)+'"></video>':'<img class="liga-story-picture" src="'+e(url)+'" alt="'+e(item.title)+'">');if(item.kind==='story'){const next=items.filter(x=>x.kind==='story'),idx=next.indexOf(item),row=document.createElement('div');row.className='liga-media-actions';for(const [label,step]of[['Anterior',-1],['Siguiente',1]]){const b=document.createElement('button');b.textContent=label;b.disabled=!next[idx+step];b.onclick=()=>{n.querySelector('[data-close]').click();view(next[idx+step])};row.append(b)}n.querySelector('section').append(row)}n.addEventListener('media-close',()=>n.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load()}),{once:true})}
let renderSig='';function mount(){
 const route=(location.hash.replace(/^#\/?/,'')||'home').split('?')[0],standalone=!!document.querySelector('[data-media-page]');
 const places={home:'home',video:'video',history:'history',moments:'moments','safe-performance':'performance',performance:'performance',stats:'performance'};
 const place=standalone?'all':places[route];let root=document.querySelector('[data-liga-media]');
 const target=document.querySelector('[data-media-page]')||document.querySelector('#screen');if(!target)return;
 const category=String(window.LJR_STATE?.categoryId||window.LJR?.state?.categoryId||localStorage.getItem('v62-category')||'all');
 const list=items.filter(x=>(!x.expires||x.expires>Date.now())&&(place==='all'||x.placement===place||x.placement==='all')&&(category==='all'||x.category==='all'||x.category===category));
 if(!place||(!list.length&&!standalone)){root?.remove();renderSig='';return}
 const sig=JSON.stringify([place,admin?.id,category,list]);if(root&&renderSig===sig)return;renderSig=sig;
 if(!root){root=document.createElement('section');root.dataset.ligaMedia='';root.className='liga-media-feed';target.append(root)}
 const stories=list.filter(x=>x.kind==='story'),videos=list.filter(x=>x.kind!=='story');
 root.innerHTML=(standalone?'<div class="liga-media-actions"><button data-login>Herramientas</button>'+(admin?'<button data-edit>Publicar</button><button data-live>Transmitir</button>':'')+'</div>':'')+
 '<div class="liga-stories" aria-label="Historias de 24 horas">'+stories.map(x=>'<button data-view="'+e(x.id)+'" aria-label="Ver historia: '+e(x.title)+'"><span>'+ (x.mime.startsWith('video/')?'<video muted playsinline preload="metadata" src="'+e(base+'/api/file/'+x.id)+'#t=0.1"></video>':'<img src="'+e(base+'/api/file/'+x.id)+'" alt="">')+'</span><small>'+e(x.title)+'</small></button>').join('')+'</div>'+
 '<div class="liga-media-grid">'+videos.slice(0,18).map(x=>'<article><button data-view="'+e(x.id)+'">'+(x.mime.startsWith('video/')?'<video muted playsinline preload="metadata" src="'+e(base+'/api/file/'+x.id)+'#t=0.1"></video><span class="liga-media-play-icon">▶</span>':'<img loading="lazy" src="'+e(base+'/api/file/'+x.id)+'" alt="">')+'<b>'+e(x.title)+'</b></button>'+'</article>').join('')+'</div>';
 root.querySelector('[data-login]')?.addEventListener('click',manage);root.querySelector('[data-edit]')?.addEventListener('click',edit);root.querySelector('[data-live]')?.addEventListener('click',broadcast);
 root.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(items.find(x=>x.id===b.dataset.view)));
 const rail=target.querySelector('.stories,.v20-stories');if(stories.length){if(rail)rail.insertAdjacentElement('afterend',root);else {const grid=target.querySelector('.v26-moments-grid');if(grid)grid.insertAdjacentElement('beforebegin',root);else target.append(root)}}
}

async function refresh(){try{items=(await api('media')).items;mount()}catch(err){console.warn('Contenido de la Liga:',err.message)}}
async function ice(){return api('ice')}
async function gather(pc){if(pc.iceGatheringState==='complete')return;await new Promise(resolve=>{const done=()=>{if(pc.iceGatheringState==='complete'){clearTimeout(timeout);pc.removeEventListener('icegatheringstatechange',done);resolve()}};const timeout=setTimeout(()=>{pc.removeEventListener('icegatheringstatechange',done);resolve()},8000);pc.addEventListener('icegatheringstatechange',done)})}
async function broadcast(){if(!admin){await ensureAdmin();if(!admin)return login()}const n=modal('Transmitir directamente desde el teléfono','<p>Comparte el enlace para que vean el partido aquí. Este modo conecta la cámara con hasta seis espectadores.</p><label>Título<input data-title value="Liga Juventino en vivo"></label><video controls muted playsinline autoplay></video><div class="liga-media-actions"><button data-start>Iniciar cámara y transmisión</button><button data-stop disabled>Terminar</button></div><div data-link></div><small data-relay></small>');const status=n.querySelector('[data-status]'),video=n.querySelector('video'),peers=new Map();let stream,room,timer,running=false,polling=false,closed=false;
async function stop(){closed=true;clearInterval(timer);peers.forEach(pc=>pc.close());peers.clear();stream?.getTracks().forEach(t=>t.stop());video.srcObject=null;if(room)try{await api('rooms/'+room,{method:'DELETE'})}catch{}room=null;running=false;n.querySelector('[data-stop]').disabled=true;n.querySelector('[data-start]').disabled=false;status.textContent='Transmisión finalizada.'}
n.addEventListener('media-close',stop,{once:true});n.querySelector('[data-stop]').onclick=stop;n.querySelector('[data-start]').onclick=async()=>{if(running)return;closed=false;const start=n.querySelector('[data-start]');start.disabled=true;try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment',width:{ideal:1280},height:{ideal:720}},audio:true});if(closed){stream.getTracks().forEach(t=>t.stop());return}video.srcObject=stream;await video.play();const cfg=await ice(),r=await api('rooms',{method:'POST',body:{title:n.querySelector('[data-title]').value}});room=r.id;running=true;n.querySelector('[data-stop]').disabled=false;const link=base+'/?live='+room;n.querySelector('[data-link]').innerHTML='<a href="'+e(link)+'" target="_blank" rel="noopener">Abrir enlace del directo</a><button data-share>Compartir enlace</button>';n.querySelector('[data-share]').onclick=async()=>{try{if(navigator.share)await navigator.share({title:'Liga Juventino en vivo',url:link});else{await navigator.clipboard.writeText(link);message('Enlace copiado.')}}catch(err){if(err.name!=='AbortError')message(err.message)}};n.querySelector('[data-relay]').textContent=cfg.relayConfigured?'Conexión con servidor de retransmisión disponible.':'Conexión directa entre teléfonos. Algunas redes móviles requieren configurar un servidor de retransmisión para poder conectarse.';status.textContent='Cámara activa. Esperando espectadores…';async function poll(){if(polling||!running)return;polling=true;try{await api('rooms/'+room+'/heartbeat',{method:'POST'});const offers=(await api('rooms/'+room+'/offers')).peers;for(const peer of offers){if(peers.has(peer.id)||peers.size>=6)continue;const pc=new RTCPeerConnection({iceServers:cfg.iceServers});peers.set(peer.id,pc);pc.onconnectionstatechange=()=>{const count=[...peers.values()].filter(p=>p.connectionState==='connected').length;status.textContent=count+' espectadores conectados.';if(['failed','closed','disconnected'].includes(pc.connectionState)){pc.close();peers.delete(peer.id)}};await pc.setRemoteDescription(JSON.parse(peer.offer));stream.getTracks().forEach(track=>pc.addTrack(track,stream));await pc.setLocalDescription(await pc.createAnswer());await gather(pc);if(running)await api('rooms/'+room+'/answer',{method:'POST',body:{id:peer.id,answer:pc.localDescription.toJSON()}})}}catch(err){status.textContent='Problema de conexión: '+err.message}finally{polling=false}}timer=setInterval(poll,3500);poll()}catch(err){stream?.getTracks().forEach(t=>t.stop());status.textContent=err.name==='NotAllowedError'?'Permite el acceso a cámara y micrófono.':err.message;start.disabled=false}}}
async function watch(id){const target=document.querySelector('[data-media-page]');if(!target)return;const root=document.createElement('section');root.className='liga-media-watch';root.innerHTML='<h1>Transmisión de la Liga</h1><video controls playsinline autoplay></video><p role="status">Conectando…</p><div class="liga-media-actions"><button data-audio>Reproducir con sonido</button><button data-pip>PiP</button><button data-cast>Transmitir en TV</button><button data-retry>Reconectar</button></div>';target.prepend(root);const status=root.querySelector('p'),video=root.querySelector('video');let pc,pollTimer,answerTimer,stopped=false;async function start(){pc?.close();clearInterval(pollTimer);clearInterval(answerTimer);stopped=false;try{const room=await api('rooms/'+id);root.querySelector('h1').textContent=room.title;if(!room.active)throw Error('La transmisión no está activa.');const cfg=await ice();pc=new RTCPeerConnection({iceServers:cfg.iceServers});pc.addTransceiver('video',{direction:'recvonly'});pc.addTransceiver('audio',{direction:'recvonly'});pc.ontrack=ev=>{video.srcObject=ev.streams[0]||new MediaStream([ev.track]);video.play().catch(()=>status.textContent='Toca Reproducir con sonido.');status.textContent='En vivo'};pc.onconnectionstatechange=()=>{if(pc.connectionState==='failed')status.textContent='No se pudo conectar entre estas redes. El administrador necesita un servidor de retransmisión.'};await pc.setLocalDescription(await pc.createOffer());await gather(pc);const peer=await api('rooms/'+id+'/offer',{method:'POST',body:{offer:pc.localDescription.toJSON()}});let tries=0;answerTimer=setInterval(async()=>{try{if(stopped)return;const r=await api('rooms/'+id+'/answer?peer='+peer.id,{headers:{Authorization:'Bearer '+peer.token}});if(r.answer){clearInterval(answerTimer);await pc.setRemoteDescription(r.answer)}else if(++tries>20){clearInterval(answerTimer);status.textContent='La cámara no respondió. Toca Reconectar.'}}catch(err){clearInterval(answerTimer);status.textContent=err.message}},2000);pollTimer=setInterval(async()=>{try{const state=await api('rooms/'+id);if(!state.active){status.textContent='La transmisión terminó.';clearInterval(pollTimer);clearInterval(answerTimer);pc.close();video.srcObject=null}}catch(err){status.textContent=err.message}},12000)}catch(err){status.textContent=err.message}}root.querySelector('[data-retry]').onclick=start;root.querySelector('[data-audio]').onclick=()=>{video.muted=false;video.play().catch(err=>status.textContent=err.message)};root.querySelector('[data-pip]').onclick=async()=>{try{await video.requestPictureInPicture()}catch{status.textContent='Este navegador no permite PiP para este video.'}};root.querySelector('[data-cast]').onclick=async()=>{try{if(video.remote?.prompt)await video.remote.prompt();else if(video.webkitShowPlaybackTargetPicker)video.webkitShowPlaybackTargetPicker();else throw Error()}catch{status.textContent='No hay un televisor compatible disponible para esta conexión.'}};window.addEventListener('pagehide',()=>{stopped=true;pc?.close();clearInterval(pollTimer);clearInterval(answerTimer)},{once:true});start()}
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
document.addEventListener('click',event=>{const circle=event.target.closest('.story,.v20-story');if(!circle)return;const label=normalize(circle.querySelector('small')?.textContent);const story=items.find(x=>x.kind==='story'&&x.expires>Date.now()&&x.subject&&normalize(x.subject)===label);if(story){event.preventDefault();event.stopImmediatePropagation();view(story)}},true);
document.addEventListener('contextmenu',event=>{const circle=event.target.closest('.story,.v20-story');if(circle&&admin){event.preventDefault();edit(circle.querySelector('small')?.textContent||'')}});

window.LJR_MEDIA={api,get admin(){return admin},login,manage,edit,broadcast,refresh,base,restoreAdminSession,deviceRemembered};
restoreAdminSession().catch(err=>console.warn('Restauración de administración:',err?.message||err));
refresh();window.addEventListener('hashchange',()=>setTimeout(mount,150));new MutationObserver(()=>mount()).observe(document.querySelector('#screen')||document.querySelector('[data-media-page]')||document.body,{childList:true});setInterval(refresh,60000);const live=new URL(location.href).searchParams.get('live');if(live)watch(live);
})();
