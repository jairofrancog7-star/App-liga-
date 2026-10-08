/* V941 Liga Juventino TV — botón de reproducción integrado en tarjetas del archivo.
   Mantiene los <video> originales, los controles existentes y el diseño de Momentos. */
(function(){
 'use strict';
 if(window.__LJR_V941_TV_COMPACT__)return;
 window.__LJR_V941_TV_COMPACT__=true;
 const playSvg='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 6 10 6-10 6z" fill="currentColor" stroke="none"/></svg>';
 const pauseSvg='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="7" y="6" width="3.5" height="12" rx=".7" fill="currentColor"/><rect x="13.5" y="6" width="3.5" height="12" rx=".7" fill="currentColor"/></svg>';
 let screen=null,observer=null,queued=false;
 function inVideo(){
   return document.body?.dataset.appRoute==='video'||location.hash.replace(/^#\/?/,'').split('?')[0]==='video';
 }
 function enhance(){
   if(!inVideo())return;
   const root=document.querySelector('#screen #v105-bottom[data-v105-route="video"]');
   if(!root)return;
   root.querySelectorAll('.v105-video-card').forEach(card=>{
     if(card.dataset.v941Tv==='1')return;
     const video=card.querySelector('video');
     if(!video)return;
     const name=card.querySelector('b')?.textContent?.trim()||'Video de la Liga';
     card.dataset.v941Tv='1';
     card.classList.add('v941-tv-card');
     const action=document.createElement('button');
     action.type='button';action.className='v941-tv-play';action.dataset.v941Play='1';
     action.setAttribute('aria-label','Reproducir '+name);
     action.setAttribute('title','Reproducir '+name);
     card.append(action);
     function update(){
       const isPlaying=!video.paused&&!video.ended;
       action.innerHTML=(isPlaying?pauseSvg:playSvg)+'<span class="v941-tv-play-label">'+(isPlaying?'Pausar':'Ver')+'</span>';
       action.setAttribute('aria-label',(isPlaying?'Pausar ':'Reproducir ')+name);
       action.setAttribute('title',(isPlaying?'Pausar ':'Reproducir ')+name);
       action.setAttribute('aria-pressed',String(isPlaying));
     }
     action.addEventListener('click',async event=>{
       event.preventDefault();event.stopPropagation();
       if(!video.paused&&!video.ended){video.pause();return}
       try{await video.play()}catch(err){
         action.setAttribute('title','El video no está disponible en este momento');
         video.controls=true;
       }
     });
     video.addEventListener('play',update);
     video.addEventListener('pause',update);
     video.addEventListener('ended',update);
     update();
   });
 }
 function schedule(){
   if(queued)return;queued=true;
   requestAnimationFrame(()=>{queued=false;enhance()});
 }
 function bind(){
   const s=document.getElementById('screen');if(!s)return;
   if(s!==screen){observer?.disconnect();screen=s;observer=new MutationObserver(schedule);observer.observe(screen,{childList:true,subtree:true})}
   schedule();
 }
 window.addEventListener('hashchange',bind);
 window.addEventListener('pageshow',bind);
 document.addEventListener('DOMContentLoaded',bind,{once:true});
 if(document.readyState!=='loading')bind();
})();
