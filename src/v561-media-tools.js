import {Capacitor,registerPlugin} from '@capacitor/core';
const cameraPiP=registerPlugin('LigaPiP');
import {attachPlayerControls} from './v560-stream-player-controls.js';
export function patchKeepingPlayer(old,fresh,selector){
 const player=old.querySelector(selector),replacement=fresh.querySelector(selector);if(!player||!replacement)return false;
 const parent=player.parentElement;if(parent!==old)return false;
 const nodes=[...fresh.children];[...old.children].filter(n=>n!==player).forEach(n=>n.remove());
 let after=false,last=player;for(const child of nodes){if(child===replacement){after=true;continue}if(!after)old.insertBefore(child,player);else{last.after(child);last=child}}
 old.dataset.sig=fresh.dataset.sig||'';return true;
}
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function enableDirectStream(video){
 if(video._ligaHls||video._ligaHlsLoading)return;
 if(!/\.m3u8(?:[?#]|$)/i.test(video.getAttribute('src')||'')||video.canPlayType('application/vnd.apple.mpegurl'))return;
 video._ligaHlsLoading=true;
 try{const {default:Hls}=await import('hls.js');if(!video.isConnected||!Hls.isSupported())return;
 const hls=new Hls({enableWorker:true});video._ligaHls=hls;hls.loadSource(video.src);hls.attachMedia(video);
 hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)video.dispatchEvent(new Event('error'))});
 const observer=new MutationObserver(()=>{if(!video.isConnected){hls.destroy();observer.disconnect()}});observer.observe(document.body,{childList:true,subtree:true});
 }catch{video.dispatchEvent(new Event('error'))}finally{video._ligaHlsLoading=false}
}
export function playbackSettings(card){
 const video=card.querySelector('video'),frame=card.querySelector('iframe');const dialog=document.createElement('dialog');dialog.className='v561-dialog';
 dialog.innerHTML='<form method="dialog"><header><b>Pistas de reproducción</b><button aria-label="Cerrar">×</button></header></form><div class="v561-tabs"><button data-tab="video">Video</button><button data-tab="audio">Audio</button><button data-tab="text">Subtítulos</button></div><div data-tracks></div><button data-apply>Aplicar</button>';
 document.body.append(dialog);dialog.showModal();dialog.addEventListener('close',()=>dialog.remove());let tab='video';const pending={};
 const list=dialog.querySelector('[data-tracks]');function draw(){
 dialog.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
 if(!video){list.innerHTML='<p>El reproductor de '+(/youtube/.test(frame?.src)?'YouTube':/tiktok/.test(frame?.src)?'TikTok':'Facebook')+' controla sus pistas. Abre ⚙ dentro del video para elegir calidad, audio o subtítulos.</p>';return}
 let options=[];
 if(tab==='video')options=[['-1','Automática'],...(video._ligaHls?.levels||[]).map((l,i)=>[String(i),(l.width||'?')+' × '+(l.height||'?')])];
 if(tab==='audio')options=[['sound','Sonido'],['muted','Silencio'],...(video._ligaHls?.audioTracks||[]).map((a,i)=>[String(i),a.name||a.lang||'Audio '+(i+1)])];
 if(tab==='text')options=[['-1','Ninguno'],...(video._ligaHls?.subtitleTracks||[...video.textTracks]).map((t,i)=>[String(i),t.name||t.label||t.lang||t.language||'Subtítulos '+(i+1)])];
 let current=tab==='video'?String(video._ligaHls?.currentLevel??-1):tab==='audio'?(video.muted?'muted':'sound'):String(video._ligaHls?.subtitleTrack??[...video.textTracks].findIndex(t=>t.mode==='showing'));
 list.innerHTML=options.map(([value,label])=>'<label class="v561-track"><span>'+escapeHtml(label)+'</span><input type="radio" name="track" value="'+value+'" '+(value===(pending[tab]??current)?'checked':'')+'></label>').join('');
 list.querySelectorAll('input').forEach(i=>i.onchange=()=>pending[tab]=i.value);
 }
 dialog.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;draw()});
 dialog.querySelector('[data-apply]').onclick=()=>{if(video){if(pending.video!==undefined&&video._ligaHls)video._ligaHls.currentLevel=Number(pending.video);if(pending.audio!==undefined){video.muted=pending.audio==='muted';if(video._ligaHls&&/^\d+$/.test(pending.audio))video._ligaHls.audioTrack=Number(pending.audio)}if(pending.text!==undefined){if(video._ligaHls)video._ligaHls.subtitleTrack=Number(pending.text);else[...video.textTracks].forEach((t,i)=>t.mode=i===Number(pending.text)?'showing':'disabled')}}dialog.close()};draw();
}
let cameraStream,peer,recording,recorded=[],resource,endpoint,deleteHeaders={};
export async function openPhoneCamera(){
 let panel=document.querySelector('[data-v561-camera]');if(panel){panel.hidden=false;return}
 panel=document.createElement('section');panel.dataset.v561Camera='';panel.className='v561-camera';
 panel.innerHTML='<header><b>Cámara del teléfono</b><button data-camera-close aria-label="Detener cámara y cerrar">×</button></header><div class="v196-frame"><video muted autoplay playsinline></video></div><p data-camera-status>Solicitando acceso a cámara y micrófono…</p><div class="v561-actions"><button data-camera-record>Grabar</button><button data-camera-stop disabled>Finalizar grabación</button><button data-camera-save disabled>Descargar video</button><button data-camera-switch>Cambiar cámara</button></div><details><summary>Emitir directamente a un servidor</summary><p>Conecta tu servidor WHIP para enviar video en vivo desde este teléfono. Los espectadores necesitarán el enlace de reproducción de ese servidor.</p><label>URL WHIP<input data-whip-url type="url" placeholder="https://tu-servidor/whip"></label><label>Token (si se requiere)<input data-whip-token type="password" autocomplete="off"></label><button data-camera-live>Conectar transmisión</button><button data-camera-end disabled>Detener emisión</button></details>';
 document.body.append(panel);let facing='environment';const video=panel.querySelector('video'),status=panel.querySelector('[data-camera-status]');
 const close=()=>{if(recording?.state==='recording')recording.stop();cameraStream?.getTracks().forEach(t=>t.stop());peer?.close();if(resource)fetch(resource,{method:'DELETE',headers:deleteHeaders}).catch(()=>{});resource=null;peer=null;cameraStream=null;panel.remove();document.body.classList.remove('v561-camera-pip')};panel.querySelector('[data-camera-close]').onclick=close;
 async function start(){try{if(!navigator.mediaDevices?.getUserMedia)throw Error('Este navegador no ofrece acceso a cámara. Abre la página HTTPS en Chrome.');cameraStream?.getTracks().forEach(t=>t.stop());cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:facing,width:{ideal:1280},height:{ideal:720}},audio:true});if(!panel.isConnected){cameraStream.getTracks().forEach(t=>t.stop());return}video.srcObject=cameraStream;await video.play();status.textContent='Cámara activa · vista local. Pulsa Grabar o conecta tu servidor para emitir.'}catch(e){status.textContent='No se pudo activar cámara: '+e.message}}
 panel.querySelector('[data-camera-switch]').onclick=()=>{if(peer||recording?.state==='recording'){status.textContent='Detén la emisión o grabación antes de cambiar cámara.';return}facing=facing==='environment'?'user':'environment';start()};
 panel.querySelector('[data-camera-record]').onclick=()=>{if(!cameraStream||!window.MediaRecorder){status.textContent='La grabación no está disponible.';return}recorded=[];recording=new MediaRecorder(cameraStream);recording.ondataavailable=e=>{if(e.data.size)recorded.push(e.data)};recording.onstop=()=>{panel.querySelector('[data-camera-save]').disabled=!recorded.length;status.textContent='Grabación finalizada. Puedes descargarla.'};recording.start(1000);panel.querySelector('[data-camera-record]').disabled=true;panel.querySelector('[data-camera-stop]').disabled=false;status.textContent='Grabando en este teléfono…'};
 panel.querySelector('[data-camera-stop]').onclick=()=>{recording?.stop();panel.querySelector('[data-camera-record]').disabled=false;panel.querySelector('[data-camera-stop]').disabled=true};
 panel.querySelector('[data-camera-save]').onclick=()=>{const blob=new Blob(recorded,{type:recording.mimeType}),a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='Liga_Juventino_'+Date.now()+'.webm';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000)};
 panel.querySelector('[data-camera-live]').onclick=async()=>{if(!cameraStream)return;try{endpoint=new URL(panel.querySelector('[data-whip-url]').value);if(endpoint.protocol!=='https:')throw Error('El servidor debe usar HTTPS');peer?.close();peer=new RTCPeerConnection();cameraStream.getTracks().forEach(t=>peer.addTrack(t,cameraStream));await peer.setLocalDescription(await peer.createOffer());if(peer.iceGatheringState!=='complete')await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('No se pudo preparar la conexión de red')),12000);peer.addEventListener('icegatheringstatechange',()=>{if(peer.iceGatheringState==='complete'){clearTimeout(timer);resolve()}})});
 const token=panel.querySelector('[data-whip-token]').value;deleteHeaders=token?{Authorization:'Bearer '+token}:{};const activePeer=peer;const response=await fetch(endpoint.href,{method:'POST',headers:{'Content-Type':'application/sdp',...(token?{Authorization:'Bearer '+token}:{})},body:peer.localDescription.sdp});if(!response.ok)throw Error('Servidor respondió '+response.status);resource=response.headers.get('Location');if(resource)resource=new URL(resource,endpoint).href;if(!panel.isConnected||peer!==activePeer){if(resource)fetch(resource,{method:'DELETE',headers:deleteHeaders}).catch(()=>{});activePeer.close();return}await peer.setRemoteDescription({type:'answer',sdp:await response.text()});status.textContent='Conectando con el servidor…';peer.onconnectionstatechange=()=>status.textContent=peer.connectionState==='connected'?'Emitiendo video al servidor':'Conexión: '+peer.connectionState;panel.querySelector('[data-camera-end]').disabled=false}catch(e){peer?.close();peer=null;if(resource)fetch(resource,{method:'DELETE',headers:deleteHeaders}).catch(()=>{});resource=null;status.textContent='No se pudo emitir: '+e.message}};
 panel.querySelector('[data-camera-end]').onclick=()=>{peer?.close();peer=null;if(resource)fetch(resource,{method:'DELETE',headers:deleteHeaders}).catch(()=>{});resource=null;status.textContent='Emisión detenida · cámara local activa';panel.querySelector('[data-camera-end]').disabled=true};
 attachPlayerControls(panel,{pip:async()=>{try{if(Capacitor.isNativePlatform()&&Capacitor.getPlatform()==='android'){document.body.classList.add('v561-camera-pip');await cameraPiP.enter()}else await video.requestPictureInPicture()}catch(e){document.body.classList.remove('v561-camera-pip');status.textContent='PiP: '+e.message}},settings:()=>playbackSettings(panel),cast:()=>{if(video.remote?.prompt)video.remote.prompt().catch(e=>status.textContent=e.message);else status.textContent='Este navegador no ofrece conexión TV para la cámara.'},notify:msg=>status.textContent=msg});await start();
}
window.LJR_PHONE_CAMERA={open:openPhoneCamera};

window.addEventListener('liga:native-pip',e=>{if(!e.detail?.active)document.body.classList.remove('v561-camera-pip')});
