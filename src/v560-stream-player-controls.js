import {Capacitor,registerPlugin} from '@capacitor/core';
const nativePip=registerPlugin('LigaPiP');
const activePlayers=new Set(),ordinaryPlayers=new Set();
export function trackNativePiP(video){if(ordinaryPlayers.has(video))return;ordinaryPlayers.add(video);for(const event of ['play','pause','ended'])video.addEventListener(event,armPiP);armPiP()}
let armed=false;function armPiP(){for(const video of ordinaryPlayers)if(!video.isConnected)ordinaryPlayers.delete(video);const enabled=[...activePlayers].some(s=>s.media.isConnected)||[...ordinaryPlayers].some(video=>!video.paused&&!video.ended);if(Capacitor.isNativePlatform()&&armed!==enabled){armed=enabled;nativePip.arm({enabled}).catch(()=>{armed=!enabled})}}
new MutationObserver(armPiP).observe(document.documentElement,{childList:true,subtree:true});
const states=new WeakMap();
let apiPromise;
function youtubeAPI(){
  if(window.YT?.Player)return Promise.resolve(window.YT);
  if(!apiPromise)apiPromise=new Promise((resolve,reject)=>{
    const previous=window.onYouTubeIframeAPIReady;
    const script=document.createElement('script');
    const finish=()=>{clearTimeout(timeout);script.onerror=null;if(window.onYouTubeIframeAPIReady===ready)window.onYouTubeIframeAPIReady=previous};
    const fail=()=>{finish();script.remove();reject(new Error('No se pudo conectar con YouTube. Toca Recargar video para reintentar.'))};
    const ready=()=>{finish();try{previous?.()}catch{}if(window.YT?.Player)resolve(window.YT);else fail()};
    const timeout=setTimeout(fail,15000);
    window.onYouTubeIframeAPIReady=ready;
    script.src='https://www.youtube.com/iframe_api';script.onerror=fail;document.head.append(script);
  }).catch(error=>{apiPromise=null;throw error});
  return apiPromise;
}
export function streamProvider(value){
  try{
    const host=new URL(value).hostname.toLowerCase();
    if(host==='youtu.be'||/(^|\.)youtube(?:-nocookie)?\.com$/.test(host))return 'youtube';
    if(host==='fb.watch'||/(^|\.)facebook\.com$/.test(host))return 'facebook';
    if(/(^|\.)tiktok\.com$/.test(host))return 'tiktok';
  }catch{}
  return 'external';
}
export function youtubeVideoId(value){
  try{
    const u=new URL(value);if(streamProvider(u.href)!=='youtube')return '';
    const id=u.hostname==='youtu.be'?u.pathname.split('/')[1]:u.searchParams.get('v')||u.pathname.match(/^\/(?:live|embed|shorts)\/([^/]+)/)?.[1];
    return /^[\w-]{11}$/.test(id||'')?id:'';
  }catch{return ''}
}
export function normalizeStreamUrl(value){
  let raw=String(value||'').trim();
  const embed=raw.match(/\bsrc=["']([^"']+)/i);if(embed)raw=embed[1].replace(/&amp;/g,'&');
  if(/^(?:www\.|m\.|web\.)?(?:youtube\.com|youtube-nocookie\.com|youtu\.be|facebook\.com|fb\.watch|tiktok\.com)\//i.test(raw))raw='https://'+raw;
  try{
    const u=new URL(raw);if(!/^https?:$/.test(u.protocol))return '';
    if(/(^|\.)facebook\.com$/.test(u.hostname)){
      if(u.pathname==='/plugins/video.php'&&u.searchParams.get('href'))return normalizeStreamUrl(u.searchParams.get('href'));
      const id=u.searchParams.get('v')||u.pathname.match(/\/(?:videos|reel)\/(\d+)/)?.[1];
      if(id)return 'https://www.facebook.com/watch/?v='+encodeURIComponent(id);
    }
    return u.href;
  }catch{return ''}
}
export function tiktokVideoId(url){return String(url||'').match(/\/(?:video|v1)\/(\d+)/)?.[1]||''}
window.addEventListener('message',event=>{
  if(event.origin!=='https://www.tiktok.com'||!event.data?.['x-tiktok-player'])return;
  const frame=[...document.querySelectorAll('iframe')].find(f=>f.contentWindow===event.source),state=states.get(frame);if(!state)return;
  if(event.data.type==='onCurrentTime')state.time=Number(event.data.value?.currentTime)||0;
  if(event.data.type==='onStateChange')state.paused=event.data.value!==1;
  if(event.data.type==='onPlayerReady')state.ready=true;
  if(event.data.type==='onPlayerError')state.error='TikTok no pudo reproducir este video. Revisa el enlace público.';
  state.update();
});
export function attachPlayerControls(card,{pip,settings,cast,notify,changeSource}){
  let media=card.querySelector('.v196-frame video,.v196-frame iframe');if(!media||states.has(media))return;
  const isVideo=media.tagName==='VIDEO',isYT=streamProvider(media.src)==='youtube',isTT=streamProvider(media.src)==='tiktok';
  const controlled=isVideo||isYT||isTT,frame=card.querySelector('.v196-frame');
  frame.classList.add('v919-stream-frame');
  const symbols={
   zoom:'<path d="M5 5h6M5 5v6m14-6h-6m6 0v6M5 19h6m-6 0v-6m14 6h-6m6 0v-6"/>',
   back:'<path d="M7 5H3v4m1-1a8 8 0 1 1-.2 8"/><text x="12" y="15" fill="currentColor" stroke="none" text-anchor="middle" font-size="8">10</text>',
   next:'<path d="M17 5h4v4m-1-1a8 8 0 1 0 .2 8"/><text x="12" y="15" fill="currentColor" stroke="none" text-anchor="middle" font-size="8">10</text>',
   play:'<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
   pause:'<path d="M7 5h4v14H7zm7 0h4v14h-4z" fill="currentColor" stroke="none"/>',
   fullscreen:'<path d="M8 3H4a1 1 0 0 0-1 1v4m13-5h4a1 1 0 0 1 1 1v4M8 21H4a1 1 0 0 1-1-1v-4m13 5h4a1 1 0 0 0 1-1v-4"/>',
   pip:'<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="12" y="11" width="8" height="6" rx="1"/>',
   cast:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 15c4 0 6 2 6 5M3 11c6 0 10 3 10 9"/>',
   settings:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l1 2.8 2.3 1 2.8-1 2 3.4-2.2 2a9 9 0 0 1 0 3.6l2.2 2-2 3.4-2.8-1-2.3 1L14 22h-4l-1-2.8-2.3-1-2.8 1-2-3.4 2.2-2a9 9 0 0 1 0-3.6l-2.2-2 2-3.4 2.8 1 2.3-1L10 2z"/>',
   mute:'<path d="M11 5 6 9H3v6h3l5 4V5zM15 9l6 6m0-6-6 6"/>',
   loop:'<path d="m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4m14-1v3a2 2 0 0 1-2 2H3"/>',
   shot:'<path d="M14 4H9L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z"/><circle cx="12" cy="13" r="3"/>'
  };
  const icon=key=>window.LJR_ICONS?.svg(({back:'replay10',next:'forward10',loop:'repeat'})[key]||key)||'<svg viewBox="0 0 24 24" aria-hidden="true">'+symbols[key]+'</svg>';
  const btn=(action,label,body)=>'<button type="button" data-action="'+action+'" aria-label="'+label+'" title="'+label+'">'+body+'</button>';
  const bar=document.createElement('div');bar.className='v560-player-controls v919-stream-controls v919-shown';
  bar.innerHTML='<div class="v919-stream-quick">'+
   btn('zoom','Zoom de transmisión',icon('zoom')+'<span data-zoom-label>1×</span>')+
   (isVideo||isYT?btn('speed','Velocidad de reproducción','<span data-speed-label>1×</span>'):'')+
   (isVideo?btn('loop','Repetición automática',icon('loop')):'')+
   (isVideo?btn('shot','Captura de pantalla',icon('shot')):'')+
   btn('pip','Ventana flotante PiP',icon('pip'))+
   btn('cast','Transmitir a TV',icon('cast'))+
   btn('settings','Ajustes de reproducción',icon('settings'))+
   btn('fullscreen','Pantalla completa',icon('fullscreen'))+
   '</div>'+(controlled?'<div class="v919-stream-center">'+
   btn('back','Retroceder 10 segundos',icon('back'))+
   btn('play','Reproducir o pausar',icon('play'))+
   btn('next','Avanzar 10 segundos',icon('next'))+'</div>':'');
  frame.append(bar);
  const revealHit=!isVideo?document.createElement('button'):null;
  if(revealHit){revealHit.type='button';revealHit.className='v919-stream-reveal';revealHit.setAttribute('aria-label','Mostrar controles del video');frame.append(revealHit)}
  let hideTimer=0,speedIndex=0;
  const speeds=[1,1.25,1.5,2,0.75];
  function reveal(){
   if(!card.isConnected)return;
   bar.classList.add('v919-shown');clearTimeout(hideTimer);
   hideTimer=setTimeout(()=>{bar.classList.remove('v919-shown')},1500);
  }
  if(revealHit)revealHit.addEventListener('click',reveal);
  if(isVideo)media.addEventListener('click',reveal);
  frame.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'&&event.movementX+event.movementY)reveal()});
  frame.addEventListener('focusin',reveal);
  reveal();
  const status=document.createElement('small');status.className='v560-play-status';bar.after(status);
  status.setAttribute('role','status');
  if(!isVideo){
    const recovery=document.createElement('div');recovery.className='v608-player-recovery';
    const retry=document.createElement('button');retry.type='button';retry.textContent='Recargar video';retry.dataset.v608Retry='';
    retry.onclick=()=>{state.error='';state.ready=false;state.zoom=1;bar.querySelector('[data-zoom-label]').textContent='1×';state.update();if(isYT){state.player?.destroy();media=frameTemplate.cloneNode(true);card.querySelector('.v196-frame').querySelector('iframe')?.replaceWith(media);states.set(media,state);connectYouTube()}else media.src=media.src};
    recovery.append(retry);
    const sourceUrl=streamProvider(media.src)==='facebook'?new URL(media.src).searchParams.get('href'):isYT?'https://www.youtube.com/watch?v='+youtubeVideoId(media.src):isTT?media.src:'';
    if(sourceUrl){const original=document.createElement('a');original.href=sourceUrl;original.target='_blank';original.rel='noopener';original.textContent='Abrir '+(isYT?'YouTube':isTT?'TikTok':'Facebook');recovery.append(original)}
    if(changeSource){const change=document.createElement('button');change.type='button';change.textContent='Cambiar enlace';change.onclick=()=>changeSource();recovery.append(change)}
    status.after(recovery);
    if(streamProvider(media.src)==='facebook'){
      const linked=new URL(media.src).searchParams.get('href')||'';
      if(/facebook\.com\/share\//i.test(linked)||/fb\.watch\//i.test(linked)){const hint=document.createElement('p');hint.className='v608-link-hint';hint.textContent='Si este enlace compartido no reproduce, usa Cambiar enlace y pega la dirección del video: /videos/ID, /reel/ID o watch/?v=ID.';recovery.after(hint)}
    }
  }
  const state={ready:isVideo,paused:true,time:0,zoom:1,player:null,error:'',update(){
    this.media=media;this.card=card;if(this.paused)activePlayers.delete(this);else activePlayers.add(this);window.LJR_ACTIVE_MEDIA_CARD=[...activePlayers].find(s=>s.media.isConnected)?.card||null;armPiP();
    const play=bar.querySelector('[data-action="play"]');if(play){play.innerHTML=icon(this.paused?'play':'pause');play.setAttribute('aria-label',this.paused?'Reproducir':'Pausar');}
    status.textContent=this.error||'';
  }};states.set(media,state);
  if(isVideo){for(const event of ['play','pause','timeupdate','loadedmetadata'])media.addEventListener(event,()=>{state.paused=media.paused;state.time=media.currentTime;state.update();if(event==='play'||event==='pause')reveal()});media.addEventListener('error',()=>{state.error='No se pudo cargar el video. Revisa la fuente de transmisión.';state.update()})}
  const frameTemplate=media.cloneNode(true);
  let connectionAttempt=0;
  function connectYouTube(){const attempt=++connectionAttempt;const timeout=setTimeout(()=>{if(attempt===connectionAttempt&&!state.ready){state.error='YouTube no respondió. Toca Recargar video o Cambiar enlace.';state.update()}},20000);youtubeAPI().then(YT=>{
    if(attempt!==connectionAttempt||!media.isConnected)return;
    state.player=new YT.Player(media,{events:{onReady:()=>{if(attempt!==connectionAttempt)return;clearTimeout(timeout);state.ready=true;state.error='';state.update()},onStateChange:e=>{state.paused=e.data!==1;if(e.data===1)state.error='';state.update();reveal()},onError:e=>{clearTimeout(timeout);state.error=[101,150].includes(e.data)?'El propietario no permite insertar este video. Cambia el enlace.':e.data===153?'YouTube rechazó la identificación del reproductor. Actualiza la app Android o prueba este enlace en la web.':e.data===100?'Este video es privado o fue eliminado. Cambia el enlace.':'YouTube no pudo reproducir este enlace ('+e.data+').';state.update()}}});
  }).catch(error=>{clearTimeout(timeout);if(attempt===connectionAttempt){state.error=error.message;state.update()}})}
  if(isYT)connectYouTube();
  bar.addEventListener('click',async event=>{
    const button=event.target.closest('[data-action]');if(!button)return;event.preventDefault();event.stopPropagation();
    const action=button.dataset.action;reveal();
    if(action==='pip'){pip();return}
    if(action==='settings'){settings();return}
    if(action==='cast'){cast();return}
    if(action==='zoom'){state.zoom=state.zoom===1?1.25:state.zoom===1.25?1.5:1;media.style.transform='scale('+state.zoom+')';button.querySelector('[data-zoom-label]').textContent=state.zoom+'×';return}
    if(action==='speed'){speedIndex=(speedIndex+1)%speeds.length;const speed=speeds[speedIndex];if(isVideo)media.playbackRate=speed;else if(isYT&&state.player?.setPlaybackRate)state.player.setPlaybackRate(speed);button.querySelector('[data-speed-label]').textContent=speed+'×';return}
    if(action==='loop'&&isVideo){media.loop=!media.loop;button.setAttribute('aria-pressed',String(media.loop));return}
    if(action==='shot'&&isVideo){try{const canvas=document.createElement('canvas');canvas.width=media.videoWidth;canvas.height=media.videoHeight;if(!canvas.width||!canvas.height)throw Error('El video todavía no está listo.');canvas.getContext('2d').drawImage(media,0,0);const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='liga-juventino-captura.png';document.body.append(a);a.click();a.remove()}catch{notify('Este video no permite capturas desde el reproductor.')}return}
    if(action==='fullscreen'){
      if(document.fullscreenElement){await document.exitFullscreen();return}
      const target=isVideo&&/Android/.test(navigator.userAgent)?media:card;
      try{if(target.requestFullscreen)await target.requestFullscreen();else throw Error();}
      catch{card.classList.toggle('v560-expanded');button.setAttribute('aria-label',card.classList.contains('v560-expanded')?'Salir de pantalla completa':'Pantalla completa')}
      return;
    }
    if(!state.ready){notify('Espera a que cargue el reproductor o toca reproducir dentro del video.');return}
    if(isVideo){if(action==='play'){if(media.paused)media.play().catch(()=>notify('No se pudo iniciar el video'));else media.pause()}else if(Number.isFinite(media.duration))media.currentTime=Math.max(0,Math.min(media.duration,media.currentTime+(action==='back'?-10:10)));return}
    if(isYT&&state.player){if(action==='play')state.paused?(state.player.unMute?.(),state.player.playVideo()):state.player.pauseVideo();else state.player.seekTo(Math.max(0,state.player.getCurrentTime()+(action==='back'?-10:10)),true);return}
    if(isTT){if(action==='play'&&state.paused)media.contentWindow.postMessage({'x-tiktok-player':true,type:'unMute'},'https://www.tiktok.com');media.contentWindow.postMessage({'x-tiktok-player':true,type:action==='play'?(state.paused?'play':'pause'):'seekTo',value:Math.max(0,state.time+(action==='back'?-10:10))},'https://www.tiktok.com')}
  });
}
