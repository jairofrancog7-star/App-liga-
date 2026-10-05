/* Use a real video element for local streams so Android and web PiP can follow playback. */
export function watchLocalRoom(room){
 const media=window.LJR_MEDIA,n=media.modal(room.title||'Liga en vivo','<div class="ljr-local-player"><video controls playsinline autoplay muted></video><button type="button" data-local-retry>Reconectar</button></div>');
 const video=n.querySelector('video'),status=n.querySelector('[data-status]');let pc=null,closed=false,attempt=0,answerTimer=0,roomTimer=0;
 function disconnect(){clearInterval(answerTimer);clearInterval(roomTimer);pc?.close();pc=null;video.pause();video.srcObject=null}
 const leave=()=>n.querySelector('[data-close]')?.click();
 function close(){if(closed)return;closed=true;attempt++;disconnect();removeEventListener('hashchange',leave);removeEventListener('pagehide',leave)}
 n.addEventListener('media-close',close,{once:true});addEventListener('hashchange',leave);addEventListener('pagehide',leave);
 async function start(){
  if(closed)return;const run=++attempt;disconnect();status.textContent='Conectando con la cámara de la Liga…';const current=()=>!closed&&run===attempt&&n.isConnected;
  try{
   const active=await media.api('rooms/'+encodeURIComponent(room.id));if(!current())return;if(!active.active)throw Error('La transmisión ya terminó.');
   const config=await media.api('ice');if(!current())return;
   const connection=new RTCPeerConnection({iceServers:config.iceServers});pc=connection;connection.addTransceiver('video',{direction:'recvonly'});connection.addTransceiver('audio',{direction:'recvonly'});
   connection.ontrack=event=>{if(!current())return;video.srcObject=event.streams[0]||new MediaStream([event.track]);video.play().catch(()=>{status.textContent='Toca reproducir para ver la transmisión.'});status.textContent='En vivo · activa el sonido desde el reproductor.'};
   connection.onconnectionstatechange=()=>{if(!current())return;if(connection.connectionState==='failed')status.textContent='Se perdió la conexión. Toca Reconectar.'};
   await connection.setLocalDescription(await connection.createOffer());if(!current())return;
   if(connection.iceGatheringState!=='complete')await new Promise(resolve=>{const finish=()=>{clearTimeout(timer);connection.removeEventListener('icegatheringstatechange',changed);resolve()},changed=()=>{if(connection.iceGatheringState==='complete')finish()},timer=setTimeout(finish,8000);connection.addEventListener('icegatheringstatechange',changed)});
   if(!current())return;const peer=await media.api('rooms/'+encodeURIComponent(room.id)+'/offer',{method:'POST',body:{offer:connection.localDescription.toJSON()}});if(!current())return;
   let tries=0,polling=false;
   answerTimer=setInterval(async()=>{if(!current()||polling)return;polling=true;try{const answer=await media.api('rooms/'+encodeURIComponent(room.id)+'/answer?peer='+encodeURIComponent(peer.id),{headers:{Authorization:'Bearer '+peer.token}});if(!current())return;if(answer.answer){clearInterval(answerTimer);await connection.setRemoteDescription(answer.answer)}else if(++tries>=20){clearInterval(answerTimer);status.textContent='La cámara no respondió. Toca Reconectar.'}}catch(error){if(current()){clearInterval(answerTimer);status.textContent=error.message}}finally{polling=false}},2000);
   roomTimer=setInterval(async()=>{try{const active=await media.api('rooms/'+encodeURIComponent(room.id));if(current()&&!active.active){disconnect();status.textContent='La transmisión terminó.'}}catch(error){if(current())status.textContent=error.message}},12000);
  }catch(error){if(current()){disconnect();status.textContent=error.message||'No se pudo abrir la transmisión.'}}
 }
 n.querySelector('[data-local-retry]').onclick=start;start();return n;
}
