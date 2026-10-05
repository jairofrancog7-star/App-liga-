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
  const controlled=isVideo||isYT||isTT;
  const bar=document.createElement('div');bar.className='v560-player-controls';
  bar.innerHTML='<button type="button" data-action="zoom" aria-label="Zoom de transmisión">Zoom 1×</button>'+ (controlled?'<button type="button" data-action="back" aria-label="Retroceder 10 segundos">◀◀</button><button type="button" data-action="play" aria-label="Reproducir o pausar">▶</button><button type="button" data-action="next" aria-label="Avanzar 10 segundos">▶▶</button>':'')+'<button type="button" data-action="fullscreen" aria-label="Pantalla completa">⛶</button><button type="button" data-action="pip" aria-label="PiP fuera de la aplicación">PiP</button><button type="button" data-action="cast" aria-label="Transmitir en televisión">▣</button><button type="button" data-action="settings" aria-label="Ajustes de reproducción">⚙</button>';
  card.querySelector('.v196-frame').after(bar);
  const status=document.createElement('small');status.className='v560-play-status';bar.after(status);
  status.setAttribute('role','status');
  if(!isVideo){
    const recovery=document.createElement('div');recovery.className='v608-player-recovery';
    const retry=document.createElement('button');retry.type='button';retry.textContent='Recargar video';retry.dataset.v608Retry='';
    retry.onclick=()=>{state.error='';state.ready=false;state.zoom=1;bar.querySelector('[data-action=zoom]').textContent='Zoom 1×';state.update();if(isYT){state.player?.destroy();media=frameTemplate.cloneNode(true);card.querySelector('.v196-frame').replaceChildren(media);states.set(media,state);connectYouTube()}else media.src=media.src};
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
    const play=bar.querySelector('[data-action="play"]');if(play)play.textContent=this.paused?'▶':'Ⅱ';
    status.textContent=this.error||'';
  }};states.set(media,state);
  if(isVideo){for(const event of ['play','pause','timeupdate','loadedmetadata'])media.addEventListener(event,()=>{state.paused=media.paused;state.time=media.currentTime;state.update()});media.addEventListener('error',()=>{state.error='No se pudo cargar el video. Revisa la fuente de transmisión.';state.update()})}
  const frameTemplate=media.cloneNode(true);
  let connectionAttempt=0;
  function connectYouTube(){const attempt=++connectionAttempt;const timeout=setTimeout(()=>{if(attempt===connectionAttempt&&!state.ready){state.error='YouTube no respondió. Toca Recargar video o Cambiar enlace.';state.update()}},20000);youtubeAPI().then(YT=>{
    if(attempt!==connectionAttempt||!media.isConnected)return;
    state.player=new YT.Player(media,{events:{onReady:()=>{if(attempt!==connectionAttempt)return;clearTimeout(timeout);state.ready=true;state.error='';state.update()},onStateChange:e=>{state.paused=e.data!==1;if(e.data===1)state.error='';state.update()},onError:e=>{clearTimeout(timeout);state.error=[101,150].includes(e.data)?'El propietario no permite insertar este video. Cambia el enlace.':e.data===153?'YouTube rechazó la identificación del reproductor. Actualiza la app Android o prueba este enlace en la web.':e.data===100?'Este video es privado o fue eliminado. Cambia el enlace.':'YouTube no pudo reproducir este enlace ('+e.data+').';state.update()}}});
  }).catch(error=>{clearTimeout(timeout);if(attempt===connectionAttempt){state.error=error.message;state.update()}})}
  if(isYT)connectYouTube();
  bar.addEventListener('click',async event=>{
    const button=event.target.closest('[data-action]');if(!button)return;event.preventDefault();event.stopPropagation();
    const action=button.dataset.action;
    if(action==='pip'){pip();return}
    if(action==='settings'){settings();return}
    if(action==='cast'){cast();return}
    if(action==='zoom'){state.zoom=state.zoom===1?1.25:state.zoom===1.25?1.5:1;media.style.transform='scale('+state.zoom+')';button.textContent='Zoom '+state.zoom+'×';return}
    if(action==='fullscreen'){
      if(document.fullscreenElement){await document.exitFullscreen();return}
      const target=isVideo&&/Android/.test(navigator.userAgent)?media:card;
      try{if(target.requestFullscreen)await target.requestFullscreen();else throw Error();}
      catch{card.classList.toggle('v560-expanded');button.textContent=card.classList.contains('v560-expanded')?'×':'⛶'}
      return;
    }
    if(!state.ready){notify('Espera a que cargue el reproductor o toca reproducir dentro del video.');return}
    if(isVideo){if(action==='play'){if(media.paused)media.play().catch(()=>notify('No se pudo iniciar el video'));else media.pause()}else if(Number.isFinite(media.duration))media.currentTime=Math.max(0,Math.min(media.duration,media.currentTime+(action==='back'?-10:10)));return}
    if(isYT&&state.player){if(action==='play')state.paused?(state.player.unMute?.(),state.player.playVideo()):state.player.pauseVideo();else state.player.seekTo(Math.max(0,state.player.getCurrentTime()+(action==='back'?-10:10)),true);return}
    if(isTT){if(action==='play'&&state.paused)media.contentWindow.postMessage({'x-tiktok-player':true,type:'unMute'},'https://www.tiktok.com');media.contentWindow.postMessage({'x-tiktok-player':true,type:action==='play'?(state.paused?'play':'pause'):'seekTo',value:Math.max(0,state.time+(action==='back'?-10:10))},'https://www.tiktok.com')}
  });
}
