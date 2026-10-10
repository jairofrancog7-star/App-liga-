/* V977 — Reproductor HTML5 global para la app azul en navegador y GitHub Pages.
   No modifica las fuentes, portadas, videos de cámara ni reproducciones decorativas.
   Respeta los reproductores especializados V560/V777 cuando están disponibles. */
(function () {
  'use strict';
  if (window.__LJR_VIDEO_CONTROLS_V977__) return;
  window.__LJR_VIDEO_CONTROLS_V977__ = true;

  var ICONS = {
    play:'<path d="m9 5 11 7-11 7z" fill="currentColor" stroke="none"/>',
    pause:'<path d="M7 5h4v14H7zm7 0h4v14h-4z" fill="currentColor" stroke="none"/>',
    back:'<path d="M8 4H4v4M4 8a8 8 0 1 1 0 8"/><text x="12" y="15" text-anchor="middle" fill="currentColor" stroke="none" font-size="8">10</text>',
    next:'<path d="M16 4h4v4M20 8a8 8 0 1 0 0 8"/><text x="12" y="15" text-anchor="middle" fill="currentColor" stroke="none" font-size="8">10</text>',
    loop:'<path d="m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4m14-1v3a2 2 0 0 1-2 2H3"/>',
    camera:'<path d="M14 4H9L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z"/><circle cx="12" cy="13" r="3"/>',
    pip:'<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="11" y="11" width="9" height="7" rx="1" fill="currentColor" stroke="none"/>',
    full:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    sound:'<path d="M11 5 6 9H3v6h3l5 4zM15 9a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/>',
    muted:'<path d="M11 5 6 9H3v6h3l5 4zM17 9l5 6m0-6-5 6"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>'
  };
  var speeds = [1,1.25,1.5,2,.75];
  var managed = new Set();
  var pending = 0;
  function svg(name) {
    const original=window.LJR_ICONS?.svg(({back:"replay10",next:"forward10",full:"fullscreen",loop:"repeat",sound:"volume",muted:"mute",menu:"overflow"})[name]||name);if(original)return original;
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+ICONS[name]+'</svg>';
  }
  function button(action,label,body) {
    return '<button type="button" data-v977-action="'+action+'" aria-label="'+label+'" title="'+label+'">'+body+'</button>';
  }
  function fmt(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
    seconds = Math.floor(seconds);
    return (seconds >= 3600 ? Math.floor(seconds/3600)+':' : '')+
      String(Math.floor(seconds%3600/60)).padStart(seconds >= 3600 ? 2 : 1,'0')+
      ':'+String(seconds%60).padStart(2,'0');
  }
  function shouldEnhance(video) {
    if (!(video instanceof HTMLVideoElement) || !video.isConnected || video.dataset.v977Controls || video.dataset.v777Controls) return false;
    if (video.closest('.v977-player,.ljr-video-player,.v560-player-controls,.v919-stream-frame,.v196-frame,.v144-stream-frame,.v806-camera,.v156-camera-frame,[data-v156-live-panel],[data-v806-video],.v155-camera,.v60-camera,.v73-gallery,.v73-home-motion,.v105-motion,.v15-decor,.liga-stories,[data-v73-motion-banner],[data-ljr-decorative]')) return false;
    if (video.matches('[aria-hidden="true"],[data-v105-motion],[data-v806-video],[data-v156-video],[data-ljr-decorative]')) return false;
    if (video.srcObject || (video.autoplay && video.muted && video.loop && !video.hasAttribute('controls'))) return false;
    var explicit = video.hasAttribute('controls') || video.closest('.v105-final,.v105-video-card,.v26-reference-video,[data-video-player],.video-player');
    return !!explicit;
  }
  function enhance(video) {
    if (!shouldEnhance(video)) return;
    var parent = video.parentElement;
    if (!parent) return;
    var box = document.createElement('div');
    box.className = 'v977-player ljr-video-player v977-visible v977-paused';
    box.setAttribute('role','group');
    box.setAttribute('aria-label','Reproductor de video');
    parent.insertBefore(box,video);
    box.appendChild(video);
    video.dataset.v977Controls = '1';
    // El controlador V777 no debe crear una segunda barra sobre ésta.
    video.dataset.v777Controls = '1';
    video.controls = false;
    video.playsInline = true;
    video.setAttribute('playsinline','');

    var controls = document.createElement('div');
    controls.className = 'v977-controls';
    controls.innerHTML =
      '<div class="v977-top">'+
        button('speed','Velocidad','<span data-v977-speed>1×</span>')+
        button('loop','Repetir video',svg('loop'))+
        button('shot','Capturar fotograma',svg('camera'))+
        button('pip','Ventana flotante',svg('pip'))+
        button('menu','Más opciones',svg('menu'))+
        button('full','Pantalla completa',svg('full'))+
      '</div>'+
      '<div class="v977-middle">'+
        button('back','Retroceder 10 segundos',svg('back'))+
        button('play','Reproducir',svg('play'))+
        button('next','Avanzar 10 segundos',svg('next'))+
      '</div>'+
      '<div class="v977-bottom">'+
        '<div class="v977-timeline"><span data-v977-time>0:00</span>'+
          '<input type="range" min="0" max="1000" value="0" data-v977-seek aria-label="Posición del video">'+
          '<span data-v977-duration>0:00</span></div>'+
        '<div class="v977-audio">'+
          button('mute','Silenciar',svg('sound'))+
          '<input type="range" min="0" max="1" step=".05" value="1" data-v977-volume aria-label="Volumen"></div>'+
      '</div>'+
      '<div class="v977-menu" data-v977-menu hidden>'+
        button('fit','Cambiar entre ajustar y rellenar imagen','Ajustar imagen')+
        button('mirror','Reflejar horizontalmente','Espejo')+
        button('captions','Activar subtítulos disponibles','Subtítulos')+
      '</div>'+
      '<span class="v977-status" role="status" aria-live="polite" data-v977-status hidden></span>';
    box.appendChild(controls);
    var quick = controls.querySelector('[data-v977-action="play"]');
    var seek = controls.querySelector('[data-v977-seek]');
    var volume = controls.querySelector('[data-v977-volume]');
    var menu = controls.querySelector('[data-v977-menu]');
    var status = controls.querySelector('[data-v977-status]');
    var hideTimer = 0;
    var errorTimer = 0;
    var speedIndex = 0;
    var cover = false;
    var mirror = false;

    parent.classList.add('v977-ready');
    var oldPlay = parent.querySelector('.v941-tv-play');
    if (oldPlay) oldPlay.hidden = true;

    function show() {
      clearTimeout(hideTimer);
      box.classList.add('v977-visible');
      if (!video.paused && menu.hidden) hideTimer = setTimeout(function () {
        if (!box.matches(':focus-within') && video.isConnected && !video.paused) box.classList.remove('v977-visible');
      },3000);
    }
    function message(text) {
      clearTimeout(errorTimer);
      status.textContent = text;
      status.hidden = false;
      errorTimer = setTimeout(function(){ status.hidden = true; },4300);
      show();
    }
    function update() {
      if (!box.isConnected) return;
      var known = Number.isFinite(video.duration) && video.duration > 0;
      controls.querySelector('[data-v977-time]').textContent = fmt(video.currentTime);
      controls.querySelector('[data-v977-duration]').textContent = known ? fmt(video.duration) : '0:00';
      seek.disabled = !known;
      if (document.activeElement !== seek) seek.value = known ? Math.min(1000,Math.max(0,video.currentTime/video.duration*1000)) : 0;
      quick.innerHTML = svg(video.paused ? 'play' : 'pause');
      quick.setAttribute('aria-label',video.paused ? 'Reproducir' : 'Pausar');
      var mute = controls.querySelector('[data-v977-action="mute"]');
      var silent = video.muted || video.volume === 0;
      mute.innerHTML = svg(silent ? 'muted' : 'sound');
      mute.setAttribute('aria-label',silent ? 'Activar audio' : 'Silenciar');
      if (document.activeElement !== volume) volume.value = silent ? 0 : video.volume;
      box.classList.toggle('v977-paused',video.paused);
      controls.querySelector('[data-v977-action="loop"]').setAttribute('aria-pressed',String(video.loop));
    }
    async function playPause() {
      if (!video.paused && !video.ended) {video.pause();return;}
      try {
        await video.play();
      } catch (err) { message('No se pudo reproducir este video.');video.controls = true; }
    }
    controls.addEventListener('click',async function (event) {
      var target = event.target.closest('[data-v977-action]');
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      var action = target.dataset.v977Action;
      show();
      try {
        if (action === 'play') await playPause();
        else if (action === 'back' || action === 'next') {
          if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime =
            Math.max(0,Math.min(video.duration,video.currentTime + (action === 'back' ? -10 : 10)));
        } else if (action === 'mute') video.muted = !video.muted;
        else if (action === 'speed') {
          speedIndex = (speedIndex+1)%speeds.length;
          video.playbackRate = speeds[speedIndex];
          controls.querySelector('[data-v977-speed]').textContent = speeds[speedIndex]+'×';
        } else if (action === 'loop') video.loop = !video.loop;
        else if (action === 'menu') menu.hidden = !menu.hidden;
        else if (action === 'pip') {
          if (video.paused) await video.play();
          if (document.pictureInPictureElement === video && document.exitPictureInPicture) await document.exitPictureInPicture();
          else if (video.requestPictureInPicture) await video.requestPictureInPicture();
          else if (video.webkitSetPresentationMode) video.webkitSetPresentationMode('picture-in-picture');
          else throw Error('Ventana flotante no disponible en este navegador.');
        } else if (action === 'full') {
          if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
          else if (box.requestFullscreen) await box.requestFullscreen();
          else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
          else throw Error('Pantalla completa no disponible.');
        } else if (action === 'shot') {
          if (!video.videoWidth || !video.videoHeight) throw Error('Espera a que cargue el video.');
          var canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video,0,0);
          var a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = 'liga-juventino-fotograma-'+Date.now()+'.png';
          document.body.appendChild(a);a.click();a.remove();
          message('Captura preparada.');
        } else if (action === 'fit') {
          cover = !cover;box.classList.toggle('v977-cover',cover);
          target.textContent = cover ? 'Mostrar completo' : 'Ajustar imagen';
          menu.hidden = true;
        } else if (action === 'mirror') {
          mirror = !mirror;box.classList.toggle('v977-mirror',mirror);
          target.textContent = mirror ? 'Quitar espejo' : 'Espejo';
          menu.hidden = true;
        } else if (action === 'captions') {
          var tracks = Array.from(video.textTracks || []);
          if (!tracks.length) throw Error('Este video no tiene subtítulos.');
          var active = tracks.some(function(track){ return track.mode === 'showing'; });
          tracks.forEach(function(track){track.mode = active ? 'disabled' : 'showing';});
          target.textContent = active ? 'Activar subtítulos' : 'Quitar subtítulos';
          menu.hidden = true;
        }
      } catch (err) { message(action === 'shot' ? 'El video no permite capturas desde este origen.' : (err.message || 'Función no disponible.')); }
      update();
    });
    seek.addEventListener('input',function () {
      if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = (+seek.value/1000)*video.duration;
      show();
    });
    volume.addEventListener('input',function () {
      video.volume = +volume.value;video.muted = +volume.value === 0;show();
    });
    video.addEventListener('click',function(){if (!menu.hidden)menu.hidden = true;show();});
    box.addEventListener('pointermove',function(event){if (event.pointerType === 'mouse')show();});
    box.addEventListener('touchstart',show,{passive:true});
    box.addEventListener('focusin',show);
    ['loadedmetadata','durationchange','timeupdate','volumechange','ratechange'].forEach(function (name){video.addEventListener(name,update);});
    ['play','pause','ended'].forEach(function(name){video.addEventListener(name,function(){
      if (name === 'play') managed.forEach(function(other){if (other !== video && !other.paused) other.pause();});
      update();show();
    });});
    video.addEventListener('error',function(){message('No se pudo cargar el video. Revisa el archivo.');video.controls = true;});
    managed.add(video);
    update();show();
  }
  function scan() {
    pending = 0;
    document.querySelectorAll('video').forEach(enhance);
    managed.forEach(function(video){if (!video.isConnected) managed.delete(video);});
  }
  function schedule() {
    if (pending) return;
    // V777 recibe prioridad: evita dos interfaces cuando el módulo avanzado funciona.
    pending = setTimeout(scan,180);
  }
  function start() {
    if (!document.body) return;
    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
    window.addEventListener('hashchange',schedule);
    window.addEventListener('pageshow',schedule);
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();