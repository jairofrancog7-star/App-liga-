import {trackNativePiP} from './v560-stream-player-controls.js';
import { Capacitor, registerPlugin } from '@capacitor/core';
const nativePiP=registerPlugin('LigaPiP');
const esc=s=>window.LJR_CMS?.esc(s)||String(s||'');
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
function controls(video){
 if(video.dataset.v777Controls||video.closest('.v196-frame,.liga-stories,.v105-motion,.v15-decor'))return;
 if(video.muted&&video.autoplay&&!video.controls)return;
 video.dataset.v777Controls='1';trackNativePiP(video);video.controls=false;video.playsInline=true;
 const box=document.createElement('div');box.className='ljr-video-player';video.before(box);box.append(video);
 const bar=document.createElement('div');bar.className='ljr-video-controls';bar.innerHTML='<div class="ljr-video-timeline"><span data-time>0:00</span><input type="range" data-seek min="0" max="1000" value="0" aria-label="Posición del video"><span data-duration>0:00</span></div><div class="ljr-video-actions"><button type="button" data-v777-action="back" aria-label="Retroceder 10 segundos">−10</button><button type="button" data-v777-action="play" aria-label="Reproducir">▶</button><button type="button" data-v777-action="next" aria-label="Avanzar 10 segundos">+10</button><button type="button" data-v777-action="mute" aria-label="Silenciar">♫</button><input data-volume type="range" min="0" max="1" step=".05" value="1" aria-label="Volumen"><button type="button" data-v777-action="pip" aria-label="Ventana flotante">PiP</button><button type="button" data-v777-action="full" aria-label="Pantalla completa">⛶</button></div><small role="status"></small>';box.append(bar);
 const status=bar.querySelector('small'),seek=bar.querySelector('[data-seek]'),play=bar.querySelector('[data-v777-action=play]');
 const time=t=>Math.floor((t||0)/60)+':'+String(Math.floor((t||0)%60)).padStart(2,'0');
 const update=()=>{const finite=Number.isFinite(video.duration)&&video.duration>0;bar.querySelector('[data-time]').textContent=time(video.currentTime);bar.querySelector('[data-duration]').textContent=finite?time(video.duration):'En vivo';seek.disabled=!finite;seek.value=finite?video.currentTime/video.duration*1000:0;play.textContent=video.paused?'▶':'Ⅱ';play.setAttribute('aria-label',video.paused?'Reproducir':'Pausar')};
 for(const type of ['timeupdate','durationchange','loadedmetadata','pause','play'])video.addEventListener(type,update);
 seek.oninput=()=>{if(Number.isFinite(video.duration))video.currentTime=+seek.value/1000*video.duration};
 bar.querySelector('[data-volume]').oninput=e=>{video.volume=+e.target.value;video.muted=false};
 bar.addEventListener('click',async e=>{const b=e.target.closest('[data-v777-action]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();try{switch(b.dataset.v777Action){case 'play':if(video.paused)await video.play();else video.pause();break;case 'back':case 'next':if(Number.isFinite(video.duration))video.currentTime=Math.max(0,Math.min(video.duration,video.currentTime+(b.dataset.v777Action==='back'?-10:10)));break;case 'mute':video.muted=!video.muted;b.textContent=video.muted?'♪':'♫';break;case 'full':if(document.fullscreenElement)await document.exitFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();else await box.requestFullscreen();break;case 'pip':if(video.paused)video.play().catch(()=>{});if(Capacitor.isNativePlatform()&&Capacitor.getPlatform()==='android')await nativePiP.enter();else if(video.requestPictureInPicture)await video.requestPictureInPicture();else if(video.webkitSetPresentationMode)video.webkitSetPresentationMode('picture-in-picture');else{await video.requestFullscreen();status.textContent='Para abrir la ventana flotante, usa Inicio del teléfono mientras se reproduce.'}break}}catch(err){status.textContent=err.message||'No se pudo activar esta opción.'}update()});
 video.addEventListener('error',()=>{status.textContent='No se pudo cargar este video. El administrador puede actualizarlo.';video.controls=true});update();
}
function patch(){document.querySelectorAll('video').forEach(controls);
 const root=document.querySelector('#screen');if(!root)return;
 if(route()==='scorers'){
  const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA,cat=localStorage.getItem('v62-category')||'3';
  for(const row of root.querySelectorAll('.v28-rank-row')){const name=row.querySelector('b')?.textContent,actual=db?.categories?.[cat]?.scorers?.flatMap(t=>t.rows||[]).find(r=>r[1]===name);const team=actual?.[2]||row.querySelector('small')?.textContent.split(' · ')[0];const photo=window.LJR_PLAYER_MEDIA?.photo?.(name,team),holder=row.querySelector('.v28-team-logo');
   if(holder&&photo&&holder.querySelector('img')?.getAttribute('src')!==photo)holder.innerHTML='<img src="'+esc(photo)+'" alt="'+esc(name)+'">';
   const small=row.querySelector('small'),logo=window.LJR_TEAM_LOGOS?.get?.(team);if(small&&logo&&!small.querySelector('img'))small.insertAdjacentHTML('afterbegin','<img class="ljr-scorer-team" src="'+esc(logo)+'" alt="">');
  }
 }
 // The same publication action is available in all requested media sections.
 if(window.LJR_MEDIA?.admin&&['home','history','moments','safe-performance','performance','video'].includes(route())&&!root.querySelector('[data-v777-section-media]')){const b=document.createElement('button');b.dataset.v777SectionMedia='';b.className='ljr-admin-only btn outline full';b.textContent='Subir imagen o video a esta sección';b.onclick=()=>window.LJR_MEDIA.edit('',({home:'home',history:'history',moments:'moments',video:'video'})[route()]||'performance');root.append(b)}
 if(!window.LJR_MEDIA?.admin)root.querySelector('[data-v777-section-media]')?.remove();
 const contentKind={scorers:'scorers',rankings:'standings','v4-calendar':'fixture',news:'news',players:'player',teams:'team'}[route()];
 if(contentKind&&window.LJR_MEDIA?.admin&&!root.querySelector('[data-v777-content-edit]')){const b=document.createElement('button');b.dataset.v777ContentEdit='';b.className='ljr-admin-only btn outline full';b.textContent=({scorers:'Modificar tabla de goleo',rankings:'Modificar clasificación','v4-calendar':'Actualizar o reprogramar jornada',news:'Crear o editar noticias',players:'Administrar jugadores',teams:'Administrar equipos'})[route()];b.onclick=()=>window.LJR_CMS.open(contentKind);root.append(b)}
 if(!window.LJR_MEDIA?.admin)root.querySelector('[data-v777-content-edit]')?.remove();
}
window.addEventListener('click',e=>{
 const button=e.target.closest?.('button,a,[role=button]');if(!button)return;
 const t=button.textContent.trim(), title=['Precisión a balón parado','Definición rápida','Transición y presión'].find(x=>t.includes(x));
 if(title){e.preventDefault();e.stopImmediatePropagation();const items=window.LJR_MEDIA?.items||[],item=items.find(x=>x.mime?.startsWith('video/')&&x.title===title)||items.find(x=>x.mime?.startsWith('video/')&&t.includes(x.title));if(item)window.LJR_MEDIA.view(item);else if(window.LJR_MEDIA?.admin)window.LJR_MEDIA.edit(title,'home',undefined,{kind:'video'});else window.LJR_MEDIA.modal('Vídeos destacados','<p>La Liga todavía no ha publicado este video.</p>')}
},true);
let timer;const schedule=()=>{clearTimeout(timer);timer=setTimeout(patch,70)};new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});for(const event of ['hashchange','liga:admin','liga:content'])addEventListener(event,schedule);schedule();
// Android PiP must display the playing video, including local WebRTC streams.
function prepareNativeVideo(){
 const players=[...document.querySelectorAll('.ljr-video-player')],player=players.reverse().find(box=>{const video=box.querySelector('video');return video&&!video.paused&&!video.ended})||(window.LJR_ACTIVE_MEDIA_CARD?.isConnected?window.LJR_ACTIVE_MEDIA_CARD:null);
 if(!player)return;
 document.querySelectorAll('.ljr-native-pip-player').forEach(box=>box.classList.remove('ljr-native-pip-player'));
 player.classList.add('ljr-native-pip-player');document.body.classList.add('ljr-native-pip');
}
addEventListener('liga:prepare-pip',prepareNativeVideo);
addEventListener('liga:native-pip',event=>{if(event.detail?.active)prepareNativeVideo();else{document.body.classList.remove('ljr-native-pip');document.querySelectorAll('.ljr-native-pip-player').forEach(box=>box.classList.remove('ljr-native-pip-player'))}});
