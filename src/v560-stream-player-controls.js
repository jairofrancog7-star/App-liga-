const states=new WeakMap();
let apiPromise;
function youtubeAPI(){
  if(window.YT?.Player)return Promise.resolve(window.YT);
  if(!apiPromise)apiPromise=new Promise((resolve,reject)=>{
    const previous=window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady=()=>{previous?.();resolve(window.YT)};
    const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=()=>reject(new Error('No se pudo conectar con YouTube'));document.head.append(script);
  });
  return apiPromise;
}
export function normalizeStreamUrl(value){
  let raw=String(value||'').trim();
  const embed=raw.match(/\bsrc=["']([^"']+)/i);if(embed)raw=embed[1].replace(/&amp;/g,'&');
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
export function attachPlayerControls(card,{pip,settings,cast,notify}){
  const media=card.querySelector('.v196-frame video,.v196-frame iframe');if(!media||states.has(media))return;
  const isVideo=media.tagName==='VIDEO',isYT=/youtube-nocookie\.com/.test(media.src),isTT=/tiktok\.com/.test(media.src);
  const controlled=isVideo||isYT||isTT;
  const bar=document.createElement('div');bar.className='v560-player-controls';
  bar.innerHTML='<button type="button" data-action="zoom" aria-label="Zoom de transmisión">Zoom 1×</button>'+ (controlled?'<button type="button" data-action="back" aria-label="Retroceder 10 segundos">◀◀</button><button type="button" data-action="play" aria-label="Reproducir o pausar">▶</button><button type="button" data-action="next" aria-label="Avanzar 10 segundos">▶▶</button>':'')+'<button type="button" data-action="fullscreen" aria-label="Pantalla completa">⛶</button><button type="button" data-action="pip" aria-label="PiP fuera de la aplicación">PiP</button><button type="button" data-action="cast" aria-label="Transmitir en televisión">▣</button><button type="button" data-action="settings" aria-label="Ajustes de reproducción">⚙</button>';
  card.querySelector('.v196-frame').after(bar);
  const status=document.createElement('small');status.className='v560-play-status';bar.after(status);
  const state={ready:isVideo,paused:true,time:0,zoom:1,player:null,error:'',update(){
    const play=bar.querySelector('[data-action="play"]');if(play)play.textContent=this.paused?'▶':'Ⅱ';
    status.textContent=this.error||'';
  }};states.set(media,state);
  if(isVideo){for(const event of ['play','pause','timeupdate','loadedmetadata'])media.addEventListener(event,()=>{state.paused=media.paused;state.time=media.currentTime;state.update()});media.addEventListener('error',()=>{state.error='No se pudo cargar el video. Revisa la fuente de transmisión.';state.update()})}
  if(isYT)youtubeAPI().then(YT=>{
    if(!media.isConnected)return;
    state.player=new YT.Player(media,{events:{onReady:()=>{state.ready=true},onStateChange:e=>{state.paused=e.data!==1;state.update()},onError:e=>{state.error=[101,150].includes(e.data)?'El propietario no permite insertar este video. Cambia la fuente.':'YouTube no pudo reproducir este enlace ('+e.data+').';state.update()}}});
  }).catch(error=>{state.error=error.message;state.update()});
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
    if(isYT&&state.player){if(action==='play')state.paused?state.player.playVideo():state.player.pauseVideo();else state.player.seekTo(Math.max(0,state.player.getCurrentTime()+(action==='back'?-10:10)),true);return}
    if(isTT){media.contentWindow.postMessage({'x-tiktok-player':true,type:action==='play'?(state.paused?'play':'pause'):'seekTo',value:Math.max(0,state.time+(action==='back'?-10:10))},'https://www.tiktok.com')}
  });
}
