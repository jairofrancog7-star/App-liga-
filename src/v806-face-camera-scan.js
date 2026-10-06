/* V806 — Escaneo visual de rostro con cámara frontal.
   Este módulo DETECTA que hay un rostro centrado; no identifica a la persona
   ni reemplaza Face ID/Android Biometrics. No guarda fotos ni video. */
(()=>{
'use strict';
let mediaPipePromise=null;

function qs(s,r=document){return r.querySelector(s)}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function stopStream(stream){try{stream?.getTracks?.().forEach(t=>t.stop())}catch(_){}}

async function loadMediaPipe(forceRetry=false){
  if(forceRetry)mediaPipePromise=null;
  if(mediaPipePromise)return mediaPipePromise;

  mediaPipePromise=(async()=>{
    const moduleUrls=[
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/+esm',
      'https://esm.sh/@mediapipe/tasks-vision@1.0.1'
    ];
    const wasmUrls=[
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm',
      'https://unpkg.com/@mediapipe/tasks-vision@1.0.1/wasm'
    ];
    const modelUrl='https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite';

    let lastError=null;
    for(const moduleUrl of moduleUrls){
      let mod=null;
      try{mod=await import(moduleUrl)}catch(err){lastError=err;continue}
      if(!mod?.FilesetResolver||!mod?.FaceDetector){lastError=new Error('MediaPipe incompleto');continue}

      for(const wasmUrl of wasmUrls){
        try{
          const vision=await mod.FilesetResolver.forVisionTasks(wasmUrl);
          if(typeof mod.FaceDetector.createFromModelPath==='function'){
            return await mod.FaceDetector.createFromModelPath(vision,modelUrl);
          }
          return await mod.FaceDetector.createFromOptions(vision,{
            baseOptions:{modelAssetPath:modelUrl},
            runningMode:'IMAGE',
            minDetectionConfidence:.45,
            minSuppressionThreshold:.30
          });
        }catch(err){lastError=err}
      }
    }
    throw lastError||new Error('No fue posible iniciar MediaPipe');
  })().catch(err=>{
    console.warn('[V807 MediaPipe face scan]',err);
    mediaPipePromise=null;
    return null;
  });

  return mediaPipePromise;
}

function frameCanvas(video,canvas){
  const w=video.videoWidth||640,h=video.videoHeight||480;
  const maxW=720,scale=Math.min(1,maxW/w);
  canvas.width=Math.max(2,Math.round(w*scale));
  canvas.height=Math.max(2,Math.round(h*scale));
  const ctx=canvas.getContext('2d',{alpha:false,willReadFrequently:true});
  ctx.save();
  // Mirror the front camera to match the preview.
  ctx.translate(canvas.width,0);ctx.scale(-1,1);
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  ctx.restore();
  return {w:canvas.width,h:canvas.height};
}

function centered(box,w,h){
  if(!box||!w||!h)return false;
  const cx=box.x+box.width/2,cy=box.y+box.height/2;
  const dx=Math.abs(cx-w/2)/w,dy=Math.abs(cy-h/2)/h;
  const area=(box.width*box.height)/(w*h);
  return dx<.19&&dy<.22&&area>.075&&area<.62;
}

async function detectNative(canvas){
  if(typeof window.FaceDetector!=='function')return null;
  try{
    const d=new window.FaceDetector({fastMode:true,maxDetectedFaces:1});
    const faces=await d.detect(canvas);
    const z=faces?.[0]?.boundingBox;
    if(!z)return {found:false,engine:'FaceDetector'};
    return {found:true,engine:'FaceDetector',box:{x:z.x,y:z.y,width:z.width,height:z.height}};
  }catch(_){return null}
}

async function detectMediaPipe(canvas,retry=false){
  const d=await loadMediaPipe(retry);if(!d)return null;
  try{
    const r=d.detect(canvas);
    const z=r?.detections?.[0]?.boundingBox;
    if(!z)return {found:false,engine:'MediaPipe'};
    return {found:true,engine:'MediaPipe',box:{x:Number(z.originX||0),y:Number(z.originY||0),width:Number(z.width||0),height:Number(z.height||0)}};
  }catch(err){
    console.warn('[V807 face detect]',err);
    if(!retry){
      const d2=await loadMediaPipe(true);
      if(d2&&d2!==d){
        try{
          const r2=d2.detect(canvas);
          const z2=r2?.detections?.[0]?.boundingBox;
          if(!z2)return {found:false,engine:'MediaPipe'};
          return {found:true,engine:'MediaPipe',box:{x:Number(z2.originX||0),y:Number(z2.originY||0),width:Number(z2.width||0),height:Number(z2.height||0)}};
        }catch(_){}
      }
    }
    return null;
  }
}

function ui(){
  const root=document.createElement('div');
  root.className='v806-face-overlay';
  root.innerHTML=
    '<section class="v806-face-sheet" role="dialog" aria-modal="true" aria-label="Escanear rostro">'+
      '<header><div><small>VERIFICACIÓN VISUAL</small><h2>Escanear rostro</h2></div><button type="button" data-v806-close aria-label="Cerrar">×</button></header>'+
      '<div class="v806-camera">'+
        '<video data-v806-video autoplay muted playsinline></video>'+
        '<canvas data-v806-canvas hidden></canvas>'+
        '<div class="v806-face-guide" aria-hidden="true"><i></i><b data-v806-progress></b></div>'+
        '<div class="v806-camera-state" data-v806-state>Preparando cámara…</div>'+
      '</div>'+
      '<div class="v806-face-copy"><b data-v806-title>Coloca tu cara dentro del óvalo</b><span data-v806-help>Mira de frente, con buena luz y sin tapar tu rostro.</span></div>'+
      '<div class="v806-face-meter"><i data-v806-meter></i></div>'+
      '<p>No se guarda ninguna foto ni video. Este paso sólo comprueba que la cámara puede detectar un rostro. El acceso seguro sigue dependiendo de la biometría del teléfono.</p>'+
      '<button type="button" class="v806-cancel" data-v806-close>Cancelar</button>'+
    '</section>';
  document.body.appendChild(root);
  return root;
}

async function open(){
  if(!navigator.mediaDevices?.getUserMedia)throw new Error('Este navegador no permite usar la cámara.');
  const root=ui(),video=qs('[data-v806-video]',root),canvas=qs('[data-v806-canvas]',root);
  const state=qs('[data-v806-state]',root),title=qs('[data-v806-title]',root),help=qs('[data-v806-help]',root);
  const meter=qs('[data-v806-meter]',root),guide=qs('.v806-face-guide',root);
  let stream=null,cancelled=false,done=false;
  const close=()=>{cancelled=true;stopStream(stream);root.remove()};
  root.querySelectorAll('[data-v806-close]').forEach(b=>b.addEventListener('click',close));

  try{
    stream=await navigator.mediaDevices.getUserMedia({
      video:{
        facingMode:{ideal:'user'},
        width:{ideal:1280,min:480},
        height:{ideal:720,min:360}
      },
      audio:false
    });
    if(cancelled){stopStream(stream);throw new DOMException('Cancelado','AbortError')}
    video.srcObject=stream;
    await video.play();
    state.textContent='Cámara frontal activa';
    root.classList.add('is-live');

    let stable=0,engine='',tries=0,detectorFailures=0;
    const nativeAvailable=typeof window.FaceDetector==='function';
    if(!nativeAvailable){
      state.textContent='Cargando detector facial…';
      title.textContent='Preparando detector';
      help.textContent='La primera carga puede tardar unos segundos.';
      await loadMediaPipe();
    }

    while(!cancelled&&!done){
      if(video.readyState<2||!video.videoWidth){await sleep(180);continue}
      const {w,h}=frameCanvas(video,canvas);
      let result=await detectNative(canvas);
      if(!result)result=await detectMediaPipe(canvas,detectorFailures>0);
      tries++;
      if(!result){
        detectorFailures++;
        if(detectorFailures<3){
          state.textContent='Reintentando detector facial…';
          title.textContent='Preparando detector';
          help.textContent='Mantén la cámara abierta un momento.';
          await sleep(650);
          continue;
        }
        state.textContent='Detector facial no disponible';
        title.textContent='No pude iniciar el detector';
        help.textContent='La cámara funciona, pero el detector no cargó. Revisa la conexión y vuelve a intentar.';
        throw new Error('No se pudo iniciar el detector facial. Inténtalo otra vez.');
      }
      detectorFailures=0;
      engine=result.engine||engine;
      const good=!!(result.found&&centered(result.box,w,h));
      stable=good?Math.min(6,stable+1):Math.max(0,stable-1);
      const pct=Math.round(stable/6*100);
      meter.style.width=pct+'%';
      guide.classList.toggle('has-face',!!result.found);
      guide.classList.toggle('is-centered',good);
      if(!result.found){
        title.textContent='No veo un rostro';
        help.textContent='Acerca un poco el teléfono y mira a la cámara.';
        state.textContent='Buscando rostro…';
      }else if(!good){
        title.textContent='Rostro detectado';
        help.textContent='Centra tu cara dentro del óvalo y mantente quieto.';
        state.textContent='Ajustando posición…';
      }else{
        title.textContent='Mantente quieto';
        help.textContent='Detectando rostro… '+pct+'%';
        state.textContent='Rostro centrado';
      }
      if(stable>=6){
        done=true;
        root.classList.add('is-success');
        title.textContent='Rostro detectado correctamente';
        help.textContent='La cámara y el detector facial están funcionando.';
        state.textContent='Escaneo visual completado';
        meter.style.width='100%';
        await sleep(700);
        stopStream(stream);
        root.remove();
        return {ok:true,engine,completedAt:new Date().toISOString()};
      }
      await sleep(220);
      if(tries>90)throw new Error('No pude detectar tu rostro. Revisa la luz y vuelve a intentarlo.');
    }
    throw new DOMException('Cancelado','AbortError');
  }catch(err){
    stopStream(stream);
    if(cancelled||err?.name==='AbortError'){root.remove();throw err}
    if(err?.name==='NotAllowedError'){
      state.textContent='Permiso de cámara bloqueado';
      title.textContent='Necesito permiso para usar la cámara';
      help.textContent='En Chrome toca el candado o controles del sitio y permite Cámara.';
    }else{
      state.textContent='No se pudo completar el escaneo';
      title.textContent='Escaneo facial no disponible';
      help.textContent=err?.message||'Inténtalo de nuevo.';
    }
    root.classList.add('is-error');
    await sleep(1400);
    root.remove();
    throw err;
  }
}

window.LJR_FACE_CAMERA_SCAN={open};
})();