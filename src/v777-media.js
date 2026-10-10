import {trackNativePiP} from './v560-stream-player-controls.js';
import { Capacitor, registerPlugin } from '@capacitor/core';
const nativePiP=registerPlugin('LigaPiP');
const esc=s=>window.LJR_CMS?.esc(s)||String(s||'');
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
function controls(video){
 if(video.dataset.v777Controls||video.matches('[data-ljr-decorative],video[aria-hidden="true"]')||video.closest('.v196-frame,.liga-stories,.v105-motion,.v15-decor,[data-v73-motion-banner],.v73-home-motion,.v73-gallery'))return;
 if(video.muted&&video.autoplay&&!video.controls)return;
 video.dataset.v777Controls='1';trackNativePiP(video);video.controls=false;video.playsInline=true;
 const box=document.createElement('div');box.className='ljr-video-player v918-overlay-player ljr-controls-visible ljr-video-paused';video.before(box);box.append(video);
 const icons={
  play:'<path class="v918-icon-filled" d="M8 5.5v13l11-6.5z"/>',
  pause:'<path class="v918-icon-filled" d="M7 5h4v14H7zm7 0h4v14h-4z"/>',
  back:'<path d="M8 5H4v4"/><path d="M4.5 9A8 8 0 1 1 5 17.5"/><text x="12" y="15" text-anchor="middle" fill="currentColor" stroke="none" font-size="8" font-weight="700">10</text>',
  next:'<path d="M16 5h4v4"/><path d="M19.5 9A8 8 0 1 0 19 17.5"/><text x="12" y="15" text-anchor="middle" fill="currentColor" stroke="none" font-size="8" font-weight="700">10</text>',
  mute:'<path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m17 9 4 6m0-6-4 6"/>',
  volume:'<path d="M11 5 6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18 6a9 9 0 0 1 0 12"/>',
  full:'<path d="M8 3H4a1 1 0 0 0-1 1v4m13-5h4a1 1 0 0 1 1 1v4M8 21H4a1 1 0 0 1-1-1v-4m13 5h4a1 1 0 0 0 1-1v-4"/>',
  pip:'<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="12" y="11" width="8" height="6" rx="1" fill="currentColor" stroke="none"/>',
  camera:'<path d="M14 4H9l-2 3H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-2-3z"/><circle cx="12" cy="13" r="3"/>',
  rotate:'<rect x="6" y="3" width="12" height="18" rx="2" transform="rotate(45 12 12)"/><path d="m4 4 2 1-2 2M20 20l-2-1 2-2"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l1 2.8 2.3 1 2.8-1 2 3.4-2.2 2a9 9 0 0 1 0 3.6l2.2 2-2 3.4-2.8-1-2.3 1L14 22h-4l-1-2.8-2.3-1-2.8 1-2-3.4 2.2-2a9 9 0 0 1 0-3.6l-2.2-2 2-3.4 2.8 1 2.3-1L10 2z"/>',
  repeat:'<path d="m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4m14-1v3a2 2 0 0 1-2 2H3"/>',
  timer:'<circle cx="12" cy="13" r="9"/><path d="M12 8v5l3 2M9 2h6"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>'
 };
 const svg=name=>window.LJR_ICONS?.svg(({back:'replay10',next:'forward10',full:'fullscreen',menu:'overflow'})[name]||name)||'<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">'+icons[name]+'</svg>';
 const button=(action,label,inner)=>'<button type="button" data-v777-action="'+action+'" aria-label="'+label+'" title="'+label+'">'+inner+'</button>';
 const bar=document.createElement('div');bar.className='ljr-video-controls';
 bar.innerHTML='<div class="ljr-video-quick">'+
  button('speed','Cambiar velocidad de reproducción','<span data-speed-label>1×</span>')+
  button('repeat','Repetir video',svg('repeat'))+
  button('shot','Guardar captura del video',svg('camera'))+
  button('pip','Ventana flotante PiP',svg('pip'))+
  button('settings','Más opciones de reproducción',svg('menu'))+
  button('full','Pantalla completa',svg('full'))+
  '</div><div class="ljr-video-center">'+
  button('back','Retroceder 10 segundos',svg('back'))+
  button('play','Reproducir o pausar',svg('play'))+
  button('next','Avanzar 10 segundos',svg('next'))+
  '</div><div class="ljr-video-footer"><div class="ljr-video-timeline"><span data-time>0:00</span><input type="range" data-seek min="0" max="1000" value="0" aria-label="Posición del video"><span data-duration>0:00</span></div><div class="ljr-video-actions">'+
  button('mute','Silenciar o activar audio',svg('volume'))+
  '<input data-volume type="range" min="0" max="1" step=".05" value="1" aria-label="Volumen"></div><small role="status" aria-live="polite"></small></div>'+
  '<div class="v919-video-menu" hidden role="group" aria-label="Opciones adicionales">'+
  button('timer','Temporizador de apagado',svg('timer')+'<span data-v919-timer>Temporizador</span>')+
  button('segment','Repetir segmento A y B',svg('repeat')+'<span data-v919-segment>A-B</span>')+
  button('fit','Cambiar ajuste de imagen',svg('full')+'<span data-v919-fit>Encajar</span>')+
  button('mirror','Reflejar horizontalmente el video',svg('rotate')+'<span data-v919-mirror>Espejo</span>')+
  button('rotate','Girar pantalla',svg('rotate')+'<span>Rotación</span>')+
  '</div>';
 box.append(bar);
 const status=bar.querySelector('small'),seek=bar.querySelector('[data-seek]'),play=bar.querySelector('[data-v777-action=play]'),mute=bar.querySelector('[data-v777-action=mute]');
 const time=t=>Math.floor((t||0)/60)+':'+String(Math.floor((t||0)%60)).padStart(2,'0');
 let hideTimer=0,sleepTimer=0,speedIndex=0,segmentA=null,segmentB=null,fitCover=false,mirrored=false,timerMinutes=0;
 const speeds=[1,1.25,1.5,2,.75],timers=[0,5,15,30,60],menu=bar.querySelector('.v919-video-menu');
 function reveal(){
  if(!box.isConnected)return;
  box.classList.add('ljr-controls-visible');clearTimeout(hideTimer);
  if(menu.hidden)hideTimer=setTimeout(()=>{if(!box.isConnected)return;box.classList.remove('ljr-controls-visible')},1500);
 }
 function closeMenu(){menu.hidden=true;box.classList.remove('v919-menu-open');reveal()}
 function segmentText(){return segmentA===null?'A-B':segmentB===null?'Punto B':'Quitar A-B'}
 video.addEventListener('timeupdate',()=>{
  if(segmentB!==null&&segmentA!==null&&video.currentTime>=segmentB)video.currentTime=segmentA;
 });
 function update(){
  const finite=Number.isFinite(video.duration)&&video.duration>0;
  bar.querySelector('[data-time]').textContent=time(video.currentTime);
  bar.querySelector('[data-duration]').textContent=finite?time(video.duration):'En vivo';
  seek.disabled=!finite;seek.value=finite?video.currentTime/video.duration*1000:0;
  play.innerHTML=svg(video.paused?'play':'pause');play.setAttribute('aria-label',video.paused?'Reproducir':'Pausar');play.title=play.getAttribute('aria-label');
  const silent=video.muted||video.volume===0;mute.innerHTML=svg(silent?'mute':'volume');mute.setAttribute('aria-label',silent?'Activar audio':'Silenciar');mute.title=mute.getAttribute('aria-label');
  bar.querySelector('[data-volume]').value=video.muted?0:video.volume;
  box.classList.toggle('ljr-video-paused',video.paused);
 }
 for(const type of ['timeupdate','durationchange','loadedmetadata','volumechange','ratechange'])video.addEventListener(type,update);
 for(const type of ['pause','play','ended'])video.addEventListener(type,()=>{update();reveal()});
 video.addEventListener('click',()=>{if(!menu.hidden)closeMenu();else reveal()});
 box.addEventListener('focusin',()=>reveal());
 box.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'&&event.movementX+event.movementY!==0)reveal()});
 seek.oninput=()=>{if(Number.isFinite(video.duration)&&video.duration>0)video.currentTime=+seek.value/1000*video.duration;reveal()};
 seek.addEventListener('pointerdown',()=>clearTimeout(hideTimer));
 seek.addEventListener('pointerup',reveal);
 bar.querySelector('[data-volume]').oninput=event=>{video.volume=+event.target.value;video.muted=video.volume===0;reveal()};
 bar.addEventListener('click',async event=>{
  const b=event.target.closest('[data-v777-action]');if(!b)return;event.preventDefault();event.stopImmediatePropagation();reveal();
  try{
   switch(b.dataset.v777Action){
    case 'play':if(video.paused)await video.play();else video.pause();break;
    case 'back':case 'next':if(Number.isFinite(video.duration)&&video.duration>0)video.currentTime=Math.max(0,Math.min(video.duration,video.currentTime+(b.dataset.v777Action==='back'?-10:10)));break;
    case 'mute':video.muted=!video.muted;break;
    case 'speed':speedIndex=(speedIndex+1)%speeds.length;video.playbackRate=speeds[speedIndex];b.querySelector('[data-speed-label]').textContent=speeds[speedIndex]+'×';break;
    case 'repeat':video.loop=!video.loop;b.setAttribute('aria-pressed',String(video.loop));break;
    case 'settings':{
     const show=menu.hidden;menu.hidden=!show;box.classList.toggle('v919-menu-open',show);
     clearTimeout(hideTimer);if(!show)reveal();break;
    }
    case 'fit':fitCover=!fitCover;video.classList.toggle('v919-video-cover',fitCover);b.querySelector('[data-v919-fit]').textContent=fitCover?'Recortar':'Encajar';break;
    case 'mirror':mirrored=!mirrored;video.classList.toggle('v919-video-mirror',mirrored);b.querySelector('[data-v919-mirror]').textContent=mirrored?'Normal':'Espejo';break;
    case 'segment':{
     if(segmentA===null){segmentA=video.currentTime;segmentB=null;}
     else if(segmentB===null){const point=video.currentTime;if(point<=segmentA+0.3){status.textContent='Avanza el video para marcar el punto B.';break}segmentB=point;video.currentTime=segmentA;}
     else{segmentA=null;segmentB=null}
     b.querySelector('[data-v919-segment]').textContent=segmentText();break;
    }
    case 'timer':{
     const index=timers.indexOf(timerMinutes);timerMinutes=timers[(index+1)%timers.length];
     clearTimeout(sleepTimer);
     if(timerMinutes)sleepTimer=setTimeout(()=>{video.pause();timerMinutes=0;b.querySelector('[data-v919-timer]').textContent='Temporizador';reveal()},timerMinutes*60*1000);
     b.querySelector('[data-v919-timer]').textContent=timerMinutes?timerMinutes+' min':'Temporizador';break;
    }
    case 'full':
     if(document.fullscreenElement)await document.exitFullscreen();
     else if(box.requestFullscreen)await box.requestFullscreen();
     else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();
     else throw Error('Pantalla completa no disponible en este dispositivo.');
     break;
    case 'pip':
     if(video.paused)await video.play();
     if(Capacitor.isNativePlatform()&&Capacitor.getPlatform()==='android')await nativePiP.enter();
     else if(video.requestPictureInPicture)await video.requestPictureInPicture();
     else if(video.webkitSetPresentationMode)video.webkitSetPresentationMode('picture-in-picture');
     else throw Error('Para usar PiP, reproduce el video y sal al inicio del teléfono.');
     break;
    case 'shot':{
     if(!video.videoWidth||!video.videoHeight)throw Error('Espera a que cargue la imagen del video.');
     const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;
     canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
     const url=canvas.toDataURL('image/png'),link=document.createElement('a');link.href=url;link.download='liga-juventino-video-'+Date.now()+'.png';document.body.append(link);link.click();link.remove();
     break;
    }
    case 'rotate':
     if(!screen.orientation?.lock)throw Error('Tu teléfono no permite rotación desde el reproductor.');
     if(!document.fullscreenElement&&box.requestFullscreen)await box.requestFullscreen();
     await screen.orientation.lock('landscape');break;
   }
   if(!['segment','timer'].includes(b.dataset.v777Action))status.textContent='';
  }catch(err){status.textContent=err?.message||'No se pudo activar esta opción.';reveal()}
  update();
 });
 video.addEventListener('error',()=>{status.textContent='No se pudo cargar este video. El administrador puede actualizarlo.';video.controls=true;reveal()});
 new MutationObserver(()=>{if(box.isConnected)return;clearTimeout(hideTimer);clearTimeout(sleepTimer)}).observe(box.parentNode,{childList:true});
 update();reveal();
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
